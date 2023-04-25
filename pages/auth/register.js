import React, { useState, useEffect } from "react";

import Alert from "components/Popups/Alert";

// layout for page

import Auth from "layouts/Auth.js";

// Firebase
import storage from "firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useGetCurrentUserQuery } from "store/services/UserService";

export default function Register() {
  const [profileImage, setProfileImage] = React.useState(null);
  const [passMatch, setPassMatch] = React.useState(true);
  const [nickValue, setNickValue] = useState('');
  const [pwdState, setPwdState] = React.useState({
    password: "",
    confirmPassword: ""
  });
  
  const { data } = useGetCurrentUserQuery();
  
  // Estados de Popups (Nickname)
  const [showNickUsed, setShowNickUsed] = React.useState(false);
  const [showLoading, setShowLoading] = React.useState(false);
  const [showNickAvailable, setShowNickAvailable] = React.useState(false);

  // Firebase (solo para probar, luego eliminarlo).
  const [percent, setPercent] = useState(0);
  const [firebaseImage, setFirebaseImage] = React.useState(null);


  const onImageChange = (e) => {
    setFirebaseImage(e.target.files[0]);
    if (e.target.files && e.target.files[0]) {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
    }
  }

  useEffect(() => {
    validatePassword();
  }, [pwdState]);

  // "Prototipo" de cómo funcionaría el delay cuando deja de escribir el nickname para consultar la
  // disponibilidad del mismo.
  // useEffect(() => {
  //   setShowLoading(true);  // muestro el popup de cargando
  //   const timer = setTimeout(() => {
  //     llamadaApi();
  //     if(condicion && nickValue.length > 0){
  //       setShowNickUsed(true);
  //     }else{
  //       setShowNickAvailable(true);
  //     }
  //   }, 800);

  //   return () => clearTimeout(timer)
  //   setShowLoading(false);
  // }, [nickValue]);
  
  const handlePwChange = (e) => {
    const { id, value } = e.target;
    setPwdState((prevState) => ({
      ...prevState,
      [id]: value
    }));
  };

  const validatePassword = () => {
    const submitbutton = document.getElementById('submit');
    if(pwdState.password === pwdState.confirmPassword){
       setPassMatch(true)
       submitbutton.classList.remove("cursor-not-allowed");
      }else{
      setPassMatch(false);
      submitbutton.classList.add("cursor-not-allowed");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validatePassword();
  };

  const handleUpload = () => {
    if (!firebaseImage) {
      alert("Please upload an image first!");
      return;
    } 
    
    const storageRef = ref(storage, `/profileImages/${Date.now() + firebaseImage.name}`); // modificar esta línea para usar un nombre distinto para el archivo
    const uploadTask = uploadBytesResumable(storageRef, firebaseImage);

    uploadTask.on("state_changed",
      (snapshot) => {
        const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setPercent(percent);
      },
      (err) => console.log(err), 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log(url);
        });
      }
    );
  };

  return (
    <>
      <div className="container mx-auto px-4 h-full">
        <div className="py-10 m-auto content-center justify-center h-full">
          <div className="w-full m-auto lg:w-6/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
              <div className="flex-auto px-4 lg:px-10 py-9">
                <div className="text-blueGray-400 text-center mb-3 font-bold">
                  <small>Registra una cuenta con tus credenciales</small>
                </div>
                <form action="/api/signup" method="POST" onSubmit={handleSubmit}>
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="nickname"
                    >
                      Nickname
                    </label>
                    <input
                      type="text"
                      id="nickname"
                      name="nickname"
                      value={nickValue}
                      onChange={e => setNickValue(e.target.value)}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Nickname"
                      required
                    />
                  </div>
                  <Alert important={"Genial!"} text={"El nickname se encuentra disponible."} color={"bg-green-600"} icon={"fas fa-solid fa-check"} 
                  show={showNickAvailable} setShow={setShowNickAvailable} />
                  <Alert important={"Un momento..."} text={"Comprobando disponibilidad."} color={"bg-yellow-500"} icon={"fas fa-solid fa-spinner fa-spin"} 
                  show={showLoading}/>
                  <Alert important={"Uups..."} text={"Ese nickname ya se encuentra en uso."} color={"bg-red-500"} icon={"fas fa-regular fa-user"} 
                  show={showNickUsed} setShow={setShowNickUsed} />

                  
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      autoComplete="username"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Email"
                      required
                    />
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
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
                        if (!/[0-9]/.test(event.key) && event.key !== "Backspace" && event.key !== "Delete" && event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
                          event.preventDefault();
                        }
                      }}
                        
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Teléfono"
                      required
                    />
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="nombre"
                    >
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      autoComplete="name"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Nombre completo"
                      required
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:flex-wrap justify-between relative w-full mb-3">
                    <div className="sm:w-5/12">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="password"
                      >
                        Contraseña
                      </label>
                      <input
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        value={pwdState.password}
                        onChange={handlePwChange}
                        className="border-0 px-6 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Contraseña"
                        required
                      />
                    </div>
                    <div className="sm:w-5/12">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="confirmPassword"
                      >
                        Repetir Contraseña
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="password"
                        autoComplete="new-password"
                        value={pwdState.confirmPassword}
                        onChange={handlePwChange}
                        className="border-0 px-6 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Confirmar Contraseña"
                        required
                      />
                    </div>
                  </div>
                  {
                    !passMatch && (
                      <div className="mx-4">
                        <p className="text-white py-2 border-0 rounded relative mb-4 bg-red-500 text-center">Las contraseñas no coinciden.</p>
                      </div>
                      )
                  }

                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="biografia"
                  >
                    Biografía
                  </label>
                  <textarea
                    type="text"
                    id="biografia"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    rows="4"
                    placeholder="Breve biografía."
                  ></textarea>
                </div>

                <div className="flex flex-col sm:flex-row relative w-full mb-3 gap-y-3">
                    <div className="w-full sm:w-4/6">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2 bg-rose-600! md:bg-blue-700!"
                        htmlFor="foto"
                      >
                        Foto perfil
                      </label>
                      <input
                        type="file"
                        id="foto"
                        name="image"
                        onChange={onImageChange}
                        className="border-0 px-6 py-3 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        //required
                      />
                    </div>
                    
                    <div className="w-full sm:w-2/6">
                      <div className="flex w-full justify-center">
                        { !profileImage ? <img src="/img/profileIMG.png" alt="vista previa imagen"
                        className="shadow rounded-full h-[120px] w-[120px] min-w-[120px] min-h-[120px] align-middle border-none" />
                        : 
                        <img src={profileImage} alt="vista previa imagen de perfil"
                        className="shadow rounded-full h-[120px] w-[120px] min-w-[120px] min-h-[120px] align-middle border-none" />
                        }
                      </div>
                    </div>
                  </div>

                  <div className="text-center mt-6">
                    <button
                      className="bg-blue-800 text-white active:bg-blue-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      type="submit"
                      id="submit"
                      disabled={!passMatch}
                    >
                      Registrarse
                    </button>
                    {/* eliminar */}
                    <button className="bg-orange-500 text-white active:bg-orange-400 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                    onClick={handleUpload}>Upload to Firebase</button>
                    <p>{percent} "% done"</p>
                    {/* eliminar */}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Register.layout = Auth;
