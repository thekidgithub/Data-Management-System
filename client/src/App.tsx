import React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "./components/TopBar";
import Aside from "./components/Aside";
import { LanguageProvider } from "./components/LanguageContext";

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <div className="w-screen h-screen flex flex-col">
        <TopBar />
        <div className="w-full flex-1 bg-[#f7f5f5] flex">
          <Aside />
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </LanguageProvider>
  );
};

export default App;
