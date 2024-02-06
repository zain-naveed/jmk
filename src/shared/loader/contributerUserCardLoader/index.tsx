import classNames from "classnames";
import SkeletonLoader from "../skeletonLoader";
import styles from "./style.module.scss";

function ContributerCardLoader() {
  return (
    <div
      className={classNames(
        styles.userContainer,
        "d-flex flex-column align-items-center p-0"
      )}
    >
      <SkeletonLoader iconStyle={classNames(styles.userIcon)} />
      <SkeletonLoader iconStyle={classNames(styles.title, "mt-2 w-50")} />
    </div>
  );
}

export default ContributerCardLoader;
