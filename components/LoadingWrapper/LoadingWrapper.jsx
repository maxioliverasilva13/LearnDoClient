import Spinner from "components/Spinner/Spinner";
import useGlobalSlice from "hooks/useGlobalSlice";

const LoadingWrapper = ({ children }) => {
    const { isLoading } = useGlobalSlice();
  return (
    <>
      {isLoading && <Spinner />}
      {children}
    </>
  );
};

export default LoadingWrapper;
