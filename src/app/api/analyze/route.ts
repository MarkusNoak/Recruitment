import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'
import type { AuditFormData } from '@/types'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY is not configured. Please set it in your environment variables.' },
      { status: 500 }
    )
  }

  let formData: AuditFormData
  try {
    formData = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const prompt = `You are an expert AI automation consultant. Analyse the following business and produce a detailed, personalised automation audit report in valid JSON.

COMPANY DETAILS:
- Company Name: ${formData.companyName}
- Industry: ${formData.industry}
- Company Size: ${formData.companySize}
- Country: ${formData.country || 'Not specified'}

CURRENT OPERATIONS:
- Software & Tools: ${formData.currentTools || 'Not specified'}
- Key Business Processes: ${formData.keyProcesses || 'Not specified'}
- Current Automation Maturity: ${formData.automationLevel}
- Weekly Manual Hours (team): ${formData.weeklyManualHours || 'Not specified'}

CHALLENGES & GOALS:
- Pain Points: ${formData.painPoints.join(', ') || 'Not specified'}
- Automation Goals: ${formData.goals.join(', ') || 'Not specified'}
- Budget Range: ${formData.budgetRange || 'Not specified'}
- Desired Timeline: ${formData.timeline || 'Not specified'}

Based on this information, produce a thorough, actionable automation audit. Be specific to the company's industry and tools. Return ONLY valid JSON — no markdown, no explanation, no text outside the JSON.

Required JSON structure:
{
  "score": <integer 0-100 representing automation readiness>,
  "scoreLabel": "<one of: Beginner | Developing | Intermediate | Advanced | Expert>",
  "summary": "<2-3 sentence personalised executive summary referencing the company name and industry>",
  "strengths": ["<3-4 existing strengths or positive aspects>"],
  "opportunities": [
    {
      "id": <integer>,
      "title": "<concise opportunity title>",
      "description": "<2-3 sentence description specific to this company's tools and processes>",
      "timeSavings": "<e.g. 8-12 hours/week>",
      "estimatedROI": "<e.g. 4-6x in first year>",
      "difficulty": "<low|medium|high>",
      "timeToImplement": "<e.g. 2-4 weeks>",
      "recommendedTools": ["<tool 1>", "<tool 2>", "<tool 3>"]
    }
  ],
  "roadmap": [
    {
      "phase": "<phase name e.g. Phase 1: Quick Wins>",
      "duration": "<e.g. Month 1-2>",
      "focus": "<one sentence focus area>",
      "actions": ["<specific action 1>", "<specific action 2>", "<specific action 3>"],
      "estimatedInvestment": "<e.g. €2,000–5,000>"
    }
  ],
  "estimatedAnnualSavings": "<e.g. €40,000–80,000>",
  "topPriorityAction": "<the single most impactful immediate action, 1-2 sentences>",
  "industryBenchmark": "<1 sentence comparing to industry peers>"
}

Rules:
- Provide exactly 4-6 automation opportunities ordered by impact/priority
- Provide exactly 3 roadmap phases (Quick Wins, Scale Up, Optimise)
- All figures should be realistic and specific to the company size and industry
- Tool recommendations must be real, named tools relevant to the industry
- Be specific and actionable — avoid generic advice`

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from AI')
    }

    // Extract JSON — handle potential markdown code blocks
    let jsonText = content.text.trim()
    const codeBlockMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1].trim()
    }

    const report = JSON.parse(jsonText)
    return NextResponse.json(report)
  } catch (err) {
    console.error('Analyze API error:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { error: `Analysis failed: ${message}` },
      { status: 500 }
    )
  }
}
