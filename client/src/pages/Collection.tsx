import { useNavigate, useParams } from "react-router-dom";
import { useGlobalContext } from "../context/session";
import React, { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import {
  ScalarCollection,
  ScalarEventCollectionNotifications,
} from "../types/collections";
import NavBar from "../components/NavBar";
import iconNotification from "../assets/iconRecordatorio.png";
import "./styles/CollectionComponent.css";

import {
  TbCalendarDollar,
  TbReportMoney,
  TbTimelineEventText,
  TbTrash,
} from "react-icons/tb";

import socket from "../components/socket/socket";

function Collection() {
  const { collectionId } = useParams<{ collectionId: string }>();
  const { dataSession } = useGlobalContext();
  const router = useNavigate();

  const [selectOption, setSelectOption] = useState<string>("");
  const [dataCollection, setDataCollection] = useState<ScalarCollection | null>(
    null
  );
  const [nameEvent, setNameEvent] = useState<string>("");
  const [updateEvents, setUpdateEvents] = useState<
    ScalarEventCollectionNotifications[] | null
  >(null);

  if (!dataSession) {
    router("/");
  }

  useEffect(() => {
    const getCollection = async () => {
      const response = await axios.post(
        "http://localhost:3000/collections/id",
        { collectionId }
      );
      const collection = response.data.data;
      // console.log(collection);
      setDataCollection(collection);
    };

    const getEvents = async () => {
      const response = await axios.post(
        "http://localhost:3000/collections/event/notification",
        {
          collectionId,
        }
      );
      // console.log(response.data)
      setUpdateEvents(response.data.data);
    };

    getCollection();
    getEvents();
  }, [collectionId]);

  useEffect(() => {
    socket.emit("connected", `Hello from collection ${collectionId}`);

    socket.on(
      "update_event_notification",
      (data: ScalarEventCollectionNotifications[]) => {
        console.log(data);
        setUpdateEvents(data);
      }
    );

    return () => {
      socket.off("update_event_notification");
    };
  }, [collectionId]);

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectOption(event.target.value);
  };

  const handleCreateEventNotification = (e: FormEvent) => {
    e.preventDefault();
    if (collectionId) {
      const data = {
        collectionId,
        name: nameEvent,
        type: selectOption,
      };
      socket.emit("create_event_notification", data);
    } else {
      throw new Error("Error al crear evento");
    }
  };

  const handleCreateEventChat = () => {
    const data = {
      collectionId,
      name: nameEvent,
      type: selectOption,
    };
    socket.emit("create_event", data);
  };

  return (
    <>
      <NavBar session_id={dataSession && dataSession.nameSession} />

      <div className="headerControlCollection">
        <div className="onlyInfoCollection">
          <div className="centerOnlyInfoCollection">
            <div className="boxIconTypeCollection">
              <img src={iconNotification} alt="icon" />
            </div>
            <div className="detailsCollection">
              <h3>{dataCollection?.nameType}</h3>
              <p>{dataCollection?.name}</p>
            </div>
          </div>
        </div>

        <div className="boxListEvents">
          <h3 className="titleEventListBox">Eventos creados</h3>
          <div
            className={
              updateEvents?.length === 0 ? "voidListEvents" : "listEvents"
            }
          >
            {updateEvents?.map((event) => (
              <div className="baseCardEvent">
                <div className="infoBlock01">
                  <div className="boxIconEvent">
                    {event.type == "subscription" && (
                      <TbReportMoney size={40} className="iconEventType" />
                    )}
                    {event.type == "reminder" && (
                      <TbCalendarDollar size={40} className="iconEventType" />
                    )}
                  </div>
                  <div className="boxInfoEvent">
                    <div className="centerBoxInfoEvent">
                      <p>{event.type}</p>
                      <p>{event.name}</p>
                    </div>
                  </div>
                </div>
                <div className="eventStatus">
                  <div className="boxIconEventStatus">
                    <TbTrash className="iconDeleteEvent" size={20} />
                  </div>
                </div>
              </div>
            ))}
            {updateEvents?.length === 0 && (
              <div className="baseCardVoidEvent">
                <div className="noEventBoxIcon">
                  <TbTimelineEventText size={30} />
                </div>
                <p>Sin Eventos</p>
              </div>
            )}
          </div>
        </div>

        <div className="formEventCreate">
          <form
            onSubmit={
              dataCollection?.nameType == "Notificaciones automáticas"
                ? handleCreateEventNotification
                : handleCreateEventChat
            }
          >
            <h2 className="titleForm">Crea un nuevo evento</h2>
            <div className="boxFormCreate">
              <p>Elige el tipo de evento</p>
              <select value={selectOption} onChange={handleSelect}>
                <option value="">Seleccione una opcion</option>
                <option value="subscription">Subscripcion</option>
                <option value="reminder">Recordatorio</option>
              </select>
            </div>
            <div className="boxFormCreate">
              <p>Nombre</p>
              <input
                type="text"
                className="inputNameEvent"
                onChange={(e) => setNameEvent(e.target.value)}
              />
            </div>
            {/* {selectOption == "reminder" && (
              <div>

              </div>
            )} */}

            <div className="containerBtnCreate">
              <button type="submit">Crear</button>
            </div>
          </form>
        </div>
      </div>

      
    </>
  );
}

export default Collection;
