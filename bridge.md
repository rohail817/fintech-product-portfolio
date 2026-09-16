# Bridge Credit Intelligence

Connect deal inputs, underwriting formulas, policy thresholds, downside scenarios and a reviewable recommendation in one stateful workspace.

[Open demo](https://urrly.rohailabid.com/projects/bridge/) · [Portfolio](https://urrly.rohailabid.com/)

## Credit view

### Underwrite the case

Assess debt sizing, cash flow and repayment against the deal assumptions and policy thresholds.

### Challenge the downside

Stress the case and inspect which constraints become binding, including the effect on the recommendation.

### Prepare a decision

Bring quantitative results, exceptions, conditions and reviewer judgment together in a consistent credit review.

## Technical view

AI-assisted prototype. These notes describe the current implementation.

TypeScript · React · Policy and stress engines

### Separated decision layers

Calculation, policy, stress, breakpoints and recommendation logic live in distinct modules, so a threshold change is different from a formula change.

### Explainable results

Formula substitutions, source lineage and policy evidence make it possible to inspect how a number or recommendation was produced.

### Consistent workflow state

The demo carries one deal context across the dashboard, underwriting, stress lab and credit review instead of asking the reviewer to rebuild a case on each screen.

## Try it

Change an underwriting assumption, select a downside scenario and compare the result with its formula and policy tests.

## Demo scope

A synthetic multifamily case demonstrates the workflow. It is not a live loan-origination integration or autonomous credit decision.

<details><summary>Screenshot</summary>

![Bridge Credit Intelligence](bridge.png)

</details>
