import NotFoundPage from "components/NotFoundPage/NotFoundPage";
import useGlobalSlice from "hooks/useGlobalSlice";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useGetClaseInfoQuery } from "store/services/ClaseService";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });


const ClaseInfo = () => {
  const router = useRouter();
  const claseId = router?.query?.claseId;
  const cursoId = router?.query?.cursoId;
  const { handleSetLoading } = useGlobalSlice();
  const skip = !claseId || !cursoId;
  const { data, isLoading } = useGetClaseInfoQuery({
    cursoId,
    claseId
  }, {
    skip: skip,
  })

  console.log("data is", data)

  useEffect(() => {
    handleSetLoading(isLoading);
  }, [isLoading])

  const claseInfo = data?.clase;
  if (data?.ok === false) {
    return <NotFoundPage message="Clase no encontrada" />
  }

  return (
      <main className="videoPlayer min-w-screen min-h-screen flex relative flex-col items-center">
        <div className="w-full h-[450px] claseGradient z-[10] relative ">
        <div className="w-auto p-4 text-white font-semibold text-[24px]">
          Curso: {data?.cursoName}
        </div>
        <div className="h-[853px] z-[20] top-[30%] absolute w-full flex flex-col justify-start items-center mb-7">
          <span className="ml-[44px] text-4xl text-white font-semibold">
            {data?.moduloName} : {claseInfo?.nombre}
          </span>
          <div className="h-[400px] w-[800px] mt-4">
            {
              claseInfo && <ReactPlayer
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "14px",
                overflow: "hidden",
                background: "black",
                border: "none"
              }}
              url={
                claseInfo?.video
              }
              controls
              className="h-full w-full"
            />
            }
          </div>
        </div>
        </div>
        
      </main>
  );
}

export default ClaseInfo;