import classNames from "classnames";
import SkeletonLoader from "../skeletonLoader";
import StoryCountLoader from "../storyCountLoader";
import styles from "./style.module.scss";
import UserCardLoader from "../userCardLoader";

const SaveStoryCardLoader = () => {
  return (
    <>
      <div
        className={classNames(
          "col-12 col-xl-6 mt-4",
          styles.topContainer,
          "position-relative"
        )}
      >
        <div className={classNames("d-flex flex-column flex-sm-row")}>
          <SkeletonLoader
            iconStyle={classNames(styles.artStyle, "me-0 me-sm-3 mb-3 mb-sm-0")}
          />

          <div className={classNames("w-100")}>
            <div
              className={classNames(
                "d-flex align-items-start align-items-md-center  justify-content-center justify-content-md-start flex-column flex-md-row gap-2"
              )}
            >
              <UserCardLoader />

              <StoryCountLoader />
            </div>
            <div
              className={classNames(
                "d-flex justify-content-between align-items-start mt-3 position-relative"
              )}
            >
              <SkeletonLoader iconStyle={classNames(styles.storyLabel)} />

              <SkeletonLoader iconStyle={classNames(styles.iconUpArrow)} />
            </div>
            <div
              className={classNames(
                "d-flex flex-column align-items-start gap-2 w-100 mt-3"
              )}
            >
              <SkeletonLoader iconStyle={classNames(styles.descStyle)} />
              <SkeletonLoader
                iconStyle={classNames(styles.descStyle, "w-75")}
              />
              <SkeletonLoader
                iconStyle={classNames(styles.descStyle, "w-50")}
              />
            </div>

            <div
              className={classNames(
                "mt-3 d-flex align-items-center justify-content-start gap-3"
              )}
            >
              <SkeletonLoader iconStyle={classNames(styles.actionIconStyle)} />
              <SkeletonLoader iconStyle={classNames(styles.actionIconStyle)} />
              <SkeletonLoader iconStyle={classNames(styles.actionIconStyle)} />

              <SkeletonLoader iconStyle={classNames(styles.actionIconStyle)} />
            </div>
          </div>
        </div>
        <div className={classNames(styles.btmBorder)} />
      </div>
    </>
  );
};

export default SaveStoryCardLoader;
