# Prospeo

B2B data enrichment platform for person/company enrichment and prospect search.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API for person/company enrich + bulk/search |
| MCP | - | Not publicly documented |
| CLI | [✓](../clis/prospeo.js) | Local zero-dependency Node.js CLI in this repo |
| SDK | - | API-first usage |

## Authentication

- **Type**: API key header
- **Header**: `X-KEY: {PROSPEO_API_KEY}`
- **Base URL**: `https://api.prospeo.io`
- **Env var**: `PROSPEO_API_KEY`

## Common Agent Operations

### Enrich a person

```bash
node tools/clis/prospeo.js person enrich \
  --full-name "Tim Zheng" \
  --company-website apollo.io \
  --only-verified-email
```

### Bulk enrich persons

```bash
node tools/clis/prospeo.js person bulk-enrich \
  --data '{"data":[{"full_name":"Tim Zheng","company_website":"apollo.io"}]}'
```

### Enrich a company

```bash
node tools/clis/prospeo.js company enrich --company-website apollo.io
```

### Search people/companies

```bash
# Person search (pass full payload JSON)
node tools/clis/prospeo.js person search --json '{"query":"sales leaders in saas","limit":20}'

# Company search
node tools/clis/prospeo.js company search --json '{"query":"b2b saas companies","limit":20}'
```

### Account info

```bash
node tools/clis/prospeo.js account info
```

## Notes

- Prospeo deprecates classic finder/verifier endpoints in favor of enrich/search APIs.
- Use `--only-verified-email` for stricter email quality on person enrich.
- Use `--dry-run` to preview calls without spending credits.

## Rate Limits

- Limits are plan-based in Prospeo.
- Use bulk endpoints for high-volume operations.
- Back off and retry on `429` responses.

## Relevant Skills

- pipedrive-crm
- smartlead-outbound
- apollo-outbound
