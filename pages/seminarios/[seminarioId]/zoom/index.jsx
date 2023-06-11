import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import NotFoundPage from "components/NotFoundPage/NotFoundPage";
import useGlobalSlice from "hooks/useGlobalSlice";

import { useRouter } from "next/router";

import {
  useGetCompleteSeminarioInfoQuery
} from "store/services/EventoService";



const Zoom = () => {
  const router = useRouter();
  const { query } = router;
  const seminarioId = query?.seminarioId;

  const { data, isLoading } = useGetCompleteSeminarioInfoQuery({
    seminarioId
  });

  const [loadingZoom, setLoadingZoom ] = useState(true);
  const seminarioInfo = data?.seminario;

  const esComprado = data?.comprado;

  const { handleSetLoading, userInfo} = useGlobalSlice();


  useEffect(() => {
    if (seminarioInfo && esComprado) {
      const { link, zoomPass } = seminarioInfo;
      const meetingNumber  = link.split("/").pop();
      handleLoadZoom(meetingNumber,zoomPass);
    }else{
      setLoadingZoom(false);
    }
  }, [seminarioInfo,esComprado]);

  useEffect(() => {
    handleSetLoading(
      isLoading || loadingZoom
    );
  }, [isLoading, loadingZoom]);


  async function getSignature(meetingNumber,e) {
    // e.preventDefault();
    const authEndpoint = "http://localhost:4000";

    const response = await fetch(authEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        meetingNumber: meetingNumber,
        role: 0,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        return response;
        // startMeeting(response.signature)
      })
      .catch((error) => {
        console.error(error);
        return null;
      });
    if (response?.signature) {
      return response?.signature;
    }
    return null;
  }

  const handleLoadZoom = async (meetingNumber, zoomPass) => {
    const { ZoomMtg } = await import("@zoomus/websdk");

    ZoomMtg.setZoomJSLib('https://source.zoom.us/2.13.0/lib', '/av');
    // await ZoomMtg.setZoomJSLib("https://source.zoom.us/lib", "/av");
    await ZoomMtg.preLoadWasm();
    await ZoomMtg.prepareWebSDK();
    // ZoomMtg.setZoomJSLib("http://localhost:4000/node_modules/@zoomus/websdk/dist/lib", "/av");

    const signature = await getSignature(meetingNumber);
    setLoadingZoom(false);
    if (signature) {
      startMeeting(meetingNumber, zoomPass, signature, ZoomMtg);

    } else {
      toast.error("Error cargando zoom", {
        theme: "colored",
        delay: 5000,
      })
    }
  };

  function startMeeting(meetingNumber,zoomPass,signature, ZoomMtg) {
    document.getElementById('zmmtg-root').style.display = 'block'
    ZoomMtg.init({
      leaveUrl: "http://localhost:3000/",
      success: (success) => {
        ZoomMtg.join({
          signature: signature,
          sdkKey: "9wkmEojHQpmSAXBLrGl6xQ", 
          meetingNumber: meetingNumber,
          passWord: zoomPass,
          userName: userInfo?.nombre,
          userEmail: userInfo?.email,
          tk: '',
          zak: '',
          success: (success) => {
            console.log(success)
          },
          error: (error) => {
            console.log(error)
          }
        })

      },
      error: (error) => {
        console.log(error)
      }
    })
  }


 

 
  return ( 
    ( (!data?.ok || !esComprado) && !loadingZoom) && (   <NotFoundPage message="Seminario no encontrado" /> ) 

   )
};

export default Zoom;
