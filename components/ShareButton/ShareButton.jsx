import Modal from "components/Modal/modal";
import useGlobalSlice from "hooks/useGlobalSlice";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { IoIosShare } from "react-icons/io";
import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappIcon,
  WhatsappShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share";
import { useCreateCuponMutation } from "store/services/CuponService";
import { RxCopy } from "react-icons/rx"
import { FcApproval } from "react-icons/fc"


const ShareButton = React.memo(({ eventoId }) => {
  const [openModal, setOpenModal] = useState(false);
  
  const [urlToShare, setUrlToShare] = useState(window.location.href);
  const [createCupon, { isLoading }] = useCreateCuponMutation();
  const { userInfo } = useGlobalSlice();

  const handleGenerateCupon = async () => {
    const response = await createCupon({
      evento_id: eventoId,
      user_id_from: userInfo?.id,
    });
    console.log("response is", response);
    if (response?.data?.ok) {
      setUrlToShare(`${urlToShare}?token=${response?.data?.token}`)
    }
  };

  const handleCopyLink = () => {
    if (navigator) {
      navigator.clipboard.writeText(urlToShare);
    }
  }

  useEffect(() => {
    if (openModal) {
      handleGenerateCupon();
    }
  }, [openModal]);

  return (
    <div>
      <Modal
        isVisible={openModal}
        alto="400px"
        ancho="600px"
        onClose={() => setOpenModal(false)}
      >
        <span className="text-white font-semibold text-[20px]">
          Compartir curso
        </span>
        {isLoading ? (
          <div className="w-full h-auto mt-10 flex items-center justify-center ">
            <span className="text-white text-[20px] font-semibold">
              Generando Cupon
            </span>
          </div>
        ) : (
          <div className="w-full gap-2 flex-wrap h-auto mt-10 flex flex-row items-center justify-center">
            <span className="text-green-300 my-2 font-medium text-[20px] text-center flex items-center justify-center gap-2"><FcApproval size={30} color="rgb(134 239 172 / var(--tw-text-opacity)" /> Cupon generado correctamente</span>
            <span className="text-white px-4 mb-2 font-medium text-[14px] text-center">Este cupon tendra una duracion de 5 dias, y solo podra ser utilizado una vez, otorgando 10 puntos si es usado al momento de realizar una compra</span>

            <div className="w-full gap-2 mb-4 h-auto p-4 max-w-full overflow-hidden bg-gray-600 rounded-lg flex flex-row items-center justify-between">
              <span className="text-white flex-grow w-full max-w-[100%] truncate overflow-hidden ">{urlToShare}</span>
              <RxCopy onClick={() => handleCopyLink()} size={20} color="white" className="cursor-pointer" />
            </div>
            <FacebookShareButton url={urlToShare} title="Share Facebook">
              <FacebookIcon className="mx-2 rounded-full" />
            </FacebookShareButton>
            <WhatsappShareButton url={urlToShare} title="Share Whatsapp">
              <WhatsappIcon className="mx-2 rounded-full" />
            </WhatsappShareButton>
            <TwitterShareButton url={urlToShare} title="Share Whatsapp">
              <TwitterIcon className="mx-2 rounded-full" />
            </TwitterShareButton>
          </div>
        )}
      </Modal>
      <div
        onClick={() => setOpenModal(true)}
        className="w-full flex flex-row items-center justify-start gap-2"
      >
        <IoIosShare
          className="transition-all transform hover:scale-125 cursor-pointer hover:text-white"
          size={30}
          color="#780EFF"
          fontSize="20"
          fontWeight="700"
        />
        <span className="text-white font-medium text-lg">Compartir</span>
      </div>
    </div>
  );
});

export default ShareButton;
