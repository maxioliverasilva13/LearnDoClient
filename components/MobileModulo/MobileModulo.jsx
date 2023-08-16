import clsx from "clsx";
import NoResults from "components/NotFoundPage/NoResults";
import { useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { AiFillCheckCircle, AiFillPlayCircle } from "react-icons/ai";
import Link from "next/link";
import appRoutes from "routes/appRoutes";
import SmallClaseCard from "./components/SmallClaseCard";
import PuntuacionText from "components/PuntuacionText/PuntuacionText";
import CreateEvaluacionModal from "components/Modals/CreateEvaluacionModal";

const MobileModulo = ({
  evaluacionId,
  calificacion,
  nombre,
  clases,
  id,
  cursoId,
  esComprada,
  cursoInfo,
}) => {
  const [isExpanded, setisExpanded] = useState(false);
  const [evaluacionToDo, setEvaluacionToDo] = useState(null);

  return (
    <div className="w-full h-auto relative">
      <CreateEvaluacionModal
        evaluacionId={evaluacionToDo}
        isOpen={evaluacionToDo !== null}
        setIsOpen={() => setEvaluacionToDo(null)}
        isEditing={false}
      />
      <div className="w-full h-auto flex flex-row items-center justify-start gap-2 bg-[#4444] rounded-[16px] p-5">
        <div className="w-full flex-grow h-auto flex flex-col items-start justify-start gap-1 text-white ">
          <span className="text-[18px] font-bold">{nombre}</span>
          <span className="text-[16px] font-medium">
            {clases?.length > 0
              ? `Clases: ${clases?.length}`
              : "Este modulo no tiene clases"}
          </span>
        </div>
        <BiChevronDown
          onClick={() => setisExpanded(!isExpanded)}
          size={30}
          className={clsx(
            "cursor-pointer select-none transition-all transform ",
            isExpanded && "rotate-180"
          )}
          color="white"
        />
      </div>
      <div className="w-full relative">
        <div
          className={clsx(
            " w-full mt-2 flex flex-col items-center justify-start rounded-[16px] px-4 gap-2 overflow-hidden transition-all bg-[#4444]",
            !isExpanded ? "h-0" : "h-auto itemExpanded py-2"
          )}
        >
          {clases?.length === 0 && (
            <span className="w-full py-4 h-auto m-auto text-center text-white px-5 flex flex-col gap-5">
              No se encontraron clases <NoResults customSizes="w-[100px]" />
            </span>
          )}

          {clases?.map((item) => {
            return (
              <SmallClaseCard
                moduloInfo={{
                  nombre: nombre,
                }}
                esComprada={esComprada}
                cursoInfo={cursoInfo}
                item={item}
                cursoId={cursoId}
              />
            );
          })}

          <div className="w-full my-4 h-auto flex items-center justify-start">
            {evaluacionId && esComprada && (
              <div className="w-full flex items-center flex-col gap-2 justify-center">
                {calificacion > 0 && (
                  <div className="flex flex-row items-center gap-1">
                    <AiFillCheckCircle className="text-green-500 text-[18px]" />
                    <span className="text-white font-medium">
                      Calificacion en este modulo:{" "}
                      <PuntuacionText puntuacion={calificacion} />
                    </span>
                  </div>
                )}
                <span
                  onClick={() => setEvaluacionToDo(evaluacionId)}
                  className="text-[20px] cursor-pointer w-[260px] font-Gotham text-center py-3 text-white rounded-full border-0 bg-[#78A132]"
                >
                  {calificacion === 0
                    ? "Realizar evaluacion"
                    : "Rehacer evaluacion"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileModulo;
