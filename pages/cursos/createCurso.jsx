import React from "react";
import { useState, useEffect } from "react";
import useForm from "hooks/useForm";
import useGlobalSlice from "hooks/useGlobalSlice";
import { useRouter } from "next/router";

import { FiEdit3 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Alert from "components/Popups/Alert";

import {
  useCreateEventoMutation,
  useCreateModuloMutation,
  useCreateColaboracionesMutation,
} from "store/services/EventoService";

import ColaboradoresModal from "components/Modals/ColaboradoresModal";
import AddModuloModal from "components/Modals/AddModuloModal";
import EditModuloModal from "components/Modals/EditModuloModal";
import appRoutes from "routes/appRoutes";

export default function CreateCurso() {
  // Modals
  const [isColaboradoresOpen, setIsColaboradoresOpen] = useState(false);
  const [isCreateModuloOpen, setIsCreateModuloOpen] = useState(false);
  const [isEditModuloOpen, setIsEditModuloOpen] = useState(false);
  const modals = {
    createModulo: () => setIsCreateModuloOpen((current) => !current),
    editModulo: () => setIsEditModuloOpen((current) => !current),
    colaboradores: () => setIsColaboradoresOpen((current) => !current),
  };
  
  const [cursoImage, setCursoImage] = React.useState("/img/img-1-1000x600.jpg");
  const [isFree, setIsFree] = useState(false);
  const { userInfo } = useGlobalSlice();
  const [error, setError] = useState({
    show: false,
    message: "",
  });
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setError({
        show: false,
      });
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [error.show]);
  
  const { formValues, handleChangeValue } = useForm({
    nombre: "",
    descripcion: "",
    es_pago: !isFree,
    precio: "",
    porcentaje_aprobacion: "",
  });

  const { pathname, push } = useRouter();
  
  // Services
  const [createEvento] = useCreateEventoMutation();
  const [createModulo] = useCreateModuloMutation();
  const [createColaboraciones] = useCreateColaboracionesMutation();
  
  const [selectedModule, setSelectedModule] = useState(null);
  const [modulos, setModulos] = useState([
    {
      nombre: "aaasdsadsadsadsadsadasds",
      estado: "aprobado",
      clases: [
        {
          nombre: "Clase 1",
          video: "video1",
          duracion: 60,
        },
        {
          nombre: "Clase 2",
          video: "video2",
          duracion: 120,
        },
      ],
    },
  ]);
  const [colaboradores, setColaboradores] = useState([
    {
      id: 1,
      nickname: "pepe03",
      email: "pepe@mail.com",
      telefono: "098365963",
      nombre: "Pepe Gonzales",
      biografia: "esta es mi biografia",
      imagen: "img1",
      status_id: 2,
      creditos_number: 0,
      type: "estudiante",
    },
  ]);
  
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setCursoImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleCheckboxChange = (event) => {
    setIsFree((current) => !current);
  };
  
  const handleRemoveCollaborator = (user) => {
    setColaboradores((current) =>
      current.filter((colaborador) => colaborador.id !== user.id)
    );
  };

  const handleOpenModal = (value) => {
    value();
  };

  const handleOpenEditModal = (value, module) => {
    setSelectedModule(module);
    value();
  };

  const validateInputs = () => {
    if (cursoImage === "/img/img-1-1000x600.jpg") {
      setError({
        show: true,
        message: "Seleccione una IMAGEN para el curso.",
      });
      return false;
    }
    if (formValues.nombre.trim() === "") {
      setError({
        show: true,
        message: "Por favor ingrese un NOMBRE para el curso.",
      });
      return false;
    }
    if (formValues.porcentaje_aprobacion.trim() === "") {
      setError({
        show: true,
        message: "Por favor ingrese el PORCENTAJE de APROBACIÓN para el curso.",
      });
      return false;
    } else if (
      formValues.porcentaje_aprobacion.trim() < 1 ||
      formValues.porcentaje_aprobacion.trim() > 100
    ) {
      setError({
        show: true,
        message: "El porcentaje de aprobación debe de estar entre 1% y 100%.",
      });
      return false;
    }
    if (formValues.descripcion.trim() === "") {
      setError({
        show: true,
        message: "Por favor ingrese una DESCRIPCIÓN para el curso.",
      });
      return false;
    }
    if (!isFree) {
      if (formValues.precio.trim() === "") {
        setError({
          show: true,
          message: "Por favor ingrese el PRECIO del el curso.",
        });
        return false;
      }
    }
    // Todos los inputs tienen contenido
    return true;
  };

  const handleCreateCurso = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;
    const cursoData = {
      nombre: formValues?.nombre,
      descripcion: formValues?.descripcion,
      imagen: "TESTTESTTEST",
      es_pago: formValues?.es_pago === true ? 1 : 0,
      precio: formValues?.precio,
      organizador: userInfo?.id,
      porcentaje_aprobacion: formValues?.porcentaje_aprobacion,
      tipo: "curso",
    };

    await createEvento(cursoData)
      .unwrap()
      .then(({ evento }) => {
        console.log("ID DEL EVENTO CREADO: " + evento?.id);
        if (colaboradores.length > 0) {
        }
        const colabs = {
          evento_id: evento?.id,
          colaboradores: colaboradores,
        }
        console.log("entro");
        console.log(colabs);
        createColaboraciones(colabs);
        modulos.forEach((modulo) => {
          let modData = {
            nombre: modulo?.nombre,
            clases: modulo?.clases,
            curso_id: evento?.id,
            estado: "aprobado",
          };
          createModulo(modData)
            .unwrap()
            .then((response) => {
              console.log(response);
              //push(appRoutes.cursos());
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
        console.error("Error al crear el evento: ", error);
      });
  };

  return (
    <>
      <ColaboradoresModal
        open={isColaboradoresOpen}
        setIsOpen={setIsColaboradoresOpen}
        colaboradores={colaboradores}
        setColaboradores={setColaboradores}
      />
      <AddModuloModal
        open={isCreateModuloOpen}
        setIsOpen={setIsCreateModuloOpen}
        modulos={modulos}
        setModulos={setModulos}
      />
      {selectedModule !== null && (
        <EditModuloModal
          open={isEditModuloOpen}
          setIsOpen={setIsEditModuloOpen}
          currentModule={selectedModule}
          setSelectedModule={setSelectedModule}
          allModules={modulos}
          setModules={setModulos}
        />
      )}
      <div className="w-full py-4 md:px-10 px-4 h-screen overflow-auto max-h-screen justify-start item-no-scrollbar">
        <div className="w-full h-auto flex flex-col items-start justify-center">
          <p className="text-5xl text-white px-16 py-4">Agregar un curso</p>

          <div className="px-16 w-full gap-8 flex flex-col lg:flex-row justify-center text-white font-light">
            <div className="flex flex-col gap-4 w-full sm:w-1/3">
              {/* INICIO columna 1 */}
              <div className="flex flex-col gap-y-4">
                <div className="flex w-full justify-center">
                  <img
                    src={cursoImage}
                    alt="vista previa imagen de perfil"
                    className="shadow rounded-md object-scale-down h-auto w-[500px] align-middle border-none"
                  />
                </div>
                <input
                  type="file"
                  id="foto"
                  name="image"
                  onChange={handleFileChange}
                  className="border-0 px-6 py-3 text-white bg-[#780EFF] rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
              <div className="flex flex-col gap-y-4">
                <input
                  type="text"
                  id="nombreCurso"
                  name="nombreCurso"
                  onChange={(e) =>
                    handleChangeValue("nombre", e?.target?.value)
                  }
                  value={formValues.nombre}
                  className="border border-white px-6 py-3 text-white placeholder:text-white bg-inherit rounded-full text-md shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Nombre del Curso"
                />
                <input
                  type="number"
                  id="porcAprob"
                  name="porcAprob"
                  onChange={(e) =>
                    handleChangeValue("porcentaje_aprobacion", e?.target?.value)
                  }
                  value={formValues.porcentaje_aprobacion}
                  min={5}
                  max={99}
                  className="border border-white px-6 py-3 text-white placeholder:text-white bg-inherit rounded-full text-md shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Porcentaje de aprobación"
                />
                <textarea
                  type="text"
                  id="descripcion"
                  name="descripcion"
                  onChange={(e) =>
                    handleChangeValue("descripcion", e?.target?.value)
                  }
                  value={formValues.descripcion}
                  className="border border-white px-6 py-3 text-white placeholder:text-white bg-inherit rounded-3xl text-md shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Descripción del Curso"
                />
                <div className="flex flex-col sm:flex-row items-center gap-4 h-12 min-h-12">
                  <label htmlFor="gratuito">
                    <input
                      type="checkbox"
                      id="gratuito"
                      className="accent-pink-500 mr-2"
                      value={isFree}
                      onChange={handleCheckboxChange}
                    />
                    Gratuito
                  </label>
                  {!isFree && (
                    <input
                      type="number"
                      id="precio"
                      name="precio"
                      onChange={(e) =>
                        handleChangeValue("precio", e?.target?.value)
                      }
                      value={formValues.precio}
                      className="border border-white px-6 py-3 text-white placeholder:text-white bg-inherit rounded-full text-md shadow focus:outline-none focus:ring w-max ease-linear transition-all duration-150"
                      placeholder="Precio"
                    />
                  )}
                </div>
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
                    handleOpenModal(modals.createModulo);
                  }}
                >
                  Agregar Módulo
                </button>
              </div>
              <div className="flex flex-col overflow-y-scroll scroll-smooth px-5 py-3 h-[250px] max-h-[250px] border border-white rounded-xl gap-y-4">
                {modulos.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="flex w-full py-4 px-6 bg-[#780EFF] rounded-full justify-between items-center hover:shadow-xl"
                    >
                      <p>{item.nombre}</p>
                      <FiEdit3
                        className="cursor-pointer"
                        color="white"
                        onClick={() => {
                          handleOpenEditModal(modals.editModulo, item);
                          console.log(modulos);
                        }}
                        size={30}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            {/* FIN columna 2 */}
            <div className="flex flex-col gap-4 w-full sm:w-1/3">
              {/* INICIO columna 3 */}
              <div className="flex items-center justify-between">
                <p className="text-lg font-normal">Colaboradores</p>
                <button
                  className="w-max self-center active:bg-purple-800 text-white font-semibold
                            hover:shadow-md shadow text-sm px-5 py-2 rounded-full outline outline-1 sm:mr-2 mb-1 ease-linear transition-all duration-150"
                  onClick={() => {
                    console.log(colaboradores);
                    handleOpenModal(modals.colaboradores);
                  }}
                >
                  Agregar Colaborador
                </button>
              </div>
              <div className="flex flex-col overflow-y-scroll scroll-smooth px-5 py-3 h-[250px] max-h-[250px] border border-white rounded-xl gap-y-4">
                {colaboradores.map((colaborador, index) => {
                  return (
                    <div
                      key={index}
                      className="flex w-full py-4 px-6 bg-[#780EFF] rounded-full justify-between items-center hover:shadow-xl"
                    >
                      <p>{colaborador.nombre}</p>
                      <RiDeleteBin6Line
                        className="cursor-pointer"
                        color="white"
                        size={30}
                        onClick={(e) => {
                          handleRemoveCollaborator(colaborador);
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            {/* FIN columna 3 */}
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
          <div className="flex justify-center w-full mt-6">
            <button
              type="submit"
              className="w-max bg-[#780EFF] active:bg-purple-800 text-white font-semibold hover:shadow-md shadow text-lg px-6 py-4 rounded-full sm:mr-2 mb-1 ease-linear transition-all duration-150"
              onClick={(e) => {
                handleCreateCurso(e);
                // console.log(formValues);
              }}
            >
              Crear Curso
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
