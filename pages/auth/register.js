import React, { useEffect, useState } from "react";
import Dropdown from "react-dropdown";

import Alert from "components/Popups/Alert";

// layout for page

import Auth from "layouts/Auth.js";

// Firebase
import storage from "firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import useForm from "hooks/useForm";
import Button from "components/Button/Button";
import {
  useLazyCheckNicknameQuery,
  useSignUpMutation,
} from "store/services/UserService";
import VerifyAccount from "components/VerifyAccount/VerifyAccount";
import appRoutes from "routes/appRoutes";
import { rolOptions } from "utils/rol";
let timer = null;

const availableTypes = {
  availabe: "Available",
  notAvailable: "NotAvailable",
  checking: "Checking",
  nothing: "nothing",
};

export default function Register() {
  const [profileImage, setProfileImage] = React.useState(null);
  const [userCreatedCorrect, setUserCreatedCorrect] = React.useState(false);
  const [passMatch, setPassMatch] = React.useState(true);
  const [error, setError] = useState({
    show: false,
    message: "",
  });
  const [nickValue, setNickValue] = useState("");

  // const { data } = useGetCurrentUserQuery();

  const { formValues, handleChangeValue } = useForm({
    nickname: "",
    email: "",
    telefono: "",
    nombre: "",
    password: "",
    biografia: "",
    rol: "estudiante",
    image: "",
    confirmPassword: "",
  });

  const [nicknameAvailable, setNicknameAvailable] = useState(
    availableTypes.nothing
  );
  const [checkNickname, { isLoading }] = useLazyCheckNicknameQuery();
  const [createUser, { isLoading: isLoadingCreateUser }] = useSignUpMutation();

  // Firebase (solo para probar, luego eliminarlo).
  const [percent, setPercent] = useState(null);
  const [firebaseImage, setFirebaseImage] = React.useState(null);

  const onImageChange = (e) => {
    setFirebaseImage(e.target.files[0]);
    if (e.target.files && e.target.files[0]) {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  useEffect(() => {
    if (formValues?.nickname?.length > 0) {
      setNicknameAvailable(availableTypes.checking);
    }
    clearTimeout(timer);
    timer = setTimeout(async () => {
      if (formValues?.nickname?.length > 0) {
        const response = await checkNickname(formValues?.nickname);
        const exists = response.data?.existe;
        if (exists) {
          setNicknameAvailable(availableTypes.notAvailable);
        } else {
          setNicknameAvailable(availableTypes.availabe);
        }
      } else {
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [formValues.nickname]);

  const validatePassword = () => {
    const submitbutton = document.getElementById("submit");
    if (formValues.password === formValues.confirmPassword) {
      setPassMatch(true);
      submitbutton.classList.remove("cursor-not-allowed");
      return true;
    } else {
      setError({
        show: true,
        message: "Las contraseñas no coinciden",
      });
      setPassMatch(false);
      submitbutton.classList.add("cursor-not-allowed");
      return false;
    }
  };

  const handleFinishUserRegister = async (imageUrl) => {
    handleChangeValue("image", imageUrl);
    const formValuesToSend = {
      ...formValues,
      imagen: imageUrl,
      rol: formValues?.rol || "estudiante",
    };

    const response = await createUser(formValuesToSend);
    if (response?.data?.ok) {
      setUserCreatedCorrect(true);
      setError({
        ...error,
        show: false,
      });
    } else {
      if (response?.error?.data?.ok === false) {
        setError({
          show: true,
          message: "Error, el email ya existe o los datos son invalidos",
        });
      }
    }
    console.log(response.data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validatePassword()) {
      return;
    }

    if (
      nicknameAvailable === availableTypes.availabe &&
      formValues.password === formValues.confirmPassword &&
      formValues.nickname &&
      formValues.nombre &&
      formValues.telefono &&
      formValues.email &&
      formValues.biografia
    ) {
      setError({
        ...error,
        show: false,
      });
      handleUpload();
    } else {
      setError({
        message: "Verifique todos los campos",
        show: true,
      });
    }
  };

  const handleUpload = () => {
    if (!firebaseImage) {
      setError({
        message: "Por favor, agregue una imagen",
        show: true,
      });
      return;
    }

    const storageRef = ref(
      storage,
      `/profileImages/${Date.now() + firebaseImage.name}`
    ); // modificar esta línea para usar un nombre distinto para el archivo
    const uploadTask = uploadBytesResumable(storageRef, firebaseImage);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setPercent(percent);
      },
      (err) => {
        setError({
          show: true,
          message: "No se pudo subir la imagen correctamente",
        });
        setPercent(null);
      },
      () => {
        setError({
          ...error,
          show: false,
        });
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          handleFinishUserRegister(url);
          setPercent(null);
        });
      }
    );
  };

  return (
    <>
      <div className="container mx-auto px-4 h-full">
        <div className="py-10 transition-all m-auto content-center justify-center h-full">
          <div className="w-full transition-all m-auto lg:w-6/12 px-4">
            <div className="relative transition-all flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-xl bg-gray-800 border-0">
              {userCreatedCorrect ? (
                <VerifyAccount email={formValues.email} />
              ) : (
                <div className="flex-auto px-4 lg:px-10 py-9">
                  <div className="text-blueGray-400 text-center text-xl mb-3 font-bold">
                    <small>Registra una cuenta con tus credenciales</small>
                  </div>
                  <div className="my-2">
                    {error.show && (
                      <Alert
                        show={true}
                        important={"Uups..."}
                        text={error.message}
                        color={"bg-red-500"}
                        icon={"fas fa-regular fa-user"}
                      />
                    )}
                  </div>
                  <form
                    action="/api/signup"
                    method="POST"
                    onSubmit={handleSubmit}
                  >
                    <div className="flex flex-col sm:flex-row relative w-full mb-3 gap-y-3">
                      <div className="w-full sm:w-4/6">
                        <label
                          className="block uppercase text-blueGray-400 text-xs font-bold mb-2 bg-rose-600! md:bg-blue-700!"
                          htmlFor="foto"
                        >
                          Foto perfil
                        </label>
                        <input
                          type="file"
                          id="foto"
                          name="image"
                          onChange={onImageChange}
                          className="border-[1px] border-white bg-transparent rounded-full px-6 py-3 text-blueGray-400 text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 file:bg-red-700 file:rounded-lg file:text-white file:border-0"
                          //required
                        />
                      </div>

                      <div className="w-full sm:w-2/6">
                        <div className="flex w-full justify-center">
                          {!profileImage ? (
                            <img
                              src="/img/profileIMG.png"
                              alt="vista previa imagen"
                              className="shadow rounded-full h-[120px] w-[120px] min-w-[120px] min-h-[120px] align-middle border-none"
                            />
                          ) : (
                            <img
                              src={profileImage}
                              alt="vista previa imagen de perfil"
                              className="shadow rounded-full h-[120px] w-[120px] min-w-[120px] min-h-[120px] align-middle border-none"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-400 text-xs font-bold mb-2"
                        htmlFor="nickname"
                      >
                        Nickname
                      </label>
                      <input
                        type="text"
                        id="nickname"
                        name="nickname"
                        value={formValues.nickname}
                        onChange={(e) =>
                          handleChangeValue("nickname", e.target.value)
                        }
                        className="border-[1px] border-white bg-transparent rounded-full px-3 py-3 placeholder-blueGray-300 text-blueGray-400 text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Nickname"
                        required
                      />
                    </div>
                    {nicknameAvailable === availableTypes.availabe && (
                      <Alert
                        important={"Genial!"}
                        text={"El nickname se encuentra disponible."}
                        color={"bg-green-600"}
                        icon={"fas fa-solid fa-check"}
                        show
                      />
                    )}
                    {nicknameAvailable === availableTypes.checking && (
                      <Alert
                        important={"Un momento..."}
                        text={"Comprobando disponibilidad."}
                        color={"bg-yellow-500"}
                        icon={"fas fa-solid fa-spinner fa-spin"}
                        show
                      />
                    )}
                    {nicknameAvailable === availableTypes.notAvailable && (
                      <Alert
                        important={"Uups..."}
                        text={"Ese nickname ya se encuentra en uso."}
                        color={"bg-red-500"}
                        icon={"fas fa-regular fa-user"}
                        show
                      />
                    )}

                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-400 text-xs font-bold mb-2"
                        htmlFor="email"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        autoComplete="username"
                        className="border-[1px] border-white bg-transparent rounded-full px-3 py-3 placeholder-blueGray-300 text-blueGray-400 text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Email"
                        required
                        value={formValues.email}
                        onChange={(e) =>
                          handleChangeValue("email", e.target.value)
                        }
                      />
                    </div>

                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-400 text-xs font-bold mb-2"
                        htmlFor="telefono"
                      >
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        minLength="9"
                        maxLength="15"
                        onKeyDown={(event) => {
                          if (
                            !/[0-9]/.test(event.key) &&
                            event.key !== "Backspace" &&
                            event.key !== "Delete" &&
                            event.key !== "ArrowLeft" &&
                            event.key !== "ArrowRight"
                          ) {
                            event.preventDefault();
                          }
                        }}
                        value={formValues.telefono}
                        onChange={(e) =>
                          handleChangeValue("telefono", e.target.value)
                        }
                        className="border-[1px] border-white bg-transparent rounded-full px-3 py-3 placeholder-blueGray-300 text-blueGray-400 text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Teléfono"
                        required
                      />
                    </div>

                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-400 text-xs font-bold mb-2"
                        htmlFor="nombre"
                      >
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        autoComplete="name"
                        className="border-[1px] border-white bg-transparent rounded-full px-3 py-3 placeholder-blueGray-300 text-blueGray-400 text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Nombre completo"
                        required
                        value={formValues.nombre}
                        onChange={(e) =>
                          handleChangeValue("nombre", e.target.value)
                        }
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between relative w-full gap-4 mb-3">
                      <div className="flex-grow w-full">
                        <label
                          className="block uppercase text-blueGray-400 text-xs font-bold mb-2"
                          htmlFor="password"
                        >
                          Contraseña
                        </label>
                        <input
                          type="password"
                          id="password"
                          autoComplete="new-password"
                          className="border-[1px] border-white bg-transparent px-4 py-3 placeholder-blueGray-300 text-black rounded-full text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          placeholder="Contraseña"
                          required
                          value={formValues.password}
                          onChange={(e) =>
                            handleChangeValue("password", e.target.value)
                          }
                        />
                      </div>
                      <div className="flex-grow w-full">
                        <label
                          className="block uppercase text-blueGray-400 text-xs font-bold mb-2"
                          htmlFor="confirmPassword"
                        >
                          Repetir Contraseña
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="password"
                          autoComplete="new-password"
                          value={formValues.confirmPassword}
                          onChange={(e) =>
                            handleChangeValue("confirmPassword", e.target.value)
                          }
                          className="border-[1px] border-white bg-transparent rounded-full px-4 py-3 placeholder-blueGray-300 text-blueGray-400  text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          placeholder="Confirmar Contraseña"
                          required
                        />
                      </div>
                    </div>
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-400 text-xs font-bold mb-2"
                        htmlFor="biografia"
                      >
                        Biografía
                      </label>
                      <textarea
                        type="text"
                        id="biografia"
                        className="border-[1px] border-white bg-transparent rounded-lg px-3 py-3 placeholder-blueGray-300 text-blueGray-400 text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        rows="4"
                        placeholder="Breve biografía."
                        value={formValues.biografia}
                        onChange={(e) =>
                          handleChangeValue("biografia", e.target.value)
                        }
                      ></textarea>
                    </div>
                    <div className="relative w-full mb-3 border-[1px] border-white bg-transparent rounded-full">
                      <Dropdown
                        options={rolOptions}
                        className="rounded-md!"
                        onChange={(val) => handleChangeValue("rol", val?.value)}
                        value={"estudiante"}
                        placeholder="Select an option"
                      />
                    </div>

                    <div className="text-center mt-6">
                      <Button
                        isLoading={
                          (percent !== 100 && percent != null) ||
                          isLoading ||
                          isLoadingCreateUser
                        }
                        text="Registrarse"
                        type="submit"
                      />
                      {/* eliminar */}
                      {/*                     <p>{percent} "% done"</p> */}
                      {/* eliminar */}
                    </div>
                    <p className="text-blueGray-400 text-center my-2 px-6 font-medium mt-6 flex cursor-pointer gap-2 items-center justify-center">
                      Ya tienes una cuenta ?
                      <a
                        className="text-yellow-800 underline"
                        href={appRoutes.login()}
                      >
                        Iniciar sesion
                      </a>
                    </p>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Register.layout = Auth;
