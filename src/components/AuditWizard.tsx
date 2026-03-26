'use client'

import { useState } from 'react'
import clsx from 'clsx'
import type { AuditFormData, AuditReport, LeadData } from '@/types'
import ResultsView from './ResultsView'

// ─── Static options ──────────────────────────────────────────────────────────

const INDUSTRIES = [
  'Technology / Software',
  'Finance / Banking / Insurance',
  'Healthcare / Life Sciences',
  'Retail / E-commerce',
  'Manufacturing / Industrial',
  'Professional Services / Consulting',
  'Real Estate / Property',
  'Education / Training',
  'Logistics / Transportation',
  'Marketing / Media / Advertising',
  'Construction / Engineering',
  'Other',
]

const COMPANY_SIZES = [
  '1–10 employees',
  '11–50 employees',
  '51–200 employees',
  '201–500 employees',
  '500+ employees',
]

const AUTOMATION_LEVELS = [
  'None — everything is done manually',
  'Minimal — basic email rules / calendar scheduling',
  'Moderate — some Zapier / Make / Power Automate flows',
  'Advanced — custom integrations between multiple tools',
  'Expert — AI / ML actively running in production',
]

const WEEKLY_MANUAL_HOURS = [
  'Less than 5 hours',
  '5–15 hours',
  '15–30 hours',
  '30–60 hours',
  'More than 60 hours',
]

const PAIN_POINTS = [
  'Too much time on repetitive tasks',
  'Manual data entry and transfers',
  'Slow customer response times',
  'Inefficient approval / sign-off processes',
  'Poor visibility into business performance',
  'Difficulty scaling without hiring more people',
  'High operational costs',
  'Employee burnout from manual work',
  'Errors from manual processes',
  'Slow onboarding of customers or employees',
]

const GOALS = [
  'Reduce operational costs',
  'Save time on repetitive tasks',
  'Improve customer experience',
  'Scale without proportional headcount growth',
  'Better data and business insights',
  'Faster execution of key processes',
  'Reduce human errors',
  'Improve employee satisfaction',
  'Accelerate revenue growth',
  'Strengthen compliance and audit trails',
]

const BUDGET_RANGES = [
  'Under €5,000 / year',
  '€5,000 – €20,000 / year',
  '€20,000 – €50,000 / year',
  '€50,000 – €100,000 / year',
  'Over €100,000 / year',
  'Not sure yet',
]

const TIMELINES = [
  'I want results within 1 month',
  '1–3 months',
  '3–6 months',
  '6–12 months',
  'Longer-term strategic initiative',
]

// ─── Step labels ─────────────────────────────────────────────────────────────

const STEPS = [
  { label: 'Company Profile', description: 'Tell us about your business' },
  { label: 'Current State', description: 'Your tools and operations' },
  { label: 'Goals', description: 'Challenges and priorities' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={clsx(
                'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all',
                i + 1 < current
                  ? 'bg-indigo-600 text-white'
                  : i + 1 === current
                  ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                  : 'bg-slate-100 text-slate-400'
              )}
            >
              {i + 1 < current ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <div className="hidden sm:block">
              <p className={clsx('text-xs font-semibold', i + 1 <= current ? 'text-slate-700' : 'text-slate-400')}>
                {s.label}
              </p>
              <p className="text-xs text-slate-400">{s.description}</p>
            </div>
            {i < total - 1 && (
              <div
                className={clsx(
                  'mx-3 hidden sm:block h-0.5 w-12 md:w-20 lg:w-32 rounded transition-all',
                  i + 1 < current ? 'bg-indigo-600' : 'bg-slate-200'
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function CheckboxGroup({
  options,
  selected,
  onChange,
}: {
  options: string[]
  selected: string[]
  onChange: (val: string[]) => void
}) {
  const toggle = (opt: string) => {
    onChange(selected.includes(opt) ? selected.filter((v) => v !== opt) : [...selected, opt])
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {options.map((opt) => {
        const active = selected.includes(opt)
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={clsx(
              'flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-all',
              active
                ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
            )}
          >
            <div
              className={clsx(
                'flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border-2 transition-all',
                active ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
              )}
            >
              {active && (
                <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            {opt}
          </button>
        )
      })}
    </div>
  )
}

// ─── Analyzing Screen ─────────────────────────────────────────────────────────

function AnalyzingScreen({ companyName }: { companyName: string }) {
  const messages = [
    'Analyzing your industry benchmarks…',
    'Identifying automation opportunities…',
    'Calculating estimated ROI…',
    'Building your personalized roadmap…',
    'Preparing your report…',
  ]
  const [msgIndex] = useState(0)

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <div className="relative mb-8">
        <div className="h-20 w-20 rounded-full border-4 border-indigo-100" />
        <div className="absolute inset-0 h-20 w-20 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-2">
        Analysing {companyName || 'your business'}
      </h2>
      <p className="text-slate-500 mb-6 max-w-sm">
        Our AI is reviewing your responses and generating a personalised automation audit.
      </p>

      <div className="space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={clsx(
              'flex items-center gap-2 text-sm transition-all',
              i <= msgIndex ? 'text-slate-700' : 'text-slate-300'
            )}
          >
            <div
              className={clsx(
                'h-1.5 w-1.5 rounded-full',
                i < msgIndex ? 'bg-indigo-600' : i === msgIndex ? 'bg-indigo-400 animate-pulse' : 'bg-slate-200'
              )}
            />
            {msg}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Gate Screen ──────────────────────────────────────────────────────────────

function GateScreen({
  score,
  opportunityCount,
  savings,
  companyName,
  onUnlock,
}: {
  score: number
  opportunityCount: number
  savings: string
  companyName: string
  onUnlock: (lead: LeadData) => void
}) {
  const [lead, setLead] = useState<LeadData>({ name: '', email: '', phone: '' })
  const [errors, setErrors] = useState<Partial<LeadData>>({})

  const validate = () => {
    const e: Partial<LeadData> = {}
    if (!lead.name.trim()) e.name = 'Name is required'
    if (!lead.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) e.email = 'Enter a valid email'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) onUnlock(lead)
  }

  const scoreColor =
    score >= 70 ? 'text-emerald-600' : score >= 40 ? 'text-amber-600' : 'text-rose-600'
  const scoreBg =
    score >= 70 ? 'bg-emerald-50 border-emerald-200' : score >= 40 ? 'bg-amber-50 border-amber-200' : 'bg-rose-50 border-rose-200'

  return (
    <div className="animate-fade-in">
      {/* Teaser */}
      <div className="text-center mb-8">
        <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-2">
          Your report is ready
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
          {companyName ? `${companyName}: ` : ''}Your Automation Audit Results
        </h2>
        <p className="text-slate-500 max-w-md mx-auto">
          We&apos;ve identified {opportunityCount} automation opportunities with an estimated saving of{' '}
          <strong className="text-slate-700">{savings}</strong> per year.
        </p>
      </div>

      {/* Score preview */}
      <div className={clsx('card border mx-auto max-w-xs p-6 text-center mb-6', scoreBg)}>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
          Automation Readiness Score
        </p>
        <p className={clsx('text-6xl font-bold tabular-nums', scoreColor)}>{score}</p>
        <p className={clsx('text-sm font-semibold mt-1', scoreColor)}>/ 100</p>
      </div>

      {/* Blurred preview */}
      <div className="relative card p-5 mb-6 overflow-hidden">
        <div className="blur-sm pointer-events-none select-none space-y-3">
          <div className="h-4 bg-slate-100 rounded w-2/3" />
          <div className="h-3 bg-slate-100 rounded w-full" />
          <div className="h-3 bg-slate-100 rounded w-4/5" />
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-lg bg-slate-100" />
            ))}
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
          <div className="flex items-center gap-2 rounded-full bg-white border border-slate-200 shadow px-4 py-2 text-sm font-medium text-slate-700">
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Unlock full report
          </div>
        </div>
      </div>

      {/* Gate form */}
      <div className="card p-6 md:p-8">
        <h3 className="text-lg font-bold text-slate-800 mb-1">Unlock your full report</h3>
        <p className="text-sm text-slate-500 mb-6">
          Enter your details to access your complete automation audit — including all opportunities, ROI estimates, and a step-by-step roadmap.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              className={clsx('form-input', errors.name && 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20')}
              placeholder="Jane Smith"
              value={lead.name}
              onChange={(e) => setLead({ ...lead, name: e.target.value })}
            />
            {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Work email <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              className={clsx('form-input', errors.email && 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20')}
              placeholder="jane@company.com"
              value={lead.email}
              onChange={(e) => setLead({ ...lead, email: e.target.value })}
            />
            {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Phone <span className="text-slate-400 text-xs">(optional)</span>
            </label>
            <input
              type="tel"
              className="form-input"
              placeholder="+46 70 000 0000"
              value={lead.phone ?? ''}
              onChange={(e) => setLead({ ...lead, phone: e.target.value })}
            />
          </div>

          <button type="submit" className="btn-primary w-full mt-2 py-3.5 text-base">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
            View My Full Report
          </button>

          <p className="text-center text-xs text-slate-400 mt-2">
            No spam. We respect your privacy and will never share your details.
          </p>
        </form>
      </div>
    </div>
  )
}

// ─── Step 1 ───────────────────────────────────────────────────────────────────

function Step1({
  data,
  onChange,
}: {
  data: AuditFormData
  onChange: (d: Partial<AuditFormData>) => void
}) {
  return (
    <div className="space-y-5 animate-slide-up">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Company name <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          className="form-input"
          placeholder="Acme AB"
          value={data.companyName}
          onChange={(e) => onChange({ companyName: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Industry <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <select
              className="form-select pr-8"
              value={data.industry}
              onChange={(e) => onChange({ industry: e.target.value })}
            >
              <option value="">Select industry…</option>
              {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Company size <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <select
              className="form-select pr-8"
              value={data.companySize}
              onChange={(e) => onChange({ companySize: e.target.value })}
            >
              <option value="">Select size…</option>
              {COMPANY_SIZES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
        <input
          type="text"
          className="form-input"
          placeholder="Sweden"
          value={data.country}
          onChange={(e) => onChange({ country: e.target.value })}
        />
      </div>
    </div>
  )
}

// ─── Step 2 ───────────────────────────────────────────────────────────────────

function Step2({
  data,
  onChange,
}: {
  data: AuditFormData
  onChange: (d: Partial<AuditFormData>) => void
}) {
  return (
    <div className="space-y-5 animate-slide-up">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Software and tools you currently use <span className="text-rose-500">*</span>
        </label>
        <textarea
          className="form-input min-h-[80px] resize-y"
          placeholder="e.g. HubSpot, Fortnox, Google Workspace, Excel, Slack…"
          value={data.currentTools}
          onChange={(e) => onChange({ currentTools: e.target.value })}
        />
        <p className="mt-1 text-xs text-slate-400">List the main software your team uses day to day</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Your most important business processes <span className="text-rose-500">*</span>
        </label>
        <textarea
          className="form-input min-h-[80px] resize-y"
          placeholder="e.g. invoicing, customer onboarding, lead follow-up, reporting, order management…"
          value={data.keyProcesses}
          onChange={(e) => onChange({ keyProcesses: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Current automation maturity <span className="text-rose-500">*</span>
        </label>
        <div className="space-y-2">
          {AUTOMATION_LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => onChange({ automationLevel: level })}
              className={clsx(
                'flex items-center gap-3 w-full rounded-lg border px-4 py-3 text-left text-sm transition-all',
                data.automationLevel === level
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              )}
            >
              <div
                className={clsx(
                  'flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all',
                  data.automationLevel === level ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                )}
              >
                {data.automationLevel === level && (
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </div>
              {level}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Hours per week spent on manual / repetitive tasks (team total)
        </label>
        <div className="relative">
          <select
            className="form-select pr-8"
            value={data.weeklyManualHours}
            onChange={(e) => onChange({ weeklyManualHours: e.target.value })}
          >
            <option value="">Select…</option>
            {WEEKLY_MANUAL_HOURS.map((h) => <option key={h}>{h}</option>)}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Step 3 ───────────────────────────────────────────────────────────────────

function Step3({
  data,
  onChange,
}: {
  data: AuditFormData
  onChange: (d: Partial<AuditFormData>) => void
}) {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Biggest pain points <span className="text-rose-500">*</span>
          <span className="ml-1 text-slate-400 font-normal">(pick all that apply)</span>
        </label>
        <CheckboxGroup
          options={PAIN_POINTS}
          selected={data.painPoints}
          onChange={(v) => onChange({ painPoints: v })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Your automation goals <span className="text-rose-500">*</span>
          <span className="ml-1 text-slate-400 font-normal">(pick all that apply)</span>
        </label>
        <CheckboxGroup
          options={GOALS}
          selected={data.goals}
          onChange={(v) => onChange({ goals: v })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Budget range (annual)</label>
          <div className="relative">
            <select
              className="form-select pr-8"
              value={data.budgetRange}
              onChange={(e) => onChange({ budgetRange: e.target.value })}
            >
              <option value="">Select…</option>
              {BUDGET_RANGES.map((b) => <option key={b}>{b}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Desired timeline</label>
          <div className="relative">
            <select
              className="form-select pr-8"
              value={data.timeline}
              onChange={(e) => onChange({ timeline: e.target.value })}
            >
              <option value="">Select…</option>
              {TIMELINES.map((t) => <option key={t}>{t}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Wizard ──────────────────────────────────────────────────────────────

const INITIAL_FORM: AuditFormData = {
  companyName: '',
  industry: '',
  companySize: '',
  country: '',
  currentTools: '',
  keyProcesses: '',
  automationLevel: '',
  weeklyManualHours: '',
  painPoints: [],
  goals: [],
  budgetRange: '',
  timeline: '',
}

export default function AuditWizard() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<AuditFormData>(INITIAL_FORM)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [report, setReport] = useState<AuditReport | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isUnlocked, setIsUnlocked] = useState(false)

  const updateForm = (partial: Partial<AuditFormData>) =>
    setFormData((prev) => ({ ...prev, ...partial }))

  const validateStep = (): boolean => {
    if (step === 1) {
      return !!(formData.companyName.trim() && formData.industry && formData.companySize)
    }
    if (step === 2) {
      return !!(formData.currentTools.trim() && formData.keyProcesses.trim() && formData.automationLevel)
    }
    if (step === 3) {
      return formData.painPoints.length > 0 && formData.goals.length > 0
    }
    return true
  }

  const handleNext = async () => {
    if (!validateStep()) {
      setError('Please fill in the required fields before continuing.')
      return
    }
    setError(null)

    if (step < STEPS.length) {
      setStep(step + 1)
      return
    }

    // Final step — run analysis
    setIsAnalyzing(true)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Analysis failed')
      }

      const result: AuditReport = await res.json()
      setReport(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleUnlock = (_lead: LeadData) => {
    // Lead captured — unlock the full report
    setIsUnlocked(true)
  }

  const handleReset = () => {
    setStep(1)
    setFormData(INITIAL_FORM)
    setReport(null)
    setError(null)
    setIsUnlocked(false)
  }

  // ── Render states ────────────────────────────────────────────────────────

  if (isAnalyzing) {
    return <AnalyzingScreen companyName={formData.companyName} />
  }

  if (report && isUnlocked) {
    return <ResultsView report={report} formData={formData} onReset={handleReset} />
  }

  if (report && !isUnlocked) {
    return (
      <GateScreen
        score={report.score}
        opportunityCount={report.opportunities.length}
        savings={report.estimatedAnnualSavings}
        companyName={formData.companyName}
        onUnlock={handleUnlock}
      />
    )
  }

  // ── Form wizard ──────────────────────────────────────────────────────────

  return (
    <div className="animate-fade-in">
      <ProgressBar current={step} total={STEPS.length} />

      <div className="card p-6 md:p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-1">{STEPS[step - 1].label}</h2>
        <p className="text-sm text-slate-500 mb-6">{STEPS[step - 1].description}</p>

        {step === 1 && <Step1 data={formData} onChange={updateForm} />}
        {step === 2 && <Step2 data={formData} onChange={updateForm} />}
        {step === 3 && <Step3 data={formData} onChange={updateForm} />}

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
            <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-4">
          {step > 1 ? (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => { setStep(step - 1); setError(null) }}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          ) : (
            <div />
          )}

          <button type="button" className="btn-primary" onClick={handleNext}>
            {step === STEPS.length ? (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                Generate My Audit
              </>
            ) : (
              <>
                Continue
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-slate-400">
        Step {step} of {STEPS.length} &middot; Takes about 3 minutes to complete
      </p>
    </div>
  )
}
