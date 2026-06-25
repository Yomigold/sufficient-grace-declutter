'use client'
import { useState } from 'react'
import { ExtractionResult } from '@/types'
import ConversationInput from '@/components/agent/ConversationInput'
import ExtractionResultView from '@/components/agent/ExtractionResult'

type Tab = 'paste' | 'extracted' | 'setup'

const TABS: Array<{ id: Tab; label: string }> = [
  { id: 'paste', label: 'Paste Thread' },
  { id: 'extracted', label: 'Extracted Data' },
  { id: 'setup', label: 'Setup Guide' },
]

export default function AgentPage() {
  const [tab, setTab] = useState<Tab>('paste')
  const [result, setResult] = useState<ExtractionResult | null>(null)

  return (
    <div className="min-h-screen bg-bg p-4 pb-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="pt-4">
          <p className="text-muted text-xs font-ui uppercase tracking-widest">SGD</p>
          <h1 className="font-display text-4xl text-warm">AI Agent</h1>
          <p className="text-muted text-sm font-ui mt-1">Extract CRM data from conversation threads</p>
        </div>

        <div className="flex gap-1 bg-surface2 rounded-xl p-1">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2 text-xs font-ui font-semibold uppercase tracking-wider rounded-lg transition-colors ${
                tab === t.id ? 'bg-gold text-bg' : 'text-muted hover:text-body'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'paste' && (
          <ConversationInput
            onExtracted={setResult}
            onTabChange={setTab}
          />
        )}

        {tab === 'extracted' && (
          result ? (
            <ExtractionResultView result={result} />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted font-ui text-sm">No extraction yet — paste a thread first</p>
              <button onClick={() => setTab('paste')} className="mt-4 text-gold font-ui text-sm hover:text-gold-light">
                Go to Paste Thread
              </button>
            </div>
          )
        )}

        {tab === 'setup' && (
          <div className="space-y-6">
            {[
              {
                step: '01',
                title: 'Supabase Setup',
                items: [
                  'Create a project at supabase.com',
                  'Run the SQL from supabase/migrations/001_init.sql in the SQL editor',
                  'Copy your project URL and anon key to NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY',
                  'Copy the service role key to SUPABASE_SERVICE_ROLE_KEY',
                ],
              },
              {
                step: '02',
                title: 'Vercel Deployment',
                items: [
                  'Deploy to Vercel: vercel deploy',
                  'Add all .env.local variables in Vercel project settings',
                  'Note your deployment URL (e.g. https://sgd-crm.vercel.app)',
                ],
              },
              {
                step: '03',
                title: 'Spur / Instagram Webhook',
                items: [
                  'In Spur dashboard, set webhook URL to: https://your-domain.com/api/webhook/instagram',
                  'Set the webhook secret header: x-webhook-secret = sgd_webhook_secret_2025',
                  'Enable conversation_history in the payload settings',
                ],
              },
              {
                step: '04',
                title: 'WhatsApp Business API',
                items: [
                  'In Meta developer console, set webhook URL to: https://your-domain.com/api/webhook/whatsapp',
                  'Set verify token to match your WEBHOOK_SECRET value',
                  'Subscribe to messages webhook field',
                  'For outbound alerts, set up 360dialog and add WA_API_KEY and ALERT_PHONE_NUMBER',
                ],
              },
            ].map(({ step, title, items }) => (
              <div key={step} className="bg-surface2 rounded-xl border border-ghost p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-display text-2xl text-gold">{step}</span>
                  <h3 className="font-display text-xl text-warm">{title}</h3>
                </div>
                <ul className="space-y-2">
                  {items.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm font-ui text-body">
                      <span className="text-gold flex-shrink-0">·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
