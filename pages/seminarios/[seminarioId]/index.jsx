import useGlobalSlice from "hooks/useGlobalSlice";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import {
  useGetCompleteSeminarioInfoQuery,
  useComprareventoMutation,
} from "store/services/EventoService";
import { generateRandomColor } from "utils/color";
import GlobalImage from "components/GlobalImage/GlobalImage";
import { formatCursoDescripcion } from "utils/evento";
import Link from "next/link";
import appRoutes from "routes/appRoutes";
import NotFoundPage from "components/NotFoundPage/NotFoundPage";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { PayPalButtons } from "@paypal/react-paypal-js";
import Modal from "components/Modal/modal";
import { FaRegCheckCircle } from "react-icons/fa";
import {
  useLazyUsarCuponQuery,
  useValidarCuponQuery,
} from "store/services/CuponService";
import ShareButton from "components/ShareButton/ShareButton";
import { AiOutlineInfoCircle } from "react-icons/ai";
import DealsCard from "components/DealsCard/DealsCard";
import clsx from "clsx";
import { handleGeetDisccount } from "utils/cupon";
import GoogleCalendarAuthBtn from "components/Button/GoogleCalendarAuthBtn";
import CardGananciasAcumuladas from "components/Cards/CardGananciasAcumuladas";

const SeminarioInfo = () => {
  const router = useRouter();
  const { query } = router;
  const seminarioId = query?.seminarioId;

  const { data, isLoading } = useGetCompleteSeminarioInfoQuery({
    seminarioId,
  });
  const { handleSetLoading, userInfo, handleSetUserInfo } = useGlobalSlice();

  const [canUseDiscount, setCanUseDiscount] = useState(false);
  const myCreditsNumber = userInfo?.creditos_number;

  const esComprado = data?.comprado;

  useEffect(() => {
    if (myCreditsNumber >= 10) {
      setCanUseDiscount(true);
    }
  }, [myCreditsNumber]);

  const cuponToken = query?.token;
  const {
    data: tokenValidateResponse,
    isLoading: isLoadingValidateToken,
  } = useValidarCuponQuery(
    { token: cuponToken, cursoId: seminarioId },
    {
      skip: !cuponToken || !seminarioId || isLoading || esComprado,
    }
  );
  const [
    usarCupon,
    { isLoading: isLoadingUsingCupon },
  ] = useLazyUsarCuponQuery();

  const isValidCupon = tokenValidateResponse?.esValido == true;

  const seminarioInfo = data?.seminario;

  useEffect(() => {
    handleSetLoading(
      isLoading || isLoadingValidateToken || isLoadingUsingCupon
    );
  }, [isLoading, isLoadingValidateToken, isLoadingUsingCupon]);

  const [valuesPay, setValuePay] = useState({
    userId: userInfo?.id,
    monto: seminarioInfo?.precio,
    metodoPago: "paypal",
    eventoId: seminarioId,
  });
  const [handlePay] = useComprareventoMutation();

  const [useDiscount, setUseDiscount] = useState(false);

  const isFree = seminarioInfo?.precio <= 0;

  useEffect(() => {
    if (seminarioInfo) {
      setValuePay({
        userId: userInfo?.id,
        monto: seminarioInfo?.precio || 0,
        metodoPago: "paypal",
        eventoId: seminarioInfo.id,
      });
    }
  }, [seminarioInfo, userInfo]);

  const pagar = async (values) => {
    const response = await handlePay({
      ...values,
      useDiscount: useDiscount,
    }).then((res) => {
      // createEvent
    });
    if (response?.data?.ok == true) {
      if (useDiscount) {
        handleSetUserInfo({
          ...userInfo,
          creditos_number: userInfo.creditos_number - 10,
        });
        // handleUpdateUserInfo
      }
    }
  };

  const [showModal, setShowModal] = useState(false);

  const Categorias = useMemo(() => {
    if (!data?.categorias || data?.categorias?.length === 0) {
      return null;
    }
    return (
      <div className="lg:w-full mt-10 m-auto w-[80%] h-auto flex flex-col items-start justify-center gap-y-4 lg:px-28">
        <span className="text-white font-semibold text-[20px]">Categorias</span>

        <div className="lg:w-full w-[80%] h-auto flex flex-row items-center justify-start flex-wrap gap-2">
          {data?.categorias?.map((categoria, index) => {
            return (
              <span
                className={`text-white font-medium px-4 py-2 text-[18px] rounded-lg bg-[#${generateRandomColor()}]`}
                key={index}
              >
                {categoria?.nombre}
              </span>
            );
          })}
        </div>
      </div>
    );
  }, [data?.categorias]);

  const PayPalButtonsWrapper = () => {
    const PAYPAL_CLIENT_ID =
      "ARMjbBZs3Nm__CVEJeKlu6ePlR_XQFuSYPuqFkiPMRPLZpVNeeji9C_Cf1Mit_wj912tqCp7zymLcEY3";
    const initialOptions = {
      "client-id": PAYPAL_CLIENT_ID,
      currency: "USD",
      intent: "capture",
    };

    return (
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          className="h-full w-full z-[20]"
          fundingSource="paypal"
          style={{
            shape: "pill",
            height: 48,
          }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value:
                      (cuponToken && isValidCupon) || useDiscount
                        ? handleGeetDisccount(seminarioInfo?.precio)
                        : seminarioInfo?.precio,
                  },
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            await pagar(valuesPay);
            await usarCupon({
              token: cuponToken,
            });
            setShowModal(true);
            return;
          }}
        />
      </PayPalScriptProvider>
    );
  };

  const handleReload = () => {
    window.location.reload();
  };

  function onClickLink() {
    router.push(appRoutes.zoom(seminarioId));
  }

  const renderContent = () => {
    if (isLoading) {
      return null;
    }
    if (!data?.ok) {
      return <NotFoundPage message="Seminario no encontrado" />;
    } else {
      return (
        <div className="flex flex-col w-full h-auto px-5 lg:px-12 pt-28">
          <div className="w-full h-auto lg:gap-14 flex flex-col flex-wrap lg:flex-nowrap lg:flex-row items-center justify-center">
            <div className="flex lg:w-auto w-[80%] flex-col gap-2">
              <div className="lg:m-0 m-auto w-full lg:w-[520px] lg:min-w-[520px] h-[350px] rounded-lg relative overflow-hidden">
                <GlobalImage
                  src={seminarioInfo?.imagen}
                  loader={() => seminarioInfo?.imagen}
                  className="w-full h-full"
                  objectFit="cover"
                  layout="fill"
                />
              </div>
              <span className="text-white font-semibold text-[28px]">
                {seminarioInfo?.nombre}
              </span>

              {userInfo?.id == seminarioInfo.organizador_id && (
                <CardGananciasAcumuladas
                  gananciasAcumuladas={seminarioInfo.ganancias_acumuladas}
                ></CardGananciasAcumuladas>
              )}
            </div>

            <div className="w-[80%] lg:mt-0 mt-4 lg:max-w-[500px] flex flex-col lg:items-center justify-start">
              <span className="text-white italic font-normal text-[28px] leading-[30px]">
                {formatCursoDescripcion(seminarioInfo?.descripcion)}
              </span>
              <div className="flex my-[30px] w-full italic text-white font-semibold text-sm flex-col items-start justify-start gap-4">
                <p>Modalidad: Virtual</p>
                <p>Profesor: {data?.profesor}</p>
                {esComprado && <p>URL acceso: {seminarioInfo?.link}</p>}
                <p>Fecha: {seminarioInfo?.fecha}</p>
                <p>Hora: {seminarioInfo?.hora}</p>

                {esComprado && seminarioInfo?.link && (
                  <p
                    className="flex items-center gap-2"
                    onClick={() => onClickLink()}
                  >
                    URL acceso:{" "}
                    <a className="cursor-pointer text-sky-600	text-xl">Link</a>{" "}
                  </p>
                )}
                {isValidCupon === false && cuponToken && !esComprado && (
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
              </div>
              {canUseDiscount &&
                !esComprado &&
                !cuponToken &&
                seminarioInfo?.es_pago === 1 && (
                  <div className="w-full my-4 appearsAnimation">
                    <button
                      onClick={() => setUseDiscount(!useDiscount)}
                      className="text-white appearsAnimation transition-all cursor-pointer px-4 py-2 bg-indigo-500 rounded-[20px] shadow-md"
                    >
                      {useDiscount && "No"} Usar 10 puntos
                    </button>
                  </div>
                )}

              <div className="w-auto flex lg:flex-row flex-col  lg:items-center items-start lg:gap-6 gap-2">
                <div className="flex h-full lg:flex-row flex-col lg:items-center gap-3">
                  {!esComprado &&
                    (seminarioInfo?.es_pago === 1 ? (
                      <p
                        className={clsx(
                          "text-white font-semibold text-[20px] -mt-[1px]",
                          (isValidCupon || useDiscount) && "line-through"
                        )}
                      >
                        USD ${seminarioInfo?.precio}
                      </p>
                    ) : (
                      <p className="text-white font-semibold text-[20px]">
                        Gratuito
                      </p>
                    ))}
                  {!esComprado && seminarioInfo?.es_pago === 0 && (
                    <span
                      onClick={() => pagar(valuesPay)}
                      className="text-[18px] cursor-pointer w-full font-Gotham text-center px-8 py-3 text-white rounded-full border-0 bgPrincipal ml-8"
                    >
                      Adquirir
                    </span>
                  )}
                  {esComprado &&
                    // si es presencial botón de ver ubi, sino boton con el link a la página.
                    (seminarioInfo.tipo === "seminarioP" ? (
                      <Link
                        className="cursor-pointer"
                        href={appRoutes.mapaSeminarios()} // falta implementar una forma/modal de ver la ubicación sólo de éste seminario en específico
                      >
                        <span className="text-[18px] cursor-pointer w-full font-Gotham text-center px-5 py-3 text-white rounded-full border-0 bgPrincipal">
                          Ver la Ubicación
                        </span>
                      </Link>
                    ) : (
                      <div />
                    ))}
                </div>

                <div>
                  {esComprado && (
                    <GoogleCalendarAuthBtn
                      nombre={seminarioInfo?.nombre}
                      descripcion={seminarioInfo?.descripcion}
                      duracion={seminarioInfo?.duracion}
                      fecha={seminarioInfo?.fecha}
                      hora={seminarioInfo?.hora}
                      link={seminarioInfo?.link}
                    />
                  )}
                </div>
                <div className="">
                  {userInfo?.id !== seminarioInfo.organizador_id &&
                    !esComprado &&
                    seminarioInfo?.es_pago === 1 && !isFree && <PayPalButtonsWrapper />}

                    {
                      isFree && !esComprado && <span
                      onClick={async () => {
                        await pagar({
                          ...valuesPay,
                        });
                      }}
                      className="text-[20px] min-w-[300px] cursor-pointer w-full font-Gotham text-center px-10 py-3 text-white rounded-full border-0 bgPrincipal"
                    >
                      Obtener
                    </span>
                    }
                </div>
              </div>
              <div className="w-full h-auto flex items-center justify-start">
                {(isValidCupon || useDiscount) && !esComprado && (
                  <DealsCard price={seminarioInfo?.precio} />
                )}
              </div>

              <div className="w-full flex h-max flex-row flex-wrap items-start justify-center gap-5">
                <Modal
                  isVisible={showModal}
                  onClose={() => setShowModal(false)}
                  alto={"30%"}
                  ancho={"40%"}
                >
                  <div className="flex flex-col items-center justify-center">
                    <FaRegCheckCircle size={50} color="lime"></FaRegCheckCircle>
                    <p className="text-2xl text-white mt-8">¡Pago realizado!</p>
                    <p className="text-2xm text-white mb-8">
                      ¡Disfruta de tu seminario!
                    </p>
                    <button
                      className="h-10 w-32 mb-8 rounded-full text-white"
                      style={{ backgroundColor: "#78A132" }}
                      onClick={() => {
                        setShowModal(false);
                        // handleReload();
                        // pagar(valuesPay);
                      }}
                      onClose={() => {
                        setShowModal(false);
                        // handleReload();
                      }}
                    >
                      Aceptar
                    </button>
                  </div>
                </Modal>
              </div>
              {esComprado && (
                <div className="w-full h-auto mt-6 flex items-center justify-start">
                  <ShareButton eventoId={seminarioInfo?.id} />
                </div>
              )}
            </div>
          </div>
          {Categorias}
        </div>
      );
    }
  };

  return renderContent();
};

export default SeminarioInfo;
