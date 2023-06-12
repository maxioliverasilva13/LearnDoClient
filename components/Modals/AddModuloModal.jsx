import { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlinePlus } from "react-icons/ai";
import { useLazyFilterByNicknameOrEmailQuery } from "store/services/UserService";

import CreateEvaluacionModal from "./CreateEvaluacionModal";
import Alert from "components/Popups/Alert";
import ReactPlayer from "react-player";

export default function AddModuloModal({
  open,
  setIsOpen,
  clases,
  setModulos,
  estaSugiriendo = false,
  isSugerenciaShow = false,
  moduloName,
}) {
  const [classes, setClasses] = useState([
    { nombre: "", descripcion: "", video: "" },
  ]);
  const [evaluacion, setEvaluacion] = useState({
    nombre: "",
    maximo_puntuacion: "",
    preguntas: [],
  });

  const cancelButtonRef = useRef(null);
  useEffect(() => {
    console.log("clases is", clases);
    if (clases) {
      setClasses(clases);
    }
  }, [clases]);

  const [error, setError] = useState({
    show: false,
    message: "",
  });

  const [isEvalModuloOpen, setIsEvalModuloOpen] = useState(false);

  const handleOpenModal = () => {
    setIsEvalModuloOpen((current) => !current);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setError({
        show: false,
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [error.show]);

  const isEvaluacionUnchanged = () => {
    const estadoInicial = { nombre: "", maximo_puntuacion: "", preguntas: [] };

    if (
      evaluacion.nombre === estadoInicial.nombre &&
      evaluacion.maximo_puntuacion === estadoInicial.maximo_puntuacion &&
      JSON.stringify(evaluacion.preguntas) ===
        JSON.stringify(estadoInicial.preguntas)
    ) {
      return true;
    } else {
      return false;
    }
  };

  const checkDuplicateNames = () => {
    const nombresClases = classes.map((clase) => clase.nombre);
    const nombresClasesUnicos = new Set(nombresClases); // valores únicos

    if (nombresClasesUnicos.size < nombresClases.length) {
      return true;
    } else {
      return false;
    }
  };

  const handleSaveModulo = (e) => {
    e.preventDefault();
    let temp = [...classes];
    const nombre = document.getElementById("nombreModulo").value;
    if (nombre === "") {
      setError({
        show: true,
        message: "El MÓDULO debe tener un NOMBRE.",
      });
      return;
    }
    if (temp.filter((clase) => clase.nombre === "").length > 0) {
      setError({
        show: true,
        message: "Todas las clases deben tener un NOMBRE.",
      });
      return;
    }
    if (temp.filter((clase) => clase.descripcion === "").length > 0) {
      setError({
        show: true,
        message: "Todas las clases deben tener una DESCRIPCIÓN.",
      });
      return;
    }
    if (temp.filter((clase) => clase.video === "").length > 0) {
      setError({
        show: true,
        message: "Todas las clases deben tener un VIDEO.",
      });
      return;
    }
    if (!estaSugiriendo && isEvaluacionUnchanged()) {
      setError({
        show: true,
        message: "El MÓDULO debe tener una EVALUACIÓN.",
      });
      return;
    }
    if (checkDuplicateNames()) {
      setError({
        show: true,
        message: "El NOMBRE de las clases no puede REPETIRSE.",
      });
      return;
    }

    let modulo = {
      nombre: nombre,
      estado: "aprobado",
      clases: classes,
      evaluacion: evaluacion,
    };
    // console.log(modulo);
    setModulos((current) => [...current, modulo]);
    setClasses([{ nombre: "", descripcion: "", video: "" }]); // reseteo el array
    setIsOpen(false);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedClasses = [...classes];
    updatedClasses[index][name] = value;
    setClasses(updatedClasses);
  };

  const handleInputVideoChange = (e, index) => {
    const { name } = e.target;
    const value = e.target.files[0];
    const updatedClasses = [...classes];
    updatedClasses[index][name] = value;
    setClasses(updatedClasses);
  };

  const handleAddLine = () => {
    setClasses([...classes, { nombre: "", descripcion: "", video: "" }]);
    // console.log(classes);
  };

  const handleDeleteLine = (index) => {
    const updatedClasses = [...classes];
    updatedClasses.splice(index, 1);
    setClasses(updatedClasses);
  };

  return (
    <>
      <CreateEvaluacionModal
        isOpen={isEvalModuloOpen}
        setIsOpen={setIsEvalModuloOpen}
        setEvaluacion={setEvaluacion}
      />
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          initialFocus={cancelButtonRef}
          onClose={() => {
            setIsOpen((current) => !current);
            setClasses([{ nombre: "", descripcion: "", video: "" }]);
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-950 bg-opacity-50 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center bg-black-800/200 backdrop-blur-md p-4 text-center sm:items-center sm:p-0 ">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg font-light bg-[#272831] px-6 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-5xl sm:p-6">
                  <div>
                    <div className="text-center flex flex-col gap-2 text-white item-no-scrollbar">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 mb-2 text-xl"
                      >
                        {isSugerenciaShow ? "Info Modulo" : "Agregar Módulo"}
                      </Dialog.Title>
                      <div className="flex flex-col gap-5 md:gap-0 md:flex-row justify-around">
                        <input
                          type="text"
                          id="nombreModulo"
                          name="nombreModulo"
                          className="border border-white max-w-md self-center px-6 py-3 text-white placeholder:text-white bg-inherit rounded-full text-sm shadow focus:outline-none focus:ring ring-[#780EFF] w-full ease-linear transition-all duration-150"
                          placeholder="Nombre para el Módulo"
                          value={moduloName || null}
                          disabled={isSugerenciaShow}
                        />
                        {!estaSugiriendo && (
                          <button
                            className="w-max self-center active:bg-purple-800 text-white font-semibold
                        hover:shadow-md shadow text-md px-5 py-2 rounded-full outline outline-1 sm:mr-2 mb-1 ease-linear transition-all duration-150"
                            onClick={handleOpenModal}
                          >
                            Crear Evaluación
                          </button>
                        )}
                      </div>
                      <div className="my-2">
                        {error.show && (
                          <Alert
                            show={true}
                            setShow={error.show}
                            important={"Uups..."}
                            text={error.message}
                            color={"bg-red-500"}
                            icon={"fas fa-regular fa-user"}
                          />
                        )}
                      </div>
                      <p className="self-start">Clases</p>
                      <div className="flex flex-col py-1 overflow-y-scroll scroll-smooth h-[520px] max-h-[520px] gap-y-4">
                        {classes.map((clase, index) => {
                          return (
                            <div
                              key={index}
                              className="flex flex-col sm:flex-row gap-y-2 w-full py-3 px-6 border rounded-lg justify-between items-center "
                            >
                              {isSugerenciaShow ||
                              (clase?.video && clase?.claseId) ? (
                                <div className="w-[300px] h-[250px] relative">
                                  <ReactPlayer
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      borderRadius: "14px",
                                      overflow: "hidden",
                                      border: "none",
                                    }}
                                    url={clase?.video}
                                    controls
                                    className="h-full w-full"
                                  />
                                </div>
                              ) : (
                                <input
                                  type="file"
                                  id="video"
                                  accept="video/mp4,video/x-m4v,video/*"
                                  name="video"
                                  placeholder="video para la clase"
                                  onChange={(e) =>
                                    handleInputVideoChange(e, index)
                                  }
                                  className="border-0 max-w-xs text-white rounded text-sm shadow bg-[#1E1E1E] focus:outline-none focus:ring ring-[#780EFF] ease-linear transition-all duration-150 file:bg-[#272831] file:rounded-lg file:text-white file:border-0"
                                />
                              )}
                              <div className="flex flex-col items-center justify-center gap-2 w-2/3 sm:w-2/4">
                                <input
                                  type="text"
                                  id="nombre"
                                  name="nombre"
                                  maxLength={80}
                                  value={clase.nombre}
                                  onChange={(e) => handleInputChange(e, index)}
                                  className="border border-white px-3 py-3 max-w-[240px] md:max-w-xs text-white placeholder:text-white bg-transparent rounded-full text-sm shadow focus:outline-none focus:ring ring-[#780EFF] w-full ease-linear transition-all duration-150"
                                  placeholder="Nombre de la Clase"
                                  autoComplete={"off"}
                                  disabled={isSugerenciaShow}
                                />
                                <textarea
                                  type="text"
                                  id="descripcion"
                                  name="descripcion"
                                  maxLength={200}
                                  value={clase.descripcion}
                                  onChange={(e) => handleInputChange(e, index)}
                                  className="border border-white px-3 py-3 max-w-[240px] md:max-w-xs max-h-24 min-h-12 text-white placeholder:text-white bg-transparent rounded-xl text-sm shadow focus:outline-none focus:ring ring-[#780EFF] w-full ease-linear transition-all duration-150"
                                  placeholder="Breve descripción"
                                  autoComplete={"off"}
                                  disabled={isSugerenciaShow}
                                />
                              </div>
                              {!isSugerenciaShow && (
                                <RiDeleteBin6Line
                                  className="cursor-pointer"
                                  color="white"
                                  size={30}
                                  onClick={() => handleDeleteLine(index)}
                                />
                              )}
                            </div>
                          );
                        })}
                        {!isSugerenciaShow && (
                          <button
                            className="w-max self-center active:bg-gray-700 text-white font-semibold
                      hover:shadow-md shadow text-md px-5 py-2 rounded-full outline outline-1 sm:mr-2 mb-1 ease-linear transition-all duration-150"
                            onClick={handleAddLine}
                          >
                            Agregar Clase
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3 flex flex-row sm:justify-center items-baseline sm:px-56">
                    <button
                      type="button"
                      className=" inline-flex w-3/6 justify-center rounded-full bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-500 sm:hover:bg-gray-500 sm:col-start-1 sm:mt-0"
                      onClick={() => {
                        setIsOpen(false);
                      }}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex w-3/6 justify-center rounded-full bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                      onClick={(e) => {
                        handleSaveModulo(e);
                      }}
                    >
                      Guardar
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
