
import React, {useEffect} from 'react';




const Zoom = () =>{
     

    useEffect(async()=>{
      const { ZoomMtg }  = await import("@zoomus/websdk");

      ZoomMtg.setZoomJSLib("https://source.zoom.us/lib","/av");
      ZoomMtg.preLoadWasm();
      ZoomMtg.prepareWebSDK();

      ZoomMtg.generateSDKSignature({
        meetingNumber:  85698288075,
        sdkKey: "C9OghTLySei5MMdwTsCgYQ",
        sdkSecret: "LkKjicBLpw8yRHLQdsXhUUOlKO6YlZdK",
        role: 0,
        success: async function(signature){
            ZoomMtg.init({
                leaveUrl: "http://localhost:3000/", 
                success: function(data){
                  ZoomMtg.join({
                    meetingNumber: 85698288075,
                    signature: signature.result,
                    userName: "Testing",
                    sdkKey: "C9OghTLySei5MMdwTsCgYQ", 
                    userEmail: "",
                    passWord: "7hUq14",
                    tk: '',
                    success: function(){
                        console.log("--joined---"); 
                    },
                    error: function(error){
                      console.log(error)
                    }
                  })
                }
            })
        },

        error: function(error){
          console.log(error);
        }
      })

    },[]);

    return ( <h1>Meeting will be here</h1>)
}

export default Zoom;

