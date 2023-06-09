import React, { useState, Fragment, useEffect } from "react";

import { BsDownload } from "react-icons/bs";

import { Tooltip } from "react-tooltip";

import "react-tooltip/dist/react-tooltip.css";
import { useGetEventosAdminQuery } from "store/services/EventoService";
import useGlobalSlice from "hooks/useGlobalSlice";
import NoResults from "components/NotFoundPage/NoResults";
import GlobalImage from "components/GlobalImage/GlobalImage";
import Stars from "components/Stars/Stars";
import Link from "next/link";
import appRoutes from "routes/appRoutes";
import clsx from "clsx";
import { fomratColorCurso, formatTitle } from "utils/evento";

const BarraDeCarga = ({ porcentajeCarga, ancho, colorFondo }) => {
  return (
    <div className="flex flex-row h-auto w-auto">
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
  certificadoCurso,
  estudiantesCount = 0,
  stars,
  countPuntuaciones,
  tipo,
  es_pago,
  precio,
  countEstudiantes,
}) => {
  console.log(stars);
  console.log(tipo);
  return (
    <div
      className="md:h-72 w-4/5 flex flex-col md:flex-row bg-slate-900 bg-opacity-50 gap-5 justify-start items-center rounded-[12px] p-8"
      // style={{ backgroundColor: "#780EFF" }}
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
      <div className="w-full flex flex-grow h-auto flex-col justify-center md:justify-start items-center">
        {tipo === "curso" && (
          <div className="mb-4 w-full md:w-auto">
            <Stars
              stars={stars}
              countStars={countPuntuaciones}
              justifyStart={true}
              size={20}
              needsCount={true}
            />
          </div>
        )}

        <span className=" w-full md:w-auto max-w-full truncate overflow-hidden text-2xl text-white mb-4">
          {nombreCurso}
        </span>
        <span className=" text-base font-medium text-white w-full md:w-auto">
          {descripcionCurso}
        </span>
        {es_pago === 1 && (
          <>
            {tipo === "curso" && (
              <span className=" text-base font-medium text-white w-full md:w-auto">
                Estudiantes: {countEstudiantes}
              </span>
            )}
            <span className=" text-base font-medium text-white w-full md:w-auto">
              US$ {precio}
            </span>
          </>
        )}
        {/* <BarraDeCarga
          porcentajeCarga={porcentajeCurso}
          ancho={40}
          colorFondo={"white"}
        ></BarraDeCarga> */}
        <div className="flex md:flex-row flex-col md:gap-2 md:justify-start justify-center items-center md:mt-0 mt-5 w-full">
          {tipo === "curso" && (
            <>
              <Link href={appRoutes.cursoPage(eventoId)}>
                <span className="bg-indigo-700 shadow-md  cursor-pointer transition-all transform hover:scale-110 my-2 px-4 py-2 w-max text-white block rounded-full ">
                  Ver curso
                </span>
              </Link>
              <Link href={appRoutes.editCurso(eventoId)}>
                <span className="bg-indigo-700 shadow-md  cursor-pointer transition-all transform hover:scale-110 my-2 px-4 py-2 w-max text-white block rounded-full ">
                  Editar curso
                </span>
              </Link>
              <Link href={appRoutes.progresoEstudiantes(eventoId)}>
                <span className="bg-indigo-700 shadow-md  cursor-pointer transition-all transform hover:scale-110 my-2 px-4 py-2 w-max text-white block rounded-full ">
                  Progreso Estudiantes
                </span>
              </Link>
            </>
          )}
          {(tipo === "seminarioP" || tipo === "seminarioV") && (
            <Link href={appRoutes.seminarioPage(eventoId)}>
              <span className="bg-indigo-700 shadow-md  cursor-pointer transition-all transform hover:scale-110 my-2 px-4 py-2 w-max text-white block rounded-full ">
                Ver seminario
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default function MisCursos() {
  const { userInfo, handleSetLoading } = useGlobalSlice();
  const uid = userInfo?.id;
  const { data, isLoading } = useGetEventosAdminQuery(
    {
      organizadorId: uid,
    },
    {
      skip: !uid,
    }
  );
  const cursos = data?.cursos || [];
  const seminariosP = data?.seminariosP || [];
  const seminariosV = data?.seminariosV || [];

  useEffect(() => {
    handleSetLoading(isLoading);
  }, [isLoading]);

  return (
    <>
      <main className="miscursos_page lg:px-10 px-5 py-10 w-full h-full flex flex-col gap-4 items-center min-h-screen">
        <div className="w-full flex flex-col justify-center">
          <p className="m-auto text-5xl text-white font-medium">
            Mis Eventos (Admin)
          </p>
        </div>
        <div className="w-full flex md:px-36 md:justify-start justify-center gap-5">
          <Link href={appRoutes.createCurso()}>
            <span className="bg-indigo-700 shadow-md cursor-pointer transition-all transform hover:scale-105 my-2 px-6 py-2 w-max text-xl text-white block rounded-full ">
              Crear Curso
            </span>
          </Link>
          <Link href={appRoutes.createSeminario()}>
            <span className="bg-indigo-700 shadow-md cursor-pointer transition-all transform hover:scale-110 my-2 px-6 py-2 w-max text-xl text-white block rounded-full ">
              Crear Seminario
            </span>
          </Link>
        </div>
        {cursos?.length === 0 &&
          !isLoading &&
          seminariosV?.length === 0 &&
          !isLoading &&
          seminariosP?.length === 0 &&
          !isLoading && <NoResults message={"No se encontraron eventos."} />}
        {cursos?.map((curso, index) => {
          return (
            <Tarjeta
              key={index}
              nombreCurso={curso?.nombre}
              descripcionCurso={curso?.descripcion}
              porcentajeCurso={"10"}
              imagenCurso={curso?.imagen}
              {...curso}
            ></Tarjeta>
          );
        })}
        {seminariosP?.map((seminarioP, index) => {
          return (
            <Tarjeta
              key={index}
              nombreCurso={seminarioP?.nombre}
              descripcionCurso={seminarioP?.descripcion}
              porcentajeCurso={"10"}
              imagenCurso={seminarioP?.imagen}
              {...seminarioP}
            ></Tarjeta>
          );
        })}
        {seminariosV?.map((seminarioV, index) => {
          return (
            <Tarjeta
              key={index}
              nombreCurso={seminarioV?.nombre}
              descripcionCurso={seminarioV?.descripcion}
              porcentajeCurso={"10"}
              imagenCurso={seminarioV?.imagen}
              {...seminarioV}
            ></Tarjeta>
          );
        })}
      </main>
    </>
  );
}
