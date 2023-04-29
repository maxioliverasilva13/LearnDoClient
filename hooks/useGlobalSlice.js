import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import appRoutes from "routes/appRoutes";
import { useGlobalActions } from "store/slices/GlobalSlice";
import { clearToken } from "utils/tokenUtils";

const useGlobalSlice = () => {
    const { userInfo, isLoading } = useSelector((state) => state.GlobalSlice);
    const { push } = useRouter()
    
    const {
        handleSetUserInfo,
        handleSetLoading,
     } = useGlobalActions();
    
    const handleLogout = () => {
        clearToken();
        window.location.href = appRoutes.login();
    }
    
    return {
        userInfo,
        isLoading,
        handleSetLoading,
        handleSetUserInfo,
        handleLogout,
    }
}   

export default useGlobalSlice;