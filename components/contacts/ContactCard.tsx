import Link from 'next/link'
import { Contact } from '../../types'
import Avatar from '../ui/Avatar'
import StageBadge from '../ui/StageBadge'
import { fmtN, fmtAgo } from '../../lib/utils'

interface ContactCardProps {
  contact: Contact
}

export default function ContactCard({ contact }: ContactCardProps) {
  return (
    <Link href={`/crm/contacts/${contact.id}`}>
      <div className="flex items-center gap-3 p-4 bg-surface2 rounded-xl border border-ghost hover:border-muted transition-colors cursor-pointer">
        <Avatar name={contact.name} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display text-lg text-warm truncate">{contact.name}</span>
            <StageBadge stage={contact.stage} />
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs font-ui text-muted">{contact.source}</span>
            {contact.value > 0 && (
              <>
                <span className="text-ghost">·</span>
                <span className="text-xs font-ui text-gold">{fmtN(contact.value)}</span>
              </>
            )}
          </div>
        </div>
        <div className="text-xs font-ui text-muted flex-shrink-0">{fmtAgo(contact.updated_at)}</div>
      </div>
    </Link>
  )
}
