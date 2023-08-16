import BounceLoader from "react-spinners/BounceLoader";

const Spinner = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-black bg-opacity-40 z-[100] fixed inset-0 m-auto">
      <BounceLoader
        color={"#97ca3f"}
        loading={true}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Spinner;
