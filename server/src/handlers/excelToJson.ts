import { read, utils, WorkBook } from "xlsx";

export interface TableProps {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  rol: string;
}

export function xlsxTojson(workbook: WorkBook) {
  // Name of first page on the workbook
  const sheetName = workbook.SheetNames[0];

  // We obtain the data from the sheet
  const worksheet = workbook.Sheets[sheetName];

  // We convert the data from the sheet to JSON
  const data = utils.sheet_to_json(worksheet, { header: 1 }) as string[][];

  // We create an array to store the TableProps objects
  const tablePropsArray: TableProps[] = [];

  // Iterate over the data to create the TableProps objects
  for (let i = 1; i < data.length; i++) {
    let row = data[i];
    let table: TableProps = {
      id: row[0],
      nombre: row[1],
      email: row[2],
      telefono: row[3],
      rol: row[4],
    };
    tablePropsArray.push(table);
  }

  return tablePropsArray;
}
