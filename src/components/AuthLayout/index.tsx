import logo from "../../assets/logo.webp";
import { Image } from "@nextui-org/image";

const AuthLayout = ({ title, children }: { title: string; children: any }) => {
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm relative">
        <div className="relative flex justify-center items-center mb-20">
          <Image src={logo} alt="Open Wikipedia" className="z-0"></Image>
          <h1 className="mt-96 absolute text-center text-6xl ">OpenWikipedia</h1>
        </div>
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {title}
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">{children}</div>
    </div>
  );
};

export default AuthLayout;
