import Footer from "components/Footers/Footer";
import Navbar from "components/Navbars/AdminNavbar";
import Spinner from "components/Spinner/Spinner";
import useGlobalSlice from "hooks/useGlobalSlice";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ToastContainer, toast, Slide } from "react-toastify";
import appRoutes from "routes/appRoutes";
import { useLazyGetCurrentUserQuery } from "store/services/UserService";
import { listOfAuthPages, listOfPublicPath } from "utils/pageUtils";
import { initPusher } from "utils/pusher";
import { getToken } from "utils/tokenUtils";
import "react-toastify/dist/ReactToastify.min.css";

const CheckTokenWrapper = ({ children }) => {
  const { userInfo, handleSetUserInfo } = useGlobalSlice();
  const { pathname, push } = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  const isPublicPath = listOfPublicPath.includes(pathname);
  const isAuthPage = listOfAuthPages.includes(pathname);
  useEffect(() => {
    if (userInfo?.id) {
      initPusher();
    }
  }, [userInfo]);

  const [loadCurrentUser, { isLoading }] = useLazyGetCurrentUserQuery();

  const handleCheckUserInfo = async () => {
    const response = userInfo?.id
      ? { userInfo }
      : await loadCurrentUser().unwrap();
    if (response?.userInfo) {
      handleSetUserInfo(response?.userInfo);
      if (isAuthPage) {
        const type = response?.userInfo?.type;
        push(type == "organizador" ? appRoutes.dashboard() : appRoutes.home());
      }
      setIsChecking(false);
    } else {
      setIsChecking(false);
      if (!isPublicPath) {
        push(appRoutes.login());
      }
    }
  };

  useEffect(() => {
    const token = getToken();
    if (token) {
      handleCheckUserInfo();
    } else {
      setIsChecking(false);
      if (!isPublicPath) {
        push(appRoutes.login());
      }
    }
  }, [pathname, userInfo]);

  useEffect(() => {
    if (userInfo && !isPublicPath) {
      setIsChecking(false);
    }
    if (userInfo && !userInfo?.type) {
      push(appRoutes.selectRole());
    }
  }, [userInfo, isPublicPath]);

  if (isLoading || isChecking) {
    return <Spinner />;
  }

  return (
    <div
      id="ScrollableContainer"
      className=" w-full h-full flex flex-col items-start justify-start max-h-screen overflow-auto"
    >
      {!isPublicPath && <Navbar />}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="light"
        transition={Slide}
      />
      <div className="max-h-full flex-grow w-full h-full">
        <div className="min-h-screen">{children}</div>
        {!isPublicPath && <Footer />}
      </div>
    </div>
  );
};

export default CheckTokenWrapper;
