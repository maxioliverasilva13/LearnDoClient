import { useSelector } from "react-redux";
import { useChatsSlice } from "store/slices/ChatsSlice";
import useGlobalSlice from "./useGlobalSlice";

const useChats = () => {
  const { chats = [], activeChat, temporalMessages } = useSelector((state) => state.ChatsSlice);
  const activeChatInfo = chats?.find((item) => item?.chatId === activeChat);
  const { userInfo } = useGlobalSlice();

  const activeChatId = activeChat;

  const {
    handleAddChat,
    handleSetChats,
    handleAddMessage,
    handleSetChatId,
    handleAddTemporalMessage,
    handleChangeIsRead,
  } = useChatsSlice();

  const noReadsMessages = chats?.filter((item) => {
    return item?.lastMessage?.isRead === "0" && item?.lastMessage?.user_from_id !== userInfo?.id;
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
