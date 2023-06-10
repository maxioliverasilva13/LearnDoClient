import clsx from "clsx";
import ClaseCard from "components/ClaseCard/ClaseCard";
import GlobalImage from "components/GlobalImage/GlobalImage";
import NoResults from "components/NotFoundPage/NoResults";
import { useWindowDimensions } from "hooks/useMediaQuery";
import { useEffect, useState } from "react";
import { loadSavedClases, storeItemOnIndexes } from "utils/indexesDb";

const SavedClases = () => {
  const [items, setItems] = useState([]);
  const [isChecking, setIsChecking] = useState(true);
  const { isMobile } = useWindowDimensions();

  const handleLoadItems = async () => {
    const response = await loadSavedClases();
    console.log("response", response);
    if (response?.length > 0) {
      setItems(response);
    }
    setIsChecking(false);
  };

  useEffect(() => {
    handleLoadItems();
  }, []);

  return (
    <div className="w-full h-auto md:mt-10 mt-5 md:px-20 px-5 flex flex-col items-center justify-start gap-4">
      <span className="w-full h-auto text-center text-white text-[30px] font-semibold">
        Clases Guardadas
      </span>

      {items?.length === 0 && !isChecking && (
        <NoResults message={"No se encontraron clases guardadas"} />
      )}

      <div className="w-full transition-all h-auto flex flex-row items-center justify-start flex-wrap gap-4">
        {items?.map((claseInfo) => {
          return (
            <div className={clsx(" transition-allh-auto flex md:flex-row flex-col items-center justify-center gap-2 p-4 bg-black bg-opacity-50 rounded-2xl",
                isMobile ? "w-full" : "w-[600px]"
            )}>
              <video
                className="max-w-[300px] transition-all md:mr-4 md:min-w-[300px] md:w-[300px] w-full min-w-full h-[250px] object-contain transition-all rounded-[20px]"
                controls
              >
                <source src={claseInfo?.video} type="video/mp4" />
              </video>
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavedClases;
