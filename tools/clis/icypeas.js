#!/usr/bin/env node

const API_KEY = process.env.ICYPEAS_API_KEY
const BASE_URL = process.env.ICYPEAS_BASE_URL || 'https://app.icypeas.com/api'
const IS_DRY_RUN = process.argv.includes('--dry-run')

if (!API_KEY && !IS_DRY_RUN) {
  console.error(JSON.stringify({ error: 'ICYPEAS_API_KEY environment variable required' }))
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

function parseJsonFlag(value, label) {
  if (!value) return undefined
  try {
    return JSON.parse(value)
  } catch (err) {
    throw new Error(`Invalid JSON for --${label}: ${err.message}`)
  }
}

const args = parseArgs(process.argv.slice(2))
const [cmd, sub] = args._

async function api(method, path, body) {
  const url = `${BASE_URL}${path}`
  const headers = {
    Authorization: API_KEY,
    'Content-Type': 'application/json',
  }

  if (args['dry-run']) {
    return {
      _dry_run: true,
      method,
      url,
      headers: { ...headers, Authorization: '***' },
      body: body || undefined,
    }
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch {
    return { status: res.status, body: text }
  }
}

function maybeCustom() {
  const custom = {}
  if (args.webhook) custom.webhookUrl = args.webhook
  if (args['external-id']) custom.externalId = args['external-id']
  return Object.keys(custom).length ? custom : undefined
}

async function main() {
  let result

  switch (cmd) {
    case 'email':
      switch (sub) {
        case 'find': {
          const firstname = args.firstname || ''
          const lastname = args.lastname || ''
          const domainOrCompany = args.domain || args.company || args['domain-or-company']
          if (!domainOrCompany) { result = { error: '--domain or --company required' }; break }
          if (!firstname && !lastname) { result = { error: '--firstname or --lastname required' }; break }
          const body = { firstname, lastname, domainOrCompany }
          const custom = maybeCustom()
          if (custom) body.custom = custom
          result = await api('POST', '/email-search', body)
          break
        }
        case 'verify': {
          if (!args.email) { result = { error: '--email required' }; break }
          const body = { email: args.email }
          const custom = maybeCustom()
          if (custom) body.custom = custom
          result = await api('POST', '/email-verification', body)
          break
        }
        default:
          result = { error: 'Unknown email subcommand. Use: find, verify' }
      }
      break

    case 'domain':
      switch (sub) {
        case 'scan': {
          const domainOrCompany = args.domain || args.company || args['domain-or-company']
          if (!domainOrCompany) { result = { error: '--domain or --company required' }; break }
          const body = { domainOrCompany }
          const custom = maybeCustom()
          if (custom) body.custom = custom
          result = await api('POST', '/domain-search', body)
          break
        }
        default:
          result = { error: 'Unknown domain subcommand. Use: scan' }
      }
      break

    case 'bulk':
      switch (sub) {
        case 'start': {
          const task = args.task
          const name = args.name
          const data = parseJsonFlag(args.data, 'data')
          if (!task) { result = { error: '--task required (email-search|email-verification|domain-search)' }; break }
          if (!name) { result = { error: '--name required' }; break }
          if (!Array.isArray(data) || data.length === 0) { result = { error: '--data must be a non-empty JSON array' }; break }
          const body = { task, name, data }
          const custom = parseJsonFlag(args.custom, 'custom')
          if (custom) body.custom = custom
          result = await api('POST', '/bulk-search', body)
          break
        }
        case 'files': {
          const body = {}
          if (args.file) body.file = args.file
          if (args.status) body.status = args.status
          if (args.limit) body.limit = Number(args.limit)
          if (args.next !== undefined) body.next = args.next === 'true'
          const sorts = parseJsonFlag(args.sorts, 'sorts')
          if (sorts) body.sorts = sorts
          result = await api('POST', '/search-files/read', body)
          break
        }
        default:
          result = { error: 'Unknown bulk subcommand. Use: start, files' }
      }
      break

    case 'results':
      switch (sub) {
        case 'read': {
          const body = {}
          if (args.id) body.id = args.id
          if (args.mode) body.mode = args.mode
          if (args.type) body.type = args.type
          if (args.file) body.file = args.file
          if (args.limit) body.limit = Number(args.limit)
          if (args.next !== undefined) body.next = args.next === 'true'
          const sorts = parseJsonFlag(args.sorts, 'sorts')
          if (sorts) body.sorts = sorts
          result = await api('POST', '/bulk-single-searchs/read', body)
          break
        }
        default:
          result = { error: 'Unknown results subcommand. Use: read' }
      }
      break

    case 'reverse':
      switch (sub) {
        case 'one': {
          if (!args.email) { result = { error: '--email required' }; break }
          result = await api('POST', '/reverse-email-lookup', { email: args.email })
          break
        }
        case 'bulk': {
          const emails = args.emails ? args.emails.split(',').map((v) => v.trim()).filter(Boolean) : null
          if (!emails || emails.length < 2) { result = { error: '--emails required (comma-separated, min 2)' }; break }
          result = await api('POST', '/reverse-email-lookups', { data: emails })
          break
        }
        default:
          result = { error: 'Unknown reverse subcommand. Use: one, bulk' }
      }
      break

    default:
      result = {
        error: 'Unknown command',
        usage: {
          email: {
            find: 'email find --firstname <name> --lastname <name> --domain <domain> [--webhook <url>] [--external-id <id>]',
            verify: 'email verify --email <email> [--webhook <url>] [--external-id <id>]',
          },
          domain: {
            scan: 'domain scan --domain <domain_or_company> [--webhook <url>] [--external-id <id>]',
          },
          bulk: {
            start: 'bulk start --task <email-search|email-verification|domain-search> --name <name> --data <json_array> [--custom <json_object>]',
            files: 'bulk files [--status in_progress|done] [--file <file_id>] [--limit <n>] [--next true|false] [--sorts <json_array>]',
          },
          results: {
            read: 'results read [--id <search_item_id>] [--mode single|bulk] [--type <task>] [--file <file_id>] [--limit <n>] [--next true|false] [--sorts <json_array>]',
          },
          reverse: {
            one: 'reverse one --email <email>',
            bulk: 'reverse bulk --emails <e1,e2,...>',
          },
        },
      }
  }

  console.log(JSON.stringify(result, null, 2))
}

main().catch((err) => {
  console.error(JSON.stringify({ error: err.message }))
  process.exit(1)
})
