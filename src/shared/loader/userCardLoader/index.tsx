import classNames from "classnames";
import SkeletonLoader from "../skeletonLoader";
import styles from "./style.module.scss";

interface UserCardLoaderProps {
  isStyle2: boolean;
  isStyle3: boolean;
}

const UserCardLoader = ({
  isStyle2,
  isStyle3,
}: Partial<UserCardLoaderProps>) => {
  return (
    <div
      className={classNames("d-flex align-items-center justify-content-center")}
      role="button"
    >
      <SkeletonLoader iconStyle={classNames(styles.avatarStyle)} />
      <SkeletonLoader
        iconStyle={classNames(
          isStyle2 ? styles.nameLabel2 : styles.nameLabel,
          isStyle3 && styles.nameLabel3,
          "ms-2"
        )}
      />
    </div>
  );
};

export default UserCardLoader;
