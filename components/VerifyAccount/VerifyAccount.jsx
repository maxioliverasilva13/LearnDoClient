import Link from "next/link";
import appRoutes from "routes/appRoutes";

const VerifyAccount = ({ email }) => {
    
  return (
    <div className="w-full px-6 py-4 flex flex-col items-center justify-center gap-y-4">
      <h1 className="font-bold text-white text-center">
        Verifica tu cuenta
      </h1>
      <div className="relative w-full w-[200px] h-[300px] h-auto">
        <img
          src="/img/AccountActivationIlustartion.png"
          alt="Image"
          className="object-cover w-[300px] h-[200px] m-auto"
        />
      </div>
      <a
        href={`mailto:${email}`}
        className="text-center px-6 font-medium my-2 text-white"
      >
        Tu cuenta fue creada correctamente, por favor verifica la casilla de
        correco electronico de{" "}
        <span className="text-yellow-500 underline cursor-pointer">
          {email}
        </span>
        , revisa tu correo para poder activar tu cuenta correctamente
      </a>
      <p className="text-center px-6 font-medium my-2 flex gap-2 text-white">
        Ya tienes una cuenta?
        <Link
          href={appRoutes.login()}
        >     
        <span className="colorPrincipal underline cursor-pointer">
          Login
        </span>
        </Link>
     
      </p>
    </div>
  );
};

export default VerifyAccount;
