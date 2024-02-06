import classNames from "classnames";
import SkeletonLoader from "../skeletonLoader";
import styles from "./style.module.scss";

const SocialLinksLoader = () => {
  return (
    <div className={classNames("d-flex gap-2")}>
      <SkeletonLoader iconStyle={classNames(styles.socialContainer)} />
      <SkeletonLoader iconStyle={classNames(styles.socialContainer)} />
      <SkeletonLoader iconStyle={classNames(styles.socialContainer)} />
      <SkeletonLoader iconStyle={classNames(styles.socialContainer)} />
    </div>
  );
};

export default SocialLinksLoader;
