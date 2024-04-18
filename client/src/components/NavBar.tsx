import {
  TbBrandWhatsapp,
  TbUserCancel,
  TbUserBolt,
  TbPointFilled,
} from "react-icons/tb";
import "./styles/NavBar.css";

function NavBar({ session_id }: { session_id: string | null | undefined }) {
  return (
    <>
      <nav>
        <div className="logoNav">
          <div className="boxLogo">
            <TbBrandWhatsapp className="logo" size={20} />
          </div>
          <p>Automatizaciones</p>
        </div>
        <div className="containerStatus">
          <div className="iconSession">
            {session_id ? (
              <TbUserBolt size={25} className="iconAccess" />
            ) : (
              <TbUserCancel size={25} className="iconCancel" />
            )}
          </div>
          <div className="subContainerStatus">
            <div className="supraContainerStatus">
              <div className="centerBoxStatus">
                <div className="boxStatus">
                  <div className="boxPoint">
                    <TbPointFilled
                      className={session_id ? "greenPoint" : "redPoint"}
                    />
                  </div>
                  <p>{session_id ? "Online" : "Offline"}</p>
                </div>
              </div>
              <h5>{session_id ? session_id : "Sin Session"}</h5>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
