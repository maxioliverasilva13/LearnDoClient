import { createSlice, current } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

const initialState = {
  chats: [],
  isLoading: false,
  activeChatId: null,
};

export const ChatsSlice = createSlice({
  name: "ChatSlice",
  initialState,
  reducers: {
    setChats(state, { payload }) {
      state.chats = payload;
    },
    addChat(state, { payload }) {
      state.chats.push(payload);
    },
    setChatId(state, {payload}) {
        state.activeChatId = payload;
    },
    addMessage(state, { payload }) {
      const chatId = payload?.chatId;
      const newMessage = payload?.message;

      state.chats = current(state?.chats)?.map((item) => {
        if (item?.chatId === chatId) {
          return {
            ...item,
            messages: [...item?.messages, newMessage],
            lastMessage: newMessage?.message,
          };
        }
        return item;
      })

    },
    setIsLoading(state, { payload }) {
      state.isLoading = payload;
    },
  },
  extraReducers: {},
});

export const useChatsSlice = () => {
  const dispatch = useDispatch();

  const handleSetChats = (data) => {
    dispatch(ChatsSlice.actions.setChats(data));
  };

  const handleAddChat = (data) => {
    dispatch(ChatsSlice.actions.addChat(data));
  };

  const handleAddMessage = (data) => {
    dispatch(ChatsSlice.actions.addMessage(data));
  };

  const handleSetChatId = (chatId) => {
    dispatch(ChatsSlice.actions.setChatId(chatId));
  };

  return {
    handleSetChats,
    handleAddChat,
    handleAddMessage,
    handleSetChatId,
  };
};

export default ChatsSlice.reducer;
