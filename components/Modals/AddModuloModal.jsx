import { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlinePlus } from "react-icons/ai";
import { useLazyFilterByNicknameOrEmailQuery } from "store/services/UserService";

import Alert from "components/Popups/Alert";

export default function AddModuloModal({
  open,
  setIsOpen,
  modulos,
  setModulos,
}) {
  // const [checkNickname] = useLazyFilterByNicknameOrEmailQuery();

  // const [isQueryLoading, setIsQueryLoading] = useState(false);
  // const [searchValue, setSearchValue] = useState("");

  const [classes, setClasses] = useState([
    { nombre: "", video: "", duracion: 0 }, // Línea por defecto
  ]);
  const cancelButtonRef = useRef(null);

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

  /*
  useEffect(() => {
    if (searchValue.length > 0) {
      setFilteredUsers([]);
      setIsQueryLoading(true);
    }

    clearTimeout(timer);
    timer = setTimeout(async () => {
      if (searchValue.length >= 2) {
        await checkNickname(searchValue).then((res) => {
          // console.log(res.data);
          setFilteredUsers(res.data);
          setIsQueryLoading(false);
        });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchValue]);
  */

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
    if (temp.filter((clase) => clase.video === "").length > 0) {
      setError({
        show: true,
        message: "Todas las clases deben tener un VIDEO.",
      });
      return;
    }

    let modulo = {
      nombre: nombre,
      estado: "aprobado",
      clases: classes,
    };
    console.log(modulo);
    setModulos((current) => [...current, modulo]);
    setClasses([{ nombre: "", video: "", duracion: 0 }]); // reseteo el array
    setIsOpen(false);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedClasses = [...classes];
    updatedClasses[index][name] = value;
    setClasses(updatedClasses);
  };

  const handleAddLine = () => {
    setClasses([...classes, { nombre: "", video: "", duracion: 0 }]);
    console.log(classes);
  };

  const handleDeleteLine = (index) => {
    const updatedClasses = [...classes];
    updatedClasses.splice(index, 1);
    setClasses(updatedClasses);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => {
          setIsOpen((current) => !current);
          setClasses([{ nombre: "", video: "", duracion: 0 }]);
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
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg font-light bg-[#1E1E1E] px-6 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-5xl sm:p-6">
                <div>
                  <div className="text-center flex flex-col gap-2 text-white item-no-scrollbar">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6"
                    >
                      Agregar Módulo
                    </Dialog.Title>
                    <div className="flex flex-col gap-5 md:gap-0 md:flex-row justify-around">
                      <input
                        type="text"
                        id="nombreModulo"
                        name="nombreModulo"
                        className="border border-white max-w-md self-center px-6 py-3 text-white placeholder:text-white bg-inherit rounded-full text-sm shadow focus:outline-none focus:ring ring-[#780EFF] w-full ease-linear transition-all duration-150"
                        placeholder="Nombre para el Módulo"
                      />
                      <button
                        className="w-max self-center active:bg-purple-800 text-white font-semibold
                      hover:shadow-md shadow text-md px-5 py-2 rounded-full outline outline-1 sm:mr-2 mb-1 ease-linear transition-all duration-150"
                        // onClick={/* TODO: CREAR la EVALUACIÓN para éste módulo (front+back) */}
                      >
                        Crear Evaluación
                      </button>
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
                    <div className="flex flex-col py-1 overflow-y-scroll scroll-smooth h-[260px] max-h-[260px] gap-y-4">
                      {classes.map((clase, index) => {
                        return (
                          <div
                            key={index}
                            className="flex flex-col sm:flex-row gap-y-2 w-full py-3 px-6 bg-[#333333] border rounded-3xl justify-between items-center"
                          >
                            <input
                              type="file"
                              id="video"
                              name="video"
                              onChange={(e) => handleInputChange(e, index)}
                              className="border-0 max-w-xs text-white rounded text-sm shadow bg-[#1E1E1E] focus:outline-none focus:ring ring-[#780EFF] ease-linear transition-all duration-150"
                            />
                            <input
                              type="text"
                              id="nombre"
                              name="nombre"
                              value={clase.nombre}
                              onChange={(e) => handleInputChange(e, index)}
                              className="border border-white px-3 py-3 max-w-[240px] md:max-w-xs text-white placeholder:text-white bg-[#1E1E1E] rounded-full text-sm shadow focus:outline-none focus:ring ring-[#780EFF] w-full ease-linear transition-all duration-150"
                              placeholder="Nombre para la Clase"
                              autoComplete={"off"}
                            />
                            <RiDeleteBin6Line
                              className="cursor-pointer"
                              color="white"
                              size={30}
                              onClick={() => handleDeleteLine(index)}
                            />
                          </div>
                        );
                      })}
                      <button
                        className="w-max self-center active:bg-purple-800 text-white font-semibold
                      hover:shadow-md shadow text-md px-5 py-2 rounded-full outline outline-1 sm:mr-2 mb-1 ease-linear transition-all duration-150"
                        onClick={handleAddLine}
                      >
                        Agregar Clase
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                    onClick={(e) => {
                      handleSaveModulo(e);
                    }}
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={() => {
                      setIsOpen(false);
                    }}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
