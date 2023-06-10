import GlobalImage from "components/GlobalImage/GlobalImage";
import Image from "next/image";
import Link from "next/link";
import appRoutes from "routes/appRoutes";

const UserProgress = ({ userImage, userName, aprobacion, porcentage, userId }) => {
  const formatPorcentaje = () => {
    return `${porcentage}%`;
  };

  const getColorPorcentaje = () => {
    if (porcentage > aprobacion) {
        return "#46C478";
    } else if (porcentage > (aprobacion / 2)) {
        return "#C4A146";
    } else {
        return "#C44646";
    }
  }

  return (
    <div className="w-full h-auto flex flex-row items-center justify-between">
      <Link href={appRoutes.userInfoPage(userId)}>
      <div className="w-auto cursor-pointer h-auto flex flex-row items-center gap-4">
        <div className="w-[64px] relative rounded-full border border-white h-[64px] max-w-[64px] max-h-[64px]">
          <GlobalImage
            src={userImage}
            loader={() => userImage}
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        </div>
        <span className="font-semibold text-white text-[24px] max-w-full overflow-x-hidden truncate">
          {userName}
        </span>
      </div>
      </Link>

      <div
        className="w-full flex flex-grow gap-2 items-center justify-end
    "
      >
        <span className="text-white font-semibold">{formatPorcentaje()}</span>
        <div className="w-[230px] h-[18px] rounded-full border border-white flex flex-row items-center justify-start">
            <div className={`w-[${porcentage}%] h-full rounded-full bg-[${getColorPorcentaje()}]`}>

            </div>
        </div>
      </div>
    </div>
  );
};

export default UserProgress;
