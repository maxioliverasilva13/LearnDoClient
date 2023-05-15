import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
const { default: storage } = require("firebaseConfig");
const { useState } = require("react");

const useUploadImage = () => {
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handleUpload = async (file) => {
    try {
        if (!file) {
            return null;
          }
      
          const storageRef = ref(
            storage,
            `/profileImages/${Date.now() + file?.name}`
          ); // modificar esta línea para usar un nombre distinto para el archivo
          const uploadTask = uploadBytesResumable(storageRef, file);
          await uploadTask;
          const newUrl = await getDownloadURL(uploadTask.snapshot.ref);
          setImageUrl(newUrl);
          return newUrl;
    } catch (error) {
        setError("Error al submir imagen");
        return "";
    }
  };

  return {
    handleUpload,
    error,
    imageUrl,
  };
};

export default useUploadImage;
