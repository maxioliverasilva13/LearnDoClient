import React from "react";
import { useState, useEffect } from "react";
import useForm from "hooks/useForm";
import useGlobalSlice from "hooks/useGlobalSlice";
import { useRouter } from "next/router";
import useUploadImage from "hooks/useUploadImage";

import { FiEdit3 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Alert from "components/Popups/Alert";

import {
  useCreateEventoMutation,
  useCreateModuloMutation,
  useCreateColaboracionesMutation,
  useUploadVideoMutation,
  useUpdateCursoInfoMutation,
  useUpdateAllInfoOfModuloMutation,
  useDeleteColaboracionMutation,
  useDeleteModuloMutation,
} from "store/services/EventoService";

import MultiSelect from "components/MultiSelect/MultiSelect";
import { useGetCategoriasQuery } from "store/services/CategoriaService";
import { formatToOptions } from "utils/categorias";

import ColaboradoresModal from "components/Modals/ColaboradoresModal";
import AddModuloModal from "components/Modals/AddModuloModal";
import EditModuloModal from "components/Modals/EditModuloModal";
import appRoutes from "routes/appRoutes";
import GlobalImage from "components/GlobalImage/GlobalImage";
import { toast } from "react-toastify";

export default function CreateCurso({
  cursoInfo,
  colaboradoresOfCurso,
  categoriasOfCurso,
  modulosOfCurso,
  isEdit = false,
}) {
  // Modals
  const [isColaboradoresOpen, setIsColaboradoresOpen] = useState(false);
  const [isCreateModuloOpen, setIsCreateModuloOpen] = useState(false);
  const [isEditModuloOpen, setIsEditModuloOpen] = useState(false);
  const modals = {
    createModulo: () => setIsCreateModuloOpen((current) => !current),
    editModulo: () => setIsEditModuloOpen((current) => !current),
    colaboradores: () => setIsColaboradoresOpen((current) => !current),
  };

  const [updateCursoInfo, { isLoading: isLoadingGetInfo }] =
    useUpdateCursoInfoMutation();
  const [deleteModuloInfo, { isLoading: isLoadingDeleteModulo }] =
    useDeleteModuloMutation();
  const [deleteColaboracion, { isLoading: isLoadingColaboracion }] =
    useDeleteColaboracionMutation();
  const [updateModulo, { isLoading: isLoadingUpdateModulo }] =
    useUpdateAllInfoOfModuloMutation();

  const isLoading =
    isLoadingGetInfo ||
    isLoadingColaboracion ||
    isLoadingUpdateModulo ||
    isLoadingDeleteModulo;

  const [cursoImage, setCursoImage] = React.useState(
    cursoInfo?.imagen || "/img/img-1-1000x600.jpg"
  ); // imagen a mostrar
  const [firebaseImage, setFirebaseImage] = useState(null);
  const { handleUpload, imageError, imageUrl } = useUploadImage();
  const [isPaid, setIsPaid] = useState(true);
  const { userInfo, handleSetLoading } = useGlobalSlice();
  const [error, setError] = useState({
    show: false,
    message: "",
  });

  useEffect(() => {
    handleSetLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setError({
        show: false,
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [error.show]);

  const { formValues, handleChangeValue, setFormValues } = useForm({
    nombre: cursoInfo?.nombre || "",
    descripcion: cursoInfo?.descripcion || "",
    precio: `${cursoInfo?.precio}` || "",
    porcentaje_aprobacion: cursoInfo?.porcentaje_aprobacion || "",
  });

  useEffect(() => {
    if (cursoInfo) {
      setFormValues({
        nombre: cursoInfo?.nombre || "",
        descripcion: cursoInfo?.descripcion || "",
        precio: `${cursoInfo?.precio}` || "",
        porcentaje_aprobacion: `${cursoInfo?.porcentaje_aprobacion}` || "",
      });
      setCursoImage(cursoInfo?.imagen);
    }
  }, [cursoInfo]);

  useEffect(() => {
    if (modulosOfCurso) {
      setModulos(modulosOfCurso);
    }
  }, [modulosOfCurso]);

  const { push } = useRouter();

  // Services
  const [createEvento] = useCreateEventoMutation();
  const [createModulo] = useCreateModuloMutation();
  const [createColaboraciones] = useCreateColaboracionesMutation();
  const [uploadVideo] = useUploadVideoMutation();
  const { data: categorias } = useGetCategoriasQuery();
  const [selectedCategorias, setSelectedCategorias] = useState([]);
  const optionsCategorias = formatToOptions(categorias);

  const [selectedModule, setSelectedModule] = useState(null);
  const [modulos, setModulos] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);

  useEffect(() => {
    if (colaboradoresOfCurso && colaboradoresOfCurso?.length > 0) {
      setColaboradores(colaboradoresOfCurso);
    }
  }, [colaboradoresOfCurso]);

  useEffect(() => {
    if (categoriasOfCurso) {
      setSelectedCategorias(
        categoriasOfCurso?.map((item) => {
          return {
            label: item?.nombre,
            value: item?.id,
          };
        })
      );
    }
  }, [categoriasOfCurso]);

  const handleFileChange = (event) => {
    setFirebaseImage(event.target.files[0]);
    if (event.target.files && event.target.files[0]) {
      setCursoImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleCheckboxChange = (event) => {
    setIsPaid((current) => !current);
  };

  const handleRemoveCollaborator = async (user) => {
    if (isEdit) {
      const prepareData = {
        evento_id: cursoInfo?.id,
        user_id: user?.id,
      };
      const response = await deleteColaboracion(prepareData);
      if (response?.data?.ok) {
        setColaboradores((current) =>
          current.filter((colaborador) => colaborador.id !== user.id)
        );
      }
    } else {
      setColaboradores((current) =>
        current.filter((colaborador) => colaborador.id !== user.id)
      );
    }
  };

  const handleRemoveModulo = async (currIndex) => {
    const moduloToDelete = modulos[currIndex]?.moduloId;
    if (isEdit && moduloToDelete) {
      const prepareData = {
        moduloId: moduloToDelete,
      };
      const response = await deleteModuloInfo(prepareData);
      if (response?.data?.ok) {
        setModulos((current) =>
          current.filter((modulo, index) => index !== currIndex)
        );
      }
    } else {
      setModulos((current) =>
        current.filter((modulo, index) => index !== currIndex)
      );
    }
  };

  const handleOpenModal = (value) => {
    value();
  };

  const handleOpenEditModal = (value, currModule, index) => {
    setSelectedModule({ modulo: currModule, idx: index });
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
    if (formValues.porcentaje_aprobacion?.trim() === "") {
      setError({
        show: true,
        message: "Por favor ingrese el PORCENTAJE de APROBACIÓN para el curso.",
      });
      return false;
    } else if (
      formValues.porcentaje_aprobacion?.trim() < 1 ||
      formValues.porcentaje_aprobacion?.trim() > 100
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
    if (isPaid) {
      if (formValues.precio.trim() === "") {
        setError({
          show: true,
          message: "Por favor ingrese el PRECIO del el curso.",
        });
        return false;
      }
    }
    if (selectedCategorias.length < 1) {
      setError({
        show: true,
        message: "Por favor seleccione al menos una CATEGORÍA .",
      });
      return false;
    }
    // Todos los inputs tienen contenido
    return true;
  };

  const handleEditCurso = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;
    let uploadedImageUrl = null;
    if (firebaseImage) {
      uploadedImageUrl = await handleUpload(firebaseImage).catch((error) =>
        console.log(error)
      );
    }
    const updatedCursoInfo = {
      cursoId: cursoInfo?.id,
      nombre: formValues?.nombre,
      descripcion: formValues?.descripcion,
      imagen: uploadedImageUrl ? uploadedImageUrl : cursoImage,
      es_pago: isPaid ? 1 : 0,
      precio: formValues?.precio,
      organizador: userInfo?.id,
      porcentaje_aprobacion: formValues?.porcentaje_aprobacion,
      categorias: selectedCategorias?.map((item) => item?.value),
    };
    
    await updateCursoInfo(updatedCursoInfo);

    const colaboradoresNews = colaboradores?.filter(
      (item) => item?.isNew === true
    );
    if (colaboradoresNews?.length > 0) {
      const colabs = {
        evento_id: cursoInfo?.id,
        colaboradores: colaboradoresNews,
      };
      createColaboraciones(colabs);
    }

    const modulosToCreate = modulos?.filter(
      (modulo) => modulo?.moduloId == undefined && modulo?.moduloId == null
    );
    const modulosToUpdate = modulos?.filter(
      (modulo) => modulo?.moduloId !== undefined && modulo?.moduloId !== null
    );

    if (modulosToUpdate?.length > 0) {
      const response = await updateModulo(modulosToUpdate);
      const clasesToAddVideo = response?.data?.clases;
      if (clasesToAddVideo?.length > 0) {
        await Promise.all(
          clasesToAddVideo.map((clase) => {
            const modulo = modulosToUpdate?.find(
              (mod) => mod?.moduloId == clase?.modulo_id
            );
            return uploadVideo({
              id_clase: clase.id,
              video: modulo?.clases?.find(
                (item) => item?.nombre === clase.nombre
              )?.video,
            });
          })
        );
      }
    }

    if (modulosToCreate?.length > 0) {
      await Promise.all(
        modulosToCreate?.map(async (modulo) => {
          let modData = {
            nombre: modulo?.nombre,
            clases: modulo?.clases,
            evaluacion: modulo?.evaluacion,
            curso_id: cursoInfo?.id,
            estado: "aprobado",
          };
          return createModulo(modData)
            .unwrap()
            .then(async (response) => {
              const clases = response?.clases;
              if (clases?.length > 0) {
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
              }
            })
            .catch((error) => {
              console.error(
                "Error al crear el modulo " + modulo?.nombre + ": ",
                error
              );
            });
        })
      );
    }
    toast.success("Evento actualizado correctamente", {
      theme: "colored"
    })
  };

  const handleCreateCurso = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;
    const uploadedImageUrl = await handleUpload(firebaseImage).catch((error) =>
      console.log(error)
    );
    const cursoData = {
      nombre: formValues?.nombre,
      descripcion: formValues?.descripcion,
      imagen: uploadedImageUrl,
      // imagen: "testing",
      es_pago: isPaid ? 1 : 0,
      precio: formValues?.precio,
      organizador: userInfo?.id,
      porcentaje_aprobacion: formValues?.porcentaje_aprobacion,
      categorias: selectedCategorias?.map((item) => item?.value),
      tipo: "curso",
    };

    handleSetLoading(true);
    await createEvento(cursoData)
      .unwrap()
      .then(async (response) => {
        const { evento } = response;
        console.log("ID DEL EVENTO CREADO: " + evento?.id);
        if (colaboradores?.length > 0) {
          const colabs = {
            evento_id: evento?.id,
            colaboradores: colaboradores,
          };
          createColaboraciones(colabs);
        }
        await Promise.all(
          modulos?.map((modulo) => {
            let modData = {
              nombre: modulo?.nombre,
              clases: modulo?.clases,
              evaluacion: modulo?.evaluacion,
              curso_id: evento?.id,
              estado: "aprobado",
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
          })
        );
        handleSetLoading(false);
        push(appRoutes.misCursosAdmin());
      })
      .catch((error) => {
        handleSetLoading(false);
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
          allModulos={modulos}
          setModulos={setModulos}
        />
      )}
      <div className="w-full py-4 md:px-10 h-auto justify-start item-no-scrollbar">
        <div className="w-full h-auto flex flex-col items-start justify-center">
          <p className="text-5xl text-white px-16 pb-4">Agregar un curso</p>

          <div className="px-16 w-full gap-8 flex flex-col lg:flex-row justify-center text-white font-light">
            <div className="flex md:min-w-[300px] flex-col md:mt-0 gap-4 w-full sm:w-1/3">
              {/* INICIO columna 1 */}
              <div className="flex flex-col gap-y-4 md:mt-0 mt-10">
                <div className="flex w-full justify-center h-[300px]">
                  <img
                    src={cursoImage}
                    alt="vista previa imagen de perfil"
                    className="shadow rounded-lg object-cover h-auto max-h-80 w-full align-middle border-none"
                  />
                </div>
                <input
                  type="file"
                  id="foto"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="border-0 px-6 py-3 text-white bgPrincipal rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 file:bg-[#4444] file:rounded-lg file:text-white file:border-0"
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
                      value={isPaid}
                      onChange={handleCheckboxChange}
                    />
                    Gratuito
                  </label>
                  {isPaid && (
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
            <div className="flex flex-col gap-4 w-full md:mt-0 mt-10 sm:w-1/3">
              {/* INICIO columna 2 */}
              <div className="flex items-center justify-between">
                <p className="text-lg font-normal">Módulos</p>
                <button
                  className="w-max self-center active:bg-[#78A132] text-white font-semibold
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
                {modulos.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="flex w-full py-4 px-6 bgPrincipal rounded-full justify-between items-center hover:shadow-xl"
                    >
                      <p>{item.nombre}</p>
                      <div className="flex gap-4">
                        <FiEdit3
                          className="cursor-pointer"
                          color="white"
                          onClick={() => {
                            // console.log("All modulos before update: ", modulos)
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
              <div className="flex flex-col gap-y-4">
                {/* // CATEGORIAS */}
                <MultiSelect
                  value={selectedCategorias}
                  setValue={setSelectedCategorias}
                  options={optionsCategorias}
                />
              </div>
            </div>
            {/* FIN columna 2 */}
            <div className="flex flex-col gap-4 w-full sm:w-1/3">
              {/* INICIO columna 3 */}
              <div className="flex md:flex-row flex-col md:gap-2 gap-5 items-center justify-between">
                <p className="text-lg font-normal">Colaboradores</p>
                <button
                  className="w-max self-center active:bg-[#78A132] text-white font-semibold
                            hover:shadow-md shadow text-sm px-5 py-2 rounded-full outline outline-1 sm:mr-2 mb-1 ease-linear transition-all duration-150"
                  onClick={() => {
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
                      className="flex w-full py-4 px-6 bgPrincipal rounded-full justify-between items-center hover:shadow-xl"
                    >
                      <div className="w-[30px] mr-2 h-[30px] overflow-hidden rounded-full relative">
                        <GlobalImage
                          src={colaborador?.imagen}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                      <p className="truncate max-w-full flex-grow overflow-hidden text-left">
                        {colaborador.nombre}
                      </p>
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
          <div className="flex justify-center w-full">
            <button
              type="submit"
              className="w-max bgPrincipal active:bg-[#78A132] text-white font-semibold hover:shadow-md shadow text-lg px-6 py-4 rounded-full sm:mr-2 mt-4 ease-linear transition-all duration-150"
              onClick={(e) => {
                if (isEdit) {
                  handleEditCurso(e);
                } else {
                  handleCreateCurso(e);
                }
                // console.log("modulos: ", modulos);
              }}
            >
              {isEdit ? "Guardar curso" : "Crear Curso"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
