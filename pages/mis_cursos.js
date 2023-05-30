import React, { useState, Fragment, useEffect } from "react";

import Navbar from "components/Navbars/AdminNavbar.js";

import { BsDownload } from "react-icons/bs";

import { Tooltip } from "react-tooltip";

import "react-tooltip/dist/react-tooltip.css";
import { useGetCursosCompradosQuery } from "store/services/EventoService";
import useGlobalSlice from "hooks/useGlobalSlice";
import NoResults from "components/NotFoundPage/NoResults";
import GlobalImage from "components/GlobalImage/GlobalImage";
import Stars from "components/Stars/Stars";
import Link from "next/link";
import appRoutes from "routes/appRoutes";

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
      <a className="text-white ml-1">{porcentajeCarga}%</a>
    </div>
  );
};

const Tarjeta = ({
  id: cursoId,
  imagenCurso,
  nombreCurso,
  descripcionCurso,
  porcentajeCurso,
  certificadoCurso,
  estudiantesCount = 0,
  starts,
  countPuntuaciones
}) => {

  console.log(starts)
  return (
    <div
      className="h-72 w-4/5 flex bg-slate-900 bg-opacity-50 flex-row gap-5 justify-start items-center rounded-[12px] px-8"
      // style={{ backgroundColor: "#780EFF" }}
    >
      <div className="h-48 w-48 min-w-[192px] rounded-md relative">
        <GlobalImage
          src={imagenCurso}
          className="rounded-[14px]"
          objectFit="cover"
          layout="fill"
        />
      </div>
      <div className="w-auto flex-grow h-auto flex flex-col justify-start">
          <div className=" mb-4">
          <Stars stars={starts} countStars={countPuntuaciones} justifyStart={true} size={20} needsCount={true} />
          </div>
          
          <span className=" w-full max-w-full truncate overflow-hidden text-2xl text-white mb-4">{nombreCurso}</span>
          <span className=" text-base font-medium text-white w-[473px]">
            {descripcionCurso}
          </span>
          <span className=" text-base font-medium text-white w-[473px]">
            Estudiantes: {estudiantesCount}
          </span>
        <BarraDeCarga
          porcentajeCarga={porcentajeCurso}
          ancho={40}
          colorFondo={"white"}
        ></BarraDeCarga>
        <Link href={appRoutes.cursoPage(cursoId)}>
          <span className="bg-indigo-700 shadow-md  cursor-pointer transition-all transform hover:scale-110 my-2 px-4 py-2 w-max text-white block rounded-full ">
            Ver curso
          </span>
        </Link>
      </div>
      <div>
        <button
          data-tooltip-id="my-tooltip"
          data-tooltip-content="Descargar Certificado"
          data-tooltip-place="top"
        >
          <BsDownload size={30} color="white"></BsDownload>
        </button>
        <Tooltip id="my-tooltip" clickable />
      </div>
    </div>
  );
};

export default function MisCursos() {
  const [showModal, setShowModal] = useState(false);
  const { userInfo, handleSetLoading } = useGlobalSlice();
  const uid = userInfo?.id;
  const { data, isLoading } = useGetCursosCompradosQuery(
    {
      estudianteId: uid,
    },
    {
      skip: !uid,
    }
  );
  const cursos = data?.cursos || [];

  useEffect(() => {
    handleSetLoading(isLoading);
  }, [isLoading])

  return (
    <>
      <main className="miscursos_page lg:px-10 px-5 py-10 w-full h-full flex flex-col gap-4 items-center min-h-screen">
        <div className="w-full flex flex-col justify-center mb-8">
          <a className="ml-20 text-5xl text-white font-medium">Mis Eventos</a>
        </div>
        {
          cursos?.length === 0 && !isLoading ? <NoResults message={"No se encontraron cursos"} />:
          cursos?.map((curso) => {
            return (<Tarjeta
              nombreCurso={curso?.nombre}
              descripcionCurso={curso?.descripcion}
              porcentajeCurso={"10"}
              imagenCurso={curso?.imagen}
              {...curso}
            ></Tarjeta>)
          })          
        }
        
      </main>
    </>
  );
}
