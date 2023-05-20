import { useEffect, useState } from "react";
import { MdDone } from "react-icons/md";

const CheckBox = ({ label, setValue }) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (setChecked) {
      if (setValue) {
        setValue(checked);
      }
    }
  }, [checked]);

  const handleToggle = () => {
    setChecked(!checked);
  };

  return (
    <div className="flex select-none flex-row  gap-1 items-center justify-start">
      <div
        onClick={handleToggle}
        className="w-[20px] h-[20px] cursor-pointer rounded-md border flex items-center justify-center border-white "
      >
        <MdDone
          color="white"
          size={18}
          className={`transition-all ${checked ? "opacity-100" : "opacity-0"}`}
        />
      </div>
      {label && (
        <span className="text-white text-[14px] font-medium">{label}</span>
      )}
    </div>
  );
};

export default CheckBox;
