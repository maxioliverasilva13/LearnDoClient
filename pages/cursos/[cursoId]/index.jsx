import clsx from "clsx";
import Progress from "components/Progress/Progress";
import useGlobalSlice from "hooks/useGlobalSlice";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { BsFillStarFill } from "react-icons/bs";
import { useGetCompleteCursoInfoQuery } from "store/services/EventoService";
import { generateColorProggress, generateRandomColor } from "utils/color";
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
import Modal from "components/Modal/modal";
import { useComprareventoMutation } from "store/services/EventoService";
import { FaRegCheckCircle } from "react-icons/fa";
import { useCreateCertificateMutation } from "store/services/CertificadoService";

import { useCanGetCertificateQuery } from "store/services/EventoService";
import ShareButton from "components/ShareButton/ShareButton";
import ShareProgress from "components/ShareProgress/ShareProgress";
import CardGananciasAcumuladas from "components/Cards/CardGananciasAcumuladas";




import {
  useLazyUsarCuponQuery,
  useValidarCuponQuery,
} from "store/services/CuponService";
import { AiOutlineInfoCircle } from "react-icons/ai";
import DealsCard from "components/DealsCard/DealsCard";
import { handleGeetDisccount } from "utils/cupon";
import UserCard from "components/UserCard/UserCard";

import { isMobile } from "react-device-detect";
import MobileModulo from "components/MobileModulo/MobileModulo";
import { baseUrl } from "store/baseQueryWithError";

const CursoInfo = () => {
  const router = useRouter();
  const { query } = router;
  const cursoId = query?.cursoId;
  const [openCalificarModal, setOpenCalificarModal] = useState(false);

  const { data, isLoading } = useGetCompleteCursoInfoQuery({ cursoId });
  const { handleSetLoading, userInfo, handleSetUserInfo } = useGlobalSlice();

  const soyColaorador = data?.soyColaorador;

  const myCreditsNumber = userInfo?.creditos_number;
  const [canUseDiscount, setCanUseDiscount] = useState(false);
  const [useDiscount, setUseDiscount] = useState(false);

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
  const cuponToken = query?.token;

  const [certificateID, setCertificateID] = useState(data?.certificateID);

  const stars = data?.stars;
  const countStars = data?.countPuntuaciones;

  const isAlreadyPuntuado =
    data?.puntuaciones?.find((item) => item?.estudiante_id === userInfo?.id) !==
    undefined;

  const esComprada = data?.comprado || false;

  const { data: canGetCertData } = useCanGetCertificateQuery({ cursoId }, {
    skip: userInfo?.type === "organizador" || esComprada === false,
  });

  const [gettingCertificate, setGettingCertificate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { data: tokenValidateResponse, isLoading: isLoadingValidateToken } =
    useValidarCuponQuery(
      { token: cuponToken, cursoId: cursoId },
      {
        skip: !cuponToken || !cursoId || isLoading || esComprada,
      }
    );
  const [usarCupon, { isLoading: isLoadingUsingCupon }] =
    useLazyUsarCuponQuery();
  const [handlePay, { isLoading: isLoadingPay }] = useComprareventoMutation();

  const isValid = tokenValidateResponse?.esValido == true;
  useEffect(() => {
    handleSetLoading(
      isLoading || isLoadingValidateToken || isLoadingPay || isLoadingUsingCupon
    );
  }, [isLoading, isLoadingValidateToken, isLoadingPay, isLoadingUsingCupon]);

  useEffect(() => {
    if (data?.certificateID) {
      setCertificateID(data.certificateID);
    }
  }, [data])

  const [valuesPay, setValuePay] = useState({
    userId: userInfo?.id,
    monto: cursoInfo?.precio,
    metodoPago: "paypal",
    eventoId: cursoId,
  });

  useEffect(() => {
    if (myCreditsNumber >= 10) {
      setCanUseDiscount(true);
    }
  }, [myCreditsNumber]);

  const [createCertificate] = useCreateCertificateMutation();

  useEffect(() => {
    if (cursoInfo) {
      setValuePay({
        userId: userInfo?.id,
        monto: cursoInfo?.precio,
        metodoPago: "paypal",
        eventoId: cursoInfo.id,
      });
    }
  }, [cursoInfo, userInfo]);

  useEffect(() => {
    if (canGetCertData) {
      setCanGetCertificate(canGetCertData.isApproved);
      setProgresoCurso(canGetCertData.avgCalifications);
    }
  }, [canGetCertData]);

  const pagar = async (values) => {
    const response = await handlePay(values);
    if (response?.data?.ok == true) {
      setShowModal(true);

      if (useDiscount) {
        handleSetUserInfo({
          ...userInfo,
          creditos_number: userInfo.creditos_number - 10,
        })
        // handleUpdateUserInfo
      }
    }
  };

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
    createCertificate({ curso_id: cursoId }).then((response) => {
      const { data } = response;
      const { id } = data;
      const certificateDowloadURl = `${baseUrl}/api/certificaciones/${id}/getCertificationPDF`;
      window.open(certificateDowloadURl);
      setCertificateID(id);
      setGettingCertificate(false);
    });
  };

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

  const downloadCertificate = () => {
    if (!certificateID) {
      return;
    }
    const certificateDowloadURl = `${baseUrl}/api/certificaciones/${certificateID}/getCertificationPDF`;
    window.open(certificateDowloadURl);
  };

  const renderEstudianteProgress = () => {
    return (
      <div className="w-full lg:px-[150px] px-5  my-10 gap-5 flex lg:flex-row flex-col items-center justify-between ">
        <div className="flex lg:flex-row flex-col gap-5 items-center">
          <div className="w-auto h-auto flex text-white md:flex-row flex-col gap-5 items-center justify-start">
            <span>Progreso</span>
            <div className="md:w-[420px] h-[20px] w-[300px]">
              <Progress
                porcentage={progresoCurso}
                color={generateColorProggress(
                  cursoInfo.porcentaje_aprobacion,
                  progresoCurso
                )}
              />
            </div>
          </div>

          <div className="flex flex-col text-white justify-center items-center"></div>
          {!certificateID ? (
            <button
              type="button"
              onClick={() => getCertificate()}
              className={
                canGetCertificate
                  ? "flex items-center w-full font-Gotham text-center px-10 py-3 text-white rounded-full border-0 bgPrincipal"
                  : "flex items-center w-full font-Gotham text-center px-10 py-3 text-dark rounded-full border-0 bg-[#dedede] opacity-50 cursor-not-allowed"
              }
              disabled={gettingCertificate || !canGetCertificate}
            >
              Obtener Certificado
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"
                />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => downloadCertificate()}
              className={
                "flex items-center w- font-Gotham text-center px-10 py-3 text-white rounded-full border-0 bgPrincipal"
              }
            >
              Descargar certificado
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>


            </button>)


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
    const PAYPAL_CLIENT_ID =
      "ARMjbBZs3Nm__CVEJeKlu6ePlR_XQFuSYPuqFkiPMRPLZpVNeeji9C_Cf1Mit_wj912tqCp7zymLcEY3";
    const initialOptions = {
      "client-id": PAYPAL_CLIENT_ID,
      currency: "USD",
      intent: "capture",
    };

    return (
      <PayPalScriptProvider
        className="appearsAnimation"
        options={initialOptions}
      >
        <PayPalButtons
          className="h-full appearsAnimation w-full z-[20]"
          fundingSource="paypal"
          //fundingSource = "paypal.FUNDING.PAYPAL"
          //fundingSource={
          //  {
          //  paypal.FUNDING.PAYPAL
          //  }
          //}
          style={{
            shape: "pill",
          }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value:
                      (cuponToken && isValid) || useDiscount
                        ? handleGeetDisccount(precio)
                        : precio,
                  },
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            await pagar({
              ...valuesPay,
              useDiscount: useDiscount
            });
            await usarCupon({
              token: cuponToken,
            });
            //console.log("cvalues " + userInfo.nombre)
            //console.log("cvalues " + valuesPay.userId)
            //console.log("cvalues " + valuesPay.eventoId)
            //console.log("cvalues " + valuesPay.metodoPago)
            //console.log("cvalues " + valuesPay.monto)
            //console.log("cvalues " + cursoInfo.precio)
            return;
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
    if (isLoading || isLoadingValidateToken) {
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
          <Modal
            isVisible={showModal}
            onClose={() => setShowModal(false)}
            alto={"auto"}
            ancho={"400px"}
          >
            <div className="flex flex-col items-center justify-center">
              <FaRegCheckCircle size={50} color="lime"></FaRegCheckCircle>
              <p className="text-2xl text-white mt-8">¡Pago realizado!</p>
              <p className="text-2xm text-white mb-8">Disfruta de tu curso</p>
              <button
                className="h-10 w-32 mb-8 rounded-full text-white"
                style={{ backgroundColor: "#78A132" }}
                onClick={() => {
                  setShowModal(false);
                  //pagar(valuesPay);
                }}
                onClose={() => {
                  setShowModal(false);
                }}
              >
                Aceptar
              </button>
            </div>
          </Modal>
          <div className="w-full appearsAnimation h-auto md:gap-[50px] flex lg:flex-row flex-col lg:items-start items-center justify-center">
            <div className="flex lg:w-auto w-full flex-col lg:items-start items-center lg:mb-0 mb-5 gap-2">
              <div className="md:w-[520px] md:min-w-[520px] max-w-[520px] w-full h-[350px] rounded-[20px] relative overflow-hidden">
                <GlobalImage
                  src={cursoImage}
                  loader={() => cursoImage}
                  className="w-full h-full"
                  objectFit="cover"
                  layout="fill"
                />
              </div>
              <span className="text-white appearsAnimation font-semibold text-[28px]">
                {cursoNombre}
              </span>

              {
                userInfo?.id == cursoInfo.organizador_id && (
                  <CardGananciasAcumuladas gananciasAcumuladas={cursoInfo.ganancias_acumuladas}></CardGananciasAcumuladas>
                 
                )
              }

            </div>

            <div className="w-[400px] appearsAnimation max-w-[400px] flex flex-col items-center justify-start">
              <span className="text-white italic font-normal text-[28px] leading-[30px]">
                {formatCursoDescripcion(cursoDescripcion)}
              </span>
              <div className="flex appearsAnimation my-[30px] w-full italic text-white font-semibold text-sm flex-col items-start justify-start gap-4">
                <Stars
                  stars={stars}
                  size={20}
                  needsCount={true}
                  justifyStart={true}
                  countStars={countStars}
                />
                <p>Total de Clases: {getCantClases()}</p>
                <p>Modalidad: Virtual</p>
                <UserCard user={profesor} isProfesor />
              </div>
              {esComprada ? (
                <div className="flex justify-between">
                  <Link
                    className="cursor-pointer "
                    href={appRoutes.foroPage(data?.foroId)}
                  >
                    <span
                      to={appRoutes.foroPage(data?.foroId)}
                      className="text-[20px] min-w-[300px] cursor-pointer w-full font-Gotham text-center px-10 py-3 text-white rounded-full border-0 bgPrincipal"
                    >
                      Ir al foro
                    </span>
                  </Link>
                </div>
              ) : (
                <div className="w-full appearsAnimation h-auto flex flex-col gap-4">
                  {isValid === false && cuponToken && !esComprada && (
                    <div className="w-full flex flex-row items-center justify-start gap-2">
                      <AiOutlineInfoCircle
                        color="rgb(220 38 38 / var(--tw-text-opacity))"
                        size={25}
                      />
                      <span className="text-red-600 font-medium">
                        Cupon Invalido
                      </span>
                    </div>
                  )}
                  {canUseDiscount &&
                    !esComprada &&
                    !cuponToken &&
                    cursoInfo?.es_pago === 1 && (
                      <div className="w-full my-4 appearsAnimation">
                        <button
                          onClick={() => setUseDiscount(!useDiscount)}
                          className="text-white appearsAnimation transition-all cursor-pointer px-4 py-2 bg-indigo-500 rounded-[20px] shadow-md"
                        >
                          {useDiscount && "No"} Usar 10 puntos
                        </button>
                      </div>
                    )}
                  <div className="w-full appearsAnimation flex flex-row items-start justify-center gap-[60px]">
                    <span
                      className={clsx(
                        "text-white font-semibold flex flex-col gap-1 text-[20px]"
                      )}
                    >
                      {cursoInfo?.es_pago === 1 ? (
                        <span
                          className={clsx(
                            cuponToken && isValid && "line-through"
                          )}
                        >
                          USD${precio}
                        </span>
                      ) : (
                        <div className="w-full h-auto flex flex-row items-center justify-start gap-4">
                          <span>Gratuito</span>
                          <span
                            onClick={async () => {
                              await pagar({
                                ...valuesPay,
                              });
                            }}
                            className="text-[20px] min-w-[300px] cursor-pointer w-full font-Gotham text-center px-10 py-3 text-white rounded-full border-0 bgPrincipal"
                          >
                            Obtener
                          </span>
                        </div>
                      )}

                      {(isValid || useDiscount) && !esComprada && (
                        <DealsCard price={precio} />
                      )}
                    </span>
                    {userInfo?.id !== cursoInfo.organizador_id &&
                      cursoInfo?.es_pago === 1 && <PayPalButtonsWrapper />}
                  </div>
                </div>
              )}
              {esComprada && (
                <div className="lg:w-full w-auto h-auto items-center mt-4 justify-start">
                  <ShareButton eventoId={cursoInfo?.id} />
                </div>
              )}
            </div>
          </div>
          {esComprada && renderEstudianteProgress()}
          {esComprada && <div className="w-full my-4 md:m-0 m-auto md:w-auto w-full">
          <ShareProgress
                nombreUsuario={userInfo?.nombre}
                progress={progresoCurso}
                courseName={cursoInfo?.nombre}
                averageApprove={cursoInfo?.porcentaje_aprobacion}
              ></ShareProgress>
          </div>}

          {Categorias}

          <div className="w-full mt-5  h-auto flex flex-col gap-2 items-center overflow-auto justify-start">
            {data?.modulos?.map((item) => {
              return (
                <MobileModulo
                  cursoInfo={cursoInfo}
                  esComprada={esComprada}
                  cursoId={cursoId}
                  {...item}
                />
              );
            })}
          </div>

          <div className="w-full h-auto flex items-center justify-end">
            {soyColaorador && (
              <Link href={appRoutes.cursoSugerir(cursoInfo?.id)}>
                <button className="text-white my-5 px-4 py-2 border border-white rounded-full font-semibold cursor-pointer flex file:flex-row items-center transition-all transform hover:scale-105 text-base group-[]:">
                  Colaborar
                </button>
              </Link>
            )}
          </div>
          {/* Calificaciones */}
          {data?.puntuaciones && data?.puntuaciones?.length > 0 && (
            <div className=" mt-[100px] flex flex-col gap-4 items-center justify-center w-full">
              <span className="text-white font-semibold text-[30px]">
                Puntuaciones
              </span>
              <div className="w-auto h-auto bg-opacity-20 gap-x-8 flex px-10 py-8 rounded-[18px] bg-gray-50 flex-row items-center justify-center flex-wrap">
                {data?.puntuaciones?.map((item, index) => {
                  if (index > 2) return null;
                  return (
                    <Link href={appRoutes.userInfoPage(item?.estudiante_id)} key={`puntuacionItem-${index}`}>
                      <div className="w-[160px] cursor-pointer gap-y-4 h-[270px] flex flex-col items-center justify-start gap-1">
                        <div className="min-h-[130px] w-[130px] h-[130px] relative rounded-full overflow-hidden">
                          <GlobalImage
                            src={item?.userImage}
                            loader={() => item?.userImage}
                            className="w-full h-full"
                            objectFit="cover"
                            layout="fill"
                          />
                        </div>
                        <Stars
                          stars={item?.puntuacion}
                          size={20}
                          needsCount={false}
                        />
                        <span className="text-white font-normal max-w-full max-h-[100px] overflow-hidden break-words ">
                          {item?.descripcion}
                        </span>
                      </div>
                    </Link>
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
