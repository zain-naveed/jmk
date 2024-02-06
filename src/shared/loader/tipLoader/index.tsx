import classNames from "classnames";
import SkeletonLoader from "../skeletonLoader";
import styles from "./style.module.scss";

const TipLaoder = () => {
  return (
    <div
      className={classNames(
        "d-flex w-100 align-self-start align-items-start gap-3"
      )}
    >
      <SkeletonLoader iconStyle={classNames(styles.iconStyle)} />
      <div className={classNames("gap-1 w-100 d-flex flex-column")}>
        <SkeletonLoader
          iconStyle={classNames(styles.subTitleLoader, "w-100")}
        />
        <SkeletonLoader iconStyle={classNames(styles.subTitleLoader, "w-75")} />
        <SkeletonLoader iconStyle={classNames(styles.subTitleLoader, "w-50")} />
      </div>
    </div>
  );
};

export default TipLaoder;
