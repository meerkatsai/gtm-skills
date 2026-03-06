#!/usr/bin/env node

const API_KEY = process.env.SMARTLEAD_API_KEY
const BASE_URL = process.env.SMARTLEAD_BASE_URL || 'https://server.smartlead.ai/api/v1'
const IS_DRY_RUN = process.argv.includes('--dry-run')

if (!API_KEY && !IS_DRY_RUN) {
  console.error(JSON.stringify({ error: 'SMARTLEAD_API_KEY environment variable required' }))
  process.exit(1)
}

function parseArgs(argv) {
  const result = { _: [] }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg.startsWith('--')) {
      const key = arg.slice(2)
      const next = argv[i + 1]
      if (next && !next.startsWith('--')) {
        result[key] = next
        i++
      } else {
        result[key] = true
      }
    } else {
      result._.push(arg)
    }
  }
  return result
}

const args = parseArgs(process.argv.slice(2))
const [cmd, sub] = args._

function buildUrl(path, query = {}) {
  const url = new URL(`${BASE_URL}${path}`)
  url.searchParams.set('api_key', API_KEY)
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value))
    }
  }
  return url
}

function readJsonArg(value) {
  if (!value) return undefined
  try {
    return JSON.parse(value)
  } catch {
    return { _raw: value }
  }
}

function applyListPagination(data, offsetArg, limitArg) {
  if (!Array.isArray(data)) return data
  const offset = Number.parseInt(offsetArg || '0', 10)
  const limit = limitArg === undefined ? undefined : Number.parseInt(limitArg, 10)
  const safeOffset = Number.isNaN(offset) || offset < 0 ? 0 : offset
  if (limit === undefined || Number.isNaN(limit) || limit < 0) {
    return data.slice(safeOffset)
  }
  return data.slice(safeOffset, safeOffset + limit)
}

async function api(method, path, body, query) {
  const url = buildUrl(path, query)

  if (args['dry-run']) {
    return {
      _dry_run: true,
      method,
      url: url.toString().replace(API_KEY, '***'),
      headers: { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : body,
    }
  }

  const res = await fetch(url.toString(), {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  const text = await res.text()
  let data
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    data = { body: text }
  }

  if (!res.ok) {
    return { status: res.status, error: data }
  }

  return data
}

function usage() {
  return {
    campaigns: {
      list: 'campaigns list [--offset <n>] [--limit <n>] # offset/limit are applied client-side',
      get: 'campaigns get --campaign-id <id>',
      create: 'campaigns create --name <string> [--client-id <id>] [--json <raw-json>]',
      status: 'campaigns status --campaign-id <id>',
      'set-status': 'campaigns set-status --campaign-id <id> --status <ACTIVE|PAUSED|STOPPED> [--json <raw-json>]',
      sequences: 'campaigns sequences --campaign-id <id>',
      statistics: 'campaigns statistics --campaign-id <id> [--offset <n>] [--limit <n>]',
    },
    leads: {
      list: 'leads list --campaign-id <id> [--offset <n>] [--limit <n>]',
      search: 'leads search [--email <email>] [--offset <n>] [--limit <n>]',
      add: 'leads add --campaign-id <id> --email <email> [--first-name <name>] [--last-name <name>] [--company <name>] [--json <raw-json>]'
    },
    'email-accounts': {
      list: 'email-accounts list [--offset <n>] [--limit <n>]',
      'by-campaign': 'email-accounts by-campaign --campaign-id <id>'
    }
  }
}

async function main() {
  let result

  switch (cmd) {
    case 'campaigns':
      switch (sub) {
        case 'list': {
          const campaigns = await api('GET', '/campaigns')
          if (campaigns && campaigns.status && campaigns.error) {
            result = campaigns
            break
          }
          result = applyListPagination(campaigns, args.offset, args.limit)
          break
        }
        case 'get': {
          const campaignId = args['campaign-id']
          if (!campaignId) { result = { error: '--campaign-id required' }; break }
          result = await api('GET', `/campaigns/${campaignId}`)
          break
        }
        case 'create': {
          const payloadFromArg = readJsonArg(args.json)
          if (payloadFromArg && payloadFromArg._raw) {
            result = { error: '--json must be valid JSON' }
            break
          }
          const payload = payloadFromArg || {
            name: args.name,
            client_id: args['client-id'] || undefined,
          }
          if (!payload.name) {
            result = { error: '--name required (or provide --json with full body)' }
            break
          }
          result = await api('POST', '/campaigns/create', payload)
          break
        }
        case 'status': {
          const campaignId = args['campaign-id']
          if (!campaignId) { result = { error: '--campaign-id required' }; break }
          result = await api('GET', `/campaigns/${campaignId}/status`)
          break
        }
        case 'set-status': {
          const campaignId = args['campaign-id']
          if (!campaignId) { result = { error: '--campaign-id required' }; break }

          const payloadFromArg = readJsonArg(args.json)
          if (payloadFromArg && payloadFromArg._raw) {
            result = { error: '--json must be valid JSON' }
            break
          }

          const payload = payloadFromArg || { status: args.status }
          if (!payload.status) {
            result = { error: '--status required (or provide --json with full body)' }
            break
          }

          result = await api('PATCH', `/campaigns/${campaignId}/status`, payload)
          break
        }
        case 'sequences': {
          const campaignId = args['campaign-id']
          if (!campaignId) { result = { error: '--campaign-id required' }; break }
          result = await api('GET', `/campaigns/${campaignId}/sequences`)
          break
        }
        case 'statistics': {
          const campaignId = args['campaign-id']
          if (!campaignId) { result = { error: '--campaign-id required' }; break }
          result = await api('GET', `/campaigns/${campaignId}/statistics`, undefined, { offset: args.offset, limit: args.limit })
          break
        }
        default:
          result = { error: 'Unknown campaigns subcommand. Use: list, get, create, status, set-status, sequences, statistics' }
      }
      break

    case 'leads':
      switch (sub) {
        case 'list': {
          const campaignId = args['campaign-id']
          if (!campaignId) { result = { error: '--campaign-id required' }; break }
          result = await api('GET', `/campaigns/${campaignId}/leads`, undefined, { offset: args.offset, limit: args.limit })
          break
        }
        case 'search': {
          result = await api('GET', '/leads', undefined, {
            email: args.email,
            offset: args.offset,
            limit: args.limit,
          })
          break
        }
        case 'add': {
          const campaignId = args['campaign-id']
          if (!campaignId) { result = { error: '--campaign-id required' }; break }

          const payloadFromArg = readJsonArg(args.json)
          if (payloadFromArg && payloadFromArg._raw) {
            result = { error: '--json must be valid JSON' }
            break
          }

          let payload = payloadFromArg
          if (!payload) {
            if (!args.email) {
              result = { error: '--email required (or provide --json with full body)' }
              break
            }
            const lead = { email: args.email }
            if (args['first-name']) lead.first_name = args['first-name']
            if (args['last-name']) lead.last_name = args['last-name']
            if (args.company) lead.company_name = args.company
            payload = { lead_list: [lead] }
          }

          result = await api('POST', `/campaigns/${campaignId}/leads`, payload)
          break
        }
        default:
          result = { error: 'Unknown leads subcommand. Use: list, search, add' }
      }
      break

    case 'email-accounts':
      switch (sub) {
        case 'list':
          result = await api('GET', '/email-accounts/', undefined, { offset: args.offset, limit: args.limit })
          break
        case 'by-campaign': {
          const campaignId = args['campaign-id']
          if (!campaignId) { result = { error: '--campaign-id required' }; break }
          result = await api('GET', `/campaigns/${campaignId}/email-accounts`)
          break
        }
        default:
          result = { error: 'Unknown email-accounts subcommand. Use: list, by-campaign' }
      }
      break

    default:
      result = { error: 'Unknown command', usage: usage() }
  }

  console.log(JSON.stringify(result, null, 2))
}

main().catch((err) => {
  console.error(JSON.stringify({ error: err.message }))
  process.exit(1)
})
