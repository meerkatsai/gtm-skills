#!/usr/bin/env node

const API_KEY = process.env.PROSPEO_API_KEY
const BASE_URL = process.env.PROSPEO_BASE_URL || 'https://api.prospeo.io'
const IS_DRY_RUN = process.argv.includes('--dry-run')

if (!API_KEY && !IS_DRY_RUN) {
  console.error(JSON.stringify({ error: 'PROSPEO_API_KEY environment variable required' }))
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
    'X-KEY': API_KEY,
    'Content-Type': 'application/json',
  }

  if (args['dry-run']) {
    return {
      _dry_run: true,
      method,
      url,
      headers: { ...headers, 'X-KEY': '***' },
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

function buildPersonBody() {
  const body = {}
  if (args['full-name']) body.full_name = args['full-name']
  if (args['first-name']) body.first_name = args['first-name']
  if (args['last-name']) body.last_name = args['last-name']
  if (args.linkedin) body.linkedin_url = args.linkedin
  if (args['company-website']) body.company_website = args['company-website']
  if (args['company-name']) body.company_name = args['company-name']
  if (args['only-verified-email']) body.only_verified_email = true
  return body
}

async function main() {
  let result

  switch (cmd) {
    case 'person':
      switch (sub) {
        case 'enrich': {
          const body = args.json ? parseJsonFlag(args.json, 'json') : buildPersonBody()
          if (!body.linkedin_url && !body.full_name && !(body.first_name && body.last_name)) {
            result = { error: '--linkedin or --full-name or (--first-name + --last-name) required' }
            break
          }
          result = await api('POST', '/enrich-person', body)
          break
        }
        case 'bulk-enrich': {
          const body = args.json ? parseJsonFlag(args.json, 'json') : parseJsonFlag(args.data, 'data')
          if (!body || !Array.isArray(body.data)) {
            result = { error: '--data JSON required with shape: {\"data\":[...]} or pass --json' }
            break
          }
          result = await api('POST', '/bulk-enrich-person', body)
          break
        }
        case 'search': {
          const body = args.json ? parseJsonFlag(args.json, 'json') : {}
          if (!args.json && args.query) body.query = args.query
          if (!args.json && args.limit) body.limit = Number(args.limit)
          result = await api('POST', '/search-person', body)
          break
        }
        default:
          result = { error: 'Unknown person subcommand. Use: enrich, bulk-enrich, search' }
      }
      break

    case 'company':
      switch (sub) {
        case 'enrich': {
          const body = args.json ? parseJsonFlag(args.json, 'json') : {}
          if (!args.json) {
            if (args['company-website']) body.company_website = args['company-website']
            if (args.linkedin) body.linkedin_url = args.linkedin
            if (args.name) body.name = args.name
          }
          if (!body.company_website && !body.linkedin_url && !body.name) {
            result = { error: '--company-website or --linkedin or --name required' }
            break
          }
          result = await api('POST', '/enrich-company', body)
          break
        }
        case 'search': {
          const body = args.json ? parseJsonFlag(args.json, 'json') : {}
          if (!args.json && args.query) body.query = args.query
          if (!args.json && args.limit) body.limit = Number(args.limit)
          result = await api('POST', '/search-company', body)
          break
        }
        default:
          result = { error: 'Unknown company subcommand. Use: enrich, search' }
      }
      break

    case 'account':
      switch (sub) {
        case 'info':
          result = await api('GET', '/account-information')
          break
        default:
          result = { error: 'Unknown account subcommand. Use: info' }
      }
      break

    default:
      result = {
        error: 'Unknown command',
        usage: {
          person: {
            enrich: 'person enrich --linkedin <url> | --full-name <name> [--company-website <domain>] [--only-verified-email]',
            'bulk-enrich': 'person bulk-enrich --data <json_with_data_array> | --json <payload_json>',
            search: 'person search --json <payload_json>',
          },
          company: {
            enrich: 'company enrich --company-website <domain> | --linkedin <url> | --name <name>',
            search: 'company search --json <payload_json>',
          },
          account: {
            info: 'account info',
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
