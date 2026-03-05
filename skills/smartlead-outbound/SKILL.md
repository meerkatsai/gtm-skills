---
name: smartlead-outbound
description: Execute Smartlead outbound operations through the local Smartlead CLI for campaign lifecycle management, lead ingestion, sender/account checks, and campaign analytics. Use when a user asks to create/update/list Smartlead campaigns, add leads, check campaign status, fetch campaign sequences/statistics, or inspect Smartlead email accounts.
---

# Smartlead Outbound

Use this skill to run Smartlead tasks through the repository CLI at `tools/clis/smartlead.js`.

## Prerequisites

- Require `SMARTLEAD_API_KEY` in environment.
- Optional: set `SMARTLEAD_BASE_URL` only when using a non-default Smartlead API host.
- Use Node.js 18+.

## Core Workflow

1. Validate authentication with a read call:
   - `node tools/clis/smartlead.js campaigns list --limit 1`
2. Execute the smallest command that satisfies the request.
3. Prefer `--dry-run` first for write operations (`create`, `set-status`, `add`).
4. Return JSON results and summarize key IDs and next actions.

## Command Reference

### Campaigns

- List: `node tools/clis/smartlead.js campaigns list --limit 20 --offset 0`
- Get: `node tools/clis/smartlead.js campaigns get --campaign-id <id>`
- Create: `node tools/clis/smartlead.js campaigns create --name "<name>" [--client-id <id>]`
- Status: `node tools/clis/smartlead.js campaigns status --campaign-id <id>`
- Set status: `node tools/clis/smartlead.js campaigns set-status --campaign-id <id> --status ACTIVE`
- Sequences: `node tools/clis/smartlead.js campaigns sequences --campaign-id <id>`
- Statistics: `node tools/clis/smartlead.js campaigns statistics --campaign-id <id> [--limit <n>]`

### Leads

- List campaign leads: `node tools/clis/smartlead.js leads list --campaign-id <id> --limit 100`
- Search leads: `node tools/clis/smartlead.js leads search --email <email>`
- Add one lead: `node tools/clis/smartlead.js leads add --campaign-id <id> --email <email> [--first-name <name>] [--last-name <name>] [--company <company>]`

### Email accounts

- List all: `node tools/clis/smartlead.js email-accounts list --limit 50`
- By campaign: `node tools/clis/smartlead.js email-accounts by-campaign --campaign-id <id>`

## JSON override for API changes

Use `--json` on write commands when you need exact body control.

Examples:

```bash
node tools/clis/smartlead.js campaigns create --json '{"name":"Outbound - UK","client_id":123}'
node tools/clis/smartlead.js leads add --campaign-id 123 --json '{"lead_list":[{"email":"a@b.com"}]}'
```

## Output expectations

- Emit the raw JSON command output.
- Highlight critical identifiers: `campaign_id`, `lead_id`, and status fields.
- If Smartlead returns non-2xx, report `status` and `error` payload directly.
