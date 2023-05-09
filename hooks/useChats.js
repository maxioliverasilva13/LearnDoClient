import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import appRoutes from "routes/appRoutes";
import { useChatsSlice } from "store/slices/ChatsSlice";
import { useGlobalActions } from "store/slices/GlobalSlice";
import { clearToken } from "utils/tokenUtils";

const useChats = () => {
  const { chats, activeChatId } = useSelector((state) => state.ChatsSlice);
  const activeChatInfo = chats?.find((item) => item?.chatId === activeChatId );

  const { handleAddChat, handleSetChats, handleAddMessage, handleSetChatId } =
    useChatsSlice();

  return {
    chats,
    activeChatId,
    activeChatInfo,
    handleAddChat,
    handleSetChats,
    handleAddMessage,
    handleSetChatId,
  };
};

export default useChats;
