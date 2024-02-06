import classNames from "classnames";
import SkeletonLoader from "../skeletonLoader";
import styles from "./style.module.scss";

const WritersCardLoader = () => {
  return (
    <div
      className={classNames(
        "col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 d-flex flex-column align-items-center justify-content-center gap-2 mt-4"
      )}
    >
      <SkeletonLoader iconStyle={classNames(styles.avatarStyle)} />

      <div
        className={classNames(
          "d-flex flex-column align-items-center justify-content-center w-100 gap-1"
        )}
      >
        <SkeletonLoader iconStyle={classNames(styles.title, "w-75")} />
        <SkeletonLoader iconStyle={classNames(styles.subTitle, "w-50")} />
      </div>
    </div>
  );
};

export default WritersCardLoader;
