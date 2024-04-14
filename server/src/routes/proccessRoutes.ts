import { Router } from "express";
import { WorkBook, read } from "xlsx";
import { xlsxTojson } from "../handlers/excelToJson";
import multer from "multer";

export const processors = Router();

const upload = multer();

// interface reqWorkbook {
//   workbook: WorkBook;
//   // sessionId: string;
// }

processors.post("/files", upload.single("workbook"), async (req, res) => {
  // console.log(req);
  try {
    if (!req.file) {
      throw new Error("No se cargo ningun archivo");
    }

    const workbookBuffer: Buffer = req.file.buffer;
    const workbook: WorkBook = read(workbookBuffer, { type: "buffer" });
    // const sessionId = req.body.sessionId;

    // console.log(workbook);

    if (!workbook) {
      throw new Error("Ingresa un workbook de excel");
    }
    const jsonBook = xlsxTojson(workbook);
    console.log(jsonBook);
    res.json({ success: true, data: jsonBook });
  } catch (error) {
    if (error instanceof Error) {
      res.json({ success: false, error: error.message });
    }
  }
});
