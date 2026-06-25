'use client'
import { useState } from 'react'
import { ExtractionResult } from '../../types'
import StageBadge from '../ui/StageBadge'
import { fmtN } from '../../lib/utils'

interface ExtractionResultProps {
  result: ExtractionResult
}

export default function ExtractionResultView({ result }: ExtractionResultProps) {
  const [showRaw, setShowRaw] = useState(false)
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const confidenceColor = result.confidence === 'high' ? '#5CBF6A' : result.confidence === 'medium' ? '#E8B87A' : '#C94A4A'

  return (
    <div className="space-y-4">
      <div
        className="p-3 rounded-lg text-xs font-ui font-semibold uppercase tracking-widest text-center border"
        style={{ color: confidenceColor, borderColor: confidenceColor, background: `${confidenceColor}15` }}
      >
        Confidence: {result.confidence}
      </div>

      {result.alerts.length > 0 && (
        <div className="bg-danger/10 border border-danger rounded-xl p-3 space-y-1">
          {result.alerts.map((alert, i) => (
            <p key={i} className="text-xs font-ui text-danger">{alert}</p>
          ))}
        </div>
      )}

      <div className="bg-surface2 rounded-xl border border-ghost p-4 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="font-display text-2xl text-warm">{result.name}</p>
          <StageBadge stage={result.stage} />
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-ui text-muted">
          <span>{result.source}</span>
          {result.value > 0 && <><span>·</span><span className="text-gold">{fmtN(result.value)}</span></>}
          {result.phone && <><span>·</span><span>{result.phone}</span></>}
        </div>
        {result.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {result.tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-surface3 rounded text-xs font-ui text-muted uppercase tracking-wider">{tag}</span>
            ))}
          </div>
        )}
        <p className="text-sm font-ui text-body">{result.summary}</p>
      </div>

      {result.notes.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-ui uppercase tracking-widest text-muted">Notes</p>
          {result.notes.map((note, i) => (
            <div key={i} className="bg-surface2 rounded-lg border border-ghost p-3">
              <span className="text-xs font-ui text-gold uppercase tracking-wider">{note.type}</span>
              <p className="text-sm font-ui text-body mt-1">{note.text}</p>
            </div>
          ))}
        </div>
      )}

      {result.tasks.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-ui uppercase tracking-widest text-muted">Tasks</p>
          {result.tasks.map((task, i) => (
            <div key={i} className="bg-surface2 rounded-lg border border-ghost p-3 flex items-center justify-between gap-2">
              <p className="text-sm font-ui text-body">{task.title}</p>
              <span className="text-xs font-ui text-muted flex-shrink-0">
                {task.daysFromNow === 0 ? 'Today' : task.daysFromNow === 1 ? 'Tomorrow' : `+${task.daysFromNow}d`}
              </span>
            </div>
          ))}
        </div>
      )}

      <div>
        <button
          onClick={() => setShowRaw(!showRaw)}
          className="text-xs font-ui text-muted hover:text-body transition-colors"
        >
          {showRaw ? 'Hide' : 'Show'} Raw JSON
        </button>
        {showRaw && (
          <div className="mt-2 relative">
            <pre className="bg-surface3 rounded-lg p-3 text-xs text-body overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 text-xs font-ui bg-surface2 border border-ghost rounded px-2 py-1 text-muted hover:text-body transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
