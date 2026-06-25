export type DealStage = 'New Lead' | 'Contacted' | 'Negotiating' | 'Won' | 'Lost'

export type NoteType = 'Note' | 'Call' | 'Message' | 'Meeting'

export type LeadSource = 'Instagram DM' | 'WhatsApp' | 'Referral' | 'Walk-in' | 'Facebook' | 'Website' | 'Other'

export interface Contact {
  id: string
  name: string
  phone: string | null
  email: string | null
  source: string
  stage: DealStage
  value: number
  tags: string[]
  created_at: string
  updated_at: string
}

export interface Note {
  id: string
  contact_id: string
  type: NoteType
  text: string
  created_at: string
}

export interface Task {
  id: string
  contact_id: string | null
  title: string
  due_date: string | null
  done: boolean
  created_at: string
}

export interface WebhookEvent {
  id: string
  source: string
  raw_payload: Record<string, unknown>
  extracted_data: Record<string, unknown> | null
  status: string
  created_at: string
}

export interface AgentNote {
  type: NoteType
  text: string
}

export interface AgentTask {
  title: string
  daysFromNow: number
}

export interface ExtractionResult {
  name: string
  phone: string
  email: string
  source: string
  stage: DealStage
  value: number
  tags: string[]
  confidence: 'high' | 'medium' | 'low'
  summary: string
  notes: AgentNote[]
  tasks: AgentTask[]
  alerts: string[]
}
