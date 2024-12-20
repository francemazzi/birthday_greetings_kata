import { Readable } from "stream";
import * as csv from "csv-parse";
import { CSVRecord, UserCSVRecord } from "./file_reader";
import { UserFactory } from "../../domain/repositories/user_factory";
import { Prisma } from "@prisma/client";

export class CSVFileReader<T extends CSVRecord> {
  private data: T[] = [];

  constructor(private file: Express.Multer.File) {}

  async readFile(): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const results: T[] = [];

      const stream = Readable.from(this.file.buffer);

      stream
        .pipe(
          csv.parse({
            columns: true,
            trim: true,
            cast: true,
            delimiter: ";",
          })
        )
        .on("data", (row: CSVRecord) => {
          results.push(row as T);
        })
        .on("end", () => {
          this.data = results;
          resolve(this.data);
        })
        .on("error", (error) => {
          reject(error);
        });
    });
  }

  getData(): T[] {
    return this.data;
  }

  async saveUsersToDatabase(userFactory: UserFactory): Promise<{
    success: boolean;
    saved: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let saved = 0;

    const isValidUserData = (row: any): row is UserCSVRecord => {
      return (
        typeof row.email === "string" &&
        typeof row.first_name === "string" &&
        typeof row.last_name === "string" &&
        typeof row.date_of_birth === "string"
      );
    };

    for (const row of this.data) {
      try {
        if (!isValidUserData(row)) {
          errors.push(
            `Riga invalida: mancano campi obbligatori - ${JSON.stringify(row)}`
          );
          continue;
        }

        if (!row.email.includes("@")) {
          errors.push(`Email non valida per: ${row.email}`);
          continue;
        }

        const birthdayDate = new Date(row.date_of_birth);
        if (isNaN(birthdayDate.getTime())) {
          errors.push(`Data di nascita non valida per: ${row.email}`);
          continue;
        }

        const userData: Prisma.UserCreateInput = {
          email: row.email.toLowerCase(),
          name: row.first_name,
          surname: row.last_name,
          birthday: birthdayDate,
        };

        await userFactory.createUser(userData);
        saved++;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Errore sconosciuto";
        errors.push(
          `Errore nel salvare l'utente ${row.email}: ${errorMessage}`
        );
      }
    }

    return {
      success: errors.length === 0,
      saved,
      errors,
    };
  }
}
