#!/usr/bin/env node

const API_KEY = process.env.FINDYMAIL_API_KEY
const BASE_URL = process.env.FINDYMAIL_BASE_URL || 'https://app.findymail.com/api'
const IS_DRY_RUN = process.argv.includes('--dry-run')

if (!API_KEY && !IS_DRY_RUN) {
  console.error(JSON.stringify({ error: 'FINDYMAIL_API_KEY environment variable required' }))
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

async function api(method, path, body) {
  const url = `${BASE_URL}${path}`
  const headers = {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  }

  if (args['dry-run']) {
    return {
      _dry_run: true,
      method,
      url,
      headers: { ...headers, Authorization: 'Bearer ***' },
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
        case 'find': {
          const name = args.name
          const domain = args.domain
          if (!name) { result = { error: '--name required' }; break }
          if (!domain) { result = { error: '--domain required' }; break }
          result = await api('POST', '/search/name', { name, domain })
          break
        }
        case 'verify': {
          const email = args.email
          if (!email) { result = { error: '--email required' }; break }
          result = await api('POST', '/verify', { email })
          break
        }
        default:
          result = { error: 'Unknown email subcommand. Use: find, verify' }
      }
      break

    default:
      result = {
        error: 'Unknown command',
        usage: {
          email: {
            find: 'email find --name "First Last" --domain <domain>',
            verify: 'email verify --email <email>',
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
