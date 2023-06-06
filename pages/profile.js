import React, { useState, useRef } from "react";
import { useEffect } from "react";
import Spinner from "components/Spinner/Spinner";
import {
  useChangeMeInfoMutation,
  useGetCurrentUserQuery,
} from "store/services/UserService";
import Alert from "components/Popups/Alert";
import storage from "firebaseConfig";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import GlobalImage from "components/GlobalImage/GlobalImage";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);

  const inputRef = useRef(null);
  const [avatarImported, setAvatarImported] = useState(null);

  const [handleChangeMeInfo, { isLoading: changingInfo }] =
    useChangeMeInfoMutation();
  const { data, error, isLoading: isLoadingInfo } = useGetCurrentUserQuery();
  const isLoading = changingInfo || isLoadingInfo;

  useEffect(() => {
    if (data) {
      const { userInfo } = data;
      const { imagen, ...datos } = userInfo;
      setUserData(datos);
      setUserAvatar(imagen);
    }

    if (error) {
      //redirect to page 500
    }
  }, []);

  function handleClickFile() {
    inputRef.current.click();
  }
  function onImageChange(e) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUserAvatar(URL.createObjectURL(file));
      setAvatarImported(file);
    }
  }

  const uploadFile = async (file) => {
    const fileName = file.name;
    const extension = fileName.split(".").pop();
    if (extension != "png" && extension != "jpg" && extension != "jpeg") {
    }
    const storageRef = ref(storage, `/profileImages/${Date.now() + fileName}`);
    const uploadTask = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  };

  async function onSave() {
    try {
      if (avatarImported) {
        const urlResult = await uploadFile(avatarImported);
        setUserAvatar(urlResult);
      }
      const body = {
        imagen: userAvatar,
        ...userData,
      };
      const response = await handleChangeMeInfo(body);
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <>
      <main
        className={"h-auto py-10 flex items-center justify-center text-white"}
      >
        <section className={"relative block "}></section>
        <section className={" relative py-16 bg-blueGray-200}"}>
          {isLoading ? (
            <Spinner></Spinner>
          ) : (
            <div className="container mx-auto px-4">
              <div className="relative flex flex-col min-w-0 break-words bg-[#2d2e2e] w-full mb-6 shadow-xl rounded-lg  border-4	">
                <div className="px-6">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full px-4 lg:order-2 flex justify-center">
                      <div className="relative w-[250px] h-[250px]">
                        <GlobalImage
                          src={userAvatar}
                          loader={() => userAvatar}
                          layout="fill"
                          objectFit="cover"
                          className="w-full h-full rounded-full"
                        />
                      </div>
                    </div>

                    <div className="w-full lg:w-4/12 px-4 lg:order-1">
                      <div className="flex justify-center py-4 lg:pt-4 pt-8">
                        <div className="mr-4 p-3 text-center">
                          <span className="text-xl font-bold block uppercase tracking-wide ">
                            22
                          </span>
                          <span className="text-sm ">Cursos</span>
                        </div>
                        <div className="mr-4 p-3 text-center">
                          <span className="text-xl font-bold block uppercase tracking-wide">
                            10
                          </span>
                          <span className="text-sm ">Photos</span>
                        </div>
                        <div className="lg:mr-4 p-3 text-center">
                          <span className="text-xl font-bold block uppercase tracking-wide ">
                            89
                          </span>
                          <span className="text-sm ">Comments</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center lg:order-3">
                    <div>
                      <button
                        className="z-10	 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                        onClick={handleClickFile}
                      >
                        <svg
                          className="fill-current w-4 h-4 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                        </svg>
                        <span>Cambiar imagen</span>
                      </button>
                      <input
                        type="file"
                        id="foto"
                        name="image"
                        ref={inputRef}
                        onChange={onImageChange}
                        className="hidden border-0 px-6 py-3 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        //required
                      />
                    </div>
                  </div>

                  <div className="text-center mt-12 p-16">
                    <div
                      className="flex justify-center gap-5 flex-wrap
                    "
                    >
                      <div>
                        <input
                          value={userData?.nickname}
                          disabled
                          type="text"
                          id="first_name"
                          className="min-w-[500px] bg-transparent text-white border-2   text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Nickname"
                          required
                        />
                      </div>
                      <div>
                        <input
                          disabled
                          value={userData?.email}
                          type="text"
                          id="first_name"
                          className="min-w-[500px] bg-transparent text-white border-2  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Correo"
                          required
                        />
                      </div>

                      <div>
                        <input
                          value={userData?.nombre}
                          onChange={(e) =>
                            setUserData((prev) => {
                              return {
                                ...prev,
                                nombre: e.target.value,
                              };
                            })
                          }
                          type="text"
                          id="first_name"
                          className="min-w-[500px] bg-transparent  text-white border-2  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Nombre"
                          required
                        />
                      </div>
  
                     
  
                      <div>
                        <input
                          value={userData?.telefono}
                          onChange={(e) =>
                            setUserData((prev) => {
                              return {
                                ...prev,
                                telefono: e.target.value,
                              };
                            })
                          }
                          type="text"
                          id="first_name"
                          className="min-w-[500px] bg-transparent  text-white border-2  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Telefono"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-full px-4 lg:text-center ">
                    <div className="py-6 px-3 mt-32 sm:mt-0">
                      <button
                        onClick={() => onSave()}
                        className="bg-[#8526ff] transition delay-150 duration-150 hover:bg-white hover:text-black rounded font-medium   p-4 rounded-full focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150 uppercase hover:shadow-md"
                        type="button"
                      >
                        Guardar cambios
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {}
        </section>
      </main>
    </>
  );
}
