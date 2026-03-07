# MillionVerifier

Email verification platform for real-time and bulk mailbox validation.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Single verify API + bulk verification APIs |
| MCP | - | Not publicly documented |
| CLI | [✓](../clis/millionverifier.js) | Local zero-dependency Node.js CLI in this repo |
| SDK | - | API-first usage |

## Authentication

- **Type**: API key query parameter
- **Single verify base**: `https://api.millionverifier.com/api/v3`
- **Bulk base**: `https://bulkapi.millionverifier.com/bulkapi/v2`
- **Params**: `api` (single) and `key` (bulk)
- **Env var**: `MILLIONVERIFIER_API_KEY`

## Common Agent Operations

### Verify one email (real-time)

```bash
node tools/clis/millionverifier.js email verify --email tim@apollo.io
```

### Upload a bulk list

```bash
node tools/clis/millionverifier.js bulk upload --file ./leads.csv
```

### Check file processing status

```bash
node tools/clis/millionverifier.js bulk fileinfo --file-id 123456
```

### List all files

```bash
node tools/clis/millionverifier.js bulk files
```

### Download results

```bash
node tools/clis/millionverifier.js bulk download --file-id 123456 --filter all
```

### Stop/delete a bulk file

```bash
node tools/clis/millionverifier.js bulk stop --file-id 123456
node tools/clis/millionverifier.js bulk delete --file-id 123456
```

## Notes

- Single verify supports timeout control (`--timeout`).
- Bulk routes use a separate API host from single verify.
- Use `--dry-run` to preview requests without spending credits.

## Rate Limits

- Limits and credits are plan-based.
- For large lists, prefer bulk upload over many single checks.
- Back off and retry on `429` responses.

## Relevant Skills

- smartlead-outbound
- resend-email
- pipedrive-crm
