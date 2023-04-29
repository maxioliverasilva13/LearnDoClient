import Spinner from "components/Spinner/Spinner";
import useGlobalSlice from "hooks/useGlobalSlice";
import { useRouter } from "next/router";
import { useEffect } from "react";
import appRoutes from "routes/appRoutes";
import { useGetCurrentUserQuery, useLazyGetCurrentUserQuery } from "store/services/UserService";


const listOfPublicPath = [
    appRoutes.login(),
    appRoutes.register(),
]

const CheckTokenWrapper = ({ children }) => {

    const { userInfo , handleSetUserInfo, handleSetLoading } = useGlobalSlice();
    const { pathname, push } = useRouter();

    const isPublicPath = listOfPublicPath.includes(pathname);
    
    const [loadCurrentUser, { isLoading, }] = useLazyGetCurrentUserQuery();

    const handleCheckUserInfo = async () => {
        const response = userInfo?.id ? { userInfo } : await loadCurrentUser().unwrap();
        if (response?.userInfo) {
            handleSetUserInfo(response?.userInfo);
            if (isPublicPath) {
                push(appRoutes.home())
            }
        } else {
            if (!isPublicPath) {
                push(appRoutes.login())
            }
        }
    }

    useEffect(() => {
        handleCheckUserInfo();
    }, [pathname, userInfo])

    if (isLoading) {
        return <Spinner />
    }

    return children;
}

export default CheckTokenWrapper;