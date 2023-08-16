import React, { useState } from "react";
import googleConfig from "pages/api/google-auth";
import { useEffect } from "react";
import useCreateCalendarEvent from "hooks/useCreateCalendarEvent";
import { toast } from "react-toastify";

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
  const { handleCreateEvent } = useCreateCalendarEvent();


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

            await handleCreateEvent(tokenResponse.access_token, eventData).then(() => {
              toast.success("Recordatorio creado correctamente.", {
                theme: "colored"
              })
            }).catch((error) => {
              console.log("error al crear el recordatorio en google calendar", error)
              toast.error("Error al crear el recordatorio.", {
                theme: "colored",
                delay: 5000,
              })
            });
          }
        },
      })
    );
  }, []);

  return (
    <>
      <button
        onClick={createEvento}
        className="cursor-pointer w-full font-Gotham text-center px-6 py-3 text-white rounded-full border-0 bgPrincipal text-lg"
      >
        Crear recordatorio
      </button>
    </>
  );
};

export default GoogleCalendarAuthBtn;
