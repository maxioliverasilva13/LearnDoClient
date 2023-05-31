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
import apiRoutes from "routes/apiRoutes";

import NotFoundPage from "components/NotFoundPage/NotFoundPage";
import ClaseCard from "components/ClaseCard/ClaseCard";
import CreateEvaluacionModal from "components/Modals/CreateEvaluacionModal";
import PuntuacionText from "components/PuntuacionText/PuntuacionText";
import Stars from "components/Stars/Stars";
import { PayPalScriptProvider, loadScript } from "@paypal/react-paypal-js";
import { PayPalButtons } from "@paypal/react-paypal-js";
import Modal from "components/Modal/modal"
import { useComprareventoMutation } from "store/services/EventoService";
import { FaRegCheckCircle } from "react-icons/fa";
import { useCreateCertificateMutation } from "store/services/CertificadoService";
import { useCanGetCertificateQuery } from "store/services/CursoService";

const CursoInfo = () => {
  const router = useRouter();
  const { query } = router;
  const cursoId = query?.cursoId;
  const [openCalificarModal, setOpenCalificarModal] = useState(false);

  const { data, isLoading } = useGetCompleteCursoInfoQuery({ cursoId });
  const { data: canGetCertData } = useCanGetCertificateQuery({ cursoId });
  const { handleSetLoading, userInfo } = useGlobalSlice();

  const [evaluacionToDo, setEvaluacionToDo] = useState(null);

  const cursoInfo = data?.curso;

  const cursoImage = cursoInfo?.imagen;
  const cursoDescripcion = cursoInfo?.descripcion;
  const profesor = data?.profesor;
  const precio = cursoInfo?.precio;
  const [progresoCurso, setProgresoCurso] = useState(0);
  const [canGetCertificate, setCanGetCertificate] = useState(false);
  const cursoNombre = cursoInfo?.nombre;
  const [activeModuloId, setActiveModulo] = useState(null);

  const [certificateID, setCertificateID] = useState(data?.certificateID);

  const stars = data?.stars;
  const countStars = data?.countPuntuaciones;

  const isAlreadyPuntuado =
    data?.puntuaciones?.find((item) => item?.estudiante_id === userInfo?.id) !==
    undefined;

  const esComprada = data?.comprado;
  const [gettingCertificate, setGettingCertificate] = useState(false);


  useEffect(() => {
    handleSetLoading(isLoading);
  }, [isLoading]);

  const [valuesPay, setValuePay] = useState({
    userId: userInfo?.id,
    monto: cursoInfo?.precio,
    metodoPago: "paypal",
    eventoId: cursoId,
  })
  const [handlePay] = useComprareventoMutation();

  const [createCertificate] = useCreateCertificateMutation();

  useEffect(() => {
    if (cursoInfo) {
      setValuePay({
        userId: userInfo?.id,
        monto: cursoInfo?.precio,
        metodoPago: "paypal",
        eventoId: cursoInfo.id,
      })
    }
  }, [cursoInfo, userInfo])

  useEffect(() => {
    if (canGetCertData) {
      setCanGetCertificate(canGetCertData.isApproved);
      setProgresoCurso(canGetCertData.avgCalifications)
    }
  }, canGetCertData);

  const pagar = async (values) => {
    const response = await handlePay(values);
    if (response?.data?.statusCode === 200) {
      console.log("esta funcando re bien")
    }
  }

  const [showModal, setShowModal] = useState(false);

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

  const getCertificate = () => {
    setGettingCertificate(true);
    createCertificate({ curso_id: cursoId }).then(response => {
      const { data } = response;
      const { id } = data;
      const certificateDowloadURl = `http://localhost:8000/api/certificaciones/${id}/getCertificationPDF`;
      window.open(certificateDowloadURl);
      setCertificateID(id);
      setGettingCertificate(false);
    });
  }

  const item = 1;
  const Categorias = useMemo(() => {
    if (!data?.categorias || data?.categorias?.length === 0) {
      return null;
    }
    return (
      <div className="w-full h-auto flex flex-col items-start justify-center gap-y-4">
        <span className="text-white font-semibold text-[20px]">Categorias</span>

        <div className="w-full h-auto flex flex-row items-center justify-start flex-wrap gap-2">
          {data?.categorias?.map((categoria) => {
            return (
              <span
                className={`text-white font-medium px-4 py-2 text-[18px] rounded-lg bg-[#${generateRandomColor()}]`}
              >
                {categoria?.nombre}
              </span>
            );
          })}
        </div>
      </div>
    );
  }, [data?.categorias]);

  const getCantClases = () => {
    var cantClases = 0;
    data?.modulos?.map((item) => {
      cantClases += item?.clases?.length;
      return item;
    });
    return cantClases;
  };

  
  const downloadCertificate = ()=>{
    if(!certificateID){
      return;
    }
    const certificateDowloadURl = `http://localhost:8000/api/certificaciones/${certificateID}/getCertificationPDF`;
    window.open(certificateDowloadURl);
  };

  const renderEstudianteProgress = () => {
    return (
      <div className="w-full md: px-[150px]  my-10 flex flex-row items-center justify-between ">
        <div className="flex gap-5 items-center">
          <div className="w-auto h-auto flex text-white gap-4 flex-row items-center justify-start">
            <span>Progreso</span>
            <div className="md:w-[420px] h-[20px]">
              <Progress porcentage={progresoCurso} />
            </div>
          </div>
          {
            !certificateID ? (
              <button type="button" onClick={() => getCertificate()} className={canGetCertificate ? 'flex items-center w-full font-Gotham text-center px-10 py-3 text-white rounded-full border-0 bg-[#780EFF]' : 'flex items-center w-full font-Gotham text-center px-10 py-3 text-dark rounded-full border-0 bg-[#dedede] opacity-50 cursor-not-allowed'} disabled={gettingCertificate}>
                Obtener Certificado
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                </svg>
                {
                  gettingCertificate && (
                    <svg aria-hidden="true" class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-[#780EFF] fill-[#780EFF]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                  )
                }

              </button>
            ): <button type="button" onClick={() => downloadCertificate()} className={'flex items-center w-full font-Gotham text-center px-10 py-3 text-white rounded-full border-0 bg-[#780EFF]' }>
                Descargar certificado
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
           

          </button>


          }


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

    const handleReload = () => {
      window.location.reload();
    };

    return (
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          className="h-full w-full z-[20]"
          fundingSource="paypal"
          //fundingSource = "paypal.FUNDING.PAYPAL"
          //fundingSource={
          //  {
          //  paypal.FUNDING.PAYPAL
          //  }
          //}
          style={
            {
              shape: "pill"
            }
          }
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
            await pagar(valuesPay);
            //console.log("cvalues " + userInfo.nombre)
            //console.log("cvalues " + valuesPay.userId)
            //console.log("cvalues " + valuesPay.eventoId)
            //console.log("cvalues " + valuesPay.metodoPago)
            //console.log("cvalues " + valuesPay.monto)
            //console.log("cvalues " + cursoInfo.precio)
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

            <div className="w-auto max-w-[400px] flex flex-col items-center justify-start">
              <span className="text-white italic font-normal text-[28px] leading-[30px]">
                {formatCursoDescripcion(cursoDescripcion)}
              </span>
              <div className="flex my-[30px] w-full italic text-white font-semibold text-sm flex-col items-start justify-start gap-4">
                <Stars stars={stars} size={20} needsCount={true} justifyStart={true} countStars={countStars} />
                <p>Total Clases:{getCantClases()}</p>
                <p>Modalidad: Virtual</p>
                <p>Profesor: {profesor}</p>
              </div>
              {esComprada ? (
                <div className="flex justify-between">
                  <Link
                    className="cursor-pointer "
                    href={appRoutes.foroPage(data?.foroId)}
                  >
                    <span
                      to={appRoutes.foroPage(data?.foroId)}
                      className="text-[20px] min-w-[300px] cursor-pointer w-full font-Gotham text-center px-10 py-3 text-white rounded-full border-0 bg-[#780EFF]"
                    >
                      Ir al foro
                    </span>



                  </Link>

                </div>




              ) : (
                <div className="w-full flex flex-row items-start justify-center gap-[60px]">
                  <span className="text-white font-semibold text-[20px]">
                    USD${precio}
                  </span>
                  <PayPalButtonsWrapper />
                  <Modal isVisible={showModal} onClose={() => setShowModal(false)} alto={"30%"} ancho={"40%"}>
                    <div className="flex flex-col items-center justify-center">
                      <FaRegCheckCircle size={50} color="lime"></FaRegCheckCircle>
                      <a className="text-2xl text-white mt-8">¡Pago realizado!</a>
                      <a className="text-2xm text-white mb-8">Disfruta de tu curso</a>
                      <button className="h-10 w-32 mb-8 rounded-full text-white" style={{ backgroundColor: '#780EFF' }}
                        onClick={() => {
                          setShowModal(false)
                          handleReload()
                          //pagar(valuesPay);
                        }}
                        onClose={() => {
                          setShowModal(false)
                          handleReload()
                        }}>Aceptar</button>
                    </div>
                  </Modal>
                </div>
              )}
            </div>
          </div>
          {esComprada && renderEstudianteProgress()}
          {Categorias}

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
                      <Stars stars={item?.puntuacion} size={20} needsCount={false} />
                      <span className="text-white font-normal max-w-full max-h-[100px] overflow-hidden break-words ">
                        {item?.descripcion}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      );
    }
  };

  return renderContent();
};

export default CursoInfo;