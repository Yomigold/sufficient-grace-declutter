import { DealStage } from '../../types'
import { stageColor } from '../../lib/utils'

interface StageBadgeProps {
  stage: DealStage
}

export default function StageBadge({ stage }: StageBadgeProps) {
  const color = stageColor(stage)
  return (
    <span
      className="inline-block px-2 py-0.5 rounded text-xs font-ui font-semibold uppercase tracking-widest"
      style={{ color, border: `1px solid ${color}`, background: `${color}18` }}
    >
      {stage}
    </span>
  )
}
