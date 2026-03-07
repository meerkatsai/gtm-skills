#!/usr/bin/env node

const API_KEY = process.env.ROCKETREACH_API_KEY
const BASE_URL = process.env.ROCKETREACH_BASE_URL || 'https://api.rocketreach.co/api/v2'
const IS_DRY_RUN = process.argv.includes('--dry-run')

if (!API_KEY && !IS_DRY_RUN) {
  console.error(JSON.stringify({ error: 'ROCKETREACH_API_KEY environment variable required' }))
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

async function api(method, path, body, queryObj) {
  const qs = queryObj ? new URLSearchParams(queryObj).toString() : ''
  const url = `${BASE_URL}${path}${qs ? '?' + qs : ''}`
  const headers = {
    'Api-Key': API_KEY,
    'Content-Type': 'application/json',
  }

  if (args['dry-run']) {
    return {
      _dry_run: true,
      method,
      url,
      headers: { ...headers, 'Api-Key': '***' },
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

async function main() {
  let result

  switch (cmd) {
    case 'person':
      switch (sub) {
        case 'lookup': {
          const query = {}
          if (args.id) query.id = args.id
          if (args.linkedin) query.linkedin_url = args.linkedin
          if (args.name) query.name = args.name
          if (args['current-employer']) query.current_employer = args['current-employer']
          if (!query.id && !query.linkedin_url && !query.name) {
            result = { error: '--id or --linkedin or --name required' }
            break
          }
          result = await api('GET', '/person/lookup', undefined, query)
          break
        }
        case 'status': {
          const ids = args.ids || args.id
          if (!ids) { result = { error: '--ids or --id required' }; break }
          const parsedIds = ids.split(',').map((v) => v.trim()).filter(Boolean)
          result = await api('GET', '/person/checkStatus', undefined, { ids: parsedIds.join(',') })
          break
        }
        case 'search': {
          const payload = args.json ? parseJsonFlag(args.json, 'json') : {}
          if (!args.json) {
            if (args.query) payload.query = args.query
            if (args.start) payload.start = Number(args.start)
            if (args['page-size']) payload.page_size = Number(args['page-size'])
          }
          if (!payload.query) {
            result = { error: '--query required (or pass full --json with query object)' }
            break
          }
          result = await api('POST', '/search', payload)
          break
        }
        default:
          result = { error: 'Unknown person subcommand. Use: lookup, status, search' }
      }
      break

    case 'account':
      switch (sub) {
        case 'info':
          result = await api('GET', '/account')
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
            lookup: 'person lookup --id <id> | --linkedin <url> | --name <name> [--current-employer <company>]',
            status: 'person status --ids <id1,id2,...>',
            search: 'person search --json <search_payload_json> [--start <n>] [--page-size <n>]',
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
