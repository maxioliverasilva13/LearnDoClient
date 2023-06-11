import Spinner from "components/Spinner/Spinner";
import useGlobalSlice from "hooks/useGlobalSlice";

const LoadingWrapper = ({ children }) => {
    const { isLoading } = useGlobalSlice();
  return (
    <div className="w-full h-full">
      {isLoading && <Spinner />}
      {children}
    </div>
  );
};

export default LoadingWrapper;
