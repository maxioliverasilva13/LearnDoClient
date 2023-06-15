import clsx from "clsx";
import GlobalImage from "components/GlobalImage/GlobalImage";
import { useWindowDimensions } from "hooks/useMediaQuery";
import { useState } from "react";
import { BsTrashFill } from "react-icons/bs";

const SavedClaseItem = ({ claseInfo, onRemove }) => {
  const { isMobile } = useWindowDimensions();
  const [showVideo, setShowVideo] = useState(false);
  
  const [shouldHide, setShouldHide] = useState(false);

  const handleShouldHideItem = () => {
    setShouldHide(true);
    setTimeout(() => {
        setShouldHide(false)
        setShowVideo(true)
    }, [300])
  }

  return (
    <div
      className={clsx(
        " transition-allh-auto flex md:flex-row flex-col items-center justify-center gap-2 p-4 bg-black bg-opacity-50 rounded-2xl",
        isMobile ? "w-full" : "w-auto min-w-[600px] max-w-[600px]"
      )}
    >
      {showVideo ? <video
        className="max-w-[300px] animationMax md:mr-4 md:min-w-[300px] md:w-[300px] w-full min-w-full h-[250px] object-contain transition-all rounded-[20px]"
        controls
      >
        <source src={claseInfo?.video} type="video/mp4" />
      </video> :
      <div onClick={() => handleShouldHideItem()} className={clsx("max-w-[300px] flex items-center justify-center shadow-md cursor-pointer md:mr-4 itemGenerateVideo md:min-w-[300px] md:w-[300px] w-full min-w-full h-[250px] object-contain transition-all rounded-[20px]",
      shouldHide && "animationMin"
      )}>
        <span className="font-bold text-[20px] bg-opacity-50 text-white">Obtener video</span>
      </div>
      }
      <div className="w-full transition-all flex-grow h-auto flex flex-col md:items-start items-center md:mt-0 mt-5 mb-2 justify-start gap-2">
        <span className="text-white font-semibold text-[20px]">
          Nombre: {claseInfo?.nombre}
        </span>
        <span className="text-white font-medium text-[14px]">
          <div className="flex flex-row items-center justify-start gap-2">
            <div className="relative w-[30px] h-[30px] rounded-full overflow-hidden">
              <GlobalImage
                layout="fill"
                objectFit="cover"
                src={claseInfo?.cursoInfo?.imagen}
              />
            </div>
            <span>Curso: {claseInfo?.cursoInfo?.nombre}</span>
          </div>
        </span>
        <span className="text-white font-medium text-[14px]">
          Modulo: {claseInfo?.moduloInfo?.nombre || "No tiene"}
        </span>
        <span className="text-white font-medium text-[14px]">
          Duracion: 00:02
        </span>
        {/* <BsFillTrashFill color="red" /> */}
        <div
          onClick={onRemove}
          className="w-auto h-auto p-3 bg-[white] transition-all cursor-pointer transform hover:scale-110 rounded-full shadow-md my-2"
        >
          <BsTrashFill size={25} color="red" />
        </div>
      </div>
    </div>
  );
};

export default SavedClaseItem;
