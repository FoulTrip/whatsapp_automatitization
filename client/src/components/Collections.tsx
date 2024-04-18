import { useEffect, useState } from "react";
import "./styles/collections.css";
import { TbVersionsFilled } from "react-icons/tb";
import axios from "axios";
import { useGlobalContext } from "../context/session";
import { ScalarCollection } from "../types/collections";
import socket from "./socket/socket";
import { Link } from "react-router-dom";

function CollectionsSaved() {
  const { dataSession } = useGlobalContext();
  const [collections, setCollections] = useState<ScalarCollection[] | null>(
    null
  );

  useEffect(() => {
    const getCollections = async () => {
      const response = await axios.post(
        "http://localhost:3000/collections/session",
        {
          sessionId: dataSession?.id,
        }
      );
      // console.log(response.data.data);
      setCollections(response.data.data);
    };

    getCollections();
  }, [dataSession?.id]);

  useEffect(() => {
    socket.emit("connected", "Hello from collections");

    socket.on("collection_update", (data: ScalarCollection[]) => {
      // console.log(data);
      setCollections(data);
    });

    return () => {
      socket.off("collection_update");
    };
  }, []);

  const dateTime = (timestamp: Date | undefined): string | undefined => {
    if (!timestamp) {
      return "Fecha no disponible";
    }
    const opts: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    return new Date(timestamp).toLocaleString("es-ES", opts);
  };

  return (
    <>
      <div className="containerCollections">
        <div className="headerCollections">
          <div className="boxIconHeaderCollection">
            <TbVersionsFilled size={25} />
          </div>
          <p>Colecciones guardadas</p>
        </div>

        {collections?.map((info) => (
          <div className="supraCardCollection" key={info.id}>
            <div className="cardCollection">
              <div className="boxInfoCollection">
                <div className="centerBoxInfoCollection">
                  <h5 className="labelCollection">Nombre</h5>
                  <h3 className="textCollection">{info.name}</h3>
                </div>
              </div>

              <div className="boxInfoCollection">
                <div className="centerBoxInfoCollection">
                  <h5 className="labelCollection">Tipo</h5>
                  <h3 className="textCollection">{info.nameType}</h3>
                </div>
              </div>

              <div className="boxInfoCollection">
                <div className="centerBoxInfoCollection">
                  <h5 className="labelCollection">Fecha de creacion</h5>
                  <h3 className="textCollection">
                    {dateTime(info.created_at)}
                  </h3>
                </div>
              </div>
            </div>

            <div className="optsCardCollection">
              <div className="centerOptsCardCollection">
                <Link className="visitCollectionBtn" to={`/collection/${info.id}`}>Consultar</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default CollectionsSaved;
