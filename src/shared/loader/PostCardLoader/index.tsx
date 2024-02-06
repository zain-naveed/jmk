import classNames from "classnames";
import SkeletonLoader from "../skeletonLoader";
import styles from "./style.module.scss";

const PostCardLoader = () => {
  return (
    <div className={classNames("col-12 col-md-6 col-lg-4 px-0 mt-4")}>
      <div className={classNames(styles.mainContainer)}>
        <SkeletonLoader iconStyle={classNames(styles.artStyle)} />
        <div
          className={classNames(
            "d-flex justify-content-between align-items-center position-relative px-3 py-3"
          )}
        >
          <SkeletonLoader iconStyle={classNames(styles.title)} />
          <SkeletonLoader iconStyle={classNames(styles.moreIcon)} />
        </div>
        <div
          className={classNames(
            "d-flex justify-content-between align-items-center mt-2 position-relative pb-3 pt-1 px-3"
          )}
        >
          <div
            className={classNames(
              "d-flex align-items-center justify-content-start gap-1 w-100"
            )}
          >
            <SkeletonLoader iconStyle={classNames(styles.dateIcon)} />
            <SkeletonLoader iconStyle={classNames(styles.dateLabel)} />
          </div>

          <SkeletonLoader iconStyle={classNames(styles.tagContainer)} />
        </div>
      </div>
    </div>
  );
};

export default PostCardLoader;
