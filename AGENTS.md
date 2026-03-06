# AGENTS

## Repository Rules

- Keep outputs deterministic and JSON-first for CLI tools.
- Prefer minimal, composable skills over broad monolithic instructions.
- Keep integration docs aligned with implemented CLI behavior.

## Validation

Run the following before opening a PR:

```bash
npm test
./validate-skills.sh
```
