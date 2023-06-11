import useGlobalSlice from "hooks/useGlobalSlice";
import { useEffect } from "react";
import { useGetMessagesQuery } from "store/services/MessageService";
import { formatChannelMessageSendName, subscribe } from "utils/pusher";
// import messageSound from "../../sounds/Notification.mp3";
import useSound from "use-sound";
import useChats from "hooks/useChats";
import Image from "next/image";
import AlertMessage from "components/AlertMessage/AlertMessage";
import { useRouter } from "next/router";
import { listOfPublicPath } from "utils/pageUtils";

let addedEvents = false;
const MessageWrapper = ({ children }) => {
  const { userInfo } = useGlobalSlice();
  // const [play] = useSound(messageSound);
  const {
    handleAddMessage,
    handleAddTemporalMessage,
    temporalMessages,
    handleSetChats,
  } = useChats();

  const { pathname } = useRouter();

  const isPublicPath = listOfPublicPath.includes(pathname);

  const uid = userInfo?.id;
  const { data = [], isLoading } = useGetMessagesQuery(userInfo?.id, {
    skip: !uid || isPublicPath,
  });

  useEffect(() => {
    if (!isLoading && data) {
      handleSetChats(data);
    }
  }, [isLoading]);

  useEffect(() => {
    if (data?.length > 0 && addedEvents == false) {
      addedEvents = true;
      data?.map((item) => {
        const channelName = formatChannelMessageSendName(
          item?.chatId,
          userInfo?.id
        );
        const subscription = subscribe(channelName);

        subscription.bind("createMessage", (data) => {
          const newMessage = data?.message;
          // play();
          handleAddMessage({
            chatId: item?.chatId,
            message: newMessage,
          });
          handleAddTemporalMessage({
            ...newMessage,
            userName: item?.userName,
            chatId: item?.chatId,
            userImage: item?.userImage,
          });
        });
      });
    }
  }, [data]);

  return (
    <>
      {temporalMessages && temporalMessages?.length > 0 && <div className="w-[300px] z-[350] h-full absolute p-2 gap-2 flex flex-col items-start justify-start top-0 right-0 overflow-auto">
        {temporalMessages?.map((message) => {
          return (
            <AlertMessage key={`alertMessage-${message?.id}`} {...message} />
          );
        })}
      </div>}
      {children}
    </>
  );
};

export default MessageWrapper;
