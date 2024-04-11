import { useEffect, useState } from "react";
import "./App.css";
import QRCode from "react-qr-code";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {});

function App() {
  const [session, setSession] = useState("");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [id, setId] = useState();

  useEffect(() => {
    socket.emit("connected", "Hello from client");

    socket.on("qr", (data) => {
      const { qr } = data;
      setQrCode(qr);
    });

    socket.on("ready", (data) => {
      console.log(data);
      const { id } = data;
      setId(id);
    });

    socket.on("allChats", (data) => {
      console.log("allChats", data);
    });
  }, []);

  const createSessionWP = () => {
    socket.emit("createSession", {
      id: session,
    });
  };

  const getAllChats = () => {
    socket.emit("getAllChats", { id });
  };

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Whatsapp Client</h1>

      {id == null ? (
        <>
          <h2 style={{ textAlign: "center" }}>
            Open Whatsapp app and scan qr code
          </h2>

          <div
            style={{
              display: "grid",
              placeContent: "center",
              marginTop: "20px",
            }}
          >
            <div>
              <input
                type="text"
                value={session}
                onChange={(e) => {
                  setSession(e.target.value);
                }}
              />

              <button onClick={createSessionWP}>Crear Session</button>
            </div>
          </div>

          {qrCode != null ? <QRCode value={qrCode} /> : null}
        </>
      ) : (
        <button onClick={getAllChats}>Get all chats</button>
      )}
    </>
  );
}

export default App;
