import useGlobalSlice from "hooks/useGlobalSlice";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Zoom = () => {
  const [zoomMtgInstance, setZoomMtgInstace] = useState(null);
  const { userInfo } = useGlobalSlice();
  
  async function getSignature(e) {
    // e.preventDefault();
    const authEndpoint = "http://localhost:4000";

    const response = await fetch(authEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        meetingNumber: 77707848694,
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

  const handleLoadZoom = async () => {
    const { ZoomMtg } = await import("@zoomus/websdk");

    ZoomMtg.setZoomJSLib('https://source.zoom.us/2.13.0/lib', '/av');
    // await ZoomMtg.setZoomJSLib("https://source.zoom.us/lib", "/av");
    await ZoomMtg.preLoadWasm();
    await ZoomMtg.prepareWebSDK();
    // ZoomMtg.setZoomJSLib("http://localhost:4000/node_modules/@zoomus/websdk/dist/lib", "/av");


    const signature = await getSignature();
    if (signature) {
    startMeeting(signature, ZoomMtg);

    } else {
      toast.error("Error cargando zoom", {
        theme: "colored",
        delay: 5000,
      })
    }
  };

  function startMeeting(signature, ZoomMtg) {
    document.getElementById('zmmtg-root').style.display = 'block'
    console.log(ZoomMtg)
    ZoomMtg.init({
      leaveUrl: "http://localhost:3000/",
      success: (success) => {
        console.log(success)

        ZoomMtg.join({
          signature: signature,
          sdkKey: "B_jTenOR5Ovl9KNWo4Qeg",
          meetingNumber: 77707848694,
          passWord: "HyPD2a",
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

  useEffect(() => {
    handleLoadZoom();
  }, []);

  return <h1>Meeting will be here</h1>;
};

export default Zoom;
