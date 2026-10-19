import { useState } from 'react'
import { NumberField, Stat } from '../components/Field'
import { bytes, num } from '../lib/format'

export function CapacityLab() {
  const [dau, setDau] = useState(10_000_000)
  const [reqPerUser, setReqPerUser] = useState(20)
  const [peak, setPeak] = useState(3)
  const [readKb, setReadKb] = useState(10)
  const [writeRatio, setWriteRatio] = useState(10)
  const [writeKb, setWriteKb] = useState(2)
  const [retentionYears, setRetentionYears] = useState(5)
  const [replication, setReplication] = useState(3)

  const reqPerDay = dau * reqPerUser
  const avgQps = reqPerDay / 86400
  const peakQps = avgQps * peak
  const writeQps = peakQps / writeRatio
  const readQps = peakQps - writeQps
  const readBw = readQps * readKb * 1024
  const writeBw = writeQps * writeKb * 1024
  const writesPerDay = reqPerDay / writeRatio
  const storagePerDay = writesPerDay * writeKb * 1024
  const storageTotal = storagePerDay * 365 * retentionYears * replication

  return (
    <div className="lab">
      <div className="lab-controls">
        <NumberField label="Daily active users" value={dau} min={1} step={100000} onChange={setDau} />
        <NumberField label="Requests per user per day" value={reqPerUser} min={1} onChange={setReqPerUser} />
        <NumberField label="Peak-to-average factor" value={peak} min={1} step={0.5} onChange={setPeak} />
        <NumberField label="Read size (KB)" value={readKb} min={0} onChange={setReadKb} />
        <NumberField label="Read:write ratio" value={writeRatio} min={1} onChange={setWriteRatio} hint="10 means one write per ten requests." />
        <NumberField label="Write size (KB)" value={writeKb} min={0} onChange={setWriteKb} />
        <NumberField label="Retention (years)" value={retentionYears} min={1} onChange={setRetentionYears} />
        <NumberField label="Replication factor" value={replication} min={1} onChange={setReplication} />
      </div>
      <div className="lab-results">
        <Stat label="Requests per day" value={num(reqPerDay)} />
        <Stat label="Average QPS" value={num(avgQps)} />
        <Stat label="Peak QPS" value={num(peakQps)} sub={`${num(readQps)} reads · ${num(writeQps)} writes`} />
        <Stat label="Peak read bandwidth" value={`${bytes(readBw)}/s`} />
        <Stat label="Peak write bandwidth" value={`${bytes(writeBw)}/s`} />
        <Stat label="New data per day" value={bytes(storagePerDay)} sub="before replication" />
        <Stat label="Storage after retention" value={bytes(storageTotal)} sub={`${retentionYears}y × ${replication} replicas`} />
      </div>
    </div>
  )
}
