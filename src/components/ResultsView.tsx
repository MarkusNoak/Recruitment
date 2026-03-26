'use client'

import clsx from 'clsx'
import type { AuditReport, AuditFormData } from '@/types'

// ─── Score Gauge ──────────────────────────────────────────────────────────────

function ScoreGauge({ score, label }: { score: number; label: string }) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const filled = (score / 100) * circumference

  const color =
    score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444'

  const bgColor =
    score >= 70 ? 'text-emerald-600' : score >= 40 ? 'text-amber-500' : 'text-rose-500'

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-36 w-36">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - filled}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={clsx('text-3xl font-bold tabular-nums', bgColor)}>{score}</span>
          <span className="text-xs text-slate-400 font-medium">/ 100</span>
        </div>
      </div>
      <p className={clsx('mt-2 text-sm font-semibold', bgColor)}>{label}</p>
      <p className="text-xs text-slate-400 mt-0.5">Automation Readiness Score</p>
    </div>
  )
}

// ─── Difficulty Badge ─────────────────────────────────────────────────────────

function DifficultyBadge({ difficulty }: { difficulty: 'low' | 'medium' | 'high' }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        difficulty === 'low' && 'bg-emerald-100 text-emerald-700',
        difficulty === 'medium' && 'bg-amber-100 text-amber-700',
        difficulty === 'high' && 'bg-rose-100 text-rose-700'
      )}
    >
      <span
        className={clsx(
          'h-1.5 w-1.5 rounded-full',
          difficulty === 'low' && 'bg-emerald-500',
          difficulty === 'medium' && 'bg-amber-500',
          difficulty === 'high' && 'bg-rose-500'
        )}
      />
      {difficulty === 'low' ? 'Easy win' : difficulty === 'medium' ? 'Moderate' : 'Complex'}
    </span>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface ResultsViewProps {
  report: AuditReport
  formData: AuditFormData
  onReset: () => void
}

export default function ResultsView({ report, formData, onReset }: ResultsViewProps) {
  const handlePrint = () => window.print()

  return (
    <div className="animate-fade-in" id="audit-report">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-1">
            Automation Audit Report
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
            {formData.companyName || 'Your Business'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {formData.industry} &middot; {formData.companySize}
            {formData.country ? ` · ${formData.country}` : ''}
          </p>
        </div>

        <div className="flex items-center gap-2 no-print flex-shrink-0">
          <button
            onClick={handlePrint}
            className="btn-secondary text-xs px-3 py-2"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Save PDF
          </button>
          <button onClick={onReset} className="btn-secondary text-xs px-3 py-2">
            Start over
          </button>
        </div>
      </div>

      {/* Score + Summary */}
      <div className="card p-6 md:p-8 mb-4 flex flex-col md:flex-row items-center gap-8">
        <ScoreGauge score={report.score} label={report.scoreLabel} />

        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Executive Summary</h3>
          <p className="text-slate-600 leading-relaxed mb-4">{report.summary}</p>

          <div className="flex flex-wrap gap-2">
            {report.strengths.map((s, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-indigo-600">{report.opportunities.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Automation opportunities</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-xl font-bold text-emerald-600">{report.estimatedAnnualSavings}</p>
          <p className="text-xs text-slate-500 mt-0.5">Estimated annual savings</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-sm font-bold text-slate-700 leading-snug">{report.industryBenchmark}</p>
          <p className="text-xs text-slate-500 mt-0.5">vs. industry average</p>
        </div>
      </div>

      {/* Priority action */}
      <div className="rounded-xl bg-indigo-600 text-white p-5 mb-6 flex items-start gap-4">
        <div className="flex-shrink-0 mt-0.5">
          <svg className="h-5 w-5 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold text-indigo-200 uppercase tracking-wide mb-1">
            #1 Priority Action
          </p>
          <p className="text-sm font-medium leading-relaxed">{report.topPriorityAction}</p>
        </div>
      </div>

      {/* Opportunities */}
      <section className="mb-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Automation Opportunities</h3>
        <div className="space-y-3">
          {report.opportunities.map((opp, i) => (
            <div key={opp.id ?? i} className="card p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 text-sm font-bold">
                    {i + 1}
                  </div>
                  <h4 className="font-semibold text-slate-800">{opp.title}</h4>
                </div>
                <DifficultyBadge difficulty={opp.difficulty} />
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-4">{opp.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-400 mb-0.5">Time saved</p>
                  <p className="text-sm font-semibold text-slate-700">{opp.timeSavings}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-400 mb-0.5">Est. ROI</p>
                  <p className="text-sm font-semibold text-emerald-600">{opp.estimatedROI}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-400 mb-0.5">Time to implement</p>
                  <p className="text-sm font-semibold text-slate-700">{opp.timeToImplement}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-400 mb-1">Recommended tools</p>
                  <div className="flex flex-wrap gap-1">
                    {opp.recommendedTools.slice(0, 3).map((tool) => (
                      <span key={tool} className="text-xs bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-600">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section className="mb-6 print-break-before">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Implementation Roadmap</h3>
        <div className="space-y-3">
          {report.roadmap.map((phase, i) => (
            <div key={i} className="card p-5">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={clsx(
                      'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white',
                      i === 0 ? 'bg-indigo-600' : i === 1 ? 'bg-indigo-400' : 'bg-slate-300'
                    )}
                  >
                    {i + 1}
                  </div>
                  {i < report.roadmap.length - 1 && (
                    <div className="mt-1 w-0.5 flex-1 bg-slate-100 min-h-[20px]" />
                  )}
                </div>

                <div className="flex-1 pb-2">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h4 className="font-semibold text-slate-800">{phase.phase}</h4>
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                      {phase.duration}
                    </span>
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                      {phase.estimatedInvestment}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-3">{phase.focus}</p>
                  <ul className="space-y-1.5">
                    {phase.actions.map((action, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                        <svg className="h-4 w-4 text-indigo-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking CTA */}
      <BookingCTA score={report.score} onPrint={handlePrint} onReset={onReset} />
    </div>
  )
}

// ─── Booking CTA ──────────────────────────────────────────────────────────────

function BookingCTA({
  score,
  onPrint,
  onReset,
}: {
  score: number
  onPrint: () => void
  onReset: () => void
}) {
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL ?? '#'

  const urgency =
    score >= 70
      ? 'Your business is primed for automation. Let\'s turn this roadmap into results.'
      : score >= 40
      ? 'You have clear opportunities waiting to be unlocked. A focused sprint can change the game.'
      : 'There\'s significant untapped potential here. The right starting point makes all the difference.'

  return (
    <div className="no-print space-y-3">
      {/* Primary booking block */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 p-8 text-white">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -top-8 -right-8 h-40 w-40 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-56 w-56 rounded-full bg-white/5" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-indigo-100 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Free strategy session available
          </div>

          <h3 className="text-2xl font-bold mb-2 leading-snug">
            Want expert help implementing this?
          </h3>
          <p className="text-indigo-200 text-sm leading-relaxed mb-6 max-w-lg">
            {urgency} Book a free 30-minute strategy call and we&apos;ll walk you through the highest-impact steps for your business — no sales pitch, just practical advice.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 transition-colors shadow-sm"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Book Free Strategy Call
            </a>
            <button
              onClick={onPrint}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF Report
            </button>
          </div>

          <p className="mt-4 text-xs text-indigo-300">
            30 minutes &middot; No commitment &middot; Tailored to your audit results
          </p>
        </div>
      </div>

      {/* Secondary action */}
      <div className="text-center">
        <button onClick={onReset} className="text-xs text-slate-400 hover:text-slate-600 transition-colors underline underline-offset-2">
          Run another audit
        </button>
      </div>
    </div>
  )
}
