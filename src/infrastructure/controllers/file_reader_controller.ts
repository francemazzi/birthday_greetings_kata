import { UserFactory } from "../../domain/repositories/user_factory";
import { CSVRecord } from "../../application/services/file_reader";
import { CSVFileReader } from "../../application/services/file_reader_model";
import { validateCSVData } from "../../application/useCases/file_validator";
import { Request, Response } from "express";

/**
 * @swagger
 * tags:
 *   name: CSV
 *   description: Operazioni relative al caricamento della lista degli utenti e dei loro compleanni
 */
export class CSVController {
  constructor(private userFactory: UserFactory) {}

  /**
   * @swagger
   * /file/upload:
   *   post:
   *     summary: Carica un file CSV
   *     tags: [CSV]
   *     consumes:
   *       - multipart/form-data
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               file:
   *                 type: string
   *                 format: binary
   *                 description: File CSV da caricare
   *     responses:
   *       200:
   *         description: File caricato con successo
   *       400:
   *         description: Errore nella richiesta
   */
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
