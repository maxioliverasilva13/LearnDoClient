import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import appRoutes from "routes/appRoutes";
import { useGlobalActions } from "store/slices/GlobalSlice";
import { clearToken } from "utils/tokenUtils";

const useGlobalSlice = () => {
    const { userInfo, isLoading, error } = useSelector((state) => state.GlobalSlice);
    const { push } = useRouter()
    const rol = userInfo?.type;
    
    const {
        handleSetUserInfo,
        handleSetLoading,
     } = useGlobalActions();
    
    const handleLogout = () => {
        clearToken();
        window.location.href = appRoutes.landing();
    }
    
    return {
        userInfo,
        isLoading,
        handleSetLoading,
        handleSetUserInfo,
        handleLogout,
        rol,
        error,
    }
}   

export default useGlobalSlice;