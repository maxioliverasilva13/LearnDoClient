import Auth from "layouts/Auth";
import Link from "next/link";
import appRoutes from "routes/appRoutes";
import { AiFillCheckCircle } from "react-icons/ai";
import { MdCancel } from "react-icons/md";

import { useRouter } from "next/router";
import { useActivateMutation } from "store/services/UserService";
import Spinner from "components/Spinner/Spinner";
import { useEffect, useState } from "react";
import { storageToken } from "utils/tokenUtils";
import useGlobalSlice from "hooks/useGlobalSlice";

const Activate = () => {
  const { query } = useRouter();

  const [activeUser, { isSuccess }] = useActivateMutation();
  const [customIsLoading, setCustomIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const { handleSetUserInfo } = useGlobalSlice();

  const token = query?.token;

  const handleActivateUser = async () => {
    const resposne = await activeUser({ uid: token });
    setCustomIsLoading(false);
    console.log(resposne);
    if (resposne?.data?.ok === false) {
      setError("Usuario no encontrado");
    } else if (resposne?.data?.access_token) {
      setError(null);
      setResponse(resposne?.data);
    }
  };

  useEffect(() => {
    handleActivateUser();
  }, []);

  const onSignIn = () => {
    const userInfo = response?.user;
    const token = response.access_token;
    storageToken(token);
    handleSetUserInfo(userInfo);
    window.location.href = appRoutes.home();
  };

  if (customIsLoading === true) {
    return <Spinner />;
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="md:w-[450px] rounded-lg relative bg-white h-auto px-6 py-4 roudned-lg shadow-md">
        {error !== null ? (
          <div className="w-full h-auto flex flex-col itms-center justify-center">
            <MdCancel size={30} color="red" className="m-auto" />
            <h1 className="font-bold text-gray-900 text-center">{error}</h1>
          </div>
        ) : (
          <div className="w-auto bg-white rounded-md h-auto px-6 py-4 flex flex-col items-center justify-center">
            <h1 className="font-bold text-gray-900 text-center">
              Cuenta activada correctamente
            </h1>
            <div className="relative w-full w-[200px] h-auto h-auto">
              <img
                src="/img/AccountActivationIlustartion.png"
                alt="Image"
                className="object-cover w-[300px] h-[200px] m-auto"
              />
            </div>
            <span className="text-center flex flex-col items-center my-2 justify-start px-6 font-medium my-2 text-gray-900">
              <AiFillCheckCircle size={30} color="green" />
              Su cuenta se activo correctamente
            </span>
            <p className="text-center px-6 font-medium my-2 flex cursor-pointer gap-2 text-yellow-800 underline">
              <span onClick={onSignIn} href={appRoutes.login()}>
                Iniciar sesion
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
Activate.layout = Auth;

export default Activate;
