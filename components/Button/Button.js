import clsx from "clsx";


const Button = ({ disabled, type, text, isLoading }) => {
  return (
    <button
      className={clsx(" w-8  max-w-8 bg-red-700 flex flex-row items-center justify-center gap-x-4 text-white active:bg-blue-600 text-sm font-bold uppercase px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150",
        isLoading && "bg-opacity-60"
      )}
      type={type || "submit"}
      id="submit"
      disabled={disabled || false}
    >
      {
        isLoading && <svg
        className="spinner"
        width="24"
        height="24"
        viewBox="0 0 13 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M4.38798 12.616C3.36313 12.2306 2.46328 11.5721 1.78592 10.7118C1.10856 9.85153 0.679515 8.82231 0.545268 7.73564C0.411022 6.64897 0.576691 5.54628 1.02433 4.54704C1.47197 3.54779 2.1845 2.69009 3.08475 2.06684C3.98499 1.4436 5.03862 1.07858 6.13148 1.01133C7.22435 0.944078 8.31478 1.17716 9.28464 1.68533C10.2545 2.19349 11.0668 2.95736 11.6336 3.89419C12.2004 4.83101 12.5 5.90507 12.5 7"
          stroke="white"
        />
      </svg>
      }
      {text}
    </button>
  );
};

export default Button;
