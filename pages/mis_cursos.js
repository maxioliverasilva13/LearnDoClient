import React, { useState, Fragment, useEffect } from "react";

import { BsDownload } from "react-icons/bs";

import { Tooltip } from "react-tooltip";

import "react-tooltip/dist/react-tooltip.css";
import { useGetEventosCompradosQuery} from "store/services/EventoService";
import useGlobalSlice from "hooks/useGlobalSlice";
import NoResults from "components/NotFoundPage/NoResults";
import GlobalImage from "components/GlobalImage/GlobalImage";
import Stars from "components/Stars/Stars";
import Link from "next/link";
import appRoutes from "routes/appRoutes";
import clsx from "clsx";
import { fomratColorCurso, formatTitle } from "utils/evento";
import { generateColorProggress } from "utils/color";


const BarraDeCarga = ({ porcentajeCarga, ancho, colorFondo, colorPorcentaje }) => {
  return (
    <div className="flex lg:flex-row flex-col gap-2 items-center justify-center lg:justify-start h-auto lg:w-full w-[100%]">
      <div
        className="rounded-full h-2.5 dark:bg-gray-700 border-[1px] border-white mt-2"
        style={{ width: `${ancho}%` }}
      >
        <div
          className="h-full rounded-l-full"
          
          style={{
            width: `${porcentajeCarga}%`,
            backgroundColor: `${colorFondo}`,
          }}
        ></div>
      </div>
      <p className="text-white ml-1">{porcentajeCarga}%</p>
    </div>
  );
};

const Tarjeta = ({
  id: eventoId,
  imagenCurso,
  nombreCurso,
  descripcionCurso,
  porcentajeCurso,
  porcentaje_aprobacion,
  certificateID,
  estudiantesCount = 0,
  stars,
  countPuntuaciones,
  tipo,
  es_pago,
  precio,
  countEstudiantes,
}) => {
  
  const bgProgressClass = generateColorProggress(porcentaje_aprobacion, porcentajeCurso);

  return (
    <div
      className="lg:h-72 w-4/5 flex flex-col lg:flex-row bg-[#4444] shadow-md gap-5 justify-start items-center rounded-[12px] p-8"
      // style={{ backgroundColor: "#78A132" }}
    >
      <div className="h-48 w-48 min-h-48 min-w-[192px] rounded-md relative">
        <div
          className={clsx(
            "w-min  absolute z-[20] left-0 top-4 px-4 py-1 font-semibold text-white text-xs max-w-full truncate rounded-r-md ",
            `bg-[${fomratColorCurso(tipo)}]`
          )}
        >
          {formatTitle(tipo)}
        </div>
        <GlobalImage
          src={imagenCurso}
          className="rounded-[14px]"
          objectFit="cover"
          layout="fill"
        />
      </div>
      <div className="w-full flex-grow h-auto flex flex-col justify-center lg:justify-start lg:items-start items-center">
        {tipo === "curso" && (
          <div className="mb-4 w-full">
            <Stars
              stars={stars}
              countStars={countPuntuaciones}
              justifyStart={true}
              size={20}
              needsCount={true}
            />
          </div>
        )}

        <span className="lg:w-full truncate overflow-hidden text-2xl text-white mb-4">
          {nombreCurso}
        </span>
        <span className=" text-base font-medium text-white lg:w-full">
          {descripcionCurso}
        </span>
        {es_pago === 1 && (
          <>
            {tipo === "curso" && (
              <span className=" text-base font-medium text-white lg:w-full">
                Estudiantes: {countEstudiantes}
              </span>
            )}
            <span className=" text-base font-medium text-white lg:w-full">
              USD$ {precio}
            </span>
          </>
        )}
        {tipo === "curso" && <BarraDeCarga
          porcentajeCarga={porcentajeCurso}
          ancho={40}
          colorFondo={bgProgressClass}
        ></BarraDeCarga> }
        <div className="flex flex-col lg:flex-row lg:items-start items-center sm:gap-2 w-full">
          {tipo === "curso" && (
            <>
              <Link href={appRoutes.cursoPage(eventoId)}>
                <span className="bgPrincipal shadow-md  cursor-pointer transition-all transform hover:scale-110 my-2 px-4 py-2 w-max text-white block rounded-full ">
                  Ver curso
                </span>
              </Link>
              
            </>
          )}
          {(tipo === "seminarioP" || tipo === "seminarioV") && (
            <Link href={appRoutes.seminarioPage(eventoId)}>
              <span className="bgPrincipal shadow-md  cursor-pointer transition-all transform hover:scale-110 my-2 px-4 py-2 w-max text-white block rounded-full ">
                Ver seminario
              </span>
            </Link>
          )}
        </div>

      </div>
      <div>

        {
          certificateID && (
            <button
            data-tooltip-id="my-tooltip"
            data-tooltip-content="Descargar Certificado"
            data-tooltip-place="top"
          >
            <BsDownload size={30} color="white"></BsDownload>
          </button>
          )
        }

       
        <Tooltip id="my-tooltip" clickable />
      </div>
    </div>
  );
};

export default function MisCursos() {
  const { userInfo, handleSetLoading } = useGlobalSlice();
  const uid = userInfo?.id;
  const { data, isLoading } = useGetEventosCompradosQuery();
  const eventos = data?.eventos || [];

  

  useEffect(() => {
    handleSetLoading(isLoading);
  }, [isLoading]);

  return (
    <>
      <main className="miscursos_page lg:px-10 px-5 py-10 w-full h-full flex flex-col gap-4 items-center min-h-screen">
        <div className="w-full flex flex-col justify-center">
          <p className="m-auto text-5xl text-white font-medium">
            Mis Eventos
          </p>
        </div>
        
        {eventos?.length === 0 &&
          !isLoading &&
        <NoResults message={"No se encontraron eventos."} />}

        {eventos?.map((evento, index) => {
          return (
            <Tarjeta
              key={index}
              nombreCurso={evento?.nombre}
              descripcionCurso={evento?.descripcion}
              porcentajeCurso={evento?.porcentajeCurso}
              imagenCurso={evento?.imagen}
              
              {...evento}
            ></Tarjeta>
          );
        })}
      
      </main>
    </>
  );
}
