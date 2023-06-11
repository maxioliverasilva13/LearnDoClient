import React, { useState } from "react";
import Link from "next/link";
import GoogleIcon from "../../public/img/GoogleIcon.png";
import FacebookIcon from "../../public/img/FacebookLogo.png";
import LogoTwitter from "../../public/img/LogoTwitter.png";

import randomEmail from "random-email";
import Auth from "layouts/Auth.js";
import {
  useSignInMutation,
  useSignUpWithExternalServiceMutation,
} from "store/services/UserService";
import Alert from "components/Popups/Alert";
import { storageToken } from "utils/tokenUtils";
import useGlobalSlice from "hooks/useGlobalSlice";
import Spinner from "components/Spinner/Spinner";
import Image from "next/image";
import {
  signInWithFacebook,
  signInWithGoogle,
  signInWithTwitter,
} from "../../firebase.js";
import { useLinkedIn } from "react-linkedin-login-oauth2";
import axios from "axios";

export default function Login() {
  const [showAlert, setShowAlert] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(
    "Email o contraseña invalidos"
  );
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const { handleSetUserInfo, handleSetLoading } = useGlobalSlice();
  const [handleSignIn, { isLoading }] = useSignInMutation();
  const [checking, setChecking] = useState(false);
  const [signUpWithExternalService, { isLoading: isLoadingCreate }] =
    useSignUpWithExternalServiceMutation();

  const handleChangeValues = (value, key) => {
    setValues({
      ...values,
      [key]: value,
    });
  };

  // Form params: user (puede contener email o nickname), password, remember (checkbox).

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = document.getElementById("user").value;
    const remember = document.getElementById("customCheckLogin").value;
    if (!user) {
      setShowAlert(true);
    }

    if (!values.email || !values.password) {
      setShowAlert(true);
      return;
    }

    try {
      setChecking(true);
      const response = await handleSignIn(values);
      if (response?.error || response?.error?.data) {
        setChecking(false);
        setShowAlert(true);
      } else {
        if (response?.data?.access_token) {
          setShowAlert(false);
          const token = response?.data?.access_token;
          const userInfo = response?.data?.user;
          storageToken(token);
          handleSetUserInfo(userInfo);
        } else {
          setChecking(false);
          setShowAlert(true);
        }
      }
    } catch (error) {
      setChecking(false);
      setShowAlert(true);
    }
  };

  const handleLoginWithGoogle = async () => {
    const user = await signInWithGoogle();
    if (user) {
      const newDataUsser = {
        nombre: user?.displayName,
        imagen: user?.photoURL,
        email: user?.email,
        telefono: user?.phoneNumber,
        nickname: user?.displayName,
      };

      const response = await signUpWithExternalService(newDataUsser);
      if (response?.data?.token) {
        setShowAlert(false);
        const token = response?.data?.token;
        storageToken(token);
        window.location.reload();
      } else {
        setErrorMessage("Ocurrio un error inesperado , intentalo nuevamente");
      }
    } else {
      setShowAlert(true);
    }
  };

  const handleLoginWithFacebook = async () => {
    const user = await signInWithFacebook();
    if (user) {
      const userEmail =
        user?.email ||
        randomEmail({
          domain: "gmail.com",
        });
      const newDataUsser = {
        nombre: user?.displayName,
        imagen: user?.photoURL,
        email: userEmail,
        telefono: user?.phoneNumber,
        nickname: user?.displayName,
        uid: user?.uid,
      };

      const response = await signUpWithExternalService(newDataUsser);
      if (response?.data?.token) {
        setShowAlert(false);
        const token = response?.data?.token;
        storageToken(token);
        window.location.reload();
      } else {
        setErrorMessage("Ocurrio un error inesperado , intentalo nuevamente");
      }
    } else {
      setShowAlert(true);
    }
  };

  const handleTwitterLogin = async () => {
    const user = await signInWithTwitter();
    if (user) {
      const userEmail =
        user?.email ||
        randomEmail({
          domain: "gmail.com",
        });
      const newDataUsser = {
        nombre: user?.displayName,
        imagen: user?.photoURL,
        email: userEmail,
        telefono: user?.phoneNumber,
        nickname: user?.displayName,
        uid: user?.uid,
      };

      const response = await signUpWithExternalService(newDataUsser);
      if (response?.data?.token) {
        setShowAlert(false);
        const token = response?.data?.token;
        storageToken(token);
        window.location.reload();
      } else {
        setErrorMessage("Ocurrio un error inesperado , intentalo nuevamente");
      }
    } else {
      setShowAlert(true);
    }
  };

  return (
    <>
      {checking && <Spinner />}
      <div className="container m-auto md:w-[600px] px-4 h-full">
        <div className="flex flex-col content-center items-center justify-center h-full">
          {showAlert ? (
            <div className="lg:w-auto min-w-[content] w-full">
              <Alert
                text={errorMessage}
                color="bg-red-500"
                show={true}
                important={true}
                icon={<i className="fas fa-bell" />}
              />
            </div>
          ) : null}
          <div className="w-full">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
              <div className="flex-auto px-4 lg:px-10 py-10">
                <div className="text-blueGray-400 text-center mb-3 font-bold">
                  <small>Inicia sesión utilizando tus credenciales</small>
                </div>
                <form action="#" method="POST" onSubmit={handleSubmit}>
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="user"
                    >
                      Email o Nickname
                    </label>
                    <input
                      type="text"
                      id="user"
                      name="user"
                      autoComplete="username"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Email o Nickname"
                      required
                      value={values.email}
                      onChange={(e) =>
                        handleChangeValues(e?.target?.value, "email")
                      }
                    />
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="password"
                    >
                      Contraseña
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      autoComplete="current-password"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Contraseña"
                      value={values.password}
                      onChange={(e) =>
                        handleChangeValues(e?.target?.value, "password")
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        id="customCheckLogin"
                        type="checkbox"
                        name="remember"
                        value={"yes"}
                        className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                      />
                      <span className="ml-2 text-sm font-semibold text-blueGray-600">
                        Recordar mis credenciales
                      </span>
                    </label>
                  </div>

                  <div className="text-center mt-6">
                    <button
                      className="bg-blue-800 text-white active:bg-blue-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      type="submit"
                    >
                      Iniciar sesión
                    </button>
                  </div>

                  <button
                    onClick={handleLoginWithGoogle}
                    type="button"
                    className="bg-white mt-2 w-full py-2 rounded-md border border-gray-200 flex flex-row items-center justify-center gap-4"
                  >
                    <div className="relative w-[30px] h-[32px]">
                      <Image src={GoogleIcon} layout="fill" objectFit="cover" />
                    </div>
                    Continuar con google
                  </button>

                  <button
                    onClick={handleLoginWithFacebook}
                    type="button"
                    className="bg-white mt-2 w-full py-2 rounded-md border border-gray-200 flex flex-row items-center justify-center gap-4"
                  >
                    <div className="relative w-[30px] h-[30px]">
                      <Image
                        src={FacebookIcon}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    Continuar con Facebook
                  </button>

                  {
                    <button
                      onClick={handleTwitterLogin}
                      type="button"
                      className="bg-white mt-2 w-full py-2 rounded-md border border-gray-200 flex flex-row items-center justify-center gap-4"
                    >
                      <div className="relative w-[30px] h-[30px]">
                        <Image
                          src={LogoTwitter}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                      Continuar con Twitter
                    </button>
                  }
                </form>
              </div>
            </div>
            <div className="flex flex-wrap mt-6 relative">
              <div className="w-1/2">
                <a
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                  className="text-gray-800"
                >
                  <small>Olvidaste Contrasña?</small>
                </a>
              </div>
              <div className="w-1/2 text-right">
                <Link href="/auth/register">
                  <a href="#pablo" className="text-gray-800">
                    <small>Crear cuenta</small>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Login.layout = Auth;
