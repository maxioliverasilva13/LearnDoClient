import useGlobalSlice from "hooks/useGlobalSlice";
import Link from "next/link";
import appRoutes from "routes/appRoutes";
import { AiOutlineHome } from "react-icons/ai";
import { BsCardChecklist } from "react-icons/bs";
import { MdOutlineEventAvailable } from "react-icons/md";
import { CiSaveDown1 } from "react-icons/ci";
import { FcStatistics } from "react-icons/fc";

import { useRouter } from "next/router";

const MobileNavbar = () => {
  const { userInfo } = useGlobalSlice();
  const { pathname } = useRouter();

  const getColor = (path) => {
    if (pathname === path || pathname?.includes(path)) {
      return "#6ffcee";
    } else {
      return "white";
    }
  };

  return (
    <div className="w-full h-[76px] fixed border-t-2 border-[#272831] bottom-0 left-0 bg-black bg-opacity-60 z-[50] flex flex-row items-center justify-center gap-4">
      {userInfo?.type === "estudiante" && (
        <div className="w-full px-10 h-auto flex flex-row items-center justify-around">
          <Link href={appRoutes.home()}>
            <div className="w-auto cursor-pointer h-auto flex flex-col items-center justify-center gap-1">
              
              <AiOutlineHome size={22} color={getColor("/home")} />
              <span
                className={`hover:text-gray-400 font-semibold cursor-pointer text-[${getColor(
                  "/home"
                )}]`}
              >
                Inicio
              </span>
            </div>
          </Link>
          <Link href={appRoutes.guardados()}>
            <div className="w-auto cursor-pointer h-auto flex flex-col items-center justify-center gap-1">
              <CiSaveDown1 size={22} color={getColor("/savedClases")} />

              <span
                className={`hover:text-gray-400 font-semibold cursor-pointer text-[${getColor(
                  "/savedClases"
                )}]`}
              >
                Guardados
              </span>
            </div>
          </Link>
          <Link href={appRoutes.cursos()}>
            <div className="w-auto cursor-pointer h-auto flex flex-col items-center justify-center gap-1">
              <BsCardChecklist size={22} color={getColor("/cursos")} />

              <span
                className={`hover:text-gray-400 font-semibold cursor-pointer text-[${getColor(
                  "/cursos"
                )}]`}
              >
                Cursos
              </span>
            </div>
          </Link>
          <Link href={appRoutes.misCursos()}>
            <div className="w-auto cursor-pointer h-auto flex flex-col items-center justify-center gap-1">
              <MdOutlineEventAvailable
                size={22}
                color={getColor("/mis_cursos")}
              />

              <span
                className={`hover:text-gray-400 cursor-pointer font-semibold text-[${getColor(
                  "/mis_cursos"
                )}]`}
              >
                Comprados
              </span>
            </div>
          </Link>
        </div>
      )}

      {userInfo?.type === "organizador" && (
        <div className="w-full px-10 h-auto flex flex-row items-center justify-around">
          <Link href={appRoutes.guardados()}>
            <div className="w-auto cursor-pointer h-auto flex flex-col items-center justify-center gap-1">
              <FcStatistics size={22} color={getColor("/savedClases")} />

              <span
                className={`hover:text-gray-400 font-semibold cursor-pointer text-[${getColor(
                  "/savedClases"
                )}]`}
              >
                Dashboard
              </span>
            </div>
          </Link>
          <Link href={appRoutes.misCursosAdmin()}>
            <div className="w-auto cursor-pointer h-auto flex flex-col items-center justify-center gap-1">
              <MdOutlineEventAvailable
                size={22}
                color={getColor("/mis_cursos")}
              />

              <span
                className={`hover:text-gray-400 cursor-pointer font-semibold text-[${getColor(
                  "/mis_cursos"
                )}]`}
              >
                Mis cursos
              </span>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MobileNavbar;
