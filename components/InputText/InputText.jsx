import clsx from "clsx";

const InputText = ({
  onChange,
  value,
  hasError,
  placeholder,
  type = "text",
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
    <input
      onChange={onChange}
      value={value}
      type={type}
      className={clsx(
        "appearsAnimation w-full flex-grow flex text-white outline-none placeholder-white px-4 py-2 h-[40px] bg-transparent rounded-full border",
        hasError ? "border-red-500" : "border-white"
      )}
      placeholder={placeholder}
    />
  );
};

export default InputText;
