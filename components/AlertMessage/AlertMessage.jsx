import Image from "next/image";
import Link from "next/link";
import appRoutes from "routes/appRoutes";

const AlertMessage = ({ userName, userImage, contenido, chatId }) => {
  return (
    <Link href={`${appRoutes.messages()}#chatId${chatId}`}>
      <div className="w-full gap-2 appearsMessage h-[80px] p-4 bg-gray-200 rounded-lg shadow-md flex flex-row items-center justify-start">
        <div className="w-[55px] h-[55px] relative rounded-full overflow-hidden">
          <Image
            src={userImage}
            loader={() => userImage}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="flex-grow max-w-full truncate overflow-hidden h-full flex flex-col">
          <span className="text-blueGray-950 text-[14px] font-semibold">
            Nuevo mensaje!
          </span>
          <span className="text-blueGray-950 text-[12px] font-semibold">
            {userName}: {contenido}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default AlertMessage;
