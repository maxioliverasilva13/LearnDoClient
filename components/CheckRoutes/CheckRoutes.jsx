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
    appRoutes.landing(),
    appRoutes.messages(),
    appRoutes.profile(),
    appRoutes.foroPage(),
    appRoutes.mapaSeminarios(),
    appRoutes.createCurso(),
    appRoutes.createSeminario(),
    appRoutes.misCursosAdmin(),
    appRoutes.progresoEstudiantes(),
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
    appRoutes.cursoSugerir(),
]

const CheckRoutes = ({children}) => {
    const { pathname } = useRouter();
    const { userInfo } = useGlobalSlice();
    const role = userInfo?.type;
    const isPublicPath = listOfPublicPath.includes(pathname);
    const [isValidPath, setIsValidPath] = useState(null);

    useEffect(() => {
        if (!isPublicPath) {
            if (role) {
                if (role === roles.estudiante) {
                    setIsValidPath(estudiantesPaths?.includes(pathname))
                }
                if (role === roles.organizador) {
                    setIsValidPath(organizadorPaths?.includes(pathname))
                }
            }
        }
       
    }, [pathname, isPublicPath, role])

    if (isValidPath === null && !isPublicPath) {
        return <Spinner />
    }
    if (isValidPath === false) {
        return <NotFoundPage />
    }
    return <div>
        {children}
    </div>
}

export default CheckRoutes;