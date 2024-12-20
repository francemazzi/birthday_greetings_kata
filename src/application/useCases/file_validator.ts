import { CSVRecord } from "application/services/file_reader";
import { ValidationResult } from "./validator";

export async function validateCSVData(
  data: CSVRecord[]
): Promise<ValidationResult> {
  const errors: string[] = [];

  if (!Array.isArray(data) || data.length === 0) {
    errors.push("Il file CSV non contiene dati validi");
    return { success: false, errors };
  }

  const requiredFields = ["last_name", "first_name", "date_of_birth", "email"];

  for (const row of data) {
    const missingFields = requiredFields.filter((field) => !(field in row));
    if (missingFields.length > 0) {
      errors.push(
        `Riga invalida: mancano i campi ${missingFields.join(
          ", "
        )} - ${JSON.stringify(row)}`
      );
    }
  }

  return {
    success: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}
