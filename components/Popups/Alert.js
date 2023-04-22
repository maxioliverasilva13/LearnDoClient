import React from "react";

const Alert = ({important, text, color, icon, show, setShow}) => {
  return (
    <>
      {show ? (
        <div
          id="mainDiv" className={"text-white px-6 py-4 border-0 rounded relative mb-4 " + color}
        >
          <span className="text-xl inline-block mr-2 align-middle">
            <i className={icon} />
          </span>
          <span className="inline-block align-middle mr-8">
            <b className="capitalize">{important}</b> {text}
          </span>
          <button
            className="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none"
            onClick={() => setShow(false)}
          >
            <span>×</span>
          </button>
        </div>
      ) : null}
    </>
  );
};

export default Alert;