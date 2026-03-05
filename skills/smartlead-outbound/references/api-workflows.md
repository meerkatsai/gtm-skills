# API Workflows

## Campaign setup

1. Create campaign.
2. Confirm campaign status.
3. Add leads.
4. Confirm sender accounts attached.
5. Verify sequence configuration and statistics after launch.

## Safe-write flow

1. Run target command with `--dry-run`.
2. Validate URL path and body.
3. Execute command without `--dry-run`.
4. Confirm with a read command.

## Troubleshooting

- `SMARTLEAD_API_KEY environment variable required`: export key in shell.
- `status` with API error object: verify campaign ID, body fields, and account permissions.
- Empty datasets on list calls: confirm offset/limit and workspace context in Smartlead.
