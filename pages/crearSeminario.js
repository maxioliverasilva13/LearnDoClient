import clsx from "clsx";
import CheckBox from "components/Checkbox/Checkbox";
import CustomDateTime from "components/DatePicker/DateTime";
import InputText from "components/InputText/InputText";
import MultiSelect from "components/MultiSelect/MultiSelect";
import Alert from "components/Popups/Alert";
import SelectLocationModal from "components/SelectLocationModal/SelectLocationModal";
import useForm from "hooks/useForm";
import useGlobalSlice from "hooks/useGlobalSlice";
import useUploadImage from "hooks/useUploadImage";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BiImageAdd } from "react-icons/bi";
import { toast } from "react-toastify";
import { useGetCategoriasQuery } from "store/services/CategoriaService";
import { useCrearSeminarioMutation } from "store/services/EventoService";
import { formatToOptions } from "utils/categorias";
import { EventosType } from "utils/evento";
import { scrollTop } from "utils/pageUtils";
import ZoomIcon from "../public/img/ZoomIcon.png";
import GlobalImage from "components/GlobalImage/GlobalImage";


const CrearSeminario = () => {
  const { formValues, handleChangeValue, handleChangeValueMultipleValues } =
    useForm({
      imagen: "",
      nombre: "",
      descripcion: "",
      precio: 0,
      fecha: "",
      hora: "",
      link: "",
      zoomPass: "",
      duracion: 0,
      capacidad: 0,
      ubicacion: {
        lat: 0,
        lng: 0,
      },
    });
  const { userInfo, handleSetLoading } = useGlobalSlice();
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [checkedGratis, setCheckedGratis] = useState(false);
  const [checkedOnline, setCheckedOnline] = useState(false);
  const [openSelectLocation, setOpenSelectLocation] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [createSeminario] = useCrearSeminarioMutation();
  const { handleUpload } = useUploadImage();
  const { data: categorias, isLoading } = useGetCategoriasQuery();
  const [selectedCategorias, setSelectedCategorias] = useState([]);

  const optionsCategorias = formatToOptions(categorias);

  useEffect(() => {
    handleSetLoading(isLoading);
  }, [isLoading]);

  const hasPreviewImage = previewImage !== null;

  const handleChangeImage = (e) => {
    const firstFile = e?.target?.files[0];
    if (firstFile) {
      setSelectedFile(firstFile);
      const newSrc = URL.createObjectURL(firstFile);
      setPreviewImage(newSrc);
    }
  };

  useEffect(() => {
    if (previewImage) {
      handleChangeValue("imagen", previewImage);
    }
  }, [previewImage]);

  const handleChangeLatLng = (cordenates) => {
    handleChangeValue("ubicacion", {
      lat: cordenates?.lat,
      lng: cordenates?.lng,
    });
  };

  useEffect(() => {
    if (error || success) {
      scrollTop();
    }
    if (error === true) {
      setSuccess(false);
    }
  }, [error, success]);

  const getValidationError = (value) => {
    if (error?.validated) {
      return (
        error?.validated[value] !== null && error?.validated[value] === true
      );
    }
  };

  useEffect(() => {
    if (error) {
      toast.error("Completa todos los campos correctamente", {
        theme: "colored",
      });
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e?.preventDefault();

    // checking errors
    if (checkedOnline) {
      if (
        !formValues?.imagen ||
        !formValues?.nombre ||
        !formValues?.descripcion ||
        !formValues?.fecha ||
        !formValues?.hora ||
        formValues?.duracion === 0 ||
        !formValues?.link ||
        !formValues?.zoomPass
        // (!checkedGratis && formValues?.precio === 0) ||
        // !/^https:\/\/[\w-]*\.?zoom.us\/(j|my)\/[\d\w?=-]+/.test(
        //   formValues?.link || ""
        // )
      ) {
        setError({
          type: "required",
          message: "Completa los campos requeridos",
          validated: {
            imagen: !formValues?.imagen,
            nombre: !formValues?.nombre,
            descripcion: !formValues?.descripcion,
            fecha: !formValues?.fecha,
            hora: !formValues?.hora,
            // link:
            //   !formValues?.link ||
            //   !/^https:\/\/[\w-]*\.?zoom.us\/(j|my)\/[\d\w?=-]+/.test(
            //     formValues?.link || ""
            //   ),
            zoomPass: !formValues?.zoomPass,
            precio: !checkedGratis && formValues?.precio === 0,
            capacidad: !formValues?.capacidad || formValues?.capacidad === 0,
            duracion: formValues?.duracion === 0,
          },
        });
        return;
      }
    } else {
      if (
        !formValues?.imagen ||
        !formValues?.nombre ||
        !formValues?.descripcion ||
        !formValues?.fecha ||
        formValues?.duracion === 0 ||
        !formValues?.hora ||
        (!checkedGratis && formValues?.precio === 0) ||
        formValues?.ubicacion?.lat === 0 ||
        formValues?.ubicacion?.lng === 0
      ) {
        setError({
          type: "required",
          message: "Completa los campos requeridos",
          validated: {
            imagen: !formValues?.imagen,
            nombre: !formValues?.nombre,
            descripcion: !formValues?.descripcion,
            fecha: !formValues?.fecha,
            hora: !formValues?.hora,
            precio: !checkedGratis && formValues?.precio === 0,
            capacidad: !formValues?.capacidad || formValues?.capacidad === 0,
            lat: formValues?.ubicacion?.lat === 0,
            lng: formValues?.ubicacion?.lng === 0,
            duracion: formValues?.duracion === 0,
          },
        });
        return;
      }
    }
    setError(null);

    handleSetLoading(true);
    const newImage = await handleUpload(selectedFile);
    const prepareData = {
      ...formValues, 
      isOnline: checkedOnline,
      es_pago: !checkedGratis,
      organizador: userInfo?.id,
      tipo: checkedOnline ? EventosType.seminarioV : EventosType.seminarioP,
      nombre_ubicacion: formValues?.nombre,
      latitud: formValues?.ubicacion?.lat,
      longitud: formValues?.ubicacion?.lng,
      maximo_participantes: formValues?.capacidad,
      link: formValues?.link,
      fecha: formValues?.fecha,
      hora: formValues?.hora,
      imagen: newImage,
      duracion: formValues?.duracion,
      categorias: selectedCategorias?.map((item) => item?.value)
    };
    const response = await createSeminario(prepareData);
    if (response?.data?.evento) {
      setSuccess(true);
    }
    handleSetLoading(false);
  };

  return (
    <div className="w-full h-auto md:pt-10 flex flex-col items-center justify-start">
      <Alert
        text={error?.message}
        color="bg-red-500"
        show={error !== null}
        important={true}
        icon={<i className="fas fa-bell" />}
        setShow={() => setError(null)}
      />
      <Alert
        text={"Seminario creado correctamente"}
        color="bg-green-500"
        show={success}
        important={true}
        setShow={setSuccess}
        icon={<i className="fas fa-bell" />}
      />

      <p className="w-full text-center text-white text-[32px] font-bold">
        Agergar Seminario
      </p>

      <form
        onSubmit={handleSubmit}
        className="w-[320px] pb-[40px] h-auto flex flex-col items-center gap-y-4 justify-start"
      >
        <label
          htmlFor="inputFile"
          className={clsx(
            `w-full shadow-md overflow-hidden relative cursor-pointer flex items-center justify-center mt-[20px] h-[165px] mb-[30px] rounded-lg`,
            !hasPreviewImage ? "border-2 border-dashed" : "",
            getValidationError("imagen") ? "border-red-500" : "border-white"
          )}
        >
          {!previewImage && (
            <span className="text-white flex items-center font-semibold">
              <BiImageAdd size={20} color="white" className="mr-1" /> Add or
              Drop Image
            </span>
          )}
          {previewImage && (
            <Image
              src={previewImage}
              loader={() => previewImage}
              layout="fill"
              objectFit="cover"
            />
          )}
        </label>
        <input
          accept="image/png, image/gif, image/jpeg"
          onChange={handleChangeImage}
          type="file"
          className="sr-only"
          draggable={true}
          id="inputFile"
          name="inputFile"
        />

        <InputText
          hasError={getValidationError("nombre")}
          value={formValues?.nombre}
          onChange={(e) => handleChangeValue("nombre", e?.target?.value)}
          placeholder="Agregar Nombre"
        />
        <InputText
          hasError={getValidationError("descripcion")}
          onChange={(e) => handleChangeValue("descripcion", e?.target?.value)}
          value={formValues?.descripcion}
          placeholder="Descripcion"
          type="textarea"
        />
        <CustomDateTime
          isOnline={checkedOnline}
          hasError={getValidationError("hora") || getValidationError("fecha")}
          setValues={(fecha, hora) => {
            handleChangeValueMultipleValues("fecha", fecha, "hora", hora);
          }}
        />
        <InputText
          hasError={getValidationError("duracion")}
          value={formValues?.duracion}
          onChange={(e) => handleChangeValue("duracion", e?.target?.value)}
          placeholder="Duracion en horas"
          type="number"
          label={"Duracion Horas"}
        />

        <div className="w-full flex h-[40px] items-center justify-start gap-4">
          <CheckBox setValue={setCheckedGratis} label="Gratis" />
          {!checkedGratis && (
            <InputText
              hasError={getValidationError("precio")}
              onChange={(e) => handleChangeValue("precio", e?.target?.value)}
              value={formValues?.precio}
              placeholder="Precio"
              type="number"
            />
          )}
        </div>

        <div className="w-full flex h-[40px] items-start justify-start flex-col gap-4">
          <CheckBox setValue={setCheckedOnline} label="Online" />
          {checkedOnline && (
            <div className="w-full h-auto flex flex-row items-center justify-start gap-2">
              <div className="w-[40px] h-[40px] relative min-w-[40px] min-h-[40px]">
                <GlobalImage className="rounded-full" src={ZoomIcon?.src} layout="fill" objectFit="cover" />
              </div>
              <InputText
              hasError={getValidationError("link")}
              onChange={(e) => handleChangeValue("link", e?.target?.value)}
              value={formValues?.link}
              placeholder="Zoom Link"
            />
             <InputText
              hasError={getValidationError("zoomPass")}
              onChange={(e) => handleChangeValue("zoomPass", e?.target?.value)}
              value={formValues?.zoomPass}
              placeholder="Zoom Pass"
            />
            </div>

            
          
          )}
        </div>
        <div className={clsx("w-full", checkedOnline && "mt-10")}>
        <InputText
          label={"Capacidad"}
          hasError={getValidationError("capacidad")}
          value={formValues?.capacidad}
          onChange={(e) => handleChangeValue("capacidad", e?.target?.value)}
          className="appearsAnimation w-full transition-all  text-white outline-none placeholder-white px-4 py-2 h-[40px] bg-transparent rounded-full border border-white"
          placeholder="Capacidad"
          type="number"
        />
        </div>
     
        {!checkedOnline && (
          <button
            onClick={() => setOpenSelectLocation(true)}
            type="button"
            className={clsx(
              "appearsAnimation w-full text-white outline-none placeholder-white px-4 py-3 bg-transparent rounded-full border ",
              getValidationError("lat") || getValidationError("lng")
                ? "border-red-500"
                : "border-white"
            )}
          >
            Seleccionar Ubicacion
          </button>
        )}
        <MultiSelect
          value={selectedCategorias}
          setValue={setSelectedCategorias}
          options={optionsCategorias}
        />
        <button
          type="submit"
          className="px-6 py-4 text-white rounded-full font-semibold bg-[#780EFF]"
        >
          Guardar
        </button>
      </form>

      {openSelectLocation && (
        <SelectLocationModal
          setLatLng={handleChangeLatLng}
          open={openSelectLocation}
          setOpen={(val) => setOpenSelectLocation(val)}
        />
      )}
    </div>
  );
};

export default CrearSeminario;
