#!/usr/bin/env node

const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..', '..')
const registryPath = path.join(root, 'tools', 'REGISTRY.md')
const content = fs.readFileSync(registryPath, 'utf8')
const linkRegex = /\((clis\/[^)]+|integrations\/[^)]+)\)/g

const missing = []
let match
while ((match = linkRegex.exec(content)) !== null) {
  const relative = match[1]
  const absolute = path.join(root, 'tools', relative)
  if (!fs.existsSync(absolute)) {
    missing.push(relative)
  }
}

if (missing.length > 0) {
  console.error(JSON.stringify({ error: 'Registry contains broken links', missing }, null, 2))
  process.exit(1)
}

if (process.argv.includes('--check')) {
  console.log(JSON.stringify({ ok: true, checked: 'tools/REGISTRY.md' }, null, 2))
} else {
  console.log(JSON.stringify({ ok: true, message: 'No sync action required in this repository layout.' }, null, 2))
}
