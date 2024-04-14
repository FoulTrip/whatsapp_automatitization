import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";
import { Toaster, toast } from "sonner";
import axios from "axios";
import "./styles/dropzone.css";

// interface dropWorkBook {
//   sessionId: string
// }

export default function DropWorkBook() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jsonFile, setJsonFile] = useState(null);

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

  const processFile = async () => {
    if (selectedFile) {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = async () => {
        let formData = new FormData();
        formData.append("workbook", selectedFile);

        console.log(formData.get("workbook"));
        console.log(selectedFile);

        try {
          const response = await axios.post(
            "http://localhost:3000/api/files",
            formData
          );

          console.log(response.data);

          if (response.data.success == false) {
            throw new Error("Error al procesar archivo");
          }

          const jsonResponse = await response.data.data;
          console.log(jsonResponse)
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
      <div {...getRootProps()} className="containerDrop">
        <input {...getInputProps()} />
        {selectedFile ? (
          <p>
            {selectedFile.name} - {selectedFile.size} bytes
          </p>
        ) : (
          <div className="boxMessage">
            <div className="boxIconFile">
              <FiUpload className="iconLoadFile" size={30} />
            </div>
            <p>Arrastra y suelta el documento de Excel</p>
          </div>
        )}
      </div>

      <div className="boxBtnProc">
        <button disabled={selectedFile ? false : true} onClick={processFile}>
          Procesar
        </button>
      </div>

      

      {jsonFile && <pre>{JSON.stringify(jsonFile, null, 2)}</pre>}
    </>
  );
}
