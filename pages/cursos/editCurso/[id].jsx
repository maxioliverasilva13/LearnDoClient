import useGlobalSlice from "hooks/useGlobalSlice";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useGetCompleteCursoInfoQuery, useUpdateStatusSugerenciaMutation } from "store/services/EventoService";
import CreateCurso from "../createCurso";
import { formatClases, formatModulosFromDB } from "utils/modulos";
import NotFoundPage from "components/NotFoundPage/NotFoundPage";
import GlobalImage from "components/GlobalImage/GlobalImage";
import clsx from "clsx";
import { SugerenciaType, formatSugerenciaColor, formatSugerenciaText } from "utils/evento";
import AddModuloModal from "components/Modals/AddModuloModal";
import { MdOutlineDone } from 'react-icons/md';
import { MdClose } from 'react-icons/md';

export default function EditCurso() {
  const router = useRouter();
  const { query } = router;
  const cursoId = query?.id;
  const { handleSetLoading } = useGlobalSlice();
  const [selectedInfoSugerencia, setSelectedInfoSugerencia] = useState(null);
  const [updateStatus, { isLoading : isLoadingChangeStatus }] = useUpdateStatusSugerenciaMutation();

  const { data, isLoading } = useGetCompleteCursoInfoQuery(
    { cursoId, withDetails: true },
    {
      skip: !cursoId,
    }
  );

  const cursoInfo = data?.curso;
  const categorias = data?.categorias;
  const modulos = formatModulosFromDB(data?.modulos);
  const colaboradores = data?.colaboradores || [];
  const sugerencias = data?.sugerencias || [];

  useEffect(() => {
    handleSetLoading(isLoading || isLoadingChangeStatus);
  }, [isLoading, isLoadingChangeStatus]);

  const handleChangeStatus = async (newStatus, sugerenciaId) => {
    const response = await updateStatus({
      sugerencia_id: sugerenciaId,
      status: newStatus,
    })
    if (response?.data?.ok) {
      // show modal?
    }
  }

  if (isLoading) {
    return null;
  }

  if (!cursoInfo) {
    return <NotFoundPage />;
  }

  
  return (
    <div className="w-full h-auto flex flex-col items-center justify-start gap-10">
      <AddModuloModal
        open={selectedInfoSugerencia !== null}
        setIsOpen={() => setSelectedInfoSugerencia(null)}
        setModulos={() => null}
        moduloName={selectedInfoSugerencia?.nombre}
        clases={formatClases(selectedInfoSugerencia?.clases)}
        estaSugiriendo={true}
        isSugerenciaShow={true}
      />
      <CreateCurso
        isEdit={true}
        colaboradoresOfCurso={colaboradores}
        modulosOfCurso={modulos}
        cursoInfo={cursoInfo}
        categoriasOfCurso={categorias}
      />

      {sugerencias && sugerencias?.length > 0 && (
        <div className="w-full h-auto flex flex-col gap-4 px-10">
          <span className="text-white font-semibold text-[30px]">
            Sugerencias
          </span>
          
          <div className="flex w-full h-auto gap-4 flex-row items-center justify-center sm:justify-start flex-wrap">
          {sugerencias?.map((item) => {
            return (
              <div className="w-[450px] max-w-[450px] h-[450px] bg-black transition-all bg-opacity-50 rounded-lg py-4 px-6 flex flex-row items-start justify-center">
                <div className="flex flex-col max-w-[250px] w-full gap-4 items-start justify-start">
                  <span className="text-white font-medium text-[20px]">
                    Colaborador:
                  </span>
                  <div className="flex flex-row gap-2 w-auto items-start justify-start">
                    <div className="relative w-[70px] h-[70px] rounded-full overflow-hidden">
                      <GlobalImage
                        src={item?.userInfo?.imagen}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <div className="flex flex-col max-w-[300px] items-start justify-start gap-1">
                      <span className="text-sm truncate max-w-full text-white">
                        Nombre:{item?.userInfo?.nombre}
                      </span>
                      <span className="text-sm truncate max-w-full text-white">
                        Nickname:{item?.userInfo?.nickname}
                      </span>
                      <span className="text-sm truncate max-w-full text-white">
                        Email:{item?.userInfo?.email}
                      </span>
                    </div>
                  </div>
                  <span className="text-white font-medium text-[20px]">
                    Descripcion:
                  </span>
                  <span className="w-full h-auto max-h-[120px] truncate overflow-hidden text-white">
                  {item?.contenido}
                  </span>
                  <span className="text-white font-medium text-[20px]">
                    Modulos sugeridos:
                  </span>
                  <div className="w-full h-auto flex flex-row items-center justify-start flex-wrap">
                  {item?.modulos?.map((modulo, index) => {
                    return <span onClick={() => setSelectedInfoSugerencia(modulo)} className="text-yellow-300 cursor-pointer transition-all mb-1 border-b border-transparent hover:border-[#78A132] font-medium text-lg">
                      {modulo?.nombre}
                      {index + 1 !== item?.modulos?.length && ", "}
                    </span>
                  })}
                  </div>
                  <div className="flex min-h-full h-full w-full flex-grow">

                  </div>
                  {
                    item?.estado === "pendiente" &&
                    <div className="w-full py-2 gap-2 h-auto flex flex-row items-center justify-start">
                    <span onClick={() => handleChangeStatus(SugerenciaType.aprobado, item?.id)} className="bg-green-400 cursor-pointer text-[18px] items-center rounded-lg flex flex-row gap-2 px-4 py-2 text-white font-medium"><MdOutlineDone color="white" /> Aceptar</span>
                    <span onClick={() => handleChangeStatus(SugerenciaType.rechazado, item?.id)} className="bg-red-400 cursor-pointer text-[18px] items-center rounded-lg flex flex-row gap-2 px-4 py-2 text-white font-medium"><MdClose color="white" /> Rechazar</span>
                  </div>}

                </div>
                <div className="w-full h-full flex-grow flex items-center justify-end">
                  <div className="flex h-full flex-col items-end gap-4 justify-between">
                    <span
                      className={clsx(
                        "p-4 rounded-lg shadow-md text-white text-[20px]",
                        `bg-${formatSugerenciaColor(item?.estado)}`
                      )}
                    >
                      {formatSugerenciaText(item?.estado)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
            </div>
        </div>
      )}
    </div>
  );
}
