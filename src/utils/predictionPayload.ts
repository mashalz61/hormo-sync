import { PCOSFormValues } from "@/app/(protected)/assessments/pcosForm.schema";
import { PredictionRequest } from "@/types/api";

const bloodGroupMap: Record<NonNullable<PCOSFormValues["bloodGroup"]>, number> = {
  "A+": 11,
  "A-": 12,
  "B+": 13,
  "B-": 14,
  "O+": 15,
  "O-": 16,
  "AB+": 17,
  "AB-": 18,
};

const marriageStatusMap: Record<NonNullable<PCOSFormValues["marriageStatus"]>, number> = {
  Single: 0,
  Married: 1,
  Divorced: 2,
  Widowed: 3,
};

const cyclePatternMap: Record<PCOSFormValues["cyclePattern"], number> = {
  Regular: 2,
  Irregular: 4,
};

const boolToFlag = (value: boolean | null) => {
  if (value === null) {
    return undefined;
  }

  return value ? 1 : 0;
};

const centimetersToInches = (value: number | null) =>
  value === null ? undefined : Number((value / 2.54).toFixed(2));

const addIfDefined = (target: Record<string, number>, key: string, value: number | undefined | null) => {
  if (value !== undefined && value !== null && !Number.isNaN(value)) {
    target[key] = value;
  }
};

export const buildPcosPredictionPayload = (values: PCOSFormValues): PredictionRequest => {
  const features: Record<string, number> = {};

  addIfDefined(features, "Age (yrs)", values.age);
  addIfDefined(features, "Weight (Kg)", values.weight);
  addIfDefined(features, "Height(Cm)", values.height);
  addIfDefined(features, "BMI", values.bmi);
  addIfDefined(features, "Blood Group", values.bloodGroup ? bloodGroupMap[values.bloodGroup] : undefined);
  addIfDefined(features, "Pulse rate(bpm)", values.pulseRate);
  addIfDefined(features, "RR (breaths/min)", values.respiratoryRate);
  addIfDefined(features, "Hb(g/dl)", values.hemoglobin);
  addIfDefined(features, "Cycle(R/I)", cyclePatternMap[values.cyclePattern]);
  addIfDefined(features, "Cycle length(days)", values.cycleLength);
  addIfDefined(features, "Marriage Status", values.marriageStatus ? marriageStatusMap[values.marriageStatus] : undefined);
  addIfDefined(features, "Pregnant(Y/N)", boolToFlag(values.pregnant));
  addIfDefined(features, "No. of aborptions", values.abortions);
  addIfDefined(features, "Weight gain(Y/N)", boolToFlag(values.weightGain));
  addIfDefined(features, "hair growth(Y/N)", boolToFlag(values.hairGrowth));
  addIfDefined(features, "Skin darkening (Y/N)", boolToFlag(values.skinDarkening));
  addIfDefined(features, "Hair loss(Y/N)", boolToFlag(values.hairLoss));
  addIfDefined(features, "Pimples(Y/N)", boolToFlag(values.pimples));
  addIfDefined(features, "Fast food (Y/N)", boolToFlag(values.fastFood));
  addIfDefined(features, "Reg.Exercise(Y/N)", boolToFlag(values.regularExercise));
  addIfDefined(features, "Waist(inch)", centimetersToInches(values.waist));
  addIfDefined(features, "Hip(inch)", centimetersToInches(values.hip));
  addIfDefined(features, "Waist:Hip Ratio", values.waistHipRatio);
  addIfDefined(features, "BP _Systolic (mmHg)", values.bpSystolic);
  addIfDefined(features, "BP _Diastolic (mmHg)", values.bpDiastolic);
  addIfDefined(features, "Follicle No. (L)", values.follicleNumberLeft);
  addIfDefined(features, "Follicle No. (R)", values.follicleNumberRight);
  addIfDefined(features, "Avg. F size (L) (mm)", values.follicleSizeLeft);
  addIfDefined(features, "Avg. F size (R) (mm)", values.follicleSizeRight);
  addIfDefined(features, "Endometrium (mm)", values.endometrium);
  addIfDefined(features, "FSH(mIU/mL)", values.fsh);
  addIfDefined(features, "LH(mIU/mL)", values.lh);
  addIfDefined(features, "TSH (mIU/L)", values.tsh);
  addIfDefined(features, "AMH(ng/mL)", values.amh);
  addIfDefined(features, "PRL(ng/mL)", values.prl);
  addIfDefined(features, "Vit D3 (ng/mL)", values.vitD3);
  addIfDefined(features, "PRG(ng/mL)", values.prg);
  addIfDefined(features, "RBS(mg/dl)", values.rbs);
  addIfDefined(features, "Fasting Glucose (mg/dL)", values.fastingGlucose);
  addIfDefined(features, "Fasting Insulin (uIU/mL)", values.fastingInsulin);
  addIfDefined(features, "HOMA-IR", values.insulinResistance);
  addIfDefined(features, "HbA1c(%)", values.a1c);
  addIfDefined(features, "OGTT 2hr (mg/dL)", values.ogtt2h);

  return { features };
};

export const buildIrPredictionPayload = (values: PCOSFormValues): PredictionRequest => {
  const features: Record<string, number> = {};

  addIfDefined(features, "Age (yrs)", values.age);
  addIfDefined(features, "Weight (Kg)", values.weight);
  addIfDefined(features, "Height(Cm)", values.height);
  addIfDefined(features, "BMI", values.bmi);
  addIfDefined(features, "Waist:Hip Ratio", values.waistHipRatio);
  addIfDefined(features, "Fasting Glucose (mg/dL)", values.fastingGlucose);
  addIfDefined(features, "Fasting Insulin (uIU/mL)", values.fastingInsulin);
  addIfDefined(features, "HOMA-IR", values.insulinResistance);
  addIfDefined(features, "HbA1c(%)", values.a1c);
  addIfDefined(features, "RBS(mg/dl)", values.rbs);
  addIfDefined(features, "Weight gain(Y/N)", boolToFlag(values.weightGain));
  addIfDefined(features, "Fast food (Y/N)", boolToFlag(values.fastFood));
  addIfDefined(features, "Reg.Exercise(Y/N)", boolToFlag(values.regularExercise));
  addIfDefined(features, "BP _Systolic (mmHg)", values.bpSystolic);
  addIfDefined(features, "BP _Diastolic (mmHg)", values.bpDiastolic);
  addIfDefined(features, "Skin darkening (Y/N)", boolToFlag(values.skinDarkening));

  return { features };
};
