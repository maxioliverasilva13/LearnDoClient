import clsx from "clsx";
import moment from "moment";
import React, { useEffect, useState } from "react";
import DateTime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { MdAccessTime } from "react-icons/md";

const CustomDateTime = ({ min, max, disabled = false, setValues, hasError }) => {
  const [selectedTime, setSelectedTime] = useState(null);
  const [openCalendar, setOpenCalendar] = useState(false);

  useEffect(() => {
    if (selectedTime) {
      if (setValues) {
        setValues(moment(selectedTime).format("DD/MM/YYYY"), moment(selectedTime).format("HH:mm"));
      }
    }
  }, [selectedTime]);

  return (
    <div
      className={clsx(
        "w-full h-auto px-4 py-2 flex items-center justify-between max-w-full rounded-full border ",
        hasError ? "border-red-500" : "border-white"
      )}
    >
      <DateTime
        id={"customDateTime"}
        data-testid="DateTime"
        className="w-full"
        selected={selectedTime}
        disabled={disabled}
        calendarStartDay={1}
        onChange={(date) => {
          setSelectedTime(date);
        }}
        name="name"
        placeholderText="HH:MM"
        renderInput={
          (props) => <input
          {...props}
          onChange={() => null}
          type="string"
          placeholder="Fecha y Hora"
          className="bg-transparent placeholder-white text-white w-full outline-none flex-grow border-0"
        />
        }
        timeFormat="HH:mm:ss"
        timeConstraints={{
          hours: { min: 0, max: 23 },
          minutes: { min: 0, max: 59 },
          seconds: { min: 0, max: 59 },
        }}
        shouldCloseOnSelect={true}
        closeOnScroll={openCalendar ? true : false}
        onFocus={() => setOpenCalendar(false)}
        onClickOutside={() => setOpenCalendar(false)}
        onSelect={() => setOpenCalendar(!openCalendar)}
        open={openCalendar}
        dropdownMode="select"
        autoComplete="off"
        initialViewDate={selectedTime}
        isValidDate={(currentDate, selectedDate) => currentDate.isAfter(moment(new Date()).add("day", 1))}
      />
      <button
        className=""
        type="button"
        onClick={() => setOpenCalendar(!openCalendar)}
      >
        <MdAccessTime size={30} color="white" />
      </button>
    </div>
  );
};

export default CustomDateTime;
