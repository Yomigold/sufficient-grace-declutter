'use client'
import { initials } from '../../lib/utils'

const AVATAR_COLORS = [
  '#C9924A', '#7B88CC', '#5CBF6A', '#E8B87A', '#C94A4A',
  '#9B87B8', '#4A9EC9', '#C9A04A', '#87B87B', '#B84A87',
]

function avatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
}

export default function Avatar({ name, size = 'md' }: AvatarProps) {
  const color = avatarColor(name)
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-ui font-semibold text-bg flex-shrink-0`}
      style={{ backgroundColor: color }}
    >
      {initials(name)}
    </div>
  )
}
