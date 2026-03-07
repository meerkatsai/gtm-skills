# RocketReach

B2B contact intelligence platform for person lookup, search, and contact enrichment workflows.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API for person lookup/search and account info |
| MCP | - | Not publicly documented |
| CLI | [✓](../clis/rocketreach.js) | Local zero-dependency Node.js CLI in this repo |
| SDK | ✓ | Official Python package (`rocketreach`) |

## Authentication

- **Type**: API key header
- **Header**: `Api-Key: {ROCKETREACH_API_KEY}`
- **Base URL**: `https://api.rocketreach.co/api/v2`
- **Env var**: `ROCKETREACH_API_KEY`

## Common Agent Operations

### Person lookup

```bash
# By LinkedIn URL
node tools/clis/rocketreach.js person lookup --linkedin https://www.linkedin.com/in/example

# By person ID
node tools/clis/rocketreach.js person lookup --id 123456

# By name + employer
node tools/clis/rocketreach.js person lookup --name "Tim Zheng" --current-employer "Apollo"
```

### Check lookup status (async lookups)

```bash
node tools/clis/rocketreach.js person status --ids 123456,123457
```

### Person search

```bash
node tools/clis/rocketreach.js person search --json '{"query":{"current_employer":"Apollo","job_title":"CEO"},"page_size":10}'
```

### Account info

```bash
node tools/clis/rocketreach.js account info
```

## Notes

- Some lookups return queued/progress states; poll with `person status`.
- Use `--dry-run` to preview request payloads safely.
- Respect credit usage on lookup and search calls.

## Rate Limits

- Limits are account/plan based in RocketReach.
- Back off and retry on `429` responses.

## Relevant Skills

- smartlead-outbound
- apollo-outbound
- pipedrive-crm
