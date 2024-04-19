import React, { useState } from "react";
import { JsonExcelConvert } from "../types/JsonFileExcel";
import { TbFlame, TbPhotoPlus } from "react-icons/tb";
import "./styles/filterBox.css";
import Dropzone from "react-dropzone";
import axios from "axios";
import { toast } from "sonner";
import { useGlobalContext } from "../context/session";

function FilterBox({ JsonFile }: { JsonFile: JsonExcelConvert[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [masiveMessage, setMasiveMessage] = useState<boolean>(false);
  const [selectedProfessions, setSelectedProfessions] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [messageText, setMessageText] = useState("");

  const { dataSession } = useGlobalContext();

  const handleImageDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedImage(acceptedFiles[0]);
    }
  };

  const handleProfessionCheckboxChange = (value: string) => {
    if (selectedProfessions.includes(value)) {
      setSelectedProfessions(
        selectedProfessions.filter((profession) => profession !== value)
      );
    } else {
      setSelectedProfessions([...selectedProfessions, value]);
    }
  };

  const filteredDetails = JsonFile.filter(
    (detail) =>
      detail.rol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      detail.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenMasiveMessage = () => {
    setMasiveMessage(!masiveMessage);
    setSelectedImage(null);
  };

  const handleMessageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMessageText(event.target.value);
  };

  const handleSendMessages = async () => {
    const filteredDetails = JsonFile.filter((detail) =>
      selectedProfessions.includes(detail.rol)
    );

    const onlySelect = filteredDetails.map((detail) => ({
      number: detail.telefono,
      name: detail.Nombre,
    }));

    const dataReq = {
      onlySelect,
      image: selectedImage,
      message: messageText,
      idSession: dataSession?.nameSession,
      zipCode: "57",
    };

    const response = await axios.post("http://localhost:3000/wp/send", dataReq);
    console.log(response);
    if (response.data.success == true) {
      toast.success("Mensajes enviados");
    } else if (response.data.success == false) {
      toast.error("Mensajes no enviados");
    }
  };

  return (
    <>
      <div className="searchContainer">
        <div className="boxInput">
          <input
            type="text"
            placeholder="Nombre o Profesion"
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <div className="autoMessages">
          <div
            className="btnOpt"
            onClick={handleOpenMasiveMessage}
            style={masiveMessage ? { border: "1px solid #b2b2b2" } : undefined}
          >
            <div className="iconBtnOpt">
              <TbFlame size={20} />
            </div>
            <p>Mensajes masivos</p>
          </div>
        </div>
      </div>
      {masiveMessage && (
        <>
          <div className="masiveFilterBox">
            <div className="filterBox">
              <div className="centerFilterBox">
                <h4>Profesion</h4>
                <div className="listOpts">
                  {Array.from(
                    new Set(JsonFile.map((detail) => detail.rol))
                  ).map((profesion) => (
                    <>
                      <label key={profesion}>
                        <div className="inputBox">
                          <input
                            type="checkbox"
                            value={profesion}
                            onChange={(e) =>
                              handleProfessionCheckboxChange(e.target.value)
                            }
                          />
                        </div>
                        <p>{profesion}</p>
                      </label>
                    </>
                  ))}
                </div>
              </div>
            </div>

            <div className="imageToMessage">
              <Dropzone onDrop={handleImageDrop}>
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()} className="centerImage">
                    <input {...getInputProps()} />
                    {selectedImage ? (
                      <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Preview"
                        width={120}
                        style={{ borderRadius: "8px" }}
                      />
                    ) : (
                      <div className="centerImage">
                        <div className="iconImage">
                          <TbPhotoPlus />
                        </div>
                        <p>Agregar Imagen</p>
                      </div>
                    )}
                    {/* <p>Agregar Imagen</p> */}
                  </div>
                )}
              </Dropzone>
            </div>

            <div className="messageBox">
              {/* <div className="centerMessageBox"> */}
              <p>Buenas Sr(a) [nombre cliente]</p>
              <textarea
                className="textAreaMessage"
                onChange={handleMessageChange}
                placeholder="Escribe aqui tu mensaje..."
              />
              {/* </div> */}
            </div>

            <div className="boxBtnSend">
              <button onClick={handleSendMessages}>Enviar</button>
            </div>
          </div>
        </>
      )}
      <div className="maxCardPerson">
        {filteredDetails.map((detail) => (
          <>
            <div className="centerCardPerson" key={detail.id}>
              <div className="cardPerson">
                <div className="subBoxDetail">
                  <h5>Nombre</h5>
                  <p>{detail.Nombre}</p>
                </div>

                <div className="subBoxDetail">
                  <h5>Email</h5>
                  <p>{detail.email}</p>
                </div>

                <div className="subBoxDetail">
                  <h5>Telefono</h5>
                  <p>{detail.telefono}</p>
                </div>

                <div className="subBoxDetail">
                  <h5>Profesion</h5>
                  <p>{detail.rol}</p>
                </div>
              </div>

              <div className="boxOpts">Options</div>
            </div>
          </>
        ))}
      </div>
    </>
  );
}

export default FilterBox;
