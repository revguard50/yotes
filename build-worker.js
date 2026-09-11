import { mkdir, readFile, writeFile } from 'node:fs/promises'

await mkdir(new URL('./dist/server/', import.meta.url), { recursive: true })
await writeFile(new URL('./dist/server/index.js', import.meta.url), `
const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff'
  }
})

const clean = (value, max = 4000) => String(value || '').trim().slice(0, max)

async function acceptLead(request, env) {
  if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed' }, 405)
  const contentType = request.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) return json({ ok: false, error: 'JSON required' }, 415)
  let body
  try { body = await request.json() } catch { return json({ ok: false, error: 'Invalid request' }, 400) }
  const lead = {
    company: clean(body.company, 180),
    role: clean(body.role, 180),
    email: clean(body.email, 254).toLowerCase(),
    erp: clean(body.erp, 180),
    workflow: clean(body.workflow, 100),
    artifact: clean(body.artifact, 100),
    notes: clean(body.notes),
    consent: body.consent === true,
    shortlist: Array.isArray(body.shortlist) ? body.shortlist.slice(0, 24) : [],
    roi: body.roi && typeof body.roi === 'object' ? body.roi : null,
    attribution: body.attribution && typeof body.attribution === 'object' ? body.attribution : {},
    brief: clean(body.brief, 12000),
    submitted_at: clean(body.submitted_at, 40) || new Date().toISOString(),
    source: 'vsimple-agent-explorer'
  }
  if (!lead.company || !lead.role || !lead.notes || !lead.consent || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(lead.email)) {
    return json({ ok: false, error: 'Complete the required company, role, email, workflow context, and consent fields.' }, 400)
  }
  if (!env.LEAD_WEBHOOK_URL) return json({ ok: false, error: 'Direct delivery is not configured yet.', fallback_url: 'https://www.vsimple.com/get-started' }, 503)
  const headers = { 'content-type': 'application/json' }
  if (env.LEAD_WEBHOOK_SECRET) headers.authorization = 'Bearer ' + env.LEAD_WEBHOOK_SECRET
  const response = await fetch(env.LEAD_WEBHOOK_URL, { method: 'POST', headers, body: JSON.stringify(lead) })
  if (!response.ok) return json({ ok: false, error: 'The CRM did not accept this request.' }, 502)
  return json({ ok: true }, 202)
}

export default {
  async fetch(request, env) {
    const requestUrl = new URL(request.url)
    if (requestUrl.pathname === '/api/leads') return acceptLead(request, env)
    const response = await env.ASSETS.fetch(request)
    if (response.status !== 404) return response

    const url = new URL(request.url)
    url.pathname = '/index.html'
    return env.ASSETS.fetch(new Request(url, request))
  }
}
`)

const defaultOrigin = 'https://vsimple-agent-explorer.onrender.com'
const siteOrigin = String(process.env.SITE_ORIGIN || defaultOrigin).replace(/\/$/, '')
for (const path of [
  './dist/index.html',
  './dist/workflows/order-intake/index.html',
  './dist/workflows/rfq-quote-intake/index.html',
  './dist/robots.txt',
  './dist/sitemap.xml'
]) {
  const url = new URL(path, import.meta.url)
  const source = await readFile(url, 'utf8')
  await writeFile(url, source.replaceAll(defaultOrigin, siteOrigin))
}
