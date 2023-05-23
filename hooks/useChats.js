import { useSelector } from "react-redux";
import { useChatsSlice } from "store/slices/ChatsSlice";

const useChats = () => {
  const { chats = [], activeChatId, temporalMessages } = useSelector((state) => state.ChatsSlice);
  const activeChatInfo = chats?.find((item) => item?.chatId === activeChatId);

  const {
    handleAddChat,
    handleSetChats,
    handleAddMessage,
    handleSetChatId,
    handleAddTemporalMessage,
    handleChangeIsRead,
  } = useChatsSlice();

  const noReadsMessages = chats?.filter((item) => {
    return item?.lastMessage?.isRead === "0";
  }) || []

  return {
    chats,
    activeChatId,
    activeChatInfo,
    handleAddChat,
    handleSetChats,
    handleAddMessage,
    handleSetChatId,
    handleChangeIsRead,
    temporalMessages,
    handleAddTemporalMessage,
    noReadsMessages,
  };
};

export default useChats;
