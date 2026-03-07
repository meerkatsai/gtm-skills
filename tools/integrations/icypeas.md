# Icypeas

B2B contact and company data platform for email discovery, verification, domain search, and reverse lookup.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API for single and bulk enrichment workflows |
| MCP | - | Not publicly documented |
| CLI | [✓](../clis/icypeas.js) | Local zero-dependency Node.js CLI in this repo |
| SDK | - | API-first usage |

## Authentication

- **Type**: API key header
- **Header**: `Authorization: {ICYPEAS_API_KEY}`
- **Base URL**: `https://app.icypeas.com/api`
- **Env var**: `ICYPEAS_API_KEY`

## Common Agent Operations

### Find a person's email

```bash
node tools/clis/icypeas.js email find \
  --firstname Tim \
  --lastname Zheng \
  --domain apollo.io
```

### Verify an email

```bash
node tools/clis/icypeas.js email verify --email tim@apollo.io
```

### Scan a domain/company for contacts

```bash
node tools/clis/icypeas.js domain scan --domain apollo.io
```

### Start a bulk job

```bash
node tools/clis/icypeas.js bulk start \
  --task email-search \
  --name "Q2 Lead Enrichment" \
  --data '[{"firstname":"Tim","lastname":"Zheng","domainOrCompany":"apollo.io"}]'
```

### Read file/job progress

```bash
node tools/clis/icypeas.js bulk files --status in_progress --limit 20
```

### Read collected results

```bash
node tools/clis/icypeas.js results read --mode bulk --file file_xxx --limit 50
```

### Reverse lookup

```bash
# Single
node tools/clis/icypeas.js reverse one --email tim@apollo.io

# Bulk
node tools/clis/icypeas.js reverse bulk --emails tim@apollo.io,jane@example.com
```

## Notes

- Many endpoints are asynchronous and may return processing status before final data is available.
- Use `bulk files` and `results read` to track completion and fetch outputs.
- Include webhook metadata (`--webhook`, `--external-id`) when integrating into pipelines.

## Rate Limits

- Limits are plan-based in Icypeas.
- Prefer bulk endpoints for high-volume jobs.
- Back off and retry on `429` responses.

## Relevant Skills

- pipedrive-crm
- smartlead-outbound
- apollo-outbound
