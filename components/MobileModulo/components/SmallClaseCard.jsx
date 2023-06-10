import moment from "moment";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import appRoutes from "routes/appRoutes";
import { BiDownload } from "react-icons/bi";
import { storeItemOnIndexes } from "utils/indexesDb";
import { useLazyGetBase64OfVideoQuery } from "store/services/VideoService";
import useGlobalSlice from "hooks/useGlobalSlice";
import { toast } from "react-toastify";


const SmallClaseCard = ({ item, cursoId, esComprada, cursoInfo, moduloInfo }) => {
  const videoRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [getBase64Video, { isLoading }] = useLazyGetBase64OfVideoQuery();

  const { handleSetLoading } = useGlobalSlice();

  useEffect(() => {
    handleSetLoading(isLoading)
  }, [isLoading])

  const handleSetDuration = () => {
    if (videoRef?.current) {
      const seconds = videoRef?.current?.duration;
      const newDuration = moment.utc(seconds * 1000).format("HH:mm:ss");
      setDuration(newDuration || 0);
    }
  };

  const handleStorageInIndexDb = async () => {
    const response = await getBase64Video({
      claseId: item?.id,
    });
    console.log("response", response)
    if (response?.data?.url) {
     const itemsToSend = {
       id: item?.id,
       nombre: item?.nombre,
       video: response?.data?.url,
       cursoId: cursoInfo?.id,
       cursoInfo: cursoInfo,
       moduloInfo: moduloInfo,
     };
     storeItemOnIndexes(itemsToSend);
     toast.success("Curso guardado correctamente", {
      theme: "colored",
    })
    } else {
      toast.error("Error descargando video", {
        theme: "colored",
      })
    }
    // console.log(videoRef?.current)
    // const itemsToSend = {
    //   id: item?.id,
    //   nombre: item?.nombre,
    //   video: videoRef?.current,
    //   cursoId: cursoInfo?.id,
    //   cursoInfo: cursoInfo,
    // };
    // storeItemOnIndexes(itemsToSend);
  };

  return (
    <div className="w-full relative h-auto p-4 flex flex-row items-center justify-start gap-4">
      <div className="md:w-[150px] md:h-[150px] md:min-w-[150px] min-w-[100px] w-[100px] h-[100px] relative rounded-[20px] overflow-hidden">
        <video
          onLoadedMetadata={handleSetDuration}
          ref={videoRef}
          src={item?.video}
          controls={false}
          className="w-full h-full overflow-hidden object-cover"
        />
      </div>
      <div className="w-full flex-grow flex flex-col items-start justify-center">
        <span className="text-white font-bold text-base mb-2">
          Nombre: {item?.nombre}
        </span>
        <span className="text-white font-medium text-base max-w-full overflow-hidden truncate">
          Descripcion: {item?.descripcion}
        </span>
        <span className="text-white text-sm font-medium">
          Duracion: {duration}
        </span>
      </div>
      <Link href={appRoutes.clasePage(item?.id, cursoId)}>
        <AiFillPlayCircle className="cursor-pointer" color="white" size={50} />
      </Link>

      <div
        onClick={() => handleStorageInIndexDb()}
        className="absolute cursor-pointer md:right-5 right-4 md:bottom-5 bottom-2"
      >
        {esComprada && <BiDownload color="white" size={30} className="" />}
      </div>
    </div>
  );
};

export default SmallClaseCard;
