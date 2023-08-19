import LottieWelcome from "components/LottieWelcome/LottieWelcome";
import Alert from "components/Popups/Alert";
import useGlobalSlice from "hooks/useGlobalSlice";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Dropdown from "react-dropdown";
import appRoutes from "routes/appRoutes";
import { useChangeUserRoleMutation } from "store/services/UserService";
import { rolOptions } from "utils/rol";

const SelectRole = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState(null);
  const { userInfo } = useGlobalSlice();
  const [changeRole] = useChangeUserRoleMutation();

  const handleSelectRole = async () => {
    if (selectedRole && userInfo?.id) {
      const resposne = await changeRole({
        uid: userInfo?.id,
        role: selectedRole,
      });
      if (resposne?.data?.ok) {
        window.location.reload();
      } else {
        setError("Error al actualizar el usuario");
      }
    } else {
      setError("Selecciona un rol para continuar");
    }
  };

  return (
    <div className="w-full h-auto flex flex-col items-center justify-start ">
      {/* <LottieWelcome className="w-[400px] h-auto" /> */}
      <div className="my-5">
      <Alert
        show={error !== null}
        setShow={() => setError(null)}
        important={"Error"}
        text={error}
        color={"bg-red-500"}
        icon={"fas fa-regular fa-user"}
      />
      </div>
      <span className="text-white font-semibold text-[30px] my-4">
        Bienvenido a{" "}
        <span className="select-none font-bold text-[30px]">
          Learn<span className="p-2 bg-[#78A132] rounded-lg ml-1">Do</span>
        </span>
      </span>
      <span className="w-auto text-center max-w-[600px] text-white mt-4 text-lg">
        Antes de proceder con el registro, es importante que seleccione el rol
        que mejor se ajuste a su perfil. Nuestro sistema está diseñado para
        brindarle una experiencia personalizada, acorde a sus necesidades y
        objetivos. Por favor, tome un momento para revisar detenidamente las
        siguientes opciones de rol y elija aquella que corresponda a su
        situación:
      </span>

      <label
        htmlFor="selectRole"
        className="text-white select-none font-semibold my-1 w-[400px] text-left"
      >
        Selecciona un rol
      </label>
      <Dropdown
        id="selectRole"
        name="selectRole"
        options={rolOptions}
        className="rounded-lg w-[400px]"
        onChange={(val) => setSelectedRole(val?.value)}
        value={"estudiante"}
        placeholder="Select an option"
      />

      <button
        type="submit"
        className="w-max bgPrincipal active:bg-[#78A132] text-white font-semibold hover:shadow-md text-lg px-6 py-2 shadow-md rounded-full sm:mr-2 mt-4 ease-linear transition-all duration-150"
        onClick={handleSelectRole}
      >
        Guardar
      </button>
    </div>
  );
};

export default SelectRole;
