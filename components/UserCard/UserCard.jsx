import GlobalImage from "components/GlobalImage/GlobalImage";
import Link from "next/link";
import appRoutes from "routes/appRoutes";

const UserCard = ({ user, isProfesor = false }) => {
  return (
    <Link href={appRoutes.userInfoPage(user?.id)} key={`userInfoCard-${user?.id}`}>
    <div className="w-full cursor-pointer h-auto flex flex-row items-center justify-start gap-2">
      <div className="w-[40px] min-w-[40px] relative min-h-[40px] h-[40px]">
        <GlobalImage
          src={user?.imagen}
          layout="fill"
          objectFit="cover"
          className="rounded-full"
        />
      </div>
      <div className="w-full h-auto flex-grow flex items-start justify-start truncate overflow-hidden flex-row">
        {isProfesor && <span className="text-white">Profesor:</span>}
        <span className="text-white">{user?.nombre}</span>
      </div>
    </div>
    </Link>
  );
};

export default UserCard;
