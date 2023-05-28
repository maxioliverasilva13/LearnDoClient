import clsx from "clsx";
import Progress from "components/Progress/Progress";
import useGlobalSlice from "hooks/useGlobalSlice";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { BsFillStarFill } from "react-icons/bs";
import { useGetCompleteCursoInfoQuery } from "store/services/EventoService";
import { generateRandomColor } from "utils/color";
import GlobalImage from "components/GlobalImage/GlobalImage";
import { formatCursoDescripcion } from "utils/evento";
import PuntuarModal from "components/PuntuarModal/PuntuarModal";
import { AiFillCheckCircle } from "react-icons/ai";
import Link from "next/link";
import appRoutes from "routes/appRoutes";
import NotFoundPage from "components/NotFoundPage/NotFoundPage";
import ClaseCard from "components/ClaseCard/ClaseCard";
import CreateEvaluacionModal from "components/Modals/CreateEvaluacionModal";
import PuntuacionText from "components/PuntuacionText/PuntuacionText";
import { PayPalScriptProvider, loadScript } from "@paypal/react-paypal-js";
import { PayPalButtons } from "@paypal/react-paypal-js";
import ReactDOM from 'react-dom';
import { useComprareventoMutation } from "store/services/EventoService";
import Modal from "components/Modal/modal"
import { FaRegCheckCircle } from "react-icons/fa";
import { any } from "prop-types";



const CursoInfo = () => {
  const router = useRouter();
  const { query } = router;
  const cursoId = query?.cursoId;
  const [openCalificarModal, setOpenCalificarModal] = useState(false);

  const { data, isLoading } = useGetCompleteCursoInfoQuery({ cursoId });
  const { handleSetLoading, userInfo } = useGlobalSlice();

  const [evaluacionToDo, setEvaluacionToDo] = useState(null);

  const cursoInfo = data?.curso;

  const cursoImage = cursoInfo?.imagen;
  const cursoDescripcion = cursoInfo?.descripcion;
  const profesor = data?.profesor;
  const precio = cursoInfo?.precio;
  const progresoCurso = 40;
  const cursoNombre = cursoInfo?.nombre;
  const [activeModuloId, setActiveModulo] = useState(null);

  const stars = data?.stars;
  const countStars = data?.countPuntuaciones;

  const isAlreadyPuntuado =
    data?.puntuaciones?.find((item) => item?.estudiante_id === userInfo?.id) !==
    undefined;

  const esComprada = data?.comprado;

  const [valuesPay] = useState({
    userId: userInfo?.id,
    metodoPago: "paypal",
    monto: precio,
    eventoId: cursoId,
  })

  const [handlePay] = useComprareventoMutation();

  const pagar = async (values) => {
    const response = await handlePay(values);
    if (response?.data?.statusCode === 200) {
      console.log("esta funcando re bien")
    }
  }

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    handleSetLoading(isLoading);
  }, [isLoading]);

  //   useGetCompleteCursoInfoQuery
  const renderStars = (
    stars,
    size = 20,
    needsCount = true,
    justifyStart = false
  ) => {
    return (
      <div
        className={clsx(
          "w-full h-auto flex flex-row gap-1 items-center",
          justifyStart ? "justify-start" : "justify-center"
        )}
      >
        {Array.from(Array(5).keys()).map((value) => {
          const isChecked = value < stars;
          return (
            <BsFillStarFill
              className={clsx(
                `mr-1 text-[${size}px]`,
                isChecked ? "text-yellow-500" : "text-white"
              )}
            />
          );
        })}
        {needsCount && <span className="text-white">({countStars})</span>}
      </div>
    );
  };

    const renderCategorias = () => {
    if (!data?.categorias || data?.categorias?.length === 0) {
      return null;
    }
    return <div className="w-full h-auto flex flex-col items-start justify-center gap-y-4">
      <span className="text-white font-semibold text-[20px]">Categorias</span>

      <div className="w-full h-auto flex flex-row items-center justify-start flex-wrap gap-2">
        {
          data?.categorias?.map((categoria) => {
            return <span className={`text-white font-medium px-4 py-2 text-[18px] rounded-lg bg-[#${generateRandomColor()}]`}>{categoria?.nombre}</span>
          })
        }


      </div>
    </div>
  }

  const getCantClases = () => {
    var cantClases = 0;
    data?.modulos?.map((item) => {
      cantClases += item?.clases?.length;
      return item;
    });
    return cantClases;
  };

  const renderEstudianteProgress = () => {
    return (
      <div className="w-full md: px-[150px]  my-10 flex flex-row items-center justify-between ">
        <div className="w-auto h-auto flex text-white gap-4 flex-row items-center justify-start">
          <span>Progreso</span>
          <div className="md:w-[420px] h-[20px]">
            <Progress porcentage={progresoCurso} />
          </div>
        </div>
        {isAlreadyPuntuado ? (
          <div className="w-auto h-auto flex flex-row items-center gap-2 justify-center">
            <AiFillCheckCircle className="text-green-500 text-[18px]" />
            <span className="text-white font-semibold">Puntuado</span>
          </div>
        ) : (
          <button
            onClick={() => setOpenCalificarModal(true)}
            className=" text-white px-4 py-2 border border-white rounded-full font-semibold cursor-pointer flex file:flex-row items-center transition-all transform hover:scale-105 text-base group-[]:"
          >
            <BsFillStarFill className="mr-1 text-yellow-500 text-[20px]" />
            Calificar
          </button>
        )}
      </div>
    );
  };

  const activeModulo =
    data?.modulos?.find((item) => item?.id === activeModuloId) || null;



  const PayPalButtonsWrapper = () => {
    const PAYPAL_CLIENT_ID = "ARMjbBZs3Nm__CVEJeKlu6ePlR_XQFuSYPuqFkiPMRPLZpVNeeji9C_Cf1Mit_wj912tqCp7zymLcEY3";
    const initialOptions = {
      "client-id": PAYPAL_CLIENT_ID,
      currency: "USD",
      intent: "capture",
    };

    return (
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: precio,
                  },
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            pagar(valuesPay);
            console.log("cvalues " + userInfo.nombre)
            console.log("cvalues " + valuesPay.userId)
            console.log("cvalues " + valuesPay.eventoId)
            console.log("cvalues " + valuesPay.metodoPago)
            console.log("cvalues " + valuesPay.monto)
            setShowModal(true);
            return
            //return actions.order.capture().then((details) => {
            //  
            //  setShowModal(true)
            //});
          }}
        />
      </PayPalScriptProvider>
    );
  };

  const handleReload = () => {
    window.location.reload();
  };

  const renderContent = () => {
    if (isLoading) {
      return null;
    }
    if (!data?.ok) {
      return <NotFoundPage message="Curso no encontrado" />;
    } else {
      return (
        <div className="w-full h-auto px-[6%] py-10">
          <CreateEvaluacionModal
            evaluacionId={evaluacionToDo}
            isOpen={evaluacionToDo !== null}
            setIsOpen={() => setEvaluacionToDo(null)}
            isEditing={false}
          />
          <PuntuarModal
            cursoId={cursoInfo?.id}
            openCalificarModal={openCalificarModal}
            setOpenCalificarModal={setOpenCalificarModal}
          />
          <div className="w-full h-auto md:gap-[50px] flex flex-row items-start justify-center">
            <div className="flex flex-col gap-2">
              <div className="w-[660px] h-[320px] rounded-lg relative overflow-hidden">
                <GlobalImage
                  src={cursoImage}
                  loader={() => cursoImage}
                  className="w-full h-full"
                  objectFit="cover"
                  layout="fill"
                />
              </div>
              <span className="text-white font-semibold text-[28px]">
                {cursoNombre}
              </span>
            </div>

            <div className="w-full max-w-[600px] flex flex-col items-center justify-start">
              <span className="text-white italic font-normal text-[28px] leading-[30px]">
                {formatCursoDescripcion(cursoDescripcion)}
              </span>
              <div className="flex my-[30px] w-full italic text-white font-semibold text-sm flex-col items-start justify-start gap-4">
                {renderStars(stars, 20, true, true)}
                <p>Total Clases:{getCantClases()}</p>
                <p>Modalidad: Virtual</p>
                <p>Profesor: {profesor}</p>
              </div>
              {esComprada ? (
                <Link
                  className="cursor-pointer"
                  href={appRoutes.foroPage(data?.foroId)}
                >
                  <span
                    to={appRoutes.foroPage(data?.foroId)}
                    className="text-[20px] cursor-pointer w-full font-Gotham text-center px-10 py-3 text-white rounded-full border-0 bg-[#780EFF]"
                  >
                    Ir al foro
                  </span>
                </Link>
              ) : (
                <div className="w-4/4 flex flex-row items-start justify-center gap-[60px]">
                  <span className="text-white font-semibold text-[20px]">
                    USD${precio}
                  </span>
                  <PayPalButtonsWrapper />
                </div>
              )}
            </div>
          </div>

          {esComprada && renderEstudianteProgress()}
          {renderCategorias}

          <div className="w-full mt-[50px] flex h-auto flex-row items-start justify-start">
            <div className="flex flex-col flex-grow w-full">
              <span className="w-auto mb-6 text-[30px] font-semibold text-white pl-3 border-l-4 border-[#780EFF]">
                Modulos
              </span>

              <div className="w-full h-auto flex flex-col itesm-start justify-start gap-y-[30px]">
                {data?.modulos &&
                  data.modulos?.map((modulo) => {
                    const isActiveModule = modulo?.id === activeModuloId;
                    return (
                      <div
                        onClick={() => setActiveModulo(modulo?.id)}
                        className={clsx(
                          "md:w-[90%] cursor-pointer relative bg-opacity-50 rounded-[12px] h-[120px] p-4 flex flex-row items-start justify-start",
                          isActiveModule
                            ? "moduloContainerActive"
                            : "moduloContainer"
                        )}
                      >
                        <div className="border-b-[4px] border-[#780EFF] flex-grow h-full flex flex-col items-center justify-start">
                          <span className="w-auto text-[18px] text-center max-w-full font-semibold text-white ">
                            {modulo.nombre}
                          </span>
                          <span className="w-auto text-[14px] my-4 text-center max-w-full font-semibold text-white ">
                            Clases:{modulo.clases?.length}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                {data?.modulos?.length === 0 && (
                  <div className="my-10 w-full py-4 flex items-center justify-center">
                    <span className="text-white">
                      No se encontraron modulos para este curso
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col flex-grow w-full">
              <span className="w-auto mb-6 text-[30px] font-semibold text-white pl-3 border-l-4 border-[#780EFF]">
                Clases
              </span>
              <div className="w-full h-auto flex flex-col itesm-start justify-start gap-y-[30px]">
                {activeModulo &&
                  activeModulo?.clases?.map((clase) => {
                    return (
                      <div
                        key={`clase-${clase?.id}`}
                        onClick={() =>
                          router.push(
                            appRoutes.clasePage(clase?.id, cursoInfo?.id)
                          )
                        }
                      >
                        <ClaseCard clase={clase} />
                      </div>
                    );
                  })}

                {activeModulo?.evaluacionId && esComprada && (
                  <div className="w-full flex items-center flex-col gap-2 justify-center">
                    {activeModulo?.calificacion > 0 && (
                      <div className="flex flex-row items-center gap-1">
                        <AiFillCheckCircle className="text-green-500 text-[18px]" />
                        <span className="text-white font-medium">
                          Calificacion en este modulo: <PuntuacionText puntuacion={activeModulo?.calificacion} />
                        </span>
                      </div>
                    )}
                    <span
                      onClick={() =>
                        setEvaluacionToDo(activeModulo?.evaluacionId)
                      }
                      className="text-[20px] cursor-pointer w-[260px] font-Gotham text-center py-3 text-white rounded-full border-0 bg-[#780EFF]"
                    >
                      {activeModulo?.calificacion === 0
                        ? "Realizar evaluacion"
                        : "Rehacer evaluacion"}
                    </span>
                  </div>
                )}
                {(!activeModulo || activeModulo?.clases?.length === 0) && (
                  <div className="my-10 w-full py-4 flex items-center justify-center">
                    <span className="text-white">
                      No se encontraron clases para este modulo
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Calificaciones */}
          {data?.puntuaciones && data?.puntuaciones?.length > 0 && (
            <div className=" mt-[100px] flex flex-col gap-4 items-center justify-center w-full">
              <span className="text-white font-semibold text-[30px]">
                Puntuaciones
              </span>
              <div className="w-auto h-auto bg-opacity-20 gap-x-8 flex px-10 py-8 rounded-[18px] bg-gray-50 flex-row items-center justify-center">
                {data?.puntuaciones?.map((item, index) => {
                  if (index > 2) return null;
                  return (
                    <div className="w-[160px] gap-y-4 h-[270px] flex flex-col items-center justify-start gap-1">
                      <div className="min-h-[130px] w-[130px] h-[130px] relative rounded-full overflow-hidden">
                        <GlobalImage
                          src={item?.userImage}
                          loader={() => item?.userImage}
                          className="w-full h-full"
                          objectFit="cover"
                          layout="fill"
                        />
                      </div>
                      {renderStars(item?.puntuacion, 20, false)}
                      <span className="text-white font-normal max-w-full max-h-[100px] overflow-hidden break-words ">{item?.descripcion}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <Modal isVisible={showModal} onClose={() => setShowModal(false)} alto={25} ancho={20}>
            <div className="flex flex-col items-center justify-center">
              <FaRegCheckCircle size={50} color="lime"></FaRegCheckCircle>
              <a className="text-2xl text-white">¡Pago realizado!</a>
              <a className="text-2xm text-white mb-4">Disfruta de tu curso</a>
              <button className="h-10 w-32 mb-8 rounded-full text-white" style={{ backgroundColor: '#780EFF' }}
                onClick={() => {
                  //setShowModal(false)
                  //pagar(valuesPay);
                }}
                onClose={() => {
                  setShowModal(false)
                  handleReload()
                }}>Aceptar</button>
            </div>
          </Modal>
        </div>
      );
    }
  };

  return renderContent();
};

export default CursoInfo;
