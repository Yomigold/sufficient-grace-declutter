import { DealStage } from '../types'

export function fmtN(value: number | null | undefined): string {
  if (value == null) return '₦0'
  return '₦' + value.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

export function fmtAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

export function fmtDue(dateStr: string | null | undefined): string {
  if (!dateStr) return 'No due date'
  const due = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const dueDay = new Date(due)
  dueDay.setHours(0, 0, 0, 0)
  if (dueDay.getTime() === today.getTime()) return 'Today'
  if (dueDay.getTime() === tomorrow.getTime()) return 'Tomorrow'
  if (dueDay < today) return `Overdue (${due.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })})`
  return due.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')
}

export function stageColor(stage: DealStage): string {
  const colors: Record<DealStage, string> = {
    'New Lead': '#7B88CC',
    'Contacted': '#C9924A',
    'Negotiating': '#E8B87A',
    'Won': '#5CBF6A',
    'Lost': '#C94A4A',
  }
  return colors[stage] ?? '#888888'
}
