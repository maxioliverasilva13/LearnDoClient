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

const SeminarioInfo = () => {
  const router = useRouter();
  const { query } = router;
  const seminarioId = query?.seminarioId;

  const { data, isLoading } = useGetCompleteSeminarioInfoQuery({ seminarioId });
  const { handleSetLoading, userInfo } = useGlobalSlice();

  const seminarioInfo = data?.seminario;

  const esComprado = data?.comprado;

  useEffect(() => {
    handleSetLoading(isLoading);
  }, [isLoading]);

  const [valuesPay, setValuePay] = useState({
    userId: userInfo?.id,
    monto: seminarioInfo?.precio,
    metodoPago: "paypal",
    eventoId: seminarioId,
  });
  const [handlePay] = useComprareventoMutation();

  useEffect(() => {
    if (seminarioInfo) {
      setValuePay({
        userId: userInfo?.id,
        monto: seminarioInfo?.precio,
        metodoPago: "paypal",
        eventoId: seminarioInfo.id,
      });
    }
  }, [seminarioInfo, userInfo]);

  const pagar = async (values) => {
    const response = await handlePay(values);
    if (response?.data?.statusCode === 200) {
      console.log("esta funcando re bien");
    }
  };

  const [showModal, setShowModal] = useState(false);

  const Categorias = useMemo(() => {
    if (!data?.categorias || data?.categorias?.length === 0) {
      return null;
    }
    return (
      <div className="w-full h-auto flex flex-col items-start justify-center gap-y-4 md:px-28">
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
                    value: seminarioInfo?.precio,
                  },
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            await pagar(valuesPay);
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

  const renderContent = () => {
    if (isLoading) {
      return null;
    }
    if (!data?.ok) {
      return <NotFoundPage message="Seminario no encontrado" />;
    } else {
      return (
        <div className="flex flex-col w-full h-auto sm:px-12 pt-28">
          <div className="w-full h-auto md:gap-14 flex flex-col flex-wrap md:flex-nowrap md:flex-row items-center justify-center">
            <div className="flex flex-col gap-2">
              <div className="w-[520px] h-[350px] rounded-lg relative overflow-hidden">
                <GlobalImage
                  src={seminarioInfo?.imagen}
                  loader={() => seminarioInfo?.imagen}
                  className="w-full h-full"
                  objectFit="object-scale-down"
                  layout="fill"
                />
              </div>
              <span className="text-white font-semibold text-[28px]">
                {seminarioInfo?.nombre}
              </span>
            </div>

            <div className="w-full md:max-w-[500px] flex flex-col md:items-center justify-start">
              <span className="text-white italic font-normal text-[28px] leading-[30px]">
                {formatCursoDescripcion(seminarioInfo?.descripcion)}
              </span>
              <div className="flex my-[30px] w-full italic text-white font-semibold text-sm flex-col items-start justify-start gap-4">
                <p>Modalidad: Virtual</p>
                <p>Profesor: {data?.profesor}</p>
                <p>URL acceso: {seminarioInfo?.link}</p>
              </div>
              <div className="w-full flex items-center gap-6">
                <div className="flex items-center self-start">
                  {seminarioInfo?.es_pago === 1 ? (
                    <span className="text-white font-semibold text-[20px]">
                      USD${seminarioInfo?.precio}
                    </span>
                  ) : (
                    <span className="text-white font-semibold text-[20px]">
                      Gratuito
                    </span>
                  )}
                </div>
                <div className="h-max">
                  {(esComprado || seminarioInfo.es_pago === 0) &&
                    // si es presencial botón de ver ubi, sino boton con el link a la página.
                    (seminarioInfo.tipo === "seminarioP" ? (
                      <Link
                        className="cursor-pointer"
                        href={appRoutes.mapaSeminarios()} // falta implementar una forma/modal de ver la ubicación sólo de éste seminario en específico
                      >
                        <span className="text-[18px] cursor-pointer w-full font-Gotham text-center px-10 py-3 text-white rounded-full border-0 bg-[#780EFF]">
                          Ver la Ubicación
                        </span>
                      </Link>
                    ) : (
                      <a className="cursor-pointer" href={`https://` + seminarioInfo.link}>
                        <span
                          className="text-[18px] cursor-pointer w-full font-Gotham text-center px-10 py-3 text-white rounded-full border-0 bg-[#780EFF]"
                        >
                          Acceder a la página
                        </span>
                      </a>
                    ))}
                </div>
                <div className="">
                  {userInfo?.id !== seminarioInfo.organizador_id &&
                    !esComprado &&
                    seminarioInfo?.es_pago === 1 && <PayPalButtonsWrapper />}
                </div>
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
                      style={{ backgroundColor: "#780EFF" }}
                      onClick={() => {
                        setShowModal(false);
                        // handleReload();
                        pagar(valuesPay);
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
