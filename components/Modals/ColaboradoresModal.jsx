import { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlinePlus } from "react-icons/ai";
import { useLazyFilterByNicknameOrEmailQuery } from "store/services/UserService";

let timer = null;

export default function ColaboradoresModal({
  open,
  setIsOpen,
  colaboradores,
  setColaboradores,
}) {
  const [checkNickname] = useLazyFilterByNicknameOrEmailQuery();

  const [isQueryLoading, setIsQueryLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [filteredUsers, setFilteredUsers] = useState([]);
  const cancelButtonRef = useRef(null);

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

  const handleAddCollaborator = (user) => {
    setFilteredUsers((current) =>
      current.filter((colaborador) => colaborador.id !== user.id)
    );
    if (colaboradores.filter((usuario) => usuario.id === user.id).length >= 1) {
      console.log("Ya existe dentro de los colaboradores.");
      return;
    }
    setColaboradores((current) => [...current, user]);
  };

  const handleRemoveCollaborator = (user) => {
    setColaboradores((current) =>
      current.filter((colaborador) => colaborador.id !== user.id)
    );
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setIsOpen}
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-[#1E1E1E] px-6 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="text-center flex flex-col gap-2 text-white item-no-scrollbar">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6"
                    >
                      Agregar Colaboradores
                    </Dialog.Title>
                    <input
                      type="text"
                      id="nombreCurso"
                      name="nombreCurso"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className="border border-white px-6 py-3 text-white bg-inherit rounded-full text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Filtrar usuarios por nickname o e-mail..."
                    />

                    <div className="flex justify-between">
                      <p className="self-start">Filtrado por Usuarios</p>
                      {isQueryLoading && (
                        <p className="text-white">Loading...</p>
                      )}
                    </div>
                    <div className="flex flex-col overflow-y-scroll scroll-smooth px-5 py-3 h-[200px] max-h-[250px] border border-white rounded-xl gap-y-4">
                      {filteredUsers.map((filteredUser, index) => {
                        return (
                          <div
                            key={index}
                            className="flex w-full py-2 px-6 bg-[#780EFF] rounded-full justify-between items-center"
                          >
                            <p className="truncate">
                              {filteredUser.nickname} {filteredUser.email}
                            </p>
                            <AiOutlinePlus
                              className="cursor-pointer"
                              color="white"
                              size={30}
                              id={filteredUser.id}
                              onClick={(e) => {
                                handleAddCollaborator(filteredUser);
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>

                    <p className="self-start">Colaboradores Actuales</p>
                    <div className="flex flex-col overflow-y-scroll scroll-smooth px-5 py-3 h-[260px] max-h-[260px] border border-white rounded-xl gap-y-4">
                      {colaboradores.map((colaborador, index) => {
                        return (
                          <div
                            key={index}
                            className="flex w-full py-2 px-6 bg-[#780EFF] rounded-full justify-between items-center"
                          >
                            <p className="truncate">{colaborador.nombre}</p>
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

                    <div className="mt-2">
                      <p className="text-sm">
                        Los colaboradores serán usuarios que podrán ayudar a
                        planear cursos y seminarios, ellos podrán sugerir
                        módulos y lecciones. Estas sugerencias realizadas
                        deberán ser aprobadas o rechazadas por los
                        organizadores.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={() => setIsOpen(false)}
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
