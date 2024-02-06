import classNames from "classnames";
import SkeletonLoader from "../skeletonLoader";
import styles from "./style.module.scss";

const ReplyCardLoader = () => {
  return (
    <div className={classNames("d-flex w-100")}>
      <SkeletonLoader iconStyle={classNames(styles.avatarStyle)} />
      <div className={classNames("d-flex flex-column ms-2 w-100")}>
        <div className={classNames("d-flex")}>
          <SkeletonLoader
            iconStyle={classNames(styles.commentUserName, "w-100")}
          />
        </div>
        <SkeletonLoader
          iconStyle={classNames(styles.commentContent, "w-100 mt-2")}
        />

        <div
          className={classNames(
            "d-flex align-items-center justify-content-between mt-2"
          )}
        >
          <SkeletonLoader
            iconStyle={classNames(styles.commentUserName, "w-50")}
          />
          <SkeletonLoader
            iconStyle={classNames(styles.commentUserName, "w-25")}
          />
        </div>
      </div>
    </div>
  );
};

export default ReplyCardLoader;
