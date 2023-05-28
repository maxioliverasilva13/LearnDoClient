import InputText from "components/InputText/InputText";
import Modal from "components/Modal/modal";
import Alert from "components/Popups/Alert";
import StarRating from "components/Rating/star";
import useGlobalSlice from "hooks/useGlobalSlice";
import { useState } from "react";
import { usePuntuarCursoMutation } from "store/services/EventoService";

const PuntuarModal = ({ openCalificarModal, setOpenCalificarModal, cursoId }) => {
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { userInfo } = useGlobalSlice();
  const [puntuarCurso] = usePuntuarCursoMutation();

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!rating || !description) {
      setError("Completa todos los campos");
      return;
    }
    setError(null);
    const dataToSend = {
        rating: rating,
        description,
        cursoId,
        userId: userInfo?.id,
    }
    const resposne = await puntuarCurso(dataToSend);

    if (resposne?.data?.ok) {
        setSuccess("Evento creado correctamente")
        setTimeout(() => {
          setOpenCalificarModal(false)
        }, 3000)
    }
  };

  return (
    <Modal
      isVisible={openCalificarModal}
      onClose={() => setOpenCalificarModal(false)}
      className="flex flex-row justify-center" 
      ancho={"500px"}
    >
      <form onSubmit={handleSubmit} className="w-full h-auto flex flex-col items-center justify-center">
       <div className="w-full my-4">
       {error && (
          <Alert
            show={error !== null}
            setShow={() => setError(null)}
            important={"Error"}
            text={error}
            color={"bg-red-500"}
            icon={"fas fa-regular fa-user"}
          />
        )}
        {success && (
          <Alert
            show={success !== null}
            setShow={() => setSuccess(null)}
            text={success}
            color={"bg-green-500"}
            icon={"fas fa-regular fa-user"}
          />
        )}
       </div>
        <a className="text-2xl text-white">¿Que te parece este curso?</a>
        <div className="flex flex-row mt-8 mb-8">
          <StarRating handleSetRating={setRating} />
        </div>
        <div className="my-4 w-full">
          <InputText
            type="textarea"
            label="Descripcion"
            placeholder="Descripcion..."
            value={description}
            onChange={(e) => setDescription(e?.target?.value)}
          />
        </div>
        <button
          type="submit"
          className="h-10 w-32 mb-8 px-4 py-2 rounded-full text-white"
          style={{ backgroundColor: "#780EFF" }}
        >
          Calificar
        </button>
      </form>
    </Modal>
  );
};

export default PuntuarModal;
