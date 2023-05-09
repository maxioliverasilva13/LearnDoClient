import clsx from "clsx";
import useChats from "hooks/useChats";
import Image from "next/image";
import { useRef } from "react";

const UserChat = ({
  lastMessage,
  userImage,
  userName = "",
  isMyLastMessage = false,
  chatId,
}) => {
    const ref = useRef();
  const getLastMessage = () => {
    let firstPart = isMyLastMessage ? "Tu:" : `${userName?.split(0, 10)}:`;
    return firstPart + lastMessage;
  };
  const { handleSetChatId, activeChatId } = useChats();
  const isActiveChat = activeChatId === chatId;

  const handleActiveChat = () => {
    handleSetChatId(chatId);
  }

  return (
    <div onClick={handleActiveChat} className={clsx("bg-opacity-60  w-full cursor-pointer hover:bg-white px-4 py-4 rounded-md transition-all bg-red h-auto gap-x-2 flex flex-row items-center justify-start max-w-full",
    )}>
        <div className={clsx("w-[4px] h-full transition-all", isActiveChat && "bg-indigo-500 rounded-md")}>
        </div>
      <div className="w-[90px] max-h-[90px] min-w-[90px] min-h-[90px] relative max-w-[90px] h-[90px] rounded-full overflow-hidden">
        <Image
          src={userImage}
          loader={() => userImage}
          layout="fill"
          objectFit="cover"
          className="rounded-full w-full h-full"
        />
      </div>
      <div ref={ref} className="w-full max-w-full overflow-hidden flex-grow flex flex-col items-start justify-start ">
        <p className="text-white max-w-full truncate text-[36px] font-semibold">{userName}</p>
        <span className="text-white text-left w-full max-w-full truncate font-medium">
          {getLastMessage()}
        </span>
      </div>
    </div>
  );
};

export default UserChat;
