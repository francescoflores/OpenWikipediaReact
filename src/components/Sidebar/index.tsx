import { ReactNode } from "react";

const Sidebar = ({ children }: { children: ReactNode }) => {
  return (
    <div className="fixed h-2/3 bg-gray-100 overflow-auto rounded-xl max-w-64 border-2 -ml-2 custom-scrollbar">
      <h2 className="text-center text-xl font-serif font-bold sm:text-2xl">Contents</h2>
      <div className="h-screen px-4 pt-2">{children}</div>
    </div>
  );
};

export default Sidebar;
