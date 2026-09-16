# Loan Structure Lab

Model construction spending, inventory, closings, loan balances and repayment month by month, then compare terms and stress cases.

[Open the live demo](https://urrly.rohailabid.com/projects/structure/) · [Portfolio overview](https://urrly.rohailabid.com/) · [Local demo pack](urrly-demo-pack.zip)

## Technical focus

TypeScript · Zod · Monthly ledger · DOCX/CSV

### Model before presentation

Typed scenario inputs feed a separate domain calculation layer; the interface presents the resulting funding, cash-flow and repayment outputs.

### Validated scenario changes

Input validation and structured scenario files make assumptions explicit. The monthly ledger exposes timing effects hidden by summary ratios.

### Reusable outputs

CSV and Word exports use the scenario results, connecting analysis to a work product rather than leaving the result trapped on a dashboard.

## Review path

Compare Base and Downside, change a repayment sweep, and inspect the month-by-month cash and funding effects.

## Scope

A local scenario model with fictional project data. It does not execute transactions or synchronize with a live servicing platform.

<details><summary>Screenshot of the working demo</summary>

![Loan Structure Lab](./structure.png)

</details>

Independent work by Rohail Abid. Urrly branding is illustrative. Fictional data is used throughout.
