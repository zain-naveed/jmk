import classNames from "classnames";
import styles from "./style.module.scss";
import { useEffect } from "react";

interface TabProps {
  tabs: string[];
  activeTab: string;
  handleActiveTab: (val: string) => void;
  tabItemStyle: string;
}

const CustomTab = ({
  tabs,
  activeTab,
  handleActiveTab,
  tabItemStyle,
}: Partial<TabProps>) => {
  const handleClickEvent = (e: any) => {
    if (e) {
      let getEle: any = document.getElementById("tabContainer");
      if (getEle) {
        // @ts-ignore
        // getEle.scrollLeft =
        //   e.target.offsetLeft - e.target.parentNode.offsetWidth / 2;
      }
    }
  };

  const handleResizeEvent = (e: any) => {
    if (e) {
      let getEle = document.getElementById("activeTab");
      if (getEle) {
        getEle.scrollIntoView({ block: "end" });
      }
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleClickEvent);
    window.addEventListener("resize", handleResizeEvent);
    return () => {
      window.removeEventListener("click", handleClickEvent);
      window.removeEventListener("resize", handleResizeEvent);
    };
  });

  return (
    <div
      className={classNames(
        "d-flex align-items-center justify-content-start justify-content-sm-start gap-4",
        styles.tabsContainer
      )}
      id="tabContainer"
    >
      {tabs?.map((tab, ind) => {
        return (
          <div
            className={classNames(styles.noPaddingContainer)}
            style={{ textAlign: "center" }}
            key={ind}
          >
            <label
              className={classNames(
                tab === activeTab ? styles.activeTab : styles.inActiveTab,
                tabItemStyle ? tabItemStyle : ""
              )}
              onClick={() => {
                handleActiveTab?.(tab);
              }}
              id={`${tab === activeTab ? "activeTab" : "inActiveTab"}`}
            >
              {tab}
              {tab === activeTab && (
                <div className={classNames(styles.activeTabThumb)} />
              )}
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default CustomTab;
