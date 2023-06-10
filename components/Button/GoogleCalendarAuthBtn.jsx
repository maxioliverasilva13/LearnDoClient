import React, { useState } from "react";
import googleConfig from "pages/api/google-auth";
import { useEffect } from "react";
import { useCreateCalendarEvent } from "hooks/useCreateCalendarEvent";

import moment from "moment";
import "moment/locale/es";
moment.locale("es");


const GoogleCalendarAuthBtn = ({
  nombre,
  descripcion,
  fecha,
  hora,
  duracion,
  link,
}) => {
  let fInicio = moment(fecha + " " + hora, "DD/MM/YYYY HH:mm").format();
  let fFin = moment(fecha + " " + hora, "DD/MM/YYYY HH:mm").add(duracion, 'hours').format();
  // console.log("Inicio: ", fInicio)
  // console.log("Fin: ", fFin)

  const [tokenClient, setTokenClient] = useState({});
  const SCOPES = "https://www.googleapis.com/auth/calendar";
  const eventData = {
    summary: nombre,
    description: descripcion,
    location: link || "Sede de LearnDo",
    colorId: 4,
    start: {
      dateTime: fInicio,
      timeZone: "GMT-3",
    },
    end: {
      dateTime: fFin,
      timeZone: "GMT-3",
    },
  };

  function createEvento() {
    tokenClient.requestAccessToken();
  }

  useEffect(() => {
    const google = window.google;

    // Access Tokens
    setTokenClient(
      google.accounts.oauth2.initTokenClient({
        client_id: googleConfig.clientId,
        scope: SCOPES,
        callback: async (tokenResponse) => {
          if (tokenResponse && tokenResponse.access_token) {
            console.log("response del login: ", tokenResponse);

            await useCreateCalendarEvent(tokenResponse.access_token, eventData);

            /* try {
              const response = await fetch(
                "https://www.googleapis.com/calendar/v3/calendars/primary/events",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + tokenResponse.access_token,
                  },
                  body: JSON.stringify(eventData),
                }
              )
                .then((data) => {
                  return data.json();
                })
                .then((data) => {
                  console.log("resp: ", data);
                  console.log("evento creado, chequea tu calendario");
                })
                .catch((error) => {
                  console.log("errooor: ", error);
                });

              const data = await response?.json();
              return data;
            } catch (error) {
              console.error(error);
              throw error;
            } */
          }
        },
      })
    );
  }, []);

  return (
    <>
      {/* <div id="signInDiv" className=""></div> */}
      <button
        onClick={createEvento}
        className="text-[17px] cursor-pointer w-full font-Gotham text-center px-6 py-3 text-white rounded-full border-0 bg-[#780EFF]"
      >
        Crear recordatorio
      </button>
    </>
  );
};

export default GoogleCalendarAuthBtn;
