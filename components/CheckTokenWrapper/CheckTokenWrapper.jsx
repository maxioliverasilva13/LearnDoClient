import Navbar from "components/Navbars/AdminNavbar";
import Spinner from "components/Spinner/Spinner";
import useGlobalSlice from "hooks/useGlobalSlice";
import { useRouter } from "next/router";
import { useEffect } from "react";
import appRoutes from "routes/appRoutes";
import { useLazyGetCurrentUserQuery } from "store/services/UserService";
import { listOfAuthPages, listOfPublicPath } from "utils/pageUtils";
import { initPusher } from "utils/pusher";
import { getToken } from "utils/tokenUtils";


const CheckTokenWrapper = ({ children }) => {
    const { userInfo , handleSetUserInfo, handleSetLoading } = useGlobalSlice();
    const { pathname, push } = useRouter();

    const isPublicPath = listOfPublicPath.includes(pathname);
    const isAuthPage = listOfAuthPages.includes(pathname);

    useEffect(() => {
        if (userInfo?.id) {
            initPusher();
        }
    }, [userInfo])

    const [loadCurrentUser, { isLoading, }] = useLazyGetCurrentUserQuery();

    const handleCheckUserInfo = async () => {
        const response = userInfo?.id ? { userInfo } : await loadCurrentUser().unwrap();
        if (response?.userInfo) {
            handleSetUserInfo(response?.userInfo);
            if (isAuthPage) {
                push(appRoutes.home())
            }
        } else {
            if (!isPublicPath) {
                push(appRoutes.login())
            }
        }
    }

    useEffect(() => {
        const token = getToken();
        if (token) {
            handleCheckUserInfo();
        } else {
            if (!isPublicPath) {
                push(appRoutes.login())
            }
        }
    }, [pathname, userInfo])

    if (isLoading) {
        return <Spinner />
    }

    return <div id="ScrollableContainer" className=" w-full h-full flex flex-col items-start justify-start max-h-screen overflow-auto">
        {!isPublicPath && <Navbar />}
        <div className="max-h-full flex-grow w-full h-full">
        {children}
        </div>
    </div>;
}

export default CheckTokenWrapper;