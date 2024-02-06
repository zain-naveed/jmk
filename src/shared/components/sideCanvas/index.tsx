import { Icons } from "assets";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { routeConstant } from "shared/routes/routeConstant";
import { navigationItems } from "./constants";
import styles from "./style.module.scss";

interface SideCanvasProps {
  setIsOpen: (val: boolean) => void;
  isOpen: boolean;
}

const SideCanvas = ({ isOpen, setIsOpen }: SideCanvasProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>(location?.pathname);
  function handleClick(e: any) {
    const elem: any = document.getElementById("sideShopingCart");
    if (!elem.contains(e.target)) {
      setIsOpen(false);
    }
  }

  const navigateToScreen = (route: string) => {
    navigate(route);
    setActiveTab(route);
    setIsOpen(false);
  };

  useEffect(() => {
    let elem: any = document.getElementById("backDropContainer2");
    elem.addEventListener("click", (event: any) => {
      handleClick(event);
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setActiveTab(location?.pathname);

    // eslint-disable-next-line
  }, [location?.pathname]);
  return (
    <div className={classNames(styles.backDropContainer, "d-lg-none")} style={isOpen ? { visibility: "visible" } : { visibility: "hidden" }} id="backDropContainer2">
      <div className={classNames(styles.mainContainer, isOpen ? styles.shown : styles.hidden)} id="sideShopingCart">
        <div className={`${"justify-content-between p-4"}  ${styles.logoContainer} d-flex align-items-center w-100 p-0`} style={{ position: "relative" }}>
          <Icons.Cross className={styles.crossIcon} onClick={() => setIsOpen(false)} />
          <Icons.Logo
            className={classNames(styles.logoStyle)}
            onClick={() => {
              navigateToScreen(routeConstant.home.path);
            }}
          />
        </div>
        <div className={classNames("d-flex align-items-start gap-md-4 gap-3 flex-column p-4")}>
          {navigationItems.map((item, inx) => {
            return (
              <label
                className={classNames(styles.headerLabels, activeTab === item?.route && styles.activeLabel)}
                onClick={() => {
                  navigateToScreen(item?.route);
                }}
                key={inx}
              >
                {item?.label}
              </label>
            );
          })}
          <label className={classNames(styles.headerLabels, activeTab === routeConstant.writers.path && styles.activeLabel, " d-flex d-sm-none")} onClick={() => navigateToScreen(routeConstant.writers.path)}>
            Writers
          </label>
          <label className={classNames(styles.headerLabels, activeTab === routeConstant.artists.path && styles.activeLabel, " d-flex d-sm-none")} onClick={() => navigateToScreen(routeConstant.artists.path)}>
            Artists
          </label>
        </div>
      </div>
    </div>
  );
};

export default SideCanvas;
