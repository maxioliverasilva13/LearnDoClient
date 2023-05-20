import clsx from "clsx";

const InputText = ({
  onChange,
  value,
  hasError,
  placeholder,
  type = "text",
  label,
}) => {
  if (type === "textarea") {
    return (
      <textarea
        onChange={onChange}
        value={value}
        type={type}
        className={clsx(
          "w-full text-white outline-none placeholder-white px-4 py-2 h-[120px] bg-transparent rounded-lg border",
          hasError ? "border-red-500" : "border-white"
        )}
        placeholder={placeholder}
      />
    );
  }

  return (
    <div className="w-full h-auto flex flex-col gap-2 items-start justify-start">
      {label && (
        <span className="text-white text-[14px] font-medium">{label}</span>
      )}
      <input
      onChange={onChange}
      value={value}
      type={type}
      className={clsx(
        "appearsAnimation placeholder-white w-full flex-grow flex text-white outline-none placeholder-white px-4 py-2 h-[40px] bg-transparent rounded-full border",
        hasError ? "border-red-500" : "border-white"
      )}
      placeholder={placeholder}
    />
    </div>
    
  );
};

export default InputText;
