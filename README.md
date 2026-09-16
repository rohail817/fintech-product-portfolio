# Rohail Abid — Project portfolio

[Open the portfolio](https://urrly.rohailabid.com/) · [Technical notes](engineering.md) · [Demo pack](urrly-demo-pack.zip)

| Project | Credit view | Technical view | Demo |
|---|---|---|---|
| [Collateral Control](collateral.md) | Borrowing capacity | Rules engine · Data integrity | [Open](https://urrly.rohailabid.com/projects/collateral/) |
| [QPR Intelligence](qpr.md) | Recurring reviews | Data pipeline · Document automation | [Open](https://urrly.rohailabid.com/projects/qpr/) |
| [Bridge Credit Intelligence](bridge.md) | Underwrite the case | Decision engine · Scenario state | [Open](https://urrly.rohailabid.com/projects/bridge/) |
| [Loan Structure Lab](structure.md) | Find the funding gap | Simulation · Export pipeline | [Open](https://urrly.rohailabid.com/projects/structure/) |
| [Credit Decision Studio](credit.md) | Prepare the memo | Workflow design · Structured authoring | [Open](https://urrly.rohailabid.com/projects/credit/) |
| [HBF Intel](intel.md) | Market context | Research product · In development | [Open](https://urrly.rohailabid.com/projects/intel/) |

Each project has a credit view and a technical view. The technical notes describe AI-assisted prototypes and their current behavior.

## Calculation example

[Engine](collateral-engine.ts) · [Synthetic reference case](collateral-reference.json) · [Five runnable checks](engine-checks.mjs)

The checks cover the $505,000 reference result, a $475,000 lower-advance case, repeatable fingerprints, missing evidence and an unapproved rule version. Run with Node.js 22.18+ or 24+: `node --test engine-checks.mjs`.

The demos use fictional data. HBF Intel is a development-stage brief. Each project’s notes explain its current scope.

Third-party libraries in the demo pack retain their applicable licenses. Original project materials are shared for evaluation, without an additional reuse license.
