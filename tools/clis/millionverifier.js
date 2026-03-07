#!/usr/bin/env node

const API_KEY = process.env.MILLIONVERIFIER_API_KEY
const SINGLE_BASE = process.env.MILLIONVERIFIER_SINGLE_BASE || 'https://api.millionverifier.com'
const BULK_BASE = process.env.MILLIONVERIFIER_BULK_BASE || 'https://bulkapi.millionverifier.com'
const IS_DRY_RUN = process.argv.includes('--dry-run')

if (!API_KEY && !IS_DRY_RUN) {
  console.error(JSON.stringify({ error: 'MILLIONVERIFIER_API_KEY environment variable required' }))
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

function buildUrl(base, path, query) {
  const qs = new URLSearchParams(query || {}).toString()
  return `${base}${path}${qs ? '?' + qs : ''}`
}

async function request(method, url, body, headers = {}) {
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
    body,
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
          const timeout = args.timeout ? Number(args.timeout) : undefined
          const url = buildUrl(SINGLE_BASE, '/api/v3', {
            api: API_KEY,
            email,
            timeout,
          })
          result = await request('GET', url, undefined)
          break
        }
        default:
          result = { error: 'Unknown email subcommand. Use: verify' }
      }
      break

    case 'bulk':
      switch (sub) {
        case 'upload': {
          const file = args.file
          if (!file) { result = { error: '--file required (path to CSV/TXT)' }; break }
          const url = buildUrl(BULK_BASE, '/bulkapi/v2/upload', { key: API_KEY })
          if (args['dry-run']) {
            result = await request('POST', url, '<multipart/form-data:file_contents>', {
              'Content-Type': 'multipart/form-data',
            })
            break
          }
          const fs = await import('node:fs')
          const data = fs.readFileSync(file)
          const blob = new Blob([data])
          const form = new FormData()
          form.append('file_contents', blob, file.split('/').pop())
          result = await request('POST', url, form)
          break
        }
        case 'fileinfo': {
          const fileId = args['file-id']
          if (!fileId) { result = { error: '--file-id required' }; break }
          const url = buildUrl(BULK_BASE, '/bulkapi/v2/fileinfo', { key: API_KEY, file_id: fileId })
          result = await request('GET', url)
          break
        }
        case 'files': {
          const url = buildUrl(BULK_BASE, '/bulkapi/v2/files', { key: API_KEY })
          result = await request('GET', url)
          break
        }
        case 'download': {
          const fileId = args['file-id']
          const filter = args.filter || 'all'
          if (!fileId) { result = { error: '--file-id required' }; break }
          const url = buildUrl(BULK_BASE, '/bulkapi/v2/download', { key: API_KEY, file_id: fileId, filter })
          result = await request('GET', url)
          break
        }
        case 'stop': {
          const fileId = args['file-id']
          if (!fileId) { result = { error: '--file-id required' }; break }
          const url = buildUrl(BULK_BASE, '/bulkapi/stop', { key: API_KEY, file_id: fileId })
          result = await request('GET', url)
          break
        }
        case 'delete': {
          const fileId = args['file-id']
          if (!fileId) { result = { error: '--file-id required' }; break }
          const url = buildUrl(BULK_BASE, '/bulkapi/v2/delete', { key: API_KEY, file_id: fileId })
          result = await request('GET', url)
          break
        }
        default:
          result = { error: 'Unknown bulk subcommand. Use: upload, fileinfo, files, download, stop, delete' }
      }
      break

    default:
      result = {
        error: 'Unknown command',
        usage: {
          email: {
            verify: 'email verify --email <email> [--timeout <2-60>]',
          },
          bulk: {
            upload: 'bulk upload --file <path_to_file>',
            fileinfo: 'bulk fileinfo --file-id <id>',
            files: 'bulk files',
            download: 'bulk download --file-id <id> [--filter all|ok|invalid|catch_all|unknown]',
            stop: 'bulk stop --file-id <id>',
            delete: 'bulk delete --file-id <id>',
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
