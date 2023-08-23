import moment from "moment";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import appRoutes from "routes/appRoutes";
import { BiDownload } from "react-icons/bi";
import { get_url_extension, storeItemOnIndexes } from "utils/indexesDb";
import { useLazyGetBase64OfVideoQuery } from "store/services/VideoService";
import useGlobalSlice from "hooks/useGlobalSlice";
import { toast } from "react-toastify";
import clsx from "clsx";
import { useWindowDimensions } from "hooks/useMediaQuery";
import { baseUrl } from "store/baseQueryWithError";
import NoImage from "components/NoImage/NoImage";

const SmallClaseCard = ({
  item,
  cursoId,
  esComprada,
  cursoInfo,
  moduloInfo,
}) => {
  const videoRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [getBase64Video, { isLoading }] = useLazyGetBase64OfVideoQuery();
  const { isMobile } = useWindowDimensions();

  const { handleSetLoading } = useGlobalSlice();

  useEffect(() => {
    handleSetLoading(isLoading);
  }, [isLoading]);

  const handleSetDuration = () => {
    if (videoRef?.current) {
      const seconds = videoRef?.current?.duration;
      const newDuration = moment.utc(seconds * 1000).format("HH:mm:ss");
      setDuration(newDuration || 0);
    }
  };

  const handleStorageInIndexDb = async () => {
    const video = item?.video;

    handleSetLoading(true);
    fetch(`${baseUrl}/api/videos/getBase64OfVideo?claseId=${item?.id}`)
      .then((res) => {
        console.log("xd1");
        console.log(res);
        return res.blob();
      }) // Gets the response and returns it as a blob
      .then((blob) => {
        handleSetLoading(false);
        console.log("blob is", blob);
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function() {
          var base64data = reader.result;

          const itemsToSend = {
            id: item?.id,
            nombre: item?.nombre,
            video: base64data,
            cursoId: cursoInfo?.id,
            cursoInfo: cursoInfo,
            moduloInfo: moduloInfo,
            type: get_url_extension(video, "video"),
          };
          storeItemOnIndexes(itemsToSend);
          toast.success("Curso guardado correctamente", {
            theme: "colored",
          });
        };
      })
      .catch((err) => {
        console.log("xd2");
        handleSetLoading(false);
      });

    // const response = await getBase64Video({
    //   claseId: item?.id,
    // });
    // console.log("response", response);
    // if (response?.data?.url) {
    //   const itemsToSend = {
    //     id: item?.id,
    //     nombre: item?.nombre,
    //     video: response?.data?.url,
    //     cursoId: cursoInfo?.id,
    //     cursoInfo: cursoInfo,
    //     moduloInfo: moduloInfo,
    //     type: response?.data?.type,
    //   };
    //   storeItemOnIndexes(itemsToSend);
    //   toast.success("Curso guardado correctamente", {
    //     theme: "colored",
    //   });
    // } else {
    //   toast.error("Error descargando video", {
    //     theme: "colored",
    //   });
    // }
  };

  return (
    <div className="w-full relative h-auto p-4 flex sm:flex-row flex-col items-center justify-start gap-4">
      <div className="md:w-[150px] md:h-[150px] md:min-w-[150px] min-w-[100px] w-[100px] h-[100px] relative rounded-[20px] overflow-hidden">
        {/* <video
          onLoadedMetadata={handleSetDuration}
          ref={videoRef}
          src={item?.video}
          controls={false}
          className="w-full h-full overflow-hidden object-cover"
        /> */}
        <NoImage />
      </div>
      <div
        className={clsx(
          "w-full flex-grow flex flex-col justify-center",
          isMobile ? "items-center" : "items-start"
        )}
      >
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
      <div className="w-auto flex flex-row items-center justify-start gap-4">
        <Link href={appRoutes.clasePage(item?.id, cursoId)}>
          <AiFillPlayCircle
            className="cursor-pointer"
            color="white"
            size={50}
          />
        </Link>

        <div
          onClick={() => handleStorageInIndexDb()}
          className={clsx(
            "cursor-pointer",
            isMobile ? "relative" : "  md:right-5 right-4 md:bottom-5 bottom-2"
          )}
        >
          {esComprada && <BiDownload color="white" size={30} className="" />}
        </div>
      </div>
    </div>
  );
};

export default SmallClaseCard;
