import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";
import { PiMicrosoftExcelLogoDuotone } from "react-icons/pi";
import {
  TbFolderCancel,
  TbInfoOctagonFilled,
  TbFolderCheck,
  TbFolder,
} from "react-icons/tb";
import { Toaster, toast } from "sonner";
import axios from "axios";
import "./styles/dropzone.css";
import { JsonExcelConvert } from "../types/JsonFileExcel";
import FilterBox from "./filterBox";

export default function DropWorkBook() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jsonFile, setJsonFile] = useState<JsonExcelConvert[] | null>(null);
  const [syncDb, setAsyncDb] = useState<boolean>(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      // Comprueba si el archivo es un libro de Excel
      if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel"
      ) {
        setSelectedFile(file);
      } else {
        console.log("El archivo no es un libro de Excel");
      }
    });
  }, []);

  const statusAsyncDb = () => {
    setAsyncDb(!syncDb);
  };

  const processFile = async () => {
    if (selectedFile) {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = async () => {
        let formData = new FormData();
        formData.append("workbook", selectedFile);

        // console.log(formData.get("workbook"));
        // console.log(selectedFile);

        try {
          const response = await axios.post(
            "http://localhost:3000/api/files",
            formData
          );

          // console.log(response.data);

          if (response.data.success == false) {
            throw new Error("Error al procesar archivo");
          }

          const jsonResponse: JsonExcelConvert[] = await response.data.data;
          // console.log(jsonResponse);
          setJsonFile(jsonResponse);
        } catch (error) {
          if (error instanceof Error) {
            console.log(error);
            toast.error(error.message);
          }
        }
      };

      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <>
      <Toaster richColors />

      <div className="containerFileActions">
        <div
          {...getRootProps()}
          className={!selectedFile ? "containerDrop" : "containerDropNo"}
        >
          <input {...getInputProps()} />
          {selectedFile ? (
            <>
              <div className="NameFile">
                <div className="iconNameFile">
                  <PiMicrosoftExcelLogoDuotone size={44} />
                </div>
                <p>{selectedFile.name}</p>
              </div>
              <p className="bytesFile">Tamaño: {selectedFile.size} bytes</p>
            </>
          ) : (
            <div className="boxMessage">
              <div className="boxIconFile">
                <FiUpload className="iconLoadFile" size={30} />
              </div>
              <p>Arrastra y suelta el documento de Excel</p>
            </div>
          )}
        </div>

        {selectedFile && (
          <div className="dbSiync">
            <div className="centerDbSync">
              <div className="boxBtnSync">
                <button
                  className="btnSync"
                  // disabled={syncDb == true ? true : false}
                  onClick={statusAsyncDb}
                >
                  <div className="boxIconSync">
                    {syncDb == false ? (
                      <TbFolderCancel className="iconSyncFail" size={20} />
                    ) : (
                      <TbFolderCheck className="iconSync" size={20} />
                    )}
                  </div>
                  <p className="textSync">
                    {syncDb == false ? "Syncronizar" : "Syncronizado"}
                  </p>
                </button>
              </div>

              <div className="boxInfoSync">
                <div className="centerInfoSync">
                  <div className="boxIconInfoSync">
                    <TbInfoOctagonFilled />
                  </div>
                  <p>
                    {syncDb == false
                      ? "Al syncronizar ya no necesitaras el archivo Excel"
                      : "Si quieres eliminar esta base de datos, vuelve a dar Click!"}
                  </p>
                </div>
              </div>

              <div className="boxBtnGoSaved">
                <button className="btnSync">
                  <div className="boxIconSync">
                    <TbFolder className="iconSyncFail" size={20} />
                  </div>
                  <p className="textSync">Ver Guardados</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {!jsonFile && (
        <div className="boxBtnProc">
          <button disabled={selectedFile ? false : true} onClick={processFile}>
            Procesar
          </button>
        </div>
      )}

      {jsonFile && <FilterBox JsonFile={jsonFile} />}

      {/* {jsonFile && <pre>{JSON.stringify(jsonFile, null, 2)}</pre>} */}
    </>
  );
}
