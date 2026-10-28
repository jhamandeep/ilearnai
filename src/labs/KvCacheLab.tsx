import { useState } from 'react'
import { NumberField, SelectField, Stat } from '../components/Field'
import { bytes, num } from '../lib/format'
import { LabVisual } from '../components/LabVisual'

type Preset = 'llama3-8b' | 'llama3-70b' | 'mistral-7b' | 'custom'
type Dtype = 'fp16' | 'fp8' | 'int4'

const presets: Record<Exclude<Preset, 'custom'>, { layers: number; kvHeads: number; headDim: number; params: number }> = {
  'llama3-8b': { layers: 32, kvHeads: 8, headDim: 128, params: 8e9 },
  'llama3-70b': { layers: 80, kvHeads: 8, headDim: 128, params: 70e9 },
  'mistral-7b': { layers: 32, kvHeads: 8, headDim: 128, params: 7.2e9 },
}

const dtypeBytes: Record<Dtype, number> = { fp16: 2, fp8: 1, int4: 0.5 }

export function KvCacheLab() {
  const [preset, setPreset] = useState<Preset>('llama3-70b')
  const [layers, setLayers] = useState(80)
  const [kvHeads, setKvHeads] = useState(8)
  const [headDim, setHeadDim] = useState(128)
  const [params, setParams] = useState(70)
  const [tokens, setTokens] = useState(8192)
  const [cacheDtype, setCacheDtype] = useState<Dtype>('fp16')
  const [weightDtype, setWeightDtype] = useState<Dtype>('fp16')
  const [gpuGb, setGpuGb] = useState(80)
  const [gpus, setGpus] = useState(1)

  const applyPreset = (p: Preset) => {
    setPreset(p)
    if (p !== 'custom') {
      const c = presets[p]
      setLayers(c.layers)
      setKvHeads(c.kvHeads)
      setHeadDim(c.headDim)
      setParams(c.params / 1e9)
    }
  }

  const perToken = 2 * layers * kvHeads * headDim * dtypeBytes[cacheDtype]
  const perSeq = perToken * tokens
  const weights = params * 1e9 * dtypeBytes[weightDtype]
  const total = gpuGb * 1e9 * gpus
  const free = Math.max(0, total - weights)
  const fits = perSeq > 0 ? Math.floor(free / perSeq) : 0

  return (
    <div className="lab">
      <div className="lab-controls">
        <SelectField
          label="Preset"
          value={preset}
          onChange={applyPreset}
          options={[
            { value: 'llama3-8b', label: 'Llama 3 8B' },
            { value: 'llama3-70b', label: 'Llama 3 70B' },
            { value: 'mistral-7b', label: 'Mistral 7B' },
            { value: 'custom', label: 'Custom' },
          ]}
        />
        <NumberField label="Layers" value={layers} min={1} onChange={(v) => { setLayers(v); setPreset('custom') }} />
        <NumberField label="KV heads" value={kvHeads} min={1} onChange={(v) => { setKvHeads(v); setPreset('custom') }} hint="With GQA this is fewer than query heads." />
        <NumberField label="Head dimension" value={headDim} min={1} onChange={(v) => { setHeadDim(v); setPreset('custom') }} />
        <NumberField label="Parameters (billions)" value={params} min={0.1} step={0.1} onChange={(v) => { setParams(v); setPreset('custom') }} />
        <NumberField label="Context tokens per sequence" value={tokens} min={1} step={1024} onChange={setTokens} />
        <SelectField label="KV cache dtype" value={cacheDtype} onChange={setCacheDtype} options={[{ value: 'fp16', label: 'FP16 / BF16' }, { value: 'fp8', label: 'FP8' }, { value: 'int4', label: 'INT4' }]} />
        <SelectField label="Weight dtype" value={weightDtype} onChange={setWeightDtype} options={[{ value: 'fp16', label: 'FP16 / BF16' }, { value: 'fp8', label: 'FP8 / INT8' }, { value: 'int4', label: 'INT4' }]} />
        <NumberField label="GPU memory (GB)" value={gpuGb} min={1} onChange={setGpuGb} />
        <NumberField label="GPUs" value={gpus} min={1} onChange={setGpus} />
      </div>
      <div className="lab-results">
        <LabVisual title="GPU memory budget" caption={weights > total ? 'The model weights exceed the available GPU memory.' : 'Compare the model weights and one full sequence against available GPU memory.'} maximum={Math.max(total, weights, perSeq)} items={[{ label: 'Available GPU memory', value: total, display: bytes(total) }, { label: 'Model weights', value: weights, display: bytes(weights) }, { label: 'One sequence of KV cache', value: perSeq, display: bytes(perSeq) }, { label: 'Free after weights', value: free, display: bytes(free), detail: `${fits} full-context sequences fit before framework overhead.` }]} />
        <Stat label="KV cache per token" value={bytes(perToken)} sub={`2 × ${layers} × ${kvHeads} × ${headDim} × ${dtypeBytes[cacheDtype]} B`} />
        <Stat label="KV cache per sequence" value={bytes(perSeq)} sub={`${num(tokens)} tokens`} />
        <Stat label="Weights" value={bytes(weights)} sub={`${params}B params × ${dtypeBytes[weightDtype]} B`} />
        <Stat label="Free for cache" value={bytes(free)} sub={`${bytes(total)} total`} />
        <Stat label="Concurrent sequences" value={fits} sub={weights > total ? 'Weights do not fit' : 'at full context'} />
        <div className="note">
          Formula: bytes = 2 × layers × KV heads × head dim × tokens × bytes per element. Activations and framework overhead are ignored;
          budget roughly 10% extra in practice.
        </div>
      </div>
    </div>
  )
}
