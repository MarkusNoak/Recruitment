'use client'

import { useState, useMemo, useCallback } from 'react'
import clsx from 'clsx'
import type { Prompt } from '@/data/prompts'

function LivePrompt({ template, values }: { template: string; values: Record<string, string> }) {
  const parts = template.split(/(\[[^\]]+\])/g)
  return (
    <div className="font-mono text-xs leading-relaxed text-slate-600 whitespace-pre-wrap break-words">
      {parts.map((part, i) => {
        const match = part.match(/^\[(.+?)\]$/)
        if (!match) return <span key={i}>{part}</span>
        const key = match[1]
        const val = values[key]
        return val ? (
          <span key={i} className="bg-violet-100 text-violet-800 rounded px-0.5 font-semibold not-italic">{val}</span>
        ) : (
          <span key={i} className="bg-amber-50 text-amber-700 rounded px-0.5 italic">[{key}]</span>
        )
      })}
    </div>
  )
}

export default function PromptCard({ prompt }: { prompt: Prompt }) {
  const [expanded, setExpanded] = useState(false)
  const [values, setValues] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState(false)

  const filledPrompt = useMemo(() => {
    let text = prompt.prompt
    prompt.placeholders.forEach((ph) => {
      if (values[ph]?.trim()) {
        const escaped = ph.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        text = text.replace(new RegExp(`\\[${escaped}\\]`, 'g'), values[ph])
      }
    })
    return text
  }, [prompt.prompt, prompt.placeholders, values])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(filledPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }, [filledPrompt])

  const setValue = useCallback((ph: string, val: string) => {
    setValues((prev) => ({ ...prev, [ph]: val }))
  }, [])

  return (
    <div className={clsx(
      'rounded-xl border bg-white transition-all duration-200',
      expanded ? 'border-violet-200 shadow-lg shadow-violet-50/50' : 'border-slate-100 shadow-sm hover:border-slate-200 hover:shadow'
    )}>
      <button
        type="button"
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left group"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex-shrink-0 font-mono text-[11px] font-bold text-violet-600 bg-violet-50 px-2 py-1 rounded-md leading-none">
            {prompt.id}
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 text-sm leading-snug truncate group-hover:text-violet-700 transition-colors">{prompt.title}</p>
            <p className="text-xs text-slate-500 mt-0.5 truncate">{prompt.desc}</p>
          </div>
        </div>
        <svg className={clsx('flex-shrink-0 h-4 w-4 text-slate-400 transition-transform duration-200', expanded && 'rotate-180')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-slate-50 animate-slide-down">
          <div className="mt-4 rounded-lg bg-slate-50 border border-slate-100 p-4 mb-5">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Prompt preview</p>
            <LivePrompt template={prompt.prompt} values={values} />
          </div>

          {prompt.placeholders.length > 0 && (
            <div className="mb-5 space-y-3">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Fill in your details</p>
              {prompt.placeholders.map((ph) => (
                <div key={ph}>
                  <label className="block text-xs font-medium text-slate-600 mb-1">{ph}</label>
                  <input
                    type="text"
                    value={values[ph] ?? ''}
                    onChange={(e) => setValue(ph, e.target.value)}
                    placeholder={`Enter ${ph}…`}
                    className="w-full text-sm rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 placeholder-slate-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 transition-colors"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className={clsx(
                'inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-150',
                copied ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-200' : 'bg-slate-900 text-white hover:bg-slate-700'
              )}
            >
              {copied ? (
                <><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>Copied!</>
              ) : (
                <><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Copy Prompt</>
              )}
            </button>
            {Object.values(values).some((v) => v.trim()) && (
              <button type="button" onClick={() => setValues({})} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Clear</button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
