import { useSelector } from "react-redux";
import { useGlobalActions } from "store/slices/GlobalSlice";

const useGlobalSlice = () => {
    const { userInfo } = useSelector((state) => state.GlobalSlice);
    
    const {
        handleSetUserInfo
     } = useGlobalActions();
    
    
    return {
        userInfo,
        handleSetUserInfo
    }
}   

export default useGlobalSlice;