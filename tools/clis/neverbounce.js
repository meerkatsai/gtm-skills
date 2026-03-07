#!/usr/bin/env node

const API_KEY = process.env.NEVERBOUNCE_API_KEY
const BASE_URL = process.env.NEVERBOUNCE_BASE_URL || 'https://api.neverbounce.com/v4'
const IS_DRY_RUN = process.argv.includes('--dry-run')

if (!API_KEY && !IS_DRY_RUN) {
  console.error(JSON.stringify({ error: 'NEVERBOUNCE_API_KEY environment variable required' }))
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

function withQuery(path, query) {
  const qs = new URLSearchParams(query || {}).toString()
  return `${path}${qs ? '?' + qs : ''}`
}

async function api(method, path, body) {
  const url = `${BASE_URL}${path}`
  const headers = { 'Content-Type': 'application/json' }

  if (args['dry-run']) {
    return {
      _dry_run: true,
      method,
      url: url.replace(API_KEY || '', '***'),
      headers,
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
    case 'email':
      switch (sub) {
        case 'verify': {
          const email = args.email
          if (!email) { result = { error: '--email required' }; break }
          const path = withQuery('/single/check', {
            key: API_KEY,
            email,
            address_info: args['address-info'] ? 1 : undefined,
            credits_info: args['credits-info'] ? 1 : undefined,
          })
          result = await api('POST', path)
          break
        }
        default:
          result = { error: 'Unknown email subcommand. Use: verify' }
      }
      break

    case 'account':
      switch (sub) {
        case 'info': {
          const path = withQuery('/account/info', { key: API_KEY })
          result = await api('POST', path)
          break
        }
        default:
          result = { error: 'Unknown account subcommand. Use: info' }
      }
      break

    default:
      result = {
        error: 'Unknown command',
        usage: {
          email: {
            verify: 'email verify --email <email> [--address-info] [--credits-info]',
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
