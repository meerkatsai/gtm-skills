# Smartlead

Cold email outreach platform for campaign automation, lead management, sender health, and campaign analytics.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API for campaigns, leads, email accounts, and analytics |
| MCP | ✓ | Official Smartlead MCP server (SSE transport) |
| CLI | [✓](../clis/smartlead.js) | Zero-dependency Node.js CLI |
| SDK | - | REST API only |

## Authentication

### REST API

- **Type**: API key (query parameter)
- **Parameter**: `api_key={SMARTLEAD_API_KEY}`
- **Base URL**: `https://server.smartlead.ai/api/v1`
- **Env var**: `SMARTLEAD_API_KEY`

### MCP

- **Transport**: SSE (Server-Sent Events)
- **Remote URL**: `https://mcp.smartlead.ai/sse?user_api_key=YOUR_API_KEY`
- **Reference setup guide**: https://helpcenter.smartlead.ai/en/articles/300-smartlead-mcp-server

### CLI

- **Script**: `tools/clis/smartlead.js`
- **Runtime**: Node.js 18+
- **Env vars**: `SMARTLEAD_API_KEY`, optional `SMARTLEAD_BASE_URL`

## Common Agent Operations

### REST API examples

```bash
# List campaigns
GET https://server.smartlead.ai/api/v1/campaigns?api_key={SMARTLEAD_API_KEY}

# Get campaign
GET https://server.smartlead.ai/api/v1/campaigns/{campaign_id}?api_key={SMARTLEAD_API_KEY}

# Create campaign
POST https://server.smartlead.ai/api/v1/campaigns/create?api_key={SMARTLEAD_API_KEY}
Content-Type: application/json

{
  "name": "Q2 SaaS Outbound"
}
```

### MCP setup (Claude Desktop)

```json
{
  "mcpServers": {
    "smartlead": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://mcp.smartlead.ai/sse?user_api_key=YOUR_API_KEY"
      ]
    }
  }
}
```

### CLI commands

```bash
# Campaigns
node tools/clis/smartlead.js campaigns list
# Optional local pagination
node tools/clis/smartlead.js campaigns list --offset 0 --limit 20
node tools/clis/smartlead.js campaigns get --campaign-id 12345
node tools/clis/smartlead.js campaigns create --name "Q2 SaaS Outbound"
node tools/clis/smartlead.js campaigns status --campaign-id 12345
node tools/clis/smartlead.js campaigns set-status --campaign-id 12345 --status ACTIVE

# Leads
node tools/clis/smartlead.js leads list --campaign-id 12345 --limit 100
node tools/clis/smartlead.js leads add --campaign-id 12345 --email prospect@example.com --first-name Alex --last-name Doe

# Email accounts
node tools/clis/smartlead.js email-accounts list --limit 50
node tools/clis/smartlead.js email-accounts by-campaign --campaign-id 12345

# Analytics
node tools/clis/smartlead.js campaigns statistics --campaign-id 12345 --limit 50
```

## Notes

- Use `--dry-run` on CLI commands to preview the request without sending data.
- `campaigns list` pagination flags (`--offset`, `--limit`) are applied client-side by the CLI for compatibility.
- Smartlead MCP currently supports SSE transport in the official guide.
- Smartlead API limits depend on account plan and endpoint usage.
