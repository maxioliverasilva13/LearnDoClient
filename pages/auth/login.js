import React from "react";
import Link from "next/link";

// layout for page

import Auth from "layouts/Auth.js";

export default function Login() {
  const [showAlert, setShowAlert] = React.useState(false);

  // Form params: user (puede contener email o nickname), password, remember (checkbox).
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = document.getElementById('user').value;
    const remember = document.getElementById('customCheckLogin').value;
    console.log(remember);
    if(!user){
      setShowAlert(true);
    }

    // try {
    // const res = await fetch('http://localhost:8080/api/login',
    // { 
    //   method: 'POST',
    //   body: JSON.stringify({
    //     query: data,
    //   }),
    // }
    // ).then((res) => {
    //   if(!res.ok){
    //     setShowAlert(true);
    //   }
    // });
    // } catch (err) {
    //   console.log('Error en trycatch login.js: ' + err);      
    // }

  }

  return (
    <>
      <div className="container mx-auto px-4 h-full">
        <div className="flex flex-col content-center items-center justify-center h-full">
          {showAlert ? (
            <div className="text-white w-1/2 px-6 py-4 border-0 rounded relative mb-4 bg-red-500">
              <span className="text-xl inline-block mr-5 align-middle">
                <i className="fas fa-bell" />
              </span>
              <span className="inline-block align-middle mr-8">
                <b className="capitalize">Atención!</b> Usuario o Contraseña incorrectos.
              </span>
              <button className="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none"
                onClick={() => setShowAlert(false)}
              >
                <span>×</span>
              </button>
            </div>
          ) : null}
          <div className="w-full lg:w-4/12">
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
                      className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      type="submit"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="flex flex-wrap mt-6 relative">
              <div className="w-1/2">
                <a
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                  className="text-blueGray-200"
                >
                  <small>Forgot password?</small>
                </a>
              </div>
              <div className="w-1/2 text-right">
                <Link href="/auth/register">
                  <a href="#pablo" className="text-blueGray-200">
                    <small>Create new account</small>
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
