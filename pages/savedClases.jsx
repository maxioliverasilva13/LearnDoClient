import NoResults from "components/NotFoundPage/NoResults";
import { useEffect, useState } from "react";
import { loadSavedClases, removeItemFromDB } from "utils/indexesDb";
import SavedClaseItem from "components/SavedClaseItem/SavedClaseItem";
import useGlobalSlice from "hooks/useGlobalSlice";
import { toast } from "react-toastify";

const SavedClases = () => {
  const [items, setItems] = useState([]);
  const [isChecking, setIsChecking] = useState(true);
  const { handleSetLoading } = useGlobalSlice();

  const handleLoadItems = async () => {
    try {
      handleSetLoading(true);
      const response = await loadSavedClases();
      if (response?.length > 0) {
        setItems(response || []);
      }
      setIsChecking(false);
      handleSetLoading(false);
    } catch (error) {
      handleSetLoading(false);
      console.log("error cargando las clses guardadas", error);
    }
  };

  const handleRemoveItem = (item) => {
    removeItemFromDB(item, () =>  {
      const filterITEMS = items?.filter((a) => a?.id !== item?.id)
      setItems(filterITEMS);
      toast.success("Video eliminado correctamente", {
        theme: "light",
      })
    });
  };

  useEffect(() => {
    handleLoadItems();
  }, []);

  return (
    <div className="w-full h-auto md:mt-10 mt-5 md:px-20 px-5 flex flex-col items-center justify-start gap-4">
      <span className="w-full h-auto text-center text-white text-[30px] font-semibold">
        Clases Guardadas
      </span>

      {items?.length === 0 && !isChecking && (
        <NoResults message={"No se encontraron clases guardadas"} />
      )}

      <div className="w-full transition-all h-auto flex flex-row items-center justify-center flex-wrap gap-4">
        {items?.map((claseInfo) => {
          return <SavedClaseItem
              key={claseInfo?.id}
              claseInfo={claseInfo}
              onRemove={() => handleRemoveItem(claseInfo)}
            />
          ;
        })}
      </div>
    </div>
  );
};

export default SavedClases;
