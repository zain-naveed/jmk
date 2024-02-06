import { useState } from "react";
import Header from "../header";
import SideCanvas from "../sideCanvas";

interface NavWrapperProps {
  isLandingPage: boolean;
}

const NavWrapper = ({ isLandingPage }: Partial<NavWrapperProps>) => {
  const [isSideCanvas, setIsSideCanvas] = useState<boolean>(false);

  return (
    <>
      <SideCanvas isOpen={isSideCanvas} setIsOpen={setIsSideCanvas} />
      <Header
        isSideCanvas={isSideCanvas}
        setIsSideCanvas={setIsSideCanvas}
        isLandingPage={isLandingPage ? isLandingPage : false}
      />
    </>
  );
};

export default NavWrapper;
