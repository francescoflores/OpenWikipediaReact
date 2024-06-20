import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="bg-gray-100 flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="text-xl mt-4 font-bold">Page Not Found</p>{" "}
      <Link to="/" className="mt-3 text-blue-700 font-semibold">Go to the Homepage</Link>
    </div>
  );
};

export default PageNotFound;
