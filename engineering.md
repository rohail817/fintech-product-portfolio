# Engineering notes

The strongest technical evidence is the behavior and structure of the working applications. This guide explains what to inspect, with current scope made explicit.

## Collateral Control: configuration → calculation → evidence

```text
Versioned agreement rules + synthetic input snapshot
    ↓ validate IDs, version, dates and required references
Eligibility → valuation basis → rates → concentration/aging
    ↓ integer cents + basis points + declared evaluation order
Outputs + unit contributions + ordered rule trace + replay hash
```

- A typed engine request separates rule configuration from the collateral snapshot.
- Monetary references include source system, record ID and as-of date.
- Integer-cent arithmetic and basis-point rates make rounding policy explicit.
- Missing required evidence or an unapproved rule version blocks calculation.
- Replay fingerprints expose changes to authoritative inputs or outputs; they do not constitute authentication or a tamper-proof audit service.
- The synthetic portfolio exercises identity and source-conflict review. Connected operations are outside this public demo.

See [engine](collateral-engine.ts), [fixture](collateral-reference.json) and [behavioral checks](engine-checks.mjs).

## QPR: workbook → normalized record → controlled output

```text
Excel OOXML package
    ↓ selected parts, size limits, worksheets and cached cells
Typed relationship + dates/periods + source lineage
    ↓ calculations, reconciliation, materiality
Executive review + facts/narrative separation + PDF
```

The browser reads approved workbook regions rather than treating the entire file as a trusted database. Ingestion, domain calculations, intelligence findings, narrative construction and presentation are separate layers. Source identity and sheet/cell lineage support review. The current export is PDF; other document formats require adaptation.

## Bridge and Structure: separate mechanics from decisions

Bridge separates underwriting calculations, policy checks, stress cases, breakpoints, execution logic and recommendations. The review interface exposes assumptions and evidence. Human credit review remains a distinct step.

Structure uses typed and validated scenarios with a monthly cash-flow model. Timing, budget, inventory, closings and repayment interact through an inspectable ledger. Reusable results feed comparisons, CSV output and Word exhibits.

## Credit Decision Studio: an actual document workflow

The product centers on the work product: a structured memo, evidence review, authored rationale and Word export. It illustrates the difference between generating text and designing a usable preparation-and-review workflow. The browser demo preserves local document protections.

## Delivery and observability

The public portfolio uses a Cloudflare-compatible Worker and persistent SQLite event storage. HTML requests receive signed tracking context; allowlisted interaction events use idempotent identifiers. Owner reports require a separate read key. Marked test activity and a reporting baseline separate setup from later audience traffic.

The site records broad page signals and approximate network geography, not workbooks, typed text, financial values, raw IP addresses or document contents. Geographic and interaction signals cannot identify a specific person, and link scanners or browser blocking can affect records. This infrastructure demonstrates deployable delivery and bounded observability, not an audited enterprise control environment.

## Development approach

These are independent projects built with AI-assisted coding tools. The portfolio emphasizes explicit domain models, inspectable transformations, focused tests and clear product boundaries. It is intended to support a technical conversation about how I could contribute to a fintech product or operating team.
