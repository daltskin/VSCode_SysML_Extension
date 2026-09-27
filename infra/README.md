# Telemetry Infrastructure

Azure infrastructure for optional extension telemetry: Application Insights, Log Analytics,
privacy filtering, dashboards and cost alerts. Managed separately from extension releases
and excluded from the published VSIX.

## Safeguards

- Collection respects VS Code telemetry settings and the extension opt-out.
- Stored events are allowlisted and exclude model content, file paths and raw error details.
- Usage uses resettable pseudonymous identifiers; errors are not linked to usage identities.
- Data is retained for 90 days. Queries require authorized access.
- Public ingestion can be spoofed. Daily caps and budget alerts do not guarantee a spending limit.

See [the privacy policy](../PRIVACY.md) for collection and consent details.

## Operations

- Deploy with ingestion disabled. Privacy-filter changes require verification before re-enabling it.
- Production release builds receive their telemetry destination through GitHub Actions.
  Development and test hosts remain disconnected.
- Infrastructure deployment, collection activation and extension publishing require separate approval.

## Validation

```sh
bicep build infra/main.bicep --outfile /tmp/sysml-telemetry-main.json
node infra/validate.cjs /tmp/sysml-telemetry-main.json
node --test scripts/telemetry-config.test.cjs
```

Local checks do not replace live privacy verification when ingestion rules change.
