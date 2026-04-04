import { z } from "zod";

const blankToUndefined = (value: unknown) => {
  if (typeof value === "string") {
    const normalized = value.trim().replace(",", ".");
    return normalized === "" ? undefined : normalized;
  }

  return value;
};

const blankToNull = (value: unknown) => {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "string") {
    const normalized = value.trim().replace(",", ".");
    return normalized === "" ? null : normalized;
  }

  return value;
};

const numberError = (label: string) => (issue: { input?: unknown }) =>
  issue.input === undefined ? `${label} is required` : `${label} must be a number`;

const numberField = (min: number, max: number, label: string) =>
  z.preprocess(
    blankToUndefined,
    z
      .coerce
      .number({ error: numberError(label) })
      .min(min, `${label} too low`)
      .max(max, `${label} too high`),
  );

const nonNegativeField = (label: string) =>
  z.preprocess(
    blankToUndefined,
    z.coerce.number({ error: numberError(label) }).min(0, `${label} cannot be negative`),
  );

const optionalNumberField = (min: number, max: number, label: string) =>
  z.preprocess(
    blankToNull,
    z.union([
      z.null(),
      z.coerce
        .number({ error: numberError(label) })
        .min(min, `${label} too low`)
        .max(max, `${label} too high`),
    ]),
  );

const optionalNonNegativeField = (label: string) =>
  z.preprocess(
    blankToNull,
    z.union([
      z.null(),
      z.coerce.number({ error: numberError(label) }).min(0, `${label} cannot be negative`),
    ]),
  );

export const bloodGroupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
export const marriageStatusOptions = ["Single", "Married", "Divorced", "Widowed"] as const;
export const cyclePatternOptions = ["Regular", "Irregular"] as const;
export const missedPeriodOptions = ["No missed periods", "Occasional delays", "Frequent delays"] as const;

export const pcosSchema = z.object({
  age: numberField(10, 100, "Age"),
  weight: numberField(20, 300, "Weight"),
  height: numberField(100, 250, "Height"),
  bmi: numberField(5, 80, "BMI"),
  cycleLength: numberField(10, 120, "Average cycle length"),
  cyclePattern: z.enum(cyclePatternOptions, { error: "Cycle pattern is required" }),
  missedPeriods: z.enum(missedPeriodOptions, { error: "Missed periods is required" }),
  bloodGroup: z.enum(bloodGroupOptions).nullable(),
  pulseRate: optionalNumberField(40, 180, "Pulse rate"),
  respiratoryRate: optionalNumberField(10, 40, "Respiratory rate"),
  hemoglobin: optionalNumberField(5, 20, "Hemoglobin"),
  marriageStatus: z.enum(marriageStatusOptions).nullable(),
  pregnant: z.boolean().nullable(),
  abortions: optionalNonNegativeField("Abortions"),

  waist: optionalNumberField(40, 200, "Waist"),
  hip: optionalNumberField(40, 200, "Hip"),
  waistHipRatio: optionalNumberField(0, 5, "Waist-hip ratio"),
  hairLoss: z.boolean().nullable(),
  fastFood: z.boolean().nullable(),
  regularExercise: z.boolean().nullable(),
  weightGain: z.boolean().nullable(),

  a1c: optionalNumberField(0, 20, "Hemoglobin A1C"),
  fastingGlucose: numberField(40, 400, "Fasting glucose"),
  ogtt2h: optionalNumberField(40, 500, "2-hour OGTT glucose"),
  fastingInsulin: numberField(0, 300, "Fasting insulin"),
  totalTestosterone: optionalNumberField(0, 300, "Total testosterone"),
  bpSystolic: optionalNumberField(70, 200, "Systolic blood pressure"),
  bpDiastolic: optionalNumberField(40, 130, "Diastolic blood pressure"),
  follicleNumberLeft: optionalNumberField(0, 50, "Left follicle number"),
  follicleNumberRight: optionalNumberField(0, 50, "Right follicle number"),
  follicleSizeLeft: optionalNumberField(0, 40, "Left follicle size"),
  follicleSizeRight: optionalNumberField(0, 40, "Right follicle size"),
  endometrium: optionalNumberField(1, 20, "Endometrium"),
  insulinResistance: numberField(0, 100, "Insulin resistance"),

  fsh: optionalNumberField(0, 50, "FSH"),
  lh: optionalNumberField(0, 50, "LH"),
  tsh: optionalNumberField(0.1, 10, "TSH"),
  amh: optionalNumberField(0, 20, "AMH"),
  prl: optionalNumberField(0, 100, "PRL"),
  vitD3: optionalNumberField(0, 150, "VitD3"),
  prg: optionalNumberField(0, 40, "PRG"),
  rbs: optionalNumberField(50, 400, "RBS"),
  hairGrowth: z.boolean().nullable(),
  skinDarkening: z.boolean().nullable(),
  pimples: z.boolean().nullable(),
});

export type PCOSFormValues = z.infer<typeof pcosSchema>;
export type PCOSFormInputValues = z.input<typeof pcosSchema>;

export const pcosFormDefaults: PCOSFormValues = {
  age: 28,
  weight: 68,
  height: 165,
  bmi: 25,
  cycleLength: 31,
  cyclePattern: "Irregular",
  missedPeriods: "Occasional delays",
  bloodGroup: null,
  pulseRate: null,
  respiratoryRate: null,
  hemoglobin: null,
  marriageStatus: null,
  pregnant: null,
  abortions: null,
  waist: null,
  hip: null,
  waistHipRatio: null,
  hairLoss: null,
  fastFood: null,
  regularExercise: null,
  weightGain: null,
  a1c: null,
  fastingGlucose: 102,
  ogtt2h: null,
  fastingInsulin: 15,
  totalTestosterone: null,
  bpSystolic: null,
  bpDiastolic: null,
  follicleNumberLeft: null,
  follicleNumberRight: null,
  follicleSizeLeft: null,
  follicleSizeRight: null,
  endometrium: null,
  insulinResistance: 3.78,
  fsh: null,
  lh: null,
  tsh: null,
  amh: null,
  prl: null,
  vitD3: null,
  prg: null,
  rbs: null,
  hairGrowth: null,
  skinDarkening: null,
  pimples: null,
};

export const pcosStepFields = {
  1: [
    "age",
    "weight",
    "height",
    "bmi",
    "cycleLength",
    "cyclePattern",
    "missedPeriods",
    "bloodGroup",
    "pulseRate",
    "respiratoryRate",
    "hemoglobin",
    "marriageStatus",
    "pregnant",
    "abortions",
  ],
  2: [
    "waist",
    "hip",
    "waistHipRatio",
    "hairLoss",
    "fastFood",
    "regularExercise",
    "weightGain",
  ],
  3: [
    "a1c",
    "fastingGlucose",
    "ogtt2h",
    "fastingInsulin",
    "totalTestosterone",
    "bpSystolic",
    "bpDiastolic",
    "follicleNumberLeft",
    "follicleNumberRight",
    "follicleSizeLeft",
    "follicleSizeRight",
    "endometrium",
    "insulinResistance",
  ],
  4: [
    "fsh",
    "lh",
    "tsh",
    "amh",
    "prl",
    "vitD3",
    "prg",
    "rbs",
    "hairGrowth",
    "skinDarkening",
    "pimples",
  ],
} as const satisfies Record<number, readonly (keyof PCOSFormValues)[]>;

export const pcosRequiredStepFields = {
  1: ["age", "weight", "height", "cycleLength", "cyclePattern", "missedPeriods"],
  2: [],
  3: ["fastingGlucose", "fastingInsulin"],
  4: [],
} as const satisfies Record<number, readonly (keyof PCOSFormValues)[]>;

export const pcosStepSchemas = {
  1: pcosSchema.pick({
    age: true,
    weight: true,
    height: true,
    bmi: true,
    cycleLength: true,
    cyclePattern: true,
    missedPeriods: true,
    bloodGroup: true,
    pulseRate: true,
    respiratoryRate: true,
    hemoglobin: true,
    marriageStatus: true,
    pregnant: true,
    abortions: true,
  }),
  2: pcosSchema.pick({
    waist: true,
    hip: true,
    waistHipRatio: true,
    hairLoss: true,
    fastFood: true,
    regularExercise: true,
    weightGain: true,
  }),
  3: pcosSchema.pick({
    a1c: true,
    fastingGlucose: true,
    ogtt2h: true,
    fastingInsulin: true,
    totalTestosterone: true,
    bpSystolic: true,
    bpDiastolic: true,
    follicleNumberLeft: true,
    follicleNumberRight: true,
    follicleSizeLeft: true,
    follicleSizeRight: true,
    endometrium: true,
    insulinResistance: true,
  }),
  4: pcosSchema.pick({
    fsh: true,
    lh: true,
    tsh: true,
    amh: true,
    prl: true,
    vitD3: true,
    prg: true,
    rbs: true,
    hairGrowth: true,
    skinDarkening: true,
    pimples: true,
  }),
} as const;
