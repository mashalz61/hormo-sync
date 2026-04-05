export const mealCategories = ["breakfast", "lunch", "dinner", "snacks"] as const;

export type MealCategory = (typeof mealCategories)[number];

export type MealsByCategory = Record<MealCategory, string[]>;

const CSV_HEADERS = {
  category: ["category", "meal_type"],
  mealName: ["meal_name", "food_name", "foodName"],
} as const;

export function createEmptyMealGroups(): MealsByCategory {
  return {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  };
}

export function parseMealCsv(csv: string): MealsByCategory {
  const lines = csv
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length <= 1) {
    return createEmptyMealGroups();
  }

  const [headerLine, ...dataLines] = lines;
  const headers = parseCsvLine(headerLine).map((value) => value.trim());
  const categoryIndex = findHeaderIndex(headers, CSV_HEADERS.category);
  const mealNameIndex = findHeaderIndex(headers, CSV_HEADERS.mealName);

  if (categoryIndex === -1 || mealNameIndex === -1) {
    return createEmptyMealGroups();
  }

  const groupedNames = {
    breakfast: new Set<string>(),
    lunch: new Set<string>(),
    dinner: new Set<string>(),
    snacks: new Set<string>(),
  };

  dataLines.forEach((line) => {
    const values = parseCsvLine(line);
    const category = normalizeMealCategory(values[categoryIndex]);
    const mealName = values[mealNameIndex]?.trim();

    if (!category || !mealName) {
      return;
    }

    groupedNames[category].add(formatMealName(mealName));
  });

  return mealCategories.reduce<MealsByCategory>((accumulator, category) => {
    accumulator[category] = [...groupedNames[category]].sort((left, right) =>
      left.localeCompare(right),
    );
    return accumulator;
  }, createEmptyMealGroups());
}

function findHeaderIndex(headers: string[], candidates: readonly string[]) {
  return headers.findIndex((header) => candidates.includes(header));
}

function normalizeMealCategory(value?: string): MealCategory | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  if (normalized === "snack") {
    return "snacks";
  }

  return mealCategories.includes(normalized as MealCategory)
    ? (normalized as MealCategory)
    : null;
}

function formatMealName(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function parseCsvLine(line: string) {
  const values: string[] = [];
  let currentValue = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (character === '"') {
      const nextCharacter = line[index + 1];

      if (inQuotes && nextCharacter === '"') {
        currentValue += '"';
        index += 1;
        continue;
      }

      inQuotes = !inQuotes;
      continue;
    }

    if (character === "," && !inQuotes) {
      values.push(currentValue);
      currentValue = "";
      continue;
    }

    currentValue += character;
  }

  values.push(currentValue);

  return values;
}
