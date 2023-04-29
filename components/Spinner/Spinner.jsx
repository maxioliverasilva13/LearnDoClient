import BounceLoader from "react-spinners/BounceLoader";

const Spinner = () => {
    return (
        <div className="w-full h-full flex items-center justify-center bg-white z-[50] absolute inset-0 m-auto">
        <BounceLoader
          color={"#46b3a6"}
          loading={true}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    )
}

export default Spinner;