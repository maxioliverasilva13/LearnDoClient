import Chat from "components/Chat/Chat";
import Spinner from "components/Spinner/Spinner";
import UserChat from "components/UserChat/UserChat";
import useChats from "hooks/useChats";
import useGlobalSlice from "hooks/useGlobalSlice";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useGetMessagesQuery } from "store/services/MessageService";
import { sortChats } from "utils/messages";
import { MdOutlineMessage } from "react-icons/md";
import { Tooltip } from "react-tooltip";
import NewMessage from "components/NewMessage/NewMessage";
import { useFindUserByIdQuery } from "store/services/UserService";

const Message = () => {
  const { userInfo } = useGlobalSlice();
  const { chats, activeChatId, handleSetChatId, handleAddChat } = useChats();
  const uid = userInfo?.id;
  const { isLoading } = useGetMessagesQuery(userInfo?.id, {
    skip: !uid,
  });
  const [activeNewChat, setActiveNewChat] = useState(false);
  const router = useRouter();

  const { asPath = "" } = useRouter();
  const sortedChats = sortChats(chats);
  const queryUid = router?.query?.uid;
  const { data: loadeduserInfo, isLoading: isLoadingUserInfo } =
    useFindUserByIdQuery(
      {
        uid: queryUid,
      },
      {
        skip: queryUid === null || queryUid === undefined || !Number(queryUid),
      }
    );

  const handleGenerateNewChat = (userInfo) => {
    const newChat = {
      ...userInfo,
      lastMessage: "",
      chatId: userInfo?.userId,
      isMyLastMessage: true,
      messages: [],
    };
    handleAddChat(newChat);
  };

  useEffect(() => {
    const hashChatId = asPath?.split("#")[1];
    if (hashChatId) {
      const chatId = hashChatId?.replace("chatId", "");
      if (chatId) {
        try {
          handleSetChatId(Number(chatId));
        } catch (error) {}
      }
    }
  }, []);

  useEffect(() => {
    if (activeChatId) {
      console.log("xd1")
      handleSetChatId(Number(activeChatId));
    }
  }, [activeChatId])

  useEffect(() => {
    if (loadeduserInfo?.ok === true && loadeduserInfo?.userInfo) {
      handleGenerateNewChat(loadeduserInfo?.userInfo);
    }
  }, [loadeduserInfo]);

  if (isLoading || isLoadingUserInfo) {
    return <Spinner />;
  }

  const handleToggleOpenNewChat = () => {
    setActiveNewChat(!activeNewChat);
  };

  return (
    <div className="min-h-screen border-b-white border-b-2 max-h-full w-full flex flex-col items-start justify-start">
      <div className="w-full flex flex-grow min-h-screen h-full flex-row items-start justify-start">
        {/* Chats List */}
        <div className="md:w-[450px] w-[300px] min-h-screen flex-grow flex flex-col border-r-[4px] border-white relative">
          {activeNewChat && (
            <NewMessage handleClose={handleToggleOpenNewChat} />
          )}
          <div className="w-full h-full flex flex-col items-center justify-start p-4">
            <p className="text-white text-[52px] font-bold text-center">
              Chats
            </p>
            <div className="w-full h-auto flex flex-row items-center justify-center gap-4">
              <input
                type="text"
                className="w-full px-4 placeholder-white rounded-full outline-0 my-4 py-2 border-2 border-white bg-transparent text-white text-base"
                placeholder="Buscar"
              />
              <div
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Nuevo mensaje"
                data-tooltip-place="top"
                className="cursor-pointer"
                onClick={handleToggleOpenNewChat}
              >
                <MdOutlineMessage color="white" size={35} />
                <Tooltip id="my-tooltip" clickable />
              </div>
            </div>

            {sortedChats?.map((item) => {
              return <UserChat key={`ChatItem-${item?.chatId}`} {...item} />;
            })}
          </div>
        </div>
        {/* Chat comments */}
        {activeChatId ? (
          <Chat />
        ) : (
          <div className="w-full h-full flex-grow min-h-screen flex flex-col items-center justify-center">
            <img
              src="/img/MessageIlustration.png"
              alt="Image"
              className="object-cover w-auto h-auto m-0"
            />
            <p className="text-white text-[36px] mt-5 font-bold">
              Learn
              <span className="bg-indigo-700 px-2 py-1 m-1 rounded-lg">
                Do
              </span>{" "}
              chat
            </p>
            <span className="text-white mt-5 text-center md:px-20 ">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
              quae optio reiciendis dolorem sequi laboriosam, quas ipsum
              molestiae tempore totam tempora sit sint fuga reprehenderit in
              porro harum odio! Quos!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
