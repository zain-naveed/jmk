import classNames from "classnames";
import styles from "./style.module.scss";
import SkeletonLoader from "../skeletonLoader";

const StatsCardLoader = () => {
  return (
    <div className={classNames("d-flex p-3 mt-4", styles.statContainer)}>
      <div className={classNames("col-7 d-flex flex-column gap-3")}>
        <SkeletonLoader iconStyle={classNames(styles.statstitle)} />
        <SkeletonLoader iconStyle={classNames(styles.statsAmount)} />
        <div
          className={classNames(
            "d-flex align-items-center justify-content-start gap-2"
          )}
        >
          <div className={classNames("d-flex align-items-center gap-1")}>
            <SkeletonLoader iconStyle={classNames(styles.arrowIcon)} />
            <SkeletonLoader iconStyle={classNames(styles.statsPercent)} />
          </div>

          <SkeletonLoader iconStyle={classNames(styles.statsPercent)} />
        </div>
      </div>
      <div
        className={classNames(
          "col-5 d-flex align-items-end justify-content-end"
        )}
      >
        <SkeletonLoader iconStyle={classNames(styles.chartLoader)} />
      </div>
    </div>
  );
};

export default StatsCardLoader;
