import AuditWizard from '@/components/AuditWizard'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Nav */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10 no-print">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-slate-800">AutoAudit AI</span>
          </div>
          <span className="text-xs text-slate-400">Free &middot; No account required</span>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 pt-12 pb-8 text-center no-print">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-4 py-1.5 text-xs font-semibold text-indigo-700 mb-5">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
              d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Powered by Claude AI
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">
          Discover Your Business&apos;s
          <br />
          <span className="text-indigo-600">Automation Potential</span>
        </h1>

        <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto mb-8 leading-relaxed">
          Answer a few questions about your business and get a personalised AI-powered automation audit — including your readiness score, top opportunities, ROI estimates, and a step-by-step roadmap.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 mb-4">
          {[
            { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Takes ~3 minutes' },
            {
              icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
              label: 'Personalised report',
            },
            {
              icon: 'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
              label: 'PDF download included',
            },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
              </svg>
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* Form card */}
      <section className="mx-auto max-w-2xl px-4 pb-16">
        <AuditWizard />
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white no-print">
        <div className="mx-auto max-w-4xl px-4 py-6 text-center text-xs text-slate-400">
          <p>Your data is used solely to generate your audit report and is never sold or shared with third parties.</p>
        </div>
      </footer>
    </main>
  )
}
