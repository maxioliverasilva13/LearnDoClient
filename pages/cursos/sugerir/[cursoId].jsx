import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useGlobalSlice from "hooks/useGlobalSlice";

// Visuals
import { FiEdit3 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";

// Services
import {
  useCreateSugerenciaMutation,
  useCreateModuloMutation,
  useUploadVideoMutation,
  useGetCursoAndClasesQuery,
  useIsUserColaboradorMutation,
} from "store/services/EventoService";

// Modals
import AddModuloModal from "components/Modals/AddModuloModal";
import EditModuloModal from "components/Modals/EditModuloModal";
import NotFoundPage from "components/NotFoundPage/NotFoundPage";
import appRoutes from "routes/appRoutes";
import Alert from "components/Popups/Alert";

export default function SugerirModulo() {
  // Services
  const [createModulo] = useCreateModuloMutation();
  const [createSugerencia] = useCreateSugerenciaMutation();
  const [uploadVideo] = useUploadVideoMutation();
  // Modals
  const [isCreateModuloOpen, setIsCreateModuloOpen] = useState(false);
  const [isEditModuloOpen, setIsEditModuloOpen] = useState(false);
  const modals = {
    createModulo: () => setIsCreateModuloOpen((current) => !current),
    editModulo: () => setIsEditModuloOpen((current) => !current),
  };
  const [error, setError] = useState({
    show: false,
    message: "",
  });

  const { userInfo, handleSetLoading } = useGlobalSlice();

  useEffect(() => {
    const timer = setTimeout(() => {
      setError({
        show: false,
      });
    }, 5000);
    return () => clearTimeout(timer);
  }, [error.show]);

  const { push } = useRouter();
  const router = useRouter();
  const [userCanCollab, setUserCanCollab]= useState(null);

  // console.log("Curso id: ", router?.query?.cursoId);
  const cursoId = router?.query?.cursoId;
  const { data, isLoading } = useGetCursoAndClasesQuery(
    {
      cursoId,
    },
    {
      skip: !cursoId,
    }
  );
  
  const [canUserCollab, {isLoading: iscollabloading}] = useIsUserColaboradorMutation(
    {
      skip: !cursoId,
    }
  );

  const handleCheckCollab = async () => {
    const response = await canUserCollab({
      evento_id: cursoId,
      user_id: userInfo?.id,
    },)
    console.log("response is", response)
    if (response?.data?.ok) {
      setUserCanCollab(true);
    } else {
      setUserCanCollab(false);
    }
  }

  useEffect(() => {
    if (cursoId) {
      handleCheckCollab();
    }
  }, [cursoId])

  useEffect(() => {
    handleSetLoading(isLoading);
  }, [isLoading]);

  const cursoInfo = data?.curso;
  // console.log("Curso info", cursoInfo);
  const [selectedModule, setSelectedModule] = useState(null);
  const [modulos, setModulos] = useState([]);
  const [comentario, setComentario] = useState("");
  if (userCanCollab === null) {
    return null;
  }
  if (data?.ok === false || (!userCanCollab && !iscollabloading)) {
    return <NotFoundPage message="Curso no encontrado" />;
  }

  // Handlers
  const handleRemoveModulo = (currIndex) => {
    setModulos((current) =>
      current.filter((modulo, index) => index !== currIndex)
    );
  };

  const handleOpenModal = (value) => {
    value();
  };

  const handleOpenEditModal = (value, currModule, index) => {
    setSelectedModule({ modulo: currModule, idx: index });
    value();
  };

  const validateInputs = () => {
    if (modulos.length < 1) {
      setError({
        show: true,
        message: "Por favor ingrese al menos un MÓDULO a sugerir.",
      });
      return false;
    }
    if (comentario.trim() === "") {
      setError({
        show: true,
        message: "Por favor ingrese un COMENTARIO para la sugerencia.",
      });
      return false;
    }
    return true;
  };

  const handleCreateSugerencia = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;
    console.log(modulos);
    let sugerencia = {
      estado: "pendiente",
      contenido: comentario,
      curso_id: cursoId,
      estudiante_id: userInfo?.id,
    };
    handleSetLoading(true);
    await createSugerencia(sugerencia)
      .then(({ data }) => {
        // console.log("res sugerencia:", data.sugerencia.id);
        modulos?.map((modulo) => {
          let modData = {
            nombre: modulo?.nombre,
            clases: modulo?.clases,
            curso_id: cursoId,
            sugerencia_id: data.sugerencia.id,
            estado: "pendiente",
          };
          return createModulo(modData)
            .unwrap()
            .then(async (response) => {
              const clases = response?.clases;
              await Promise.all(
                clases.map((clase) => {
                  return uploadVideo({
                    id_clase: clase.id,
                    video: modulo?.clases?.find(
                      (item) => item?.nombre === clase.nombre
                    )?.video,
                  });
                })
              );
            })
            .catch((error) => {
              console.error(
                "Error al crear el modulo " + modulo?.nombre + ": ",
                error
              );
            });
        });
      })
      .catch((error) => {
        console.error(
          "Error al crear la sugerencia " + sugerencia + " error: ",
          error
        );
      });
    handleSetLoading(false);
    push(appRoutes.cursos());
  };

  return (
    <>
      <AddModuloModal
        open={isCreateModuloOpen}
        setIsOpen={setIsCreateModuloOpen}
        modulos={modulos}
        setModulos={setModulos}
        estaSugiriendo={true}
      />
      {selectedModule !== null && (
        <EditModuloModal
          open={isEditModuloOpen}
          setIsOpen={setIsEditModuloOpen}
          currentModule={selectedModule}
          setSelectedModule={setSelectedModule}
          allModulos={modulos}
          setModulos={setModulos}
          estaSugiriendo={true}
        />
      )}
      <div className="w-full py-4 md:px-10 px-4 h-auto justify-start item-no-scrollbar">
        <div className="w-full h-auto flex flex-col items-start justify-center">
          <p className="text-5xl text-white px-16 pb-4">Crear Sugerencia</p>

          <div className="px-16 w-full gap-8 flex flex-col lg:flex-row justify-center text-white font-light">
            <div className="flex flex-col gap-4 w-full sm:w-1/3">
              {/* INICIO columna 1 */}
              <div className="flex flex-col gap-y-4">
                <div className="flex w-full justify-center h-[300px]">
                  {!isLoading && (
                    <img
                      src={cursoInfo?.imagen}
                      alt="vista previa imagen de perfil"
                      className="shadow rounded-lg object-cover h-auto max-h-80 w-full align-middle border-none"
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-y-4">
                <input
                  type="text"
                  id="nombreCurso"
                  name="nombreCurso"
                  defaultValue={cursoInfo?.nombre}
                  className="border border-white px-6 py-3 text-white placeholder:text-white bg-inherit rounded-full text-md shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Nombre del Curso"
                  readOnly
                />
                <input
                  type="number"
                  id="porcAprob"
                  name="porcAprob"
                  defaultValue={cursoInfo?.porcentaje_aprobacion}
                  className="border border-white px-6 py-3 text-white placeholder:text-white bg-inherit rounded-full text-md shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Porcentaje de aprobación"
                  readOnly
                />
                <textarea
                  type="text"
                  id="descripcion"
                  name="descripcion"
                  defaultValue={cursoInfo?.descripcion}
                  className="border border-white px-6 py-3 text-white placeholder:text-white bg-inherit rounded-3xl text-md shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Descripción del Curso"
                  readOnly
                />
              </div>
            </div>
            {/* FIN columna 1 */}
            <div className="flex flex-col gap-4 w-full sm:w-1/3">
              {/* INICIO columna 2 */}
              <div className="flex items-center justify-between">
                <p className="text-lg font-normal">Módulos</p>
                <button
                  className="w-max self-center active:bg-purple-800 text-white font-semibold
                            hover:shadow-md shadow text-sm px-5 py-2 rounded-full outline outline-1 sm:mr-2 mb-1 ease-linear transition-all duration-150"
                  onClick={() => {
                    // console.log(modulos);
                    handleOpenModal(modals.createModulo);
                  }}
                >
                  Agregar Módulo
                </button>
              </div>
              <div className="flex flex-col overflow-y-scroll scroll-smooth px-5 py-3 h-[250px] max-h-[250px] border border-white rounded-xl gap-y-4">
                {modulos?.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="flex w-full py-4 px-6 bg-[#780EFF] rounded-full justify-between items-center hover:shadow-xl"
                    >
                      <p>{item.nombre}</p>
                      <div className="flex gap-4">
                        <FiEdit3
                          className="cursor-pointer"
                          color="white"
                          onClick={() => {
                            handleOpenEditModal(modals.editModulo, item, index);
                          }}
                          size={30}
                        />
                        <RiDeleteBin6Line
                          className="cursor-pointer"
                          color="white"
                          size={30}
                          onClick={(e) => {
                            handleRemoveModulo(index);
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <textarea
                type="text"
                id="descripcionSugerencia"
                name="descripcionSugerencia"
                onChange={(e) => setComentario(e.target.value)}
                value={comentario}
                className="border border-white px-6 py-3 text-white placeholder:text-white bg-inherit rounded-3xl text-md shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="Comentarios sobre la sugerencia"
              />
            </div>
            {/* FIN columna 2 */}
          </div>
          {error.show && (
            <div className="flex items-center justify-center w-full">
              <Alert
                show={true}
                setShow={error.show}
                important={"Error."}
                text={error.message}
                color={"bg-red-500"}
                icon={"fas fa-regular fa-user"}
              />
            </div>
          )}
          <div className="flex justify-center w-full">
            <button
              type="submit"
              className="w-max bg-[#780EFF] active:bg-purple-800 text-white font-semibold hover:shadow-md shadow text-lg px-6 py-4 rounded-full sm:mr-2 mt-4 ease-linear transition-all duration-150"
              onClick={(e) => {
                handleCreateSugerencia(e);
                // console.log("modulos: ", modulos);
              }}
            >
              Enviar Sugerencia
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
