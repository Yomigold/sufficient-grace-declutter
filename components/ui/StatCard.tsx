interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  gold?: boolean
}

export default function StatCard({ label, value, sub, gold }: StatCardProps) {
  return (
    <div className="bg-surface2 rounded-xl p-4 border border-ghost">
      <p className="text-muted text-xs font-ui uppercase tracking-widest mb-1">{label}</p>
      <p className={`font-display text-3xl ${gold ? 'text-gold' : 'text-warm'}`}>{value}</p>
      {sub && <p className="text-muted text-xs font-ui mt-1">{sub}</p>}
    </div>
  )
}
