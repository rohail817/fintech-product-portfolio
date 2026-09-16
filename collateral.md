# Collateral Control

Convert agreement terms and collateral records into an explainable calculation, with versioned rules, exact money arithmetic and a reproducible result.

[Open demo](https://urrly.rohailabid.com/projects/collateral/) · [Portfolio](https://urrly.rohailabid.com/)

## Credit view

### Borrowing capacity

See which units qualify, what value supports them, and how the agreement’s advance rates and limits affect availability.

### Control exceptions

Identify missing evidence, stale records and conflicting collateral identities before they feed a lending decision.

### Explain the change

Trace a change in borrowing capacity to the rule or source that caused it, with the supporting calculation visible.

## Technical view

AI-assisted prototype. These notes describe the current implementation.

TypeScript · BigInt · Web Crypto · React

### Versioned configuration

Rules carry evaluation order, agreement citations and effective dates. The engine validates the selected rule version before calculating.

### Exact arithmetic and replay

Amounts use integer cents; rates use basis points. A canonical result fingerprint supports replay checks, while an ordered trace explains each rule’s effect.

### Exceptions as product behavior

The synthetic portfolio includes stable identities and reviewable source exceptions. Missing evidence blocks a result instead of silently substituting zero.

## Try it

Reduce the spec advance rate from 75% to 65%. Then remove a required source and watch the calculation block.

## Demo scope

This public showcase runs the existing calculation engine and synthetic portfolio locally. Connected intake, account administration, live approvals and release/payoff execution are outside this demo.

[Calculation engine](collateral-engine.ts) · [Synthetic reference case](collateral-reference.json) · [Runnable checks](engine-checks.mjs)

<details><summary>Screenshot</summary>

![Collateral Control](collateral.png)

</details>
