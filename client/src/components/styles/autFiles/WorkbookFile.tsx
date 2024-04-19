import { FormEvent, useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";
import { PiMicrosoftExcelLogoDuotone } from "react-icons/pi";
import {
  TbFolderCancel,
  TbInfoOctagonFilled,
  TbFolderCheck,
} from "react-icons/tb";
import { toast } from "sonner";
import axios from "axios";
import "./styles/dropzone.css";
import { JsonExcelConvert } from "../../../types/JsonFileExcel";
import FilterBox from "../../filterBox";
import socket from "../../socket/socket";
import { useGlobalContext } from "../../../context/session";
import { ScalarCollection } from "../../../types/collections";
import JsonCollections from "../../jsons/typesAut.json";

export default function WorkbookFile() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jsonFile, setJsonFile] = useState<JsonExcelConvert[] | null>(null);
  const [syncDb, setAsyncDb] = useState<boolean>(false);
  const [preSyncDb, setPreSyncDb] = useState<boolean>(false);
  const [namesCollections, setNameCollection] = useState<string[]>([]);
  const [selectOption, setSelectOption] = useState<string>("");
  const [newCollection, setNewCollection] = useState<boolean>(false);
  const [nameNewCollection, setNameNewCollection] = useState<string | null>(
    null
  );

  const { dataSession } = useGlobalContext();

  useEffect(() => {
    socket.emit("connected", "Hello from client");

    socket.on("collection_update", (data) => {
      if (data) {
        setPreSyncDb(false);
        setAsyncDb(true);
      }
    });

    socket.on("messageSend", (data) => {
      console.log(data);
      toast.success("Message recived");
    });

    socket.on("syncDB", (data) => {
      console.log(data);
      setAsyncDb(data.state);
    });
  }, []);

  useEffect(() => {
    const getCollections = async () => {
      const response = await axios.post(
        "http://localhost:3000/collections/session",
        {
          sessionId: dataSession?.id,
        }
      );

      const data: ScalarCollection[] = response.data.data;
      const namesCollections = data.map((detail) => detail.name);
      setNameCollection(namesCollections);
      // console.log(namesCollections);
    };

    getCollections();
  }, [dataSession?.id]);

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
    if (syncDb === true) {
      toast.error("El archivo ya esta syncronizado");
      return;
    }
    setPreSyncDb(!preSyncDb);
    // setAsyncDb(!syncDb);
  };

  const handleNewCollection = () => {
    setNewCollection(!newCollection);
  };

  const handleSelectCollection = ({
    nameCollection,
  }: {
    nameCollection: string;
  }) => {
    if (!jsonFile) {
      toast.error("Primero Procesa tu archivo");
    }

    const data = {
      jsonAgree: jsonFile,
      nameCollection: nameCollection,
    };

    socket.emit("dates_in_collection", data);
  };

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectOption(event.target.value);
  };

  const handleSyncDb = (
    e: FormEvent,
    {
      name,
      nameType,
      sessionId,
    }: {
      name: string;
      nameType: string;
      sessionId: string;
    }
  ) => {
    e.preventDefault();
    const data = {
      name,
      nameType,
      sessionId,
    };
    socket.emit("create_collection", data);
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

          console.log(response.data);

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
      <div className="containerFileActions">
        <div
          {...getRootProps()}
          className={!selectedFile ? "containerDropNo" : "containerDrop"}
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
              {!preSyncDb && (
                <>
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
                        {preSyncDb == false
                          ? "Al syncronizar ya no necesitaras el archivo Excel"
                          : null}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {preSyncDb && (
                <>
                  <div className="containerSelectCollection">
                    {!newCollection ? (
                      <>
                        <p className="titleSelectCollection">
                          Elige una coleccion
                        </p>
                        <div className="listNamesCollections">
                          {namesCollections.map((name) => (
                            <p
                              className="btnCollectionOpt"
                              onClick={() =>
                                handleSelectCollection({
                                  nameCollection: name,
                                })
                              }
                            >
                              {name}
                            </p>
                          ))}
                        </div>
                        <div className="boxBtnsActions">
                          <div className="rowBoxBtnsActions">
                            <button
                              className="btnCreateNewColl"
                              onClick={handleNewCollection}
                            >
                              Crear nueva coleccion
                            </button>
                            <button
                              className="btnCancelNewColl"
                              onClick={() => setPreSyncDb(false)}
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <form className="formNewCollectionSync">
                          <p>Selecciona una coleccion</p>
                          <select value={selectOption} onChange={handleSelect}>
                            <option value=""></option>
                            {JsonCollections.map((info) => (
                              <option value={info.name}>{info.name}</option>
                            ))}
                          </select>
                          <input
                            type="text"
                            onChange={(e) =>
                              setNameNewCollection(e.target.value)
                            }
                            placeholder="Nombre de coleccion"
                          />

                          <div className="boxBtnsActions">
                            <div className="rowBoxBtnsActions">
                              <button
                                className="btnCreateNewColl"
                                onClick={(e) =>
                                  handleSyncDb(e, {
                                    name: nameNewCollection as string,
                                    nameType: selectOption,
                                    sessionId: dataSession?.id as string,
                                  })
                                }
                              >
                                Crear
                              </button>
                              <button
                                className="btnCancelNewColl"
                                onClick={() => setNewCollection(false)}
                              >
                                Volver
                              </button>
                            </div>
                          </div>
                        </form>
                      </>
                    )}
                  </div>
                </>
              )}

              {/* <div className="boxBtnGoSaved">
                <button className="btnSync">
                  <div className="boxIconSync">
                    <TbFolder className="iconSyncFail" size={20} />
                  </div>
                  <p className="textSync">Ver Guardados</p>
                </button>
              </div> */}
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
