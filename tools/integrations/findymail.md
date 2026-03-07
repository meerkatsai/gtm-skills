# Findymail

Email finding and verification platform focused on B2B outreach data quality.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API for email finding and verification |
| MCP | - | Not publicly documented |
| CLI | [✓](../clis/findymail.js) | Local zero-dependency Node.js CLI in this repo |
| SDK | - | API-first usage |

## Authentication

- **Type**: Bearer token
- **Header**: `Authorization: Bearer {FINDYMAIL_API_KEY}`
- **Base URL**: `https://app.findymail.com/api`
- **Env var**: `FINDYMAIL_API_KEY`

## Common Agent Operations

### Find email by name + domain

```bash
node tools/clis/findymail.js email find --name "Tim Zheng" --domain apollo.io
```

### Verify email

```bash
node tools/clis/findymail.js email verify --email tim@apollo.io
```

## Notes

- Email find requires both a full name and a company domain.
- Verification should be used before outreach sends to improve deliverability.
- Use `--dry-run` to preview requests without spending credits.

## Rate Limits

- Limits and credit usage are plan-based in Findymail.
- Apply retries with exponential backoff for transient failures.
- Handle `429` responses by pausing and retrying.

## Relevant Skills

- smartlead-outbound
- pipedrive-crm
- apollo-outbound
