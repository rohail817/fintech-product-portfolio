# Engineering notes

Implementation notes for AI-assisted prototypes. The descriptions below explain software behavior and design choices.

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
