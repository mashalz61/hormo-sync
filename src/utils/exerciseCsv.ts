export type ExerciseOption = {
  name: string;
};

const CSV_HEADERS = {
  exerciseName: ["exercise_name", "exerciseName", "name"],
} as const;

export function parseExerciseCsv(csv: string) {
  const lines = csv
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length <= 1) {
    return [];
  }

  const [headerLine, ...dataLines] = lines;
  const headers = parseCsvLine(headerLine).map((value) => value.trim());
  const nameIndex = findHeaderIndex(headers, CSV_HEADERS.exerciseName);

  if (nameIndex === -1) {
    return [];
  }

  const names = new Set<string>();

  dataLines.forEach((line) => {
    const values = parseCsvLine(line);
    const exerciseName = values[nameIndex]?.trim();

    if (!exerciseName) {
      return;
    }

    names.add(formatExerciseName(exerciseName));
  });

  return [...names]
    .sort((left, right) => left.localeCompare(right))
    .map((name) => ({ name }));
}

function findHeaderIndex(headers: string[], candidates: readonly string[]) {
  return headers.findIndex((header) => candidates.includes(header));
}

function formatExerciseName(value: string) {
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
