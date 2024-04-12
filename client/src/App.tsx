import { useEffect, useState } from "react";
import "./App.css";
import QRCode from "react-qr-code";
import { io } from "socket.io-client";
import Loader from "./components/Loader";

const socket = io("http://localhost:3000", {});

function App() {
  const [session, setSession] = useState("");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [oldSessionId, setOldSessionId] = useState("");
  const [id, setId] = useState();
  const [loadingQr, setLoadingQr] = useState<boolean>(false);
  const [textSession, setTextSession] = useState(false);

  useEffect(() => {
    socket.emit("connected", "Hello from client");

    socket.on("qr", (data) => {
      const { qr } = data;
      setQrCode(qr);
      setLoadingQr(false);
    });

    socket.on("ready", (data) => {
      console.log(data);
      const { id } = data;
      setId(id);
    });

    socket.on("allChats", (data) => {
      console.log("allChats", data);
    });

    socket.on("remote_session_saved", (data) => {
      console.log("session", data);
    });
  }, []);

  const createSessionWP = () => {
    socket.emit("createSession", {
      id: session,
    });
    setLoadingQr(true);
    setTextSession(true);
  };

  const getOldSession = () => {
    socket.emit("getSession", { id: oldSessionId });
  };

  const getAllChats = () => {
    socket.emit("getAllChats", { id });
  };

  return (
    <>
      <main className="initWp">
        <div>
          <h1 className="textTitleClient">
            <span className="spanWs">Whatsapp</span> Bot
          </h1>

          <input
            type="text"
            value={oldSessionId}
            onChange={(e) => setOldSessionId(e.target.value)}
          />

          <button className="btnCreateSession" onClick={getOldSession}>
            Recuperar session
          </button>

          {id == null ? (
            <>
              <p className="noteCreate">Dale un nombre a tu session</p>

              <div className="boxInputInfo">
                {textSession == false ? (
                  <div className="subBoxInputInfo">
                    <input
                      className="inputInfo"
                      type="text"
                      value={session}
                      onChange={(e) => {
                        setSession(e.target.value);
                      }}
                      placeholder="Nombre"
                    />

                    <button
                      className="btnCreateSession"
                      onClick={createSessionWP}
                    >
                      Crear Session
                    </button>
                  </div>
                ) : (
                  <>
                    <p>{session}</p>
                  </>
                )}
              </div>
              {loadingQr == true ? <Loader reason="Generando Qr" /> : null}
              {qrCode != null && loadingQr == false ? (
                <div className="boxQrCode">
                  <QRCode value={qrCode} />
                </div>
              ) : null}
            </>
          ) : (
            <button onClick={getAllChats}>Get all chats</button>
          )}
        </div>
      </main>
    </>
  );
}

export default App;
