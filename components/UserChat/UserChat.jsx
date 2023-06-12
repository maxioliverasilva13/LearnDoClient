import clsx from "clsx";
import GlobalImage from "components/GlobalImage/GlobalImage";
import useChats from "hooks/useChats";
import useGlobalSlice from "hooks/useGlobalSlice";
import moment from "moment";
import Image from "next/image";
import { useRef } from "react";
import { MessageIsRead } from "utils/messages";

const UserChat = ({
  lastMessage,
  userImage,
  userName = "",
  isMyLastMessage = false,
  chatId,
}) => {
  const ref = useRef();
  const getLastMessage = () => {
    if (!lastMessage) {
      return "";
    }
    let firstPart = isMyLastMessage ? "Tu:" : `${userName?.split(0, 10)}:`;
    return firstPart + lastMessage?.contenido;
  };
  const { handleSetChatId, activeChatId } = useChats();
  const { userInfo } = useGlobalSlice();
  const isActiveChat = activeChatId === chatId;

  const handleActiveChat = () => {
    handleSetChatId(chatId);
  };

  const isReadLastMessage = !lastMessage
    ? true
    : MessageIsRead(lastMessage, userInfo?.id);

  const fromNow = moment(lastMessage?.created_at).fromNow();

  return (
    <div
      id={`chatId${chatId}`}
      onClick={handleActiveChat}
      className={clsx(
        " w-full cursor-pointer hover:bg-gray-700 py-4 rounded-md transition-all bg-red h-auto gap-x-2 flex flex-row items-center justify-start max-w-full"
      )}
    >
      <div
        className={clsx(
          "w-[8px] h-full transition-all",
          isActiveChat && "bg-indigo-500 rounded-md"
        )}
      ></div>
      <div className="w-[60px] max-h-[90px] min-w-[60px] min-h-[60px] relative max-w-[90px] h-[60px] rounded-full overflow-hidden">
        <GlobalImage
          src={userImage}
          loader={() => userImage}
          layout="fill"
          objectFit="cover"
          className="rounded-full w-full h-full"
        />
      </div>
      <div
        ref={ref}
        className="w-full max-w-full overflow-hidden flex-grow flex flex-col items-start justify-start "
      >
        <p className="text-white max-w-full truncate text-16 font-semibold">
          {userName}
        </p>
        <span className="text-white text-left w-full max-w-full truncate font-medium">
          {getLastMessage()}
        </span>
      </div>
      <div className="w-auto h-auto flex flex-col items-center justify-center gap-2 mr-4">
        {!isReadLastMessage && (
          <div className="w-[12px] min-w-[12px] min-h-[12px] h-[12px] rounded-full bg-indigo-500"></div>
        )}
        <span className="text-white text-[12px] min-w-max">{fromNow}</span>
      </div>
    </div>
  );
};

export default UserChat;
