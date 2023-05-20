import clsx from "clsx";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AiTwotoneCalendar } from "react-icons/ai";

const CustomDatePicker = ({ min, max, disabled = false, setValue, hasError }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openCalendar, setOpenCalendar] = useState();

  useEffect(() => {
    if (selectedDate) {
      if (setValue) {
        setValue(selectedDate?.toString());
      }
    }
  }, [selectedDate]);

  return (
    <div className={clsx("w-full h-auto px-4 py-2 flex items-center justify-between max-w-full rounded-full border ",
        hasError ? "border-red-500" : "border-white"
    )}>
      <DatePicker
        id={"customDatePickerInput"}
        data-testid="DatePicker"
        className="w-full"
        selected={selectedDate}
        minDate={min ? min : null}
        maxDate={max ? max : null}
        disabled={disabled}
        calendarStartDay={1}
        onChange={(date) => {
          setSelectedDate(date);
        }}
        name="name"
        placeholderText="DD/MM/YYYY"
        customInput={
          <input
            type="string"
            className="bg-transparent text-white w-full outline-none flex-grow border-0"
          />
        }
        shouldCloseOnSelect={true}
        closeOnScroll={openCalendar ? true : false}
        onFocus={() => setOpenCalendar(false)}
        onClickOutside={() => setOpenCalendar(false)}
        onSelect={() => setOpenCalendar(!openCalendar)}
        open={openCalendar}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        autoComplete="off"
      />
      <button
        className=""
        type="button"
        onClick={() => setOpenCalendar(!openCalendar)}
      >
        <AiTwotoneCalendar size={30} color="white" />
      </button>
    </div>
  );
};

export default CustomDatePicker;
