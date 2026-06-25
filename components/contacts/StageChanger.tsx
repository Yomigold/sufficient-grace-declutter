'use client'
import { DealStage } from '../../types'
import { stageColor } from '../../lib/utils'

const STAGES: DealStage[] = ['New Lead', 'Contacted', 'Negotiating', 'Won', 'Lost']

interface StageChangerProps {
  current: DealStage
  onChange: (stage: DealStage) => void
  loading?: boolean
}

export default function StageChanger({ current, onChange, loading }: StageChangerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {STAGES.map((stage) => {
        const active = stage === current
        const color = stageColor(stage)
        return (
          <button
            key={stage}
            onClick={() => onChange(stage)}
            disabled={loading}
            className="px-3 py-1 rounded text-xs font-ui font-semibold uppercase tracking-widest transition-all disabled:opacity-50"
            style={
              active
                ? { backgroundColor: color, color: '#0C0C0C' }
                : { border: `1px solid ${color}`, color, background: 'transparent' }
            }
          >
            {stage}
          </button>
        )
      })}
    </div>
  )
}
