# Rohail Abid — Technical product portfolio

Working financial software, prepared for Urrly recruiter review.

**[Open the live portfolio](https://urrly.rohailabid.com/)** · **[Download the local demo pack](urrly-demo-pack.zip)** · **[Read the engineering notes](engineering.md)**

My background spans commercial real estate, commercial lending and homebuilder finance at Flagstar. I am interested in fintech roles that combine technical product development, solutions and implementation, or workflow automation. I use AI-assisted coding tools to turn operating needs into working applications, with explicit calculation logic, source evidence and review boundaries.

## Start here

1. **[Collateral Control](collateral.md):** versioned agreement rules, exact money arithmetic, ordered calculation traces, source exceptions and reproducible replay.
2. **[QPR Intelligence](qpr.md):** structured workbook ingestion, typed records, reconciliation, source lineage and browser-generated PDF output.
3. Browse the other projects for scenario modeling, decision workflows and structured document authoring.

| Project | What to inspect | Live demo |
|---|---|---|
| [Collateral Control](collateral.md) | Rules engine · Data integrity | [Open](https://urrly.rohailabid.com/projects/collateral/) |
| [QPR Intelligence](qpr.md) | Data pipeline · Document automation | [Open](https://urrly.rohailabid.com/projects/qpr/) |
| [Bridge Credit Intelligence](bridge.md) | Decision engine · Scenario state | [Open](https://urrly.rohailabid.com/projects/bridge/) |
| [Loan Structure Lab](structure.md) | Simulation · Export pipeline | [Open](https://urrly.rohailabid.com/projects/structure/) |
| [Credit Decision Studio](credit.md) | Workflow design · Structured authoring | [Open](https://urrly.rohailabid.com/projects/credit/) |
| [HBF Intel](intel.md) | Research product · In development | [Open](https://urrly.rohailabid.com/projects/intel/) |

## A small, inspectable engineering sample

The [collateral calculation engine](collateral-engine.ts), [synthetic reference case](collateral-reference.json), and [five runnable checks](engine-checks.mjs) demonstrate a real part of the working app, rather than a separate illustrative snippet. Run with Node.js 22.18+ or 24+: `node --test engine-checks.mjs`.

The checks cover the $505,000 reference result, a $475,000 lower-advance case, repeatable fingerprints, missing evidence and an unapproved rule version. They are focused behavioral checks, not a claim of comprehensive production certification.

## If the live website is blocked

Read the project walkthroughs and screenshots here, or download **[urrly-demo-pack.zip](urrly-demo-pack.zip)**. Unzip it, open a terminal in the extracted folder and run `node start.mjs`, then visit `http://localhost:8765/`. A Python alternative is included in `START-HERE.md`. The pack requires no package install, sign-in, API key or connected borrower database.

The offline pack runs the five interactive demos and the HBF Intel brief. It sends no activity events. GitHub document views are not individually tracked.

## Context and boundaries

Independent work by Rohail Abid. These are synthetic prototypes and work samples; no production adoption, bank deployment or senior engineering title is implied. Urrly branding is illustrative and identifies the intended review audience, with no affiliation or endorsement implied. The full collateral application's connected workflows are outside the public showcase; HBF Intel is a development-stage brief.

This repository is a curated public showcase. Existing private repositories, credentials, borrower data and tracking records are not included. Third-party libraries in the local demo pack retain their applicable licenses; the original project materials are shared for evaluation, without an additional reuse license.
