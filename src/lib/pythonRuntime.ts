// The execution frame has an opaque origin (no allow-same-origin). Its worker
// cannot read the application DOM, cookies or localStorage. Only the pinned
// runtime CDN is permitted by its CSP. Never run learner code on the server.
export const PYODIDE_BASE = 'https://cdn.jsdelivr.net/pyodide/v314.0.7/full/'
export function pythonSandboxDocument(token: string) {
  const worker = `
    import { loadPyodide } from '${PYODIDE_BASE}pyodide.mjs';
    self.onmessage = async ({data}) => {
      let size = 0;
      const output = (text) => { size += text.length; if (size > 16000) throw new Error('Output limit reached. Print fewer values.'); self.postMessage({type:'output',text:String(text)}); };
      try {
        const py = await loadPyodide({indexURL:'${PYODIDE_BASE}', stdout:output, stderr:output});
        py.setStdin({stdin:() => { throw new Error('Use variables instead of input() in this workspace.'); }});
        self.postMessage({type:'running'});
        const namespace = py.runPython('dict()');
        try {
          await py.runPythonAsync(data.code, {globals:namespace});
          const results = [];
          for (const check of data.checks) {
            let passed = false;
            try { passed = py.runPython('bool(' + check.expression + ')', {globals:namespace}) === true; } catch { /* A missing function is an unmet check. */ }
            results.push({label:check.label,passed});
          }
          self.postMessage({type:'done',results});
        } finally { namespace.destroy(); }
      } catch (error) { self.postMessage({type:'error',text:String(error).slice(-5000)}); }
    };
  `
  const script = `
    const token = ${JSON.stringify(token)};
    let worker;
    addEventListener('message', event => {
      if (event.source !== parent || event.data?.token !== token || !['run', 'stop'].includes(event.data.type)) return;
      if (event.data.type === 'stop') { worker?.terminate(); return; }
      if (worker) return;
      const url = URL.createObjectURL(new Blob([${JSON.stringify(worker)}], {type:'text/javascript'}));
      worker = new Worker(url, {type:'module'});
      URL.revokeObjectURL(url);
      worker.onmessage = ({data}) => parent.postMessage({...data, token}, '*');
      worker.onerror = () => parent.postMessage({type:'error',text:'Python could not start. Check your connection and browser support, then retry.',token}, '*');
      worker.postMessage({code:event.data.code, checks:event.data.checks});
    });
    parent.postMessage({type:'ready',token}, '*');
  `
  return `<!doctype html><html><head><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'wasm-unsafe-eval' https://cdn.jsdelivr.net; worker-src blob:; connect-src https://cdn.jsdelivr.net;"></head><body><script>${script.replaceAll('</script', '<\\/script')}</script></body></html>`
}
