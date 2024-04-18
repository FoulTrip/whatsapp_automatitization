import { useEffect, useState } from "react";
import "./styles/App.css";
import QRCode from "react-qr-code";
import Loader from "../components/Loader";
import socket from "../components/socket/socket";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  TbDatabaseCog,
  TbSquareRoundedPlus,
  TbSquareRoundedMinus,
  TbListSearch,
  TbUserCircle,
  TbSettings,
  TbLoader,
} from "react-icons/tb";
import axios from "axios";
import { useGlobalContext } from "../context/session";
import { SessionAuth } from "../types/session";
import NavBar from "../components/NavBar";
interface messageReq {
  author: string;
  message: string;
}

function App() {
  const { dataSession, setDataSession } = useGlobalContext();
  const router = useNavigate();

  if (dataSession == null) {
    const [session, setSession] = useState("");
    const [qrCode, setQrCode] = useState<string | null>(null);
    // const [oldSessionId, setOldSessionId] = useState("");
    const [openSessions, setOpenSession] = useState<boolean>(false);
    const [id, setId] = useState<string | null>(null);
    const [loadingQr, setLoadingQr] = useState<boolean>(false);
    const [textSession, setTextSession] = useState(false);
    const [messageReq, setMessageReq] = useState<messageReq | null>(null);
    // const [savedSession, setSavedSession] = useState<boolean>(false);
    const [listSessions, setListSessions] = useState<SessionAuth[] | null>(
      null
    );
    const [loadingGetSession, setLoadingGetSession] = useState<boolean>(false);

    const handleOpenSessions = () => {
      setOpenSession(!openSessions);
    };

    const handleCreateSession = async ({
      session_id,
    }: {
      session_id: string;
    }) => {
      try {
        const response = await axios.post("http://localhost:3000/auth/signin", {
          session_id,
        });
        console.log("response Auth Session: ", response.data);

        if (response.data.success == false) {
          throw new Error("Imposible guardar en mongo");
        }
        setDataSession(response.data.data);
        toast.success("Guardado en mongo");
      } catch (error) {
        console.log(error);
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    };

    useEffect(() => {
      socket.emit("connected", "Hello from client");

      socket.on("qr", (data) => {
        const { qr } = data;
        setQrCode(qr);
        setLoadingQr(false);
      });

      socket.on("ready", (data) => {
        handleCreateSession({
          session_id: data.id,
        });
        setId(data.id);
        toast.success(`Bienvenido ${data.id}`);
      });

      socket.on("allChats", (data) => {
        console.log("allChats", data);
      });

      socket.on("remote_session_saved", (_data) => {
        toast.success("Session remota lista");
      });

      socket.on("newMessage", (data) => {
        console.log(data);
        setMessageReq(data);
      });
    }, []);

    useEffect(() => {
      const getSessions = async () => {
        const response = await axios.get("http://localhost:3000/auth/sessions");

        if ((response.data.success = false)) {
          throw new Error(response.data.error);
        } else if ((response.data.success = true)) {
          // console.log(response.data.data)
          setListSessions(response.data.data);
          // console.log(
          //   listSessions?.map((sessions) => {
          //     return sessions.id;
          //   })
          // );
        }
      };

      getSessions();
    }, []);

    if (messageReq != null) {
      toast.success(`Nuevo mensaje de: ${messageReq.author}`);
      console.log({ messageChat: messageReq.message });
      setTimeout(() => {
        setMessageReq(null);
      }, 4000);
    }

    const createSessionWP = () => {
      socket.emit("createSession", {
        id: session,
      });
      setLoadingQr(true);
      setTextSession(true);
    };

    const getOldSession = ({ id }: { id: string }) => {
      socket.emit("getSession", { id });
      setLoadingGetSession(true);
    };

    // const getAllChats = () => {
    //   socket.emit("getAllChats", { id });
    // };

    // console.log(id);

    if (id == null) {
      return (
        <>
          <NavBar
            session_id={(dataSession as SessionAuth | null)?.nameSession}
          />
          <main className="initWp">
            <div className="centerMain">
              <span className="spanWs">WhatsApp</span>
              <h1 className="autText">Automatizaciones</h1>

              <div className="containerSelectSessions">
                <div
                  className={
                    openSessions
                      ? "containerSavedSessionOpen"
                      : "containerSavedSession"
                  }
                >
                  <div className="textIcon">
                    <div className="boxIconSaved">
                      <TbDatabaseCog size={20} className="iconSaved" />
                    </div>
                    <p>Sessiones Guardadas</p>
                  </div>
                  <div className="boxIconClose" onClick={handleOpenSessions}>
                    {openSessions == false ? (
                      <TbSquareRoundedPlus
                        className="iconSavedMore"
                        size={20}
                      />
                    ) : (
                      <TbSquareRoundedMinus
                        size={20}
                        className="iconSavedMore"
                      />
                    )}
                  </div>
                </div>
                {openSessions && (
                  <div
                    className={
                      listSessions && listSessions?.length > 0
                        ? "voidSessionsDone"
                        : "voidSessions"
                    }
                  >
                    {listSessions?.length == 0 && (
                      <div className="centerVoidSession">
                        <div className="boxIconVoid">
                          <TbListSearch size={20} />
                        </div>
                        <p>Sin Sessiones</p>
                      </div>
                    )}
                    {listSessions != null &&
                      listSessions.map((sessions) => (
                        <div
                          className="cardSession"
                          key={sessions.id}
                          onClick={() =>
                            getOldSession({ id: sessions.nameSession })
                          }
                        >
                          <div className="optsCardSession">
                            <div className="avatarSession">
                              <TbUserCircle size={20} />
                            </div>
                            <p className="nameSessionText">
                              {sessions.nameSession}
                            </p>
                          </div>
                          <div className="iconOpts">
                            {loadingGetSession == true && (
                              <div className="boxIconsOpts">
                                <TbLoader className="iconLoading" size={20} />
                              </div>
                            )}
                            <div className="boxIconsOpts">
                              <TbSettings className="iconSettings" size={20} />
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <p className="noteCreate">Crea una nueva session</p>

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

              {qrCode != null && loadingQr == false && !id ? (
                <div className="boxQrCode">
                  <QRCode value={qrCode} />
                </div>
              ) : null}
            </div>
          </main>
        </>
      );
    } else if (id) {
      loadingGetSession == true && setLoadingGetSession(false);
      router("/dashboard");
    }
  } else if (dataSession !== null) {
    router("/dashboard");
  }
}

export default App;
