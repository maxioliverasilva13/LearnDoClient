import clsx from "clsx";
import useChats from "hooks/useChats";
import useForm from "hooks/useForm";
import useGlobalSlice from "hooks/useGlobalSlice";
import moment from "moment";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { useCreateMessageMutation } from "store/services/MessageService";

const MessageItem = ({ isFromMe = false, contenido, created_at }) => {
    const hour = moment(created_at).format("hh:mm");
  return (
    <div
      className={clsx(
        "w-full h-auto flex items-center",
        isFromMe ? "justify-end appearsMessageYou" : "justify-start messageAppearsAnimationMe"
      )}
    >
      <div
        className={clsx(
          "w-auto h-auto max-w-fit px-4 py-2 rounded-[24px] flex flex-row items-center justify-start gap-2 font-medium text-[20px]",
          isFromMe ? "bg-[#EAEAEA] text-black" : "bg-[#780EFF] text-white"
        )}
      >
        <span>{contenido}</span>
        <span className="text-[12px] mt-2">{hour}</span>
      </div>
    </div>
  );
};

const Chat = () => {
  const { userInfo } = useGlobalSlice();
  const { activeChatInfo, activeChatId, handleAddMessage } = useChats();
  const { formValues, handleChangeValue } = useForm({
    message: "",
  });
  const [addMessage, { isLoading }] = useCreateMessageMutation();
  const refChat = useRef(null);

  const handleMessageNew = async (uid) => {
    const newMessage = {
      message: formValues?.message,
      user_from_id: userInfo?.id,
      user_to_id: activeChatInfo?.userId,
    };

    const response = await addMessage(newMessage);
    if (response?.data?.ok) {
      handleAddMessage({
        message: response?.data?.message,
        chatId: activeChatId,
      });
      handleChangeValue("message", "")
    }

  };

  useEffect(() => {
    if (refChat?.current) {
      refChat.current?.scrollTo({ top: refChat?.current?.scrollHeight + 6000, });
    }
  }, [activeChatInfo?.messages ])

  // useEffect(() => {
  //   if (refChat?.current) {
  //     const element = document.getElementById("ScrollChats");
  //     element.scrollTop = element?.scrollHeight;
  //   }
  // }, [refChat])

  const renderMessages = () => {
    if ((activeChatInfo?.messages?.length || 0) <= 0) {
      return (
        <div className="flex flex-col items-start justify-start flex-grow h-full w-full">
          <p className="text-white font-semibold w-full text-center mt-4">
            No hay mensajes disponibles
          </p>
        </div>
      );
    }
    return (
      <div id="ScrollChats" ref={refChat} className="w-full px-4 py-4 chat gap-y-8 h-full flex-grow flex flex-col max-h-full overflow-auto">
        {activeChatInfo?.messages?.map((message) => {
          return <MessageItem isFromMe={userInfo?.id === message?.user_from_id} {...message} />;
        })}
      </div>
    );
  };

  return (
    <div className="w-full h-full transition-all flex flex-col items-start justify-start flex-grow max-h-full overflow-auto">
      <div className="w-full shadow-md h-auto transition-all flex flex-row items-center justif-start gap-2 py-4 pl-5">
        <div className="w-[90px] transition-all h-[90px] relative max-w-[90px] max-h-[90px]">
          <Image
            src={activeChatInfo?.userImage}
            loader={() => activeChatInfo?.userImage}
            layout="fill"
            objectFit="cover"
            className="rounded-full transition-all w-full h-full"
          />
        </div>
        <p className="text-white transition-all text-[46px] font-semibold">
          {activeChatInfo?.userName}
        </p>
      </div>
      {renderMessages()}
      <div className="w-full p-4 h-auto flex items-center gap-2 justify-start">
        <input
          onChange={(e) => handleChangeValue("message", e?.target?.value)}
          value={formValues.message}
          placeholder="Escribe un mensaje..."
          className="w-full flex-grow outline-none px-4 h-[60px] text-white bg-transparent border border-white rounded-full"
        />
        <AiOutlineSend
          onClick={handleMessageNew}
          className="cursor-pointer"
          color="white"
          size={50}
        />
      </div>
    </div>
  );
};

export default Chat;
