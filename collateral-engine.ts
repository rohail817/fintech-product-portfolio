export const ENGINE_VERSION = "hbf-rule-engine-v1";
export const FORMULA_VERSION = "vertical-borrowing-base-proof-v1";

const MAX_SIGNED_BIGINT_CENTS = 9_223_372_036_854_775_807n;
const BASIS_POINT_DENOMINATOR = 10_000n;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const ISO_UTC_TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

export type EngineRuleStatus = "active" | "superseded";
export type EngineRuleKind =
  | "eligibility"
  | "basis"
  | "advance_rate"
  | "aging"
  | "freshness"
  | "concentration"
  | "sublimit"
  | "release"
  | "context";

export type EngineValueUnit =
  | "basis_points"
  | "currency_cents"
  | "days"
  | "boolean"
  | "text"
  | "formula_reference";

export type EngineRule = Readonly<{
  id: string;
  ruleCode: string;
  ruleKind: EngineRuleKind;
  evaluationOrder: number;
  displayName: string;
  valueUnit: EngineValueUnit;
  numericValue: number | string | null;
  textValue: string | null;
  parameters: Readonly<Record<string, unknown>>;
  agreementCitation: string;
}>;

export type EngineRuleVersion = Readonly<{
  organizationId: string;
  facilityId: string;
  ruleVersionId: string;
  ruleVersionStatus: EngineRuleStatus;
  effectiveFrom: string;
  effectiveTo: string | null;
  facilityPattern: "vertical_borrowing_base";
  configurationHash: string;
  rules: readonly EngineRule[];
}>;

export type MoneyReference = Readonly<{
  valueCents: string;
  sourceSystem: string;
  sourceRecordId: string;
  asOfDate: string;
}>;

export type AgeReference = Readonly<{
  startEvent: string;
  eventDate: string;
  sourceSystem: string;
  sourceRecordId: string;
}>;

export type EngineUnitInput = Readonly<{
  unitId: string;
  projectId: string;
  collateralClass: string;
  status: string;
  ageReference: AgeReference;
  documentedCost: MoneyReference | null;
  supportedValue: MoneyReference | null;
}>;

export type EngineInputSnapshot = Readonly<{
  inputSnapshotId: string;
  organizationId: string;
  facilityId: string;
  calculationType: "borrowing_base_engine_proof";
  calculationAsOf: string;
  calculationTimestamp: string;
  currency: "USD";
  synthetic: true;
  units: readonly EngineUnitInput[];
}>;

export type EngineRequest = Readonly<{
  ruleVersion: EngineRuleVersion;
  inputSnapshot: EngineInputSnapshot;
}>;

export type EngineReason = Readonly<{
  code: string;
  message: string;
  ruleId: string | null;
  unitId: string | null;
}>;

export type EngineTraceStep = Readonly<{
  sequence: number;
  ruleId: string;
  ruleCode: string;
  ruleKind: EngineRuleKind;
  citation: string;
  status: "applied" | "deferred";
  affectedUnitCount: number;
  totalBeforeCents: string;
  totalAfterCents: string;
  detail: string;
}>;

export type EngineConstraint = Readonly<{
  ruleId: string;
  ruleCode: string;
  constraintType: "class_concentration";
  groupKey: string;
  limitBasisPoints: number;
  beforeCents: string;
  limitCents: string;
  afterCents: string;
  binding: boolean;
  allocationMethod: "floor_then_stable_unit_remainder";
}>;

export type EngineItemResult = Readonly<{
  unitId: string;
  projectId: string;
  collateralClass: string;
  status: string;
  ageDays: number;
  ageStartEvent: string;
  eligible: boolean;
  documentedCostCents: string | null;
  supportedValueCents: string | null;
  basisCents: string | null;
  appliedRateBasisPoints: number | null;
  rawContributionCents: string | null;
  contributionCents: string | null;
  exclusionReasons: readonly string[];
}>;

export type EngineResult = Readonly<{
  status: "succeeded" | "blocked";
  engineVersion: typeof ENGINE_VERSION;
  formulaVersion: typeof FORMULA_VERSION;
  calculationType: "borrowing_base_engine_proof";
  calculationAsOf: string;
  calculationTimestamp: string;
  organizationId: string;
  facilityId: string;
  ruleVersionId: string;
  inputSnapshotId: string;
  configurationHash: string;
  currency: "USD";
  synthetic: true;
  persisted: false;
  normalizedInputs: Readonly<{
    unitCount: number;
    units: readonly Readonly<{
      unitId: string;
      projectId: string;
      collateralClass: string;
      status: string;
      ageSource: Readonly<{
        startEvent: string;
        eventDate: string;
        sourceSystem: string;
        sourceRecordId: string;
        ageDays: number;
      }>;
      documentedCostSource: Readonly<{
        sourceSystem: string;
        sourceRecordId: string;
        asOfDate: string;
        ageDays: number;
      }> | null;
      supportedValueSource: Readonly<{
        sourceSystem: string;
        sourceRecordId: string;
        asOfDate: string;
        ageDays: number;
      }> | null;
    }>[];
  }>;
  orderedRules: readonly Readonly<{
    id: string;
    ruleCode: string;
    ruleKind: EngineRuleKind;
    evaluationOrder: number;
    agreementCitation: string;
  }>[];
  trace: readonly EngineTraceStep[];
  items: readonly EngineItemResult[];
  constraints: readonly EngineConstraint[];
  outputs: Readonly<{
    eligibleBasisCents: string | null;
    uncappedContributionCents: string | null;
    borrowingBaseCents: string | null;
  }>;
  warnings: readonly EngineReason[];
  blockingErrors: readonly EngineReason[];
  replayHash: string;
}>;

type MutableUnitState = {
  unitId: string;
  projectId: string;
  collateralClass: string;
  status: string;
  ageReference: AgeReference;
  ageDays: number;
  documentedCost: MoneyReference | null;
  supportedValue: MoneyReference | null;
  eligible: boolean;
  basisCents: bigint | null;
  appliedRateBasisPoints: number | null;
  rawContributionCents: bigint | null;
  contributionCents: bigint | null;
  exclusionReasons: string[];
};

function compareCodeUnits(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function canonicalStringify(value: unknown): string {
  if (value === null || typeof value === "string" || typeof value === "boolean") {
    return JSON.stringify(value);
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error("Canonical payload contains a non-finite number.");
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((entry) => canonicalStringify(entry)).join(",")}]`;
  }
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const keys = Object.keys(record).sort(compareCodeUnits);
    return `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalStringify(record[key])}`).join(",")}}`;
  }
  throw new Error("Canonical payload contains an unsupported value.");
}

async function sha256Hex(value: unknown) {
  const bytes = new TextEncoder().encode(canonicalStringify(value));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function deepFreeze<T>(value: T): Readonly<T> {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value as Record<string, unknown>)) {
      deepFreeze(child);
    }
  }
  return value;
}

function isIsoDate(value: string) {
  if (!ISO_DATE.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

function isIsoUtcTimestamp(value: string) {
  if (!ISO_UTC_TIMESTAMP.test(value)) return false;
  const parsed = new Date(value);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString() === value;
}

function utcDay(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
}

function daysBetween(earlier: string, later: string) {
  return utcDay(later) - utcDay(earlier);
}

function parseCents(value: string) {
  if (typeof value !== "string" || !/^(0|[1-9]\d*)$/.test(value)) {
    throw new Error("Money must be a non-negative integer-cent string.");
  }
  const parsed = BigInt(value);
  if (parsed > MAX_SIGNED_BIGINT_CENTS) throw new Error("Money exceeds the signed bigint boundary.");
  return parsed;
}

function parseRuleInteger(value: number | string | null, maximum: number) {
  const parsed = typeof value === "string" && /^\d+$/.test(value) ? Number(value) : value;
  if (typeof parsed !== "number" || !Number.isSafeInteger(parsed) || parsed < 0 || parsed > maximum) {
    throw new Error("Rule numeric value is outside its allowed integer range.");
  }
  return parsed;
}

function multiplyByBasisPoints(amountCents: bigint, basisPoints: number) {
  return (amountCents * BigInt(basisPoints)) / BASIS_POINT_DENOMINATOR;
}

function totalContribution(states: readonly MutableUnitState[]) {
  return states.reduce((sum, state) => sum + (state.contributionCents ?? 0n), 0n);
}

function addReason(
  target: EngineReason[],
  code: string,
  message: string,
  ruleId: string | null = null,
  unitId: string | null = null,
) {
  if (!target.some((reason) => reason.code === code && reason.ruleId === ruleId && reason.unitId === unitId)) {
    target.push({ code, message, ruleId, unitId });
  }
}

function stringArrayParameter(parameters: Readonly<Record<string, unknown>>, key: string) {
  const value = parameters[key];
  if (!Array.isArray(value) || value.length === 0 || value.some((entry) => typeof entry !== "string" || !entry.trim())) {
    throw new Error(`Rule parameter ${key} must be a non-empty string array.`);
  }
  const sorted = [...value].sort(compareCodeUnits) as string[];
  if (new Set(sorted).size !== sorted.length) {
    throw new Error(`Rule parameter ${key} cannot contain duplicates.`);
  }
  return sorted;
}

function stringParameter(parameters: Readonly<Record<string, unknown>>, key: string) {
  const value = parameters[key];
  if (typeof value !== "string" || !value.trim()) throw new Error(`Rule parameter ${key} must be a string.`);
  return value;
}

function booleanParameter(parameters: Readonly<Record<string, unknown>>, key: string) {
  const value = parameters[key];
  if (typeof value !== "boolean") throw new Error(`Rule parameter ${key} must be boolean.`);
  return value;
}

function assertExactParameterKeys(parameters: Readonly<Record<string, unknown>>, expectedKeys: readonly string[]) {
  const actual = Object.keys(parameters).sort(compareCodeUnits);
  const expected = [...expectedKeys].sort(compareCodeUnits);
  if (actual.length !== expected.length || actual.some((key, index) => key !== expected[index])) {
    throw new Error(`Rule parameters must contain exactly: ${expected.join(", ")}.`);
  }
}

function canonicalNumericValue(value: number | string | null) {
  if (typeof value === "number" && Number.isSafeInteger(value)) return String(value);
  if (typeof value === "string" && /^\d+$/.test(value)) return String(Number(value));
  return value;
}

function canonicalRuleForReplay(rule: EngineRule) {
  const parameters = { ...rule.parameters };
  if (rule.ruleKind === "eligibility" && Array.isArray(parameters.statuses)) {
    parameters.statuses = [...parameters.statuses].sort((left, right) =>
      compareCodeUnits(String(left), String(right)));
  }
  return {
    ...rule,
    numericValue: canonicalNumericValue(rule.numericValue),
    parameters,
  };
}

function allocateClassCap(states: MutableUnitState[], className: string, capCents: bigint) {
  const targets = states
    .filter((state) => state.eligible && state.collateralClass === className && state.contributionCents !== null)
    .sort((left, right) => compareCodeUnits(left.unitId, right.unitId));
  const before = targets.reduce((sum, state) => sum + (state.contributionCents ?? 0n), 0n);
  if (before <= capCents || before === 0n) return;

  let allocated = 0n;
  for (const target of targets) {
    const next = ((target.contributionCents ?? 0n) * capCents) / before;
    target.contributionCents = next;
    allocated += next;
  }
  let remainder = capCents - allocated;
  for (let index = 0; remainder > 0n; index = (index + 1) % targets.length) {
    targets[index].contributionCents = (targets[index].contributionCents ?? 0n) + 1n;
    remainder -= 1n;
  }
}

function normalizedReference(reference: MoneyReference | null, calculationAsOf: string) {
  if (!reference) return null;
  return {
    sourceSystem: reference.sourceSystem,
    sourceRecordId: reference.sourceRecordId,
    asOfDate: reference.asOfDate,
    ageDays: isIsoDate(reference.asOfDate) && isIsoDate(calculationAsOf)
      ? daysBetween(reference.asOfDate, calculationAsOf)
      : -1,
  };
}

function normalizedAgeReference(reference: AgeReference, calculationAsOf: string) {
  return {
    startEvent: reference.startEvent,
    eventDate: reference.eventDate,
    sourceSystem: reference.sourceSystem,
    sourceRecordId: reference.sourceRecordId,
    ageDays: isIsoDate(reference.eventDate) && isIsoDate(calculationAsOf)
      ? daysBetween(reference.eventDate, calculationAsOf)
      : -1,
  };
}

export async function runAgreementEngine(request: EngineRequest): Promise<EngineResult> {
  const errors: EngineReason[] = [];
  const warnings: EngineReason[] = [];
  const trace: EngineTraceStep[] = [];
  const constraints: EngineConstraint[] = [];
  const { ruleVersion, inputSnapshot } = request;

  for (const [field, value] of [
    ["organizationId", inputSnapshot.organizationId],
    ["facilityId", inputSnapshot.facilityId],
    ["inputSnapshotId", inputSnapshot.inputSnapshotId],
    ["ruleOrganizationId", ruleVersion.organizationId],
    ["ruleFacilityId", ruleVersion.facilityId],
    ["ruleVersionId", ruleVersion.ruleVersionId],
  ] as const) {
    if (typeof value !== "string" || !value.trim()) {
      addReason(errors, "IDENTIFIER_REQUIRED", `${field} must be a non-empty captured identifier.`);
    }
  }

  if (ruleVersion.organizationId !== inputSnapshot.organizationId) {
    addReason(errors, "ORGANIZATION_MISMATCH", "Rule and input organization IDs must match.");
  }
  if (ruleVersion.facilityId !== inputSnapshot.facilityId) {
    addReason(errors, "FACILITY_MISMATCH", "Rule and input facility IDs must match.");
  }
  if (ruleVersion.facilityPattern !== "vertical_borrowing_base" || inputSnapshot.calculationType !== "borrowing_base_engine_proof") {
    addReason(errors, "UNSUPPORTED_CALCULATION", "WP-04 executes only the bounded vertical borrowing-base engine proof.");
  }
  if (!inputSnapshot.synthetic) {
    addReason(errors, "SYNTHETIC_INPUT_REQUIRED", "WP-04 accepts synthetic input snapshots only.");
  }
  if (inputSnapshot.currency !== "USD") {
    addReason(errors, "CURRENCY_MISMATCH", "The bounded WP-04 fixture requires explicitly captured USD inputs.");
  }
  if (!["active", "superseded"].includes(ruleVersion.ruleVersionStatus)) {
    addReason(errors, "RULE_VERSION_NOT_EXECUTABLE", "Draft, in-review, and merely approved rule versions cannot execute.");
  }
  if (!/^[a-f0-9]{32,64}$/.test(ruleVersion.configurationHash)) {
    addReason(errors, "INVALID_CONFIGURATION_HASH", "The captured rule version requires its reviewed configuration fingerprint.");
  }
  if (!isIsoDate(inputSnapshot.calculationAsOf) || !isIsoDate(ruleVersion.effectiveFrom) || (ruleVersion.effectiveTo !== null && !isIsoDate(ruleVersion.effectiveTo))) {
    addReason(errors, "INVALID_EFFECTIVE_DATE", "Calculation and rule effective dates must be valid ISO dates.");
  } else {
    const inInterval = inputSnapshot.calculationAsOf >= ruleVersion.effectiveFrom
      && (ruleVersion.effectiveTo === null || inputSnapshot.calculationAsOf < ruleVersion.effectiveTo);
    if (!inInterval || (ruleVersion.ruleVersionStatus === "superseded" && ruleVersion.effectiveTo === null)) {
      addReason(errors, "RULE_VERSION_NOT_EFFECTIVE", "The captured rule version was not active for the calculation date.");
    }
  }
  if (!isIsoUtcTimestamp(inputSnapshot.calculationTimestamp)
    || inputSnapshot.calculationTimestamp.slice(0, 10) !== inputSnapshot.calculationAsOf) {
    addReason(errors, "INVALID_CALCULATION_TIMESTAMP", "The captured UTC timestamp must be canonical and match the calculation date.");
  }

  const orderedRules = [...ruleVersion.rules].sort((left, right) =>
    left.evaluationOrder - right.evaluationOrder || compareCodeUnits(left.ruleCode, right.ruleCode));
  if (orderedRules.length === 0) {
    addReason(errors, "EMPTY_RULE_VERSION", "A captured rule version must contain executable clauses.");
  }
  if (orderedRules.filter((rule) => rule.ruleKind === "eligibility").length !== 1) {
    addReason(errors, "ELIGIBILITY_RULE_REQUIRED", "The bounded engine proof requires exactly one eligibility rule.");
  }
  if (orderedRules.filter((rule) => rule.ruleKind === "basis").length !== 1) {
    addReason(errors, "BASIS_RULE_REQUIRED", "The bounded engine proof requires exactly one basis rule.");
  }
  if (!orderedRules.some((rule) => rule.ruleKind === "advance_rate")) {
    addReason(errors, "ADVANCE_RATE_REQUIRED", "The bounded engine proof requires at least one class advance-rate rule.");
  }
  const seenOrders = new Set<number>();
  const seenCodes = new Set<string>();
  const seenRuleIds = new Set<string>();
  for (const rule of orderedRules) {
    for (const [field, value] of [
      ["id", rule.id],
      ["ruleCode", rule.ruleCode],
      ["displayName", rule.displayName],
      ["agreementCitation", rule.agreementCitation],
    ] as const) {
      if (typeof value !== "string" || !value.trim()) {
        addReason(errors, "RULE_IDENTITY_REQUIRED", `${field} must be non-empty for every executable rule.`, rule.id || null);
      }
    }
    if (!Number.isSafeInteger(rule.evaluationOrder) || seenOrders.has(rule.evaluationOrder)) {
      addReason(errors, "AMBIGUOUS_RULE_ORDER", "Every rule must have a unique integer evaluation order.", rule.id);
    }
    if (seenRuleIds.has(rule.id)) {
      addReason(errors, "DUPLICATE_RULE_ID", "Every rule ID must be unique inside the captured version.", rule.id);
    }
    if (seenCodes.has(rule.ruleCode)) {
      addReason(errors, "DUPLICATE_RULE_CODE", "Every rule code must be unique inside the captured version.", rule.id);
    }
    seenOrders.add(rule.evaluationOrder);
    seenRuleIds.add(rule.id);
    seenCodes.add(rule.ruleCode);
  }

  const eligibilityRule = orderedRules.find((rule) => rule.ruleKind === "eligibility");
  const basisRule = orderedRules.find((rule) => rule.ruleKind === "basis");
  const advanceRules = orderedRules.filter((rule) => rule.ruleKind === "advance_rate");
  const concentrationRules = orderedRules.filter((rule) => rule.ruleKind === "concentration");
  if (eligibilityRule && basisRule && eligibilityRule.evaluationOrder >= basisRule.evaluationOrder) {
    addReason(errors, "INVALID_RULE_DEPENDENCY", "Eligibility must execute before the basis rule.", basisRule.id);
  }
  if (basisRule && advanceRules.some((rule) => rule.evaluationOrder <= basisRule.evaluationOrder)) {
    addReason(errors, "INVALID_RULE_DEPENDENCY", "Every advance rate must execute after the basis rule.");
  }
  const latestAdvanceOrder = advanceRules.reduce((latest, rule) => Math.max(latest, rule.evaluationOrder), Number.NEGATIVE_INFINITY);
  for (const rule of concentrationRules) {
    if (rule.evaluationOrder <= latestAdvanceOrder) {
      addReason(errors, "INVALID_RULE_DEPENDENCY", "Every concentration cap must execute after all advance rates.", rule.id);
    }
  }

  const seenUnitIds = new Set<string>();
  if (inputSnapshot.units.length === 0) {
    addReason(errors, "EMPTY_INPUT_SNAPSHOT", "The engine proof requires at least one captured unit input.");
  }
  const states: MutableUnitState[] = [...inputSnapshot.units]
    .sort((left, right) => compareCodeUnits(left.unitId, right.unitId))
    .map((unit) => {
      const ageReference: AgeReference = unit.ageReference ?? {
        startEvent: "",
        eventDate: "",
        sourceSystem: "",
        sourceRecordId: "",
      };
      for (const [field, value] of [
        ["unitId", unit.unitId],
        ["projectId", unit.projectId],
        ["collateralClass", unit.collateralClass],
        ["status", unit.status],
      ] as const) {
        if (typeof value !== "string" || !value.trim()) {
          addReason(errors, "UNIT_IDENTITY_REQUIRED", `${field} must be non-empty for every captured unit.`, null, unit.unitId || null);
        }
      }
      if (seenUnitIds.has(unit.unitId)) addReason(errors, "DUPLICATE_UNIT_ID", "Input snapshot unit IDs must be unique.", null, unit.unitId);
      seenUnitIds.add(unit.unitId);
      for (const [field, value] of [
        ["startEvent", ageReference.startEvent],
        ["sourceSystem", ageReference.sourceSystem],
        ["sourceRecordId", ageReference.sourceRecordId],
      ] as const) {
        if (typeof value !== "string" || !value.trim()) {
          addReason(errors, "AGE_LINEAGE_REQUIRED", `Age ${field} must be a non-empty captured source value.`, null, unit.unitId);
        }
      }
      const eventDate = ageReference.eventDate;
      if (typeof eventDate !== "string" || !isIsoDate(eventDate) || eventDate > inputSnapshot.calculationAsOf) {
        addReason(errors, "INVALID_AGE_EVENT_DATE", "The age event date must be valid and cannot follow the calculation date.", null, unit.unitId);
      }
      for (const reference of [unit.documentedCost, unit.supportedValue]) {
        if (!reference) continue;
        try {
          parseCents(reference.valueCents);
        } catch (error) {
          addReason(errors, "INVALID_MONEY_INPUT", error instanceof Error ? error.message : "Invalid money input.", null, unit.unitId);
        }
        if (!isIsoDate(reference.asOfDate) || reference.asOfDate > inputSnapshot.calculationAsOf) {
          addReason(errors, "INVALID_SOURCE_AS_OF", "Source as-of dates must be valid and cannot follow the calculation date.", null, unit.unitId);
        }
        if (typeof reference.sourceSystem !== "string" || !reference.sourceSystem.trim()
          || typeof reference.sourceRecordId !== "string" || !reference.sourceRecordId.trim()) {
          addReason(errors, "SOURCE_LINEAGE_REQUIRED", "Money inputs require non-empty source system and record identifiers.", null, unit.unitId);
        }
      }
      return {
        ...unit,
        ageReference,
        ageDays: typeof eventDate === "string" && isIsoDate(eventDate) && isIsoDate(inputSnapshot.calculationAsOf)
          ? daysBetween(eventDate, inputSnapshot.calculationAsOf)
          : -1,
        eligible: false,
        basisCents: null,
        appliedRateBasisPoints: null,
        rawContributionCents: null,
        contributionCents: null,
        exclusionReasons: [],
      };
    });

  let sequence = 0;
  const appliedRateClasses = new Set<string>();
  for (const rule of orderedRules) {
    const beforeTotal = totalContribution(states);
    let affectedUnitCount = 0;
    let detail = "";
    let status: EngineTraceStep["status"] = "applied";
    try {
      if (rule.ruleKind === "eligibility") {
        if (rule.valueUnit !== "text") throw new Error("Eligibility rules require the controlled-text value unit.");
        if (rule.numericValue !== null) throw new Error("Eligibility rules cannot carry a numeric value.");
        assertExactParameterKeys(rule.parameters, ["statuses"]);
        const eligibleStatuses = new Set(stringArrayParameter(rule.parameters, "statuses"));
        for (const state of states) {
          state.eligible = eligibleStatuses.has(state.status);
          if (!state.eligible) state.exclusionReasons.push("STATUS_NOT_ELIGIBLE");
          else affectedUnitCount += 1;
        }
        detail = `Eligible statuses: ${[...eligibleStatuses].join(", ")}.`;
      } else if (rule.ruleKind === "basis") {
        if (rule.valueUnit !== "formula_reference" || rule.textValue !== "lesser_of(documented_cost, supported_value)") {
          throw new Error("Only the allowlisted lesser-of basis strategy is executable in WP-04.");
        }
        if (rule.numericValue !== null) throw new Error("The lesser-of basis strategy cannot carry a numeric value.");
        assertExactParameterKeys(rule.parameters, ["future_engine", "rounding"]);
        if (!booleanParameter(rule.parameters, "future_engine")
          || stringParameter(rule.parameters, "rounding") !== "down_to_cent") {
          throw new Error("The lesser-of basis requires future_engine=true and rounding=down_to_cent.");
        }
        for (const state of states.filter((candidate) => candidate.eligible)) {
          if (!state.documentedCost || !state.supportedValue) {
            addReason(errors, "MISSING_BASIS_INPUT", "Eligible units require both documented cost and supported value.", rule.id, state.unitId);
            continue;
          }
          const documentedCost = parseCents(state.documentedCost.valueCents);
          const supportedValue = parseCents(state.supportedValue.valueCents);
          state.basisCents = documentedCost < supportedValue ? documentedCost : supportedValue;
          affectedUnitCount += 1;
        }
        detail = "Selected the lower of documented cost and supported value for each eligible unit.";
      } else if (rule.ruleKind === "advance_rate") {
        if (rule.valueUnit !== "basis_points") throw new Error("Advance-rate rules require the basis-points value unit.");
        if (rule.textValue !== null) throw new Error("Advance-rate rules cannot carry executable text.");
        assertExactParameterKeys(rule.parameters, ["class"]);
        const targetClass = stringParameter(rule.parameters, "class");
        if (appliedRateClasses.has(targetClass)) throw new Error("A collateral class cannot receive multiple advance-rate rules.");
        appliedRateClasses.add(targetClass);
        const basisPoints = parseRuleInteger(rule.numericValue, 10_000);
        for (const state of states.filter((candidate) => candidate.eligible && candidate.collateralClass === targetClass)) {
          if (state.basisCents === null) continue;
          const contribution = multiplyByBasisPoints(state.basisCents, basisPoints);
          state.appliedRateBasisPoints = basisPoints;
          state.rawContributionCents = contribution;
          state.contributionCents = contribution;
          affectedUnitCount += 1;
        }
        detail = `${basisPoints} bps applied to ${targetClass}; each unit rounds down to the cent.`;
      } else if (rule.ruleKind === "concentration") {
        if (rule.valueUnit !== "basis_points") throw new Error("Concentration rules require the basis-points value unit.");
        if (rule.textValue !== null) throw new Error("Concentration rules cannot carry executable text.");
        assertExactParameterKeys(rule.parameters, ["applies_to", "class"]);
        const targetClass = stringParameter(rule.parameters, "class");
        const appliesTo = stringParameter(rule.parameters, "applies_to");
        if (!["future_aggregate", "pre_cap_total"].includes(appliesTo)) {
          throw new Error("Unsupported concentration denominator.");
        }
        const basisPoints = parseRuleInteger(rule.numericValue, 10_000);
        const aggregateBefore = totalContribution(states);
        const targetBefore = states
          .filter((state) => state.eligible && state.collateralClass === targetClass)
          .reduce((sum, state) => sum + (state.contributionCents ?? 0n), 0n);
        if (appliesTo === "future_aggregate" && targetBefore > 0n) {
          throw new Error("The WP-03 future-aggregate placeholder cannot be interpreted when the target class contributes value.");
        }
        const limit = appliesTo === "pre_cap_total"
          ? multiplyByBasisPoints(aggregateBefore, basisPoints)
          : 0n;
        if (appliesTo === "pre_cap_total") allocateClassCap(states, targetClass, limit);
        const targetAfter = states
          .filter((state) => state.eligible && state.collateralClass === targetClass)
          .reduce((sum, state) => sum + (state.contributionCents ?? 0n), 0n);
        constraints.push({
          ruleId: rule.id,
          ruleCode: rule.ruleCode,
          constraintType: "class_concentration",
          groupKey: targetClass,
          limitBasisPoints: basisPoints,
          beforeCents: targetBefore.toString(),
          limitCents: limit.toString(),
          afterCents: targetAfter.toString(),
          binding: targetAfter < targetBefore,
          allocationMethod: "floor_then_stable_unit_remainder",
        });
        affectedUnitCount = states.filter((state) => state.eligible && state.collateralClass === targetClass).length;
        detail = appliesTo === "pre_cap_total"
          ? `${targetClass} contribution capped at ${basisPoints} bps of the explicitly declared pre-cap aggregate using stable unit-ID remainder allocation.`
          : `${targetClass} is absent, so the WP-03 future-aggregate placeholder is preserved without inventing denominator semantics.`;
      } else if (rule.ruleKind === "aging") {
        if (rule.valueUnit !== "days") throw new Error("Aging rules require the whole-days value unit.");
        if (rule.textValue !== null) throw new Error("Aging rules cannot carry executable text.");
        assertExactParameterKeys(rule.parameters, ["start_event"]);
        const startEvent = stringParameter(rule.parameters, "start_event");
        const maximumAgeDays = parseRuleInteger(rule.numericValue, 100_000);
        const mismatchedAgeSource = states.find((state) => state.eligible && state.ageReference.startEvent !== startEvent);
        if (mismatchedAgeSource) {
          throw new Error(`Unit ${mismatchedAgeSource.unitId} does not carry the required ${startEvent} age event.`);
        }
        for (const state of states.filter((candidate) => candidate.eligible && candidate.ageDays > maximumAgeDays)) {
          state.eligible = false;
          state.contributionCents = 0n;
          state.exclusionReasons.push("INVENTORY_AGE_EXCEEDED");
          affectedUnitCount += 1;
        }
        detail = `Units older than ${maximumAgeDays} days are excluded at this declared rule position.`;
      } else if (rule.ruleKind === "freshness") {
        if (rule.valueUnit !== "days") throw new Error("Freshness rules require the whole-days value unit.");
        if (rule.textValue !== null) throw new Error("Freshness rules cannot carry executable text.");
        assertExactParameterKeys(rule.parameters, ["source_field", "stale_outcome"]);
        const sourceField = stringParameter(rule.parameters, "source_field");
        const staleOutcome = stringParameter(rule.parameters, "stale_outcome");
        if (!["documented_cost", "supported_value"].includes(sourceField) || !["block", "warn"].includes(staleOutcome)) {
          throw new Error("Unsupported freshness strategy.");
        }
        const maximumAgeDays = parseRuleInteger(rule.numericValue, 100_000);
        for (const state of states.filter((candidate) => candidate.eligible)) {
          const reference = sourceField === "documented_cost" ? state.documentedCost : state.supportedValue;
          if (!reference) continue;
          const ageDays = daysBetween(reference.asOfDate, inputSnapshot.calculationAsOf);
          if (ageDays > maximumAgeDays) {
            const target = staleOutcome === "block" ? errors : warnings;
            addReason(target, "SOURCE_REFERENCE_STALE", `${sourceField} is ${ageDays} days old; maximum is ${maximumAgeDays}.`, rule.id, state.unitId);
            affectedUnitCount += 1;
          }
        }
        detail = `${sourceField} freshness limit is ${maximumAgeDays} days with ${staleOutcome} treatment.`;
      } else if (rule.ruleKind === "release") {
        if (rule.valueUnit !== "formula_reference") throw new Error("Deferred release rules require the formula-reference value unit.");
        if (rule.numericValue !== null || typeof rule.textValue !== "string" || !rule.textValue.trim()) {
          throw new Error("Deferred release rules require a non-empty formula reference and no numeric value.");
        }
        assertExactParameterKeys(rule.parameters, ["calculation_deferred_to_wp04_plus"]);
        if (!booleanParameter(rule.parameters, "calculation_deferred_to_wp04_plus")) {
          throw new Error("Release execution must remain explicitly deferred in WP-04.");
        }
        status = "deferred";
        addReason(warnings, "RELEASE_RULE_DEFERRED", "The reviewed release reference is preserved but not executed before WP-11.", rule.id);
        detail = "Release/payoff execution is outside WP-04; formula text was not evaluated.";
      } else {
        throw new Error(`Rule kind ${rule.ruleKind} is outside the bounded WP-04 executor.`);
      }
    } catch (error) {
      addReason(errors, "UNSUPPORTED_RULE_STRATEGY", error instanceof Error ? error.message : "Unsupported rule strategy.", rule.id);
      detail = "Execution blocked because the rule is not an allowlisted typed strategy.";
    }
    trace.push({
      sequence: ++sequence,
      ruleId: rule.id,
      ruleCode: rule.ruleCode,
      ruleKind: rule.ruleKind,
      citation: rule.agreementCitation,
      status,
      affectedUnitCount,
      totalBeforeCents: beforeTotal.toString(),
      totalAfterCents: totalContribution(states).toString(),
      detail,
    });
  }

  for (const state of states.filter((candidate) => candidate.eligible && candidate.contributionCents === null)) {
    addReason(errors, "MISSING_ADVANCE_RATE", "An eligible collateral class has no executable advance-rate rule.", null, state.unitId);
  }

  const normalizedInputs = {
    unitCount: states.length,
    units: states.map((state) => ({
      unitId: state.unitId,
      projectId: state.projectId,
      collateralClass: state.collateralClass,
      status: state.status,
      ageSource: normalizedAgeReference(state.ageReference, inputSnapshot.calculationAsOf),
      documentedCostSource: normalizedReference(state.documentedCost, inputSnapshot.calculationAsOf),
      supportedValueSource: normalizedReference(state.supportedValue, inputSnapshot.calculationAsOf),
    })),
  };
  const items: EngineItemResult[] = states.map((state) => ({
    unitId: state.unitId,
    projectId: state.projectId,
    collateralClass: state.collateralClass,
    status: state.status,
    ageDays: state.ageDays,
    ageStartEvent: state.ageReference.startEvent,
    eligible: state.eligible,
    documentedCostCents: state.documentedCost?.valueCents ?? null,
    supportedValueCents: state.supportedValue?.valueCents ?? null,
    basisCents: state.basisCents?.toString() ?? null,
    appliedRateBasisPoints: state.appliedRateBasisPoints,
    rawContributionCents: state.rawContributionCents?.toString() ?? null,
    contributionCents: state.contributionCents?.toString() ?? null,
    exclusionReasons: [...state.exclusionReasons],
  }));
  const succeeded = errors.length === 0;
  const eligibleStates = states.filter((state) => state.eligible);
  const outputs = succeeded ? {
    eligibleBasisCents: eligibleStates.reduce((sum, state) => sum + (state.basisCents ?? 0n), 0n).toString(),
    uncappedContributionCents: eligibleStates.reduce((sum, state) => sum + (state.rawContributionCents ?? 0n), 0n).toString(),
    borrowingBaseCents: eligibleStates.reduce((sum, state) => sum + (state.contributionCents ?? 0n), 0n).toString(),
  } : {
    eligibleBasisCents: null,
    uncappedContributionCents: null,
    borrowingBaseCents: null,
  };
  const resultWithoutHash = {
    status: succeeded ? "succeeded" as const : "blocked" as const,
    engineVersion: ENGINE_VERSION,
    formulaVersion: FORMULA_VERSION,
    calculationType: inputSnapshot.calculationType,
    calculationAsOf: inputSnapshot.calculationAsOf,
    calculationTimestamp: inputSnapshot.calculationTimestamp,
    organizationId: inputSnapshot.organizationId,
    facilityId: inputSnapshot.facilityId,
    ruleVersionId: ruleVersion.ruleVersionId,
    inputSnapshotId: inputSnapshot.inputSnapshotId,
    configurationHash: ruleVersion.configurationHash,
    currency: inputSnapshot.currency,
    synthetic: true as const,
    persisted: false as const,
    normalizedInputs,
    orderedRules: orderedRules.map((rule) => ({
      id: rule.id,
      ruleCode: rule.ruleCode,
      ruleKind: rule.ruleKind,
      evaluationOrder: rule.evaluationOrder,
      agreementCitation: rule.agreementCitation,
    })),
    trace,
    items,
    constraints,
    outputs,
    warnings,
    blockingErrors: errors,
  };
  const replayHash = await sha256Hex({
    ruleVersion: {
      organizationId: ruleVersion.organizationId,
      facilityId: ruleVersion.facilityId,
      ruleVersionId: ruleVersion.ruleVersionId,
      effectiveFrom: ruleVersion.effectiveFrom,
      facilityPattern: ruleVersion.facilityPattern,
      configurationHash: ruleVersion.configurationHash,
      rules: orderedRules.map(canonicalRuleForReplay),
    },
    inputSnapshot: {
      ...inputSnapshot,
      units: [...inputSnapshot.units].sort((left, right) => compareCodeUnits(left.unitId, right.unitId)),
    },
    result: resultWithoutHash,
  });
  return deepFreeze({ ...resultWithoutHash, replayHash }) as EngineResult;
}

export function formatUsdCents(value: string | null) {
  if (typeof value !== "string" || !/^(0|[1-9]\d*)$/.test(value)) return "—";
  const padded = value.padStart(3, "0");
  const whole = padded.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `$${whole}.${padded.slice(-2)}`;
}

export function formatBasisPoints(value: number | null) {
  if (value === null || !Number.isInteger(value) || value < 0 || value > 10_000) return "—";
  const whole = Math.floor(value / 100);
  const fractional = String(value % 100).padStart(2, "0");
  return `${whole}.${fractional}%`;
}
