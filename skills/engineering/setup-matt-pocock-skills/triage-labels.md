# Workflow Role Mapping

This compatibility-path file maps the workflow roles used by the installed Matt engineering Skills to the concrete values used by this repository's tracker. On label-based trackers the values are label strings; in local markdown they are machine-readable `Status:` / `Category:` values. Setup writes only the rows required by the selected tracker and installed flows.

| Workflow role | Value in our tracker | Used by | Meaning |
| --- | --- | --- | --- |
| `ready-for-agent` | `ready-for-agent` | `to-tickets`, `triage` | Work is fully specified and available for Agent execution |
| `bug` | `bug` | `triage` | Incoming request is a defect |
| `enhancement` | `enhancement` | `triage` | Incoming request is a feature or improvement |
| `needs-triage` | `needs-triage` | `triage` | Maintainer still needs to evaluate the request |
| `needs-info` | `needs-info` | `triage` | Waiting for information from the reporter |
| `ready-for-human` | `ready-for-human` | `triage` | Work requires human implementation or judgement |
| `wontfix` | `wontfix` | `triage` | Request will not be actioned |
| `wayfinder:map` | `wayfinder:map` | `wayfinder` | Canonical Wayfinder map issue |
| `wayfinder:research` | `wayfinder:research` | `wayfinder` | AFK research decision ticket |
| `wayfinder:prototype` | `wayfinder:prototype` | `wayfinder` | Prototype-backed decision ticket |
| `wayfinder:grilling` | `wayfinder:grilling` | `wayfinder` | HITL grilling decision ticket |
| `wayfinder:task` | `wayfinder:task` | `wayfinder` | Task that unblocks a decision |

Downstream Skills speak in workflow roles; use the configured value from the right-hand column rather than assuming the canonical role string itself is the tracker's concrete value.

For a real label-based tracker, setup verifies the required subset after the user approves the configuration and creates only labels that are missing. Existing labels keep their current color and description.
