# NeverBounce

Email verification platform for validating deliverability and reducing bounce rates.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API for single and bulk email verification |
| MCP | - | Not publicly documented |
| CLI | [✓](../clis/neverbounce.js) | Local zero-dependency Node.js CLI in this repo |
| SDK | - | API-first usage |

## Authentication

- **Type**: API key query parameter
- **Parameter**: `key={NEVERBOUNCE_API_KEY}`
- **Base URL**: `https://api.neverbounce.com/v4`
- **Env var**: `NEVERBOUNCE_API_KEY`

## Common Agent Operations

### Verify a single email

```bash
node tools/clis/neverbounce.js email verify --email tim@apollo.io
```

### Verify with extra metadata

```bash
node tools/clis/neverbounce.js email verify --email tim@apollo.io --address-info --credits-info
```

### Check account/credits info

```bash
node tools/clis/neverbounce.js account info
```

## Notes

- NeverBounce is verification-focused; it does not provide contact email finding.
- Use verification before campaign sends to improve sender reputation.
- Use `--dry-run` to inspect requests locally without spending credits.

## Rate Limits

- Limits are plan-based in NeverBounce.
- Back off and retry on `429` or transient network failures.

## Relevant Skills

- smartlead-outbound
- resend-email
- pipedrive-crm
