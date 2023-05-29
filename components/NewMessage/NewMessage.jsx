import GlobalImage from "components/GlobalImage/GlobalImage";
import LottieLoading from "components/LottieLoading/LottieLoading";
import { useEffect, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import {
  useLazyFilterByNicknameOrEmailQuery,
} from "store/services/UserService";

import { TbMessage2Share } from "react-icons/tb"
import clsx from "clsx";
import useChats from "hooks/useChats";
import { useRouter } from "next/router";
import appRoutes from "routes/appRoutes";
import NoResults from "components/NotFoundPage/NoResults";

let timer = 0;
let timer2 = 0;
const NewMessage = ({ handleClose }) => {
  const { chats, handleAddChat } = useChats();
  const [query, setQuery] = useState();
  const [searchPeople, { isLoading }] = useLazyFilterByNicknameOrEmailQuery();
  const [results, setResults] = useState([]);
  const [shouldClose, setShouldClose] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const { push } = useRouter();

  useEffect(() => {
    if (query) {
      setIsSearching(true);
      clearInterval(timer);
      timer = setTimeout(async () => {
        setIsSearching(false);
        const response = await searchPeople(query);
        setResults(response?.data);
      }, 1000);
    }
  }, [query]);

  const handleChange = (e) => {
    setQuery(e?.target?.value);
  };

  const handleShouldClose = () => {
    clearInterval(timer2);
    setShouldClose(true);
    timer2 = setTimeout(() => {
      handleClose();
    }, 500)
  }

  const handleCreateNewChat = (userInfo) => {
    handleShouldClose();
    const newChat = {
      userId: userInfo?.id,
      userName: userInfo?.nombre,
      lastMessage: "",
      chatId: userInfo?.id,
      userImage: userInfo?.imagen,
      isMyLastMessage: true,
      messages: []
  }
    handleAddChat(newChat);
    push(`${appRoutes.messages()}#${userInfo?.id}`)
  }

  return (
    <div className={clsx("w-full p-4 z-[30] top-0 linear messageAppearsAnimationMe h-full absolute bg-[#780EFF] bg-opacity-25 backdrop-blur-md flex flex-col items-center justify-start overflow-hidden transition-all ",
      shouldClose ? "-left-[450px]" : 'left-0'
    )}>
      <div className="w-full flex flex-row items-center jsutify-start p-4 gap-5">
        <MdArrowBack
          size={30}
          className="cursor-pointer"
          onClick={handleShouldClose}
          color="white"
        />
        <span className="text-white font-semibold text-[20px]">
          Nuevo Mensaje
        </span>
      </div>
      <input
        type="text"
        onChange={handleChange}
        className="w-full px-4 rounded-full outline-0 my-4 py-2 border-2 border-white bg-transparent text-white text-base"
        placeholder="Buscar persona..."
      />

      {isLoading || isSearching ? (
        <LottieLoading />
      ) : (
        <div className="w-full flex flex-col items-center justify-start gap-2">
          {
            results?.length === 0 && !isLoading && !isSearching && <NoResults message="Sin resultados" />
          }
          {results?.map((user) => {
            return (
              <div
                className="w-full h-auto p-4 shadow-b-md rounded-lg gap-4 flex flex-row items-center jsutify-start"
                key={`userItem-${user?.id}`}
              >
                <div className="w-[60px] min-w-[60px] h-[60px] rounded-full relative overflow-hidden">
                  <GlobalImage
                    src={user?.imagen}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="flex-grow w-full flex flex-col items-start justify-center">
                <span className="text-white font-medium max-w-full overflow-hidden truncate" >Nick:{user?.nickname}</span>
                <span className="text-white font-medium max-w-full overflow-hidden truncate" >{user?.nombre}</span>
                  </div>
                  <TbMessage2Share onClick={() => handleCreateNewChat(user)} className="cursor-pointer" color="white" size={50} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NewMessage;
