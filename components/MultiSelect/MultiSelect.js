import clsx from "clsx";
import { useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import OutsideClickHandler from 'react-outside-click-handler';

const MultiSelect = ({ options, value, setValue }) => {
  const [isExpanded, setIsExpanded] = useState(null);
  const [query, setQuery] = useState("");
  const hasQuery = query !== "";

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const filterWithQuery = () => {
    const newItems = options?.filter((item) => {
        return item?.label?.toString()?.includes(query);
    })
    return newItems;
  }

  const valuesToMap = hasQuery ? filterWithQuery() : options;

  const handleClickOnItem = (item) => {
    const itemExists = value?.find((val) => val?.value === item?.value);
    if (!itemExists) {
      setValue([...value, item]);
    }
  };

  const handleRemoveItem = (item) => {
    const newValues = value?.filter((val) => val?.value !== item?.value);
    setValue(newValues);
  };

  return (
    <div className="w-full multiSelect">
        <OutsideClickHandler
      className="w-full"
      onOutsideClick={() => {
        setIsExpanded(false);
      }}
    >
    <div className="w-full relative flex flex-col gap-2">
      <div className="w-full mb-2 px-4 h-[45px] border gap-2 border-white rounded-full flex flex-row items-center justify-between overlfow-hidden">
        <input
          placeholder="Categorias"
          value={query}
          onChange={(e) => setQuery(e?.target?.value)}
          className="w-full flex flex-grow h-full py-2 outline-none bg-transparent border-0 text-white placeholder-white "
        />
        <BsChevronDown
          color="white"
          onClick={handleToggleExpanded}
          size={20}
          className={clsx(
            "font-semibold cursor-pointer select-none transform transition-all",
            isExpanded && "rotate-180"
          )}
        />
      </div>
      <div className="w-full mb-2 h-auto flex flex-row items-center justify-start gap-1 max-w-full flex-wrap">
        {value?.map((item) => {
          return (
            <span className="w-auto transition-all appearsAnimation h-auto px-2 py-3 text-white bg-gray-500 rounded-lg relative">
              {item?.label}
              <IoMdClose
                onClick={() => handleRemoveItem(item)}
                size={12}
                color="white"
                className="cursor-pointer z-10 text-white absolute right-[4px] top-[4px]"
              />
            </span>
          );
        })}
      </div>
      {isExpanded && (
        <div className="w-full appearsAnimation max-h-[200px] overflow-auto h-auto p-2 flex flex-col rounded-lg shadow-md absolute top-full bg-white">
          {
          valuesToMap?.map((item) => {
            return (
              <span
                onClick={() => handleClickOnItem(item)}
                className="w-full hover:bg-gray-100 transition-all cursor-pointer px-2 py-2 text-gray-900 text-left my-2 rounded-lg"
              >
                {item?.label}
              </span>
            );
          })}
        </div>
      )}
    </div>
    </OutsideClickHandler>
    </div>
  );
};

export default MultiSelect;
