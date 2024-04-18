import "./styles/registersAut.css";
import { useEffect, useState } from "react";
import jsonTypes from "../../jsons/typesAut.json";
import { BtnTypesInfo } from "../../../types/session";

import { TbBellCog, TbBrandWechat } from "react-icons/tb";
import { useGlobalContext } from "../../../context/session";
import socket from "../../socket/socket";

function RegistersAut() {
  const [typesInfo, setTypesInfo] = useState<BtnTypesInfo[] | null>(null);
  const [selectType, setSelectType] = useState<boolean>(false);
  const [infoSelect, setInfoSelect] = useState<BtnTypesInfo | null>(null);
  const [nameCollection, setNameCollection] = useState<string>("");

  const { dataSession } = useGlobalContext();

  useEffect(() => {
    setTypesInfo(jsonTypes);
  }, [jsonTypes]);

  const handlePreOpenCollection = (info: BtnTypesInfo) => {
    setInfoSelect(info);
    setSelectType(true);
    console.log(info);
  };

  const handleCreateCollection = ({
    name,
    nameType,
    sessionId,
  }: {
    name: string;
    nameType: string;
    sessionId: string;
  }) => {
    const data = {
      name,
      nameType,
      sessionId,
    };
    socket.emit("create_collection", data);
  };

  return (
    <>
      <div className="containerSelectType">
        <div className={selectType ? "barTypes" : "barTypesOpen"}>
          <p className="advertTypes">Selecciona el tipo de automatizacion</p>
          <div className="types">
            <div className="centerTypes">
              {typesInfo?.map((info) => (
                <div
                  className="btnType"
                  key={info.id}
                  onClick={() =>
                    info.status === "Disponible" &&
                    handlePreOpenCollection(info)
                  }
                >
                  <div className="headerBtnType">
                    <div className="boxIconCircleSelect">
                      {info.icon == "TbBellCog" && (
                        <TbBellCog className="pointTypeSelect" size={20} />
                      )}
                      {info.icon == "TbBrandWechat" && (
                        <TbBrandWechat className="pointTypeSelect" size={20} />
                      )}
                    </div>
                    <h3>{info.name}</h3>
                  </div>
                  <p className="infoDescription">{info.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {selectType == true && (
          <div className="boxSelectType">
            <div className="centerSelectType">
              <div>
                <h2>Crea una coleccion</h2>
                <p>{infoSelect?.name}</p>
              </div>
              <div className="boxInputType">
                <input
                  type="text"
                  onChange={(e) => setNameCollection(e.target.value)}
                  placeholder="Example: Rentas Edificio 302"
                />
              </div>
            </div>
            <div className="btnsOptType">
              <div className="centerBtnsOptType">
                <button
                  className="btnCancelType"
                  onClick={() => setSelectType(!selectType)}
                >
                  Cancelar
                </button>
                <button
                  className="btnCreateType"
                  onClick={() =>
                    handleCreateCollection({
                      name: nameCollection,
                      nameType: infoSelect?.name as string,
                      sessionId: dataSession?.id as string,
                    })
                  }
                >
                  Crear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default RegistersAut;
