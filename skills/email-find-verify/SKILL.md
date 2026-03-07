---
name: email-find-verify
description: Use when a user wants to find or verify email addresses. First ask which provider tool to use (icypeas, findymail, prospeo, rocketreach, hunter, apollo, neverbounce, or millionverifier), then run the matching CLI workflow.
metadata:
  version: 1.0.0
---

# Email Find and Verify

Use this skill for contact email discovery and validation workflows.

## Required First Step

Before running any command, ask which tool the user wants:

- `icypeas`
- `findymail`
- `prospeo`
- `rocketreach`
- `hunter`
- `apollo`
- `neverbounce` (verify only)
- `millionverifier` (verify only)

If the user already picked one, skip this question and proceed.

## Selection Prompt

Use this style:

`Which tool should I use for this task: icypeas, findymail, prospeo, rocketreach, hunter, apollo, neverbounce, or millionverifier?`

## Capability Rules

- Finder + verify tools:
  - `icypeas`, `findymail`, `prospeo`, `rocketreach`, `hunter`, `apollo`
- Verify-only tools:
  - `neverbounce`, `millionverifier`

If user asks to **find** an email but chooses verify-only tool, say that tool cannot find emails and ask for a finder tool.

## CLI Mapping

- `icypeas` -> `node tools/clis/icypeas.js`
- `findymail` -> `node tools/clis/findymail.js`
- `prospeo` -> `node tools/clis/prospeo.js`
- `rocketreach` -> `node tools/clis/rocketreach.js`
- `hunter` -> `node tools/clis/hunter.js`
- `apollo` -> `node tools/clis/apollo.js`
- `neverbounce` -> `node tools/clis/neverbounce.js`
- `millionverifier` -> `node tools/clis/millionverifier.js`

## Quick Command Patterns

### Find email

- `icypeas`: `email find --firstname <first> --lastname <last> --domain <domain>`
- `findymail`: `email find --name "<First Last>" --domain <domain>`
- `prospeo`: `person enrich --full-name "<First Last>" --company-website <domain> --only-verified-email`
- `rocketreach`: `person lookup --name "<First Last>" --current-employer "<company>"`
- `hunter`: `email find --domain <domain> --first-name <first> --last-name <last>`
- `apollo`: `people enrich --first-name <first> --last-name <last> --domain <domain>`

### Verify email

- `icypeas`: `email verify --email <email>`
- `findymail`: `email verify --email <email>`
- `hunter`: `email verify --email <email>`
- `neverbounce`: `email verify --email <email>`
- `millionverifier`: `email verify --email <email>`

## Execution Rules

1. Confirm selected tool in one sentence.
2. Run with `--dry-run` first for write-capable endpoints when appropriate.
3. Return:
   - tool used
   - command(s) run
   - result payload summary
   - confidence/status of found or verified email

If command errors, return raw error and smallest next step.
