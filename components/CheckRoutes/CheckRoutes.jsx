import NotFoundPage from "components/NotFoundPage/NotFoundPage";
import Spinner from "components/Spinner/Spinner";
import useGlobalSlice from "hooks/useGlobalSlice";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import appRoutes from "routes/appRoutes";
import { listOfPublicPath } from "utils/pageUtils";

const roles = {
    estudiante: "estudiante",
    organizador: "organizador",
}

const organizadorPaths = [
    appRoutes.dashboard(),
    appRoutes.messages(),
    appRoutes.profile(),
    appRoutes.foroPage(),
    appRoutes.mapaSeminarios(),
    appRoutes.createCurso(),
    appRoutes.createSeminario(),
    appRoutes.misCursosAdmin(),
    appRoutes.progresoEstudiantes(),
    appRoutes.selectRole(),
    appRoutes.editCurso(),
    appRoutes.cursoPage(),
    appRoutes.seminarioPage(),
    appRoutes.progresoEstudiantes(),
    appRoutes.userInfoPage(),
    appRoutes.zoom(),
    appRoutes.guardados(),
]

const estudiantesPaths = [
    appRoutes.home(),
    appRoutes.cursoPage(),
    appRoutes.clasePage(),
    appRoutes.landing(),
    appRoutes.misCursos(),
    appRoutes.messages(),
    appRoutes.profile(),
    appRoutes.foroPage(),
    appRoutes.mapaSeminarios(),
    appRoutes.seminarios(),
    appRoutes.cursos(),
    appRoutes.selectRole(),
    appRoutes.cursoSugerir(),
    appRoutes.seminarioPage(),
    appRoutes.userInfoPage(),
    appRoutes.zoom(),
    appRoutes.guardados(),
]

const CheckRoutes = ({children}) => {
    const { pathname, push } = useRouter();
    const { userInfo } = useGlobalSlice();
    const role = userInfo?.type;
    const isPublicPath = listOfPublicPath.includes(pathname);
    const [isValidPath, setIsValidPath] = useState(null);
    const isInRolePage = appRoutes.selectRole() === pathname;

    useEffect(() => {
        if (!isPublicPath) {
            if (role) {
                if (role === roles.estudiante) {
                    setIsValidPath(estudiantesPaths?.includes(pathname))
                }
                if (role === roles.organizador) {
                    setIsValidPath(organizadorPaths?.includes(pathname))
                }
            } else {
                if (!isInRolePage) push(appRoutes.selectRole())
            }
        }
       
    }, [pathname, isPublicPath, role])

    useEffect(() => {
        if (role && isInRolePage) {
            if (role === roles.estudiante) {
                push(appRoutes.home())
            }
            if (role === roles.organizador) {
                push(appRoutes.dashboard())
            }
        }
    }, [role, isInRolePage])
    
    if (!isInRolePage) {
        if (isValidPath === null && !isPublicPath) {
            return <Spinner />
        }
        if (isValidPath === false) {
            return <NotFoundPage />
        }
    }

    if (role && isInRolePage) {
        return null;
    }
  
    return <div className="w-full h-full">
        {typeof window !== "undefined" && children}
    </div>
}

export default CheckRoutes;