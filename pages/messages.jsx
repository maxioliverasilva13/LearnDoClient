import Chat from "components/Chat/Chat";
import UserChat from "components/UserChat/UserChat";
import useChats from "hooks/useChats";
import { useEffect } from "react";

const defaultChats = [
  {
    userId: 15,
    chatId: 1,
    userName: "Lucia",
    lastMessage: "Hola bro",
    userImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnN8ZW58MHx8MHx8&w=1000&q=80",
    isMyLastMessage: false,
    messages: [
        {
            isFromMe: true,
            message: "Hola bro",
            date: new Date().toString(),
        },
        {
            isFromMe: false,
            message: "Hola Amigo",
            date: new Date().toString(),
        },
        {
            isFromMe: true,
            message: "Que haces amigo",
            date: new Date().toString(),
        }
    ],
  },
  {
    userId: 55,
    chatId: 2,
    userName: "Andres Correa",
    lastMessage: "Tengo una pregunta ,esto es un mensaje largo",
    userImage:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=798&q=80",
    isMyLastMessage: false,
    messages: [],
  },
];

const Message = () => {
  const { handleSetChats, chats, activeChatId } = useChats();

  useEffect(() => {
    handleSetChats(defaultChats);
  }, []);

  return (
    <div className="px-12 pt-[40px] pb-[20px] w-full h-full flex flex-col items-start justify-start">
      <div className="w-full flex flex-grow h-full flex-row items-start justify-start">
        {/* Chats List */}
        <div className="w-[400px] p-2 h-full flex flex-col border-r-[4px] border-white">
        <p className="text-white text-[52px] font-bold text-center mb-4">Chats</p>
          {chats?.map((item) => {
            return <UserChat key={`ChatItem-${item?.chatId}`} {...item} />;
          })}
        </div>
        {/* Chat comments */}
        {
            activeChatId && <Chat />
        }
      </div>
    </div>
  );
};

export default Message;
