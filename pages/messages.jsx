import Chat from "components/Chat/Chat";
import Spinner from "components/Spinner/Spinner";
import UserChat from "components/UserChat/UserChat";
import useChats from "hooks/useChats";
import useGlobalSlice from "hooks/useGlobalSlice";
import { useEffect } from "react";
import { useGetMessagesQuery } from "store/services/MessageService";
import { PUSHER_MESSAGESENT_EVENT_NAME, formatChannelMessageSendName, subscribe } from "utils/pusher";
let addedEvents = false;

const Message = () => {
  const { userInfo } = useGlobalSlice();
  const { handleSetChats, handleAddMessage, chats, activeChatId } = useChats();
  const uid = userInfo?.id;
  const { data = [], isLoading } = useGetMessagesQuery(userInfo?.id, {
    skip: !uid,
  });

  useEffect(() => {
    if (data?.length > 0 && addedEvents == false) {
      addedEvents = true;
      data?.map((item) => {
        const channelName = formatChannelMessageSendName(item?.chatId, userInfo?.id)
        console.log(channelName)
        const subscription = subscribe(channelName);

        console.log("suscripto");
        subscription.bind("createMessage", (data) => {
          const newMessage = data?.message;
          handleAddMessage({
            chatId: item?.chatId,
            message: newMessage,
          })
        })
      })
    }
  }, [data])

  useEffect(() => {
    if (!isLoading && data) {
        handleSetChats(data);
    }
  }, [isLoading]);

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div className="px-12 pt-[40px] pb-[20px] w-full h-full flex flex-col items-start justify-start">
      <div className="w-full flex flex-grow h-full flex-row items-start justify-start">
        {/* Chats List */}
        <div className="w-[400px] p-2 h-full flex flex-col border-r-[4px] border-white">
          <p className="text-white text-[52px] font-bold text-center">
            Chats
          </p>
          <input 
            type="text"
            className="w-full px-4 rounded-full outline-0 my-4 py-2 border-2 border-white bg-transparent text-white text-base"
            placeholder="Buscar"
          />
          {chats?.map((item) => {
            return <UserChat key={`ChatItem-${item?.chatId}`} {...item} />;
          })}
        </div>
        {/* Chat comments */}
        {activeChatId ? (
          <Chat />
        ) : (
          <div className="w-full h-full flex-grow flex flex-col items-center justify-center">
            <img
              src="/img/MessageIlustration.png"
              alt="Image"
              className="object-cover w-auto h-auto m-0"
            />
            <p className="text-white text-[36px] mt-5 font-bold">Learn<span className="bg-indigo-700 px-2 py-1 m-1 rounded-lg">Do</span> chat</p>
            <span className="text-white mt-5 text-center md:px-20 ">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur quae optio reiciendis dolorem sequi laboriosam, quas ipsum molestiae tempore totam tempora sit sint fuga reprehenderit in porro harum odio! Quos!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
