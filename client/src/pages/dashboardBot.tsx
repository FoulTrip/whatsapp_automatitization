import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useGlobalContext } from "../context/session";
import "./styles/dashboard.css";

import { TbFileSearch, TbBookmarkAi } from "react-icons/tb";
import { useState } from "react";
import WorkbookFile from "../components/styles/autFiles/WorkbookFile";
import RegistersAut from "../components/styles/autFiles/RegistersAut";
import CollectionsSaved from "../components/Collections";

function DashboardBot() {
  const [currentOpt, setCurrentOpt] = useState<string>("registration");
  const { dataSession } = useGlobalContext();
  const router = useNavigate();

  const handleOpt = (status: string) => {
    setCurrentOpt(status);
  };

  if (dataSession) {
    return (
      <>
        <NavBar session_id={dataSession?.nameSession} />

        <div className="containerOpts">
          <p className="textAdvert">Comienza a automatizar</p>
          <div className="carrouselOpts">
            <div
              className={
                currentOpt == "registration" ? "btnOptSelectInit" : "btnOptInit"
              }
              onClick={() => handleOpt("registration")}
            >
              <div className="boxIconOpt">
                <TbBookmarkAi size={20} />
              </div>
              <p className="nameOpt">Registro</p>
            </div>

            <div
              className={
                currentOpt == "file" ? "btnOptSelectInit" : "btnOptInit"
              }
              onClick={() => handleOpt("file")}
            >
              <div className="boxIconOpt">
                <TbFileSearch size={20} />
              </div>
              <p className="nameOpt">Archivo</p>
            </div>
          </div>
        </div>

        {currentOpt == "file" && <WorkbookFile />}
        {currentOpt == "registration" && <RegistersAut />}

        <CollectionsSaved />
      </>
    );
  } else if (!dataSession) {
    router("/");
  }
}

export default DashboardBot;
