import classNames from "classnames";
import SkeletonLoader from "../skeletonLoader";
import styles from "./style.module.scss";

interface CustomTabsLoaderProps {
  tabItemStyle: string;
}

const CustomTabsLoader = ({ tabItemStyle }: Partial<CustomTabsLoaderProps>) => {
  return (
    <div
      className={classNames(
        "d-flex align-items-center justify-content-start justify-content-sm-start gap-4",
        styles.tabsContainer
      )}
      id="tabContainer"
    >
      {Array.from(Array(3).keys())?.map((tab, ind) => {
        return (
          <div
            className={classNames(styles.noPaddingContainer)}
            style={{ textAlign: "center" }}
            key={ind}
          >
            <SkeletonLoader
              iconStyle={classNames(
                styles.activeTab,
                tabItemStyle ? tabItemStyle : ""
              )}
            />
          </div>
        );
      })}
    </div>
  );
};

export default CustomTabsLoader;
