# Contributing

## Development Flow

1. Create a branch from `main`.
2. Make focused changes.
3. Run local checks:

```bash
npm test
./validate-skills.sh
```

4. Open a pull request using the template that matches your change.

## Skill Changes

- Keep each skill's `SKILL.md` task-specific and executable.
- Prefer referencing scripts/templates over repeating long instructions.
- Include references only where needed.

## CLI Changes

- Keep CLIs zero-dependency.
- Return machine-readable JSON output.
- Support `--dry-run` for mutating calls.
