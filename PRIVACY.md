# SysML Extension Privacy

Updated 2026-09-27. Optional telemetry helps improve features, performance and reliability.
Unconfigured local builds and development/test hosts do not send telemetry.

## Your Choice

SysML respects VS Code telemetry settings and policies: `all` permits usage, performance
and errors; `error` permits only reviewed error codes; `crash` and `off` send nothing.

Set `sysml.telemetry.enabled` to `false` in User Settings to disable all SysML telemetry.
It defaults to `true`, cannot be enabled by workspace settings, and never affects feature access.

## Collected Data

- Allowlisted feature names, operation outcomes, timings, reviewed error codes, timestamps,
  schema/software versions, OS and host category.
- Usage only: random installation/session IDs and event sequence numbers. These are
  **pseudonymous, not anonymous**, and measure installations rather than people.
- No model/source content, model names, paths, search terms, clipboard contents, raw
  diagnostics/errors, account details or machine IDs. See [telemetry.json](telemetry.json).

The installation ID is stored locally, not synced, and deleted on usage opt-out while
running or at next startup. Re-enabling creates a new ID. Errors never include these IDs.

## Storage

Telemetry is encrypted in transit and storage, with authorized query access, in the
publisher's Azure services in **West Europe**. Extension events have **90-day retention**;
Azure operational records may have different retention. Opt-out stops collection but does
not delete events already received.

Azure processes network IP addresses; stored extension events exclude IP and location data.
Data is not intended for advertising or cross-product identification.

## Issue Reports

`SysML: Report Issue` creates a local, editable draft with version and coarse host
details, without logs or models. After your confirmation, it opens GitHub with the draft
in a URL, which may remain in browser history. Submitted issues are public and subject to
GitHub's privacy policy. Reporting works with telemetry disabled.

Contact the repository maintainer for privacy questions. Do not post sensitive data publicly;
use private security reporting for vulnerabilities where available.
