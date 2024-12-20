import { UserFactory } from "../../domain/repositories/user_factory";
import { CSVRecord } from "../../application/services/file_reader";
import { CSVFileReader } from "../../application/services/file_reader_model";
import { validateCSVData } from "../../application/useCases/file_validator";
import { Request, Response } from "express";

export class CSVController {
  constructor(private userFactory: UserFactory) {}

  uploadCSV = async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Nessun file caricato",
        });
      }

      const reader = new CSVFileReader<CSVRecord>(req.file);
      const data = await reader.readFile();

      const validationResult = await validateCSVData(data);
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          message: "Validazione fallita",
          errors: validationResult.errors,
        });
      }

      const result = await reader.saveUsersToDatabase(this.userFactory);

      return res.status(result.success ? 200 : 400).json({
        success: result.success,
        message: `Processo completato. ${result.saved} utenti salvati.`,
        errors: result.errors,
        savedCount: result.saved,
      });
    } catch (error) {
      console.error("Errore durante l'elaborazione del CSV:", error);
      return res.status(500).json({
        success: false,
        message: "Errore durante l'elaborazione del file",
      });
    }
  };
}
