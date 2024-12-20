import { CSVRecord } from "application/services/file_reader";
import { ValidationResult } from "./validator";

export async function validateCSVData(
  data: CSVRecord[]
): Promise<ValidationResult> {
  const errors: string[] = [];

  if (!Array.isArray(data) || data.length === 0) {
    errors.push("Il file CSV non contiene dati validi");
  }

  const firstRowKeys = Object.keys(data[0] || {});
  const hasInvalidRows = data.some(
    (row) => !Object.keys(row).every((key) => firstRowKeys.includes(key))
  );

  if (hasInvalidRows) {
    errors.push("Alcune righe hanno una struttura non valida");
  }

  return {
    success: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}
