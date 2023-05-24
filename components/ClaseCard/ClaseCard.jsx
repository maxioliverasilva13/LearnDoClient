import clsx from "clsx";
import moment from "moment";
import { useRef, useState } from "react";

const ClaseCard = ({ clase }) => {
  const videoRef = useRef(null);
  const [duration, setDuration] = useState(0);
  console.log(videoRef?.current?.duration);

  const handleSetDuration = () => {
    if (videoRef?.current) {
        const seconds = videoRef?.current?.duration;
        const newDuration = moment.utc(seconds*1000).format('HH:mm:ss');
        setDuration(newDuration || 0);
      }
      
  }

  return (
    <div
      className={clsx(
        "md:w-[90%] cursor-pointer transition-all hover:bg-[#d9d9d94b] relative bg-opacity-50 rounded-[12px] h-[200px] p-4 flex flex-row items-start justify-start"
      )}
    >
      <div className="md:w-[50%] min-w-[50%] h-full relative rounded-lg overflow-hidden">
        <video
          onLoadedMetadata={handleSetDuration}
          ref={videoRef}
          src={clase?.video}
          controls={false}
          className="w-full h-full overflow-hidden object-cover"
        />
      </div>
      <div className="mx-5 h-full w-[3px] bg-[#780EFF]" />
      <div className="flex-grow h-full flex flex-col items-center justify-between">
        <div className="w-full flex flex-col gap-1">
          <span className="w-auto text-[16px] text-left max-w-full font-semibold text-white ">
            {clase.nombre}
          </span>
          <span className="w-auto text-[14px] text-left max-w-full font-medium text-white ">
            {clase.descripcion}
          </span>
        </div>
        <span className="w-full text-[14px] my-4 text-left max-w-full font-semibold text-white ">
          Duracion: {duration}
        </span>
      </div>
    </div>
  );
};

export default ClaseCard;
