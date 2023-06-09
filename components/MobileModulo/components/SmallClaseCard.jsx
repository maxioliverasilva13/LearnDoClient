import moment from "moment";
import Link from "next/link";
import { useRef, useState } from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import appRoutes from "routes/appRoutes";

const SmallClaseCard = ({item, cursoId}) => {
    const videoRef = useRef(null);
    const [duration, setDuration] = useState(0);
  
    const handleSetDuration = () => {
      if (videoRef?.current) {
          const seconds = videoRef?.current?.duration;
          const newDuration = moment.utc(seconds*1000).format('HH:mm:ss');
          setDuration(newDuration || 0);
        }
        
    }

  return (
    <div className="w-full h-auto p-4 flex flex-row items-center justify-start gap-4">
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
    </div>
  );
};

export default SmallClaseCard;
