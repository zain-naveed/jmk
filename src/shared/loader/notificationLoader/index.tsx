import classNames from "classnames";
import SkeletonLoader from "../skeletonLoader";
import styles from "./style.module.scss";

const NotificationCardLoader = () => {
  return (
    <>
      <div className={classNames("col-12 col-xl-6 mt-4")}>
        <div className={classNames("d-flex  flex-sm-row")}>
          <SkeletonLoader
            iconStyle={classNames(styles.artStyle, "me-0 me-sm-3 mb-3 mb-sm-0")}
          />
          <div>
            <div className={classNames("d-flex")}>
              <SkeletonLoader
                iconStyle={classNames(
                  styles.label,
                  "me-0 me-sm-3 mb-3 mb-sm-0"
                )}
              />
              <SkeletonLoader
                iconStyle={classNames(styles.date, "me-0 me-sm-3 mb-3 mb-sm-0")}
              />
            </div>
            <SkeletonLoader
              iconStyle={classNames(
                styles.labelNotification,
                "me-0 me-sm-3 mt-2 mb-3 mb-sm-0"
              )}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationCardLoader;
