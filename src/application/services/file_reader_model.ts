import { Readable } from "stream";
import * as csv from "csv-parse";
import { CSVRecord } from "./file_reader";
import { UserFactory } from "../../domain/repositories/user_factory";
import { Prisma } from "@prisma/client";

export interface UserCSVRecord extends CSVRecord {
  email: string;
  name: string;
  surname: string;
  birthday: string;
}

export class CSVFileReader<T extends CSVRecord> {
  private data: T[] = [];

  constructor(
    private file: Express.Multer.File,
    private transformer?: (row: CSVRecord) => T
  ) {}

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
          })
        )
        .on("data", (row: CSVRecord) => {
          const transformedRow = this.transformer
            ? this.transformer(row)
            : (row as T);

          results.push(transformedRow);
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
        typeof row.name === "string" &&
        typeof row.surname === "string" &&
        typeof row.birthday === "string"
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

        const birthdayDate = new Date(row.birthday);
        if (isNaN(birthdayDate.getTime())) {
          errors.push(`Data di nascita non valida per: ${row.email}`);
          continue;
        }

        const userData: Prisma.UserCreateInput = {
          email: row.email.toLowerCase(),
          name: row.name,
          surname: row.surname,
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
