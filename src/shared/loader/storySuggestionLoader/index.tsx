import classNames from "classnames";
import SkeletonLoader from "../skeletonLoader";
import StoryCountLoader from "../storyCountLoader";
import UserCardLoader from "../userCardLoader";
import styles from "./style.module.scss";

interface StorySuggestionLoaderProps {
  isAuthorStory: boolean;
  isInProfile: boolean;
  isPrivate: boolean;
  isPersonalStory: boolean;
}

const StorySuggestionCardLoader = ({
  isAuthorStory,
  isInProfile,
  isPrivate,
  isPersonalStory,
}: Partial<StorySuggestionLoaderProps>) => {
  return (
    <>
      <div
        className={classNames(
          isAuthorStory || isInProfile || isPersonalStory
            ? "col-12 mt-4"
            : "col-12 col-lg-6 mt-4",
          isAuthorStory ? styles.topContainer2 : styles.topContainer,
          "position-relative"
        )}
      >
        <div className={classNames("d-flex flex-column flex-sm-row")}>
          {isInProfile && (
            <SkeletonLoader
              iconStyle={classNames(
                styles.artStyle,
                "me-0 me-sm-3 mb-3 mb-sm-0"
              )}
            />
          )}

          <div className={classNames("w-100")}>
            <div
              className={classNames(
                "d-flex align-items-start align-items-sm-center  justify-content-center justify-content-sm-start flex-column flex-sm-row gap-2"
              )}
            >
              {!isAuthorStory && !isInProfile && !isPersonalStory ? (
                <UserCardLoader />
              ) : null}
              <StoryCountLoader
                containerStyle={classNames(styles.categContainer)}
              />
            </div>
            <div
              className={classNames(
                "d-flex justify-content-between align-items-start mt-3 position-relative"
              )}
            >
              <SkeletonLoader
                iconStyle={classNames(styles.storyLabel, "w-100")}
              />
            </div>
            <SkeletonLoader
              iconStyle={classNames(styles.descStyle, "mt-3 w-100")}
            />
            <SkeletonLoader
              iconStyle={classNames(styles.descStyle, "mt-1 w-100")}
            />

            <SkeletonLoader
              iconStyle={classNames(styles.descStyle, "w-75 mt-1")}
            />
            {!isAuthorStory ? (
              <div
                className={classNames(
                  "mt-3 d-flex align-items-center justify-content-start gap-3"
                )}
              >
                <SkeletonLoader
                  iconStyle={classNames(styles.actionIconStyle)}
                />
                <SkeletonLoader
                  iconStyle={classNames(styles.actionIconStyle)}
                />
                <SkeletonLoader
                  iconStyle={classNames(styles.actionIconStyle)}
                />
                {!isPrivate ? (
                  <SkeletonLoader
                    iconStyle={classNames(styles.actionIconStyle)}
                  />
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
        <div className={classNames(styles.btmBorder)} />
      </div>
    </>
  );
};

export default StorySuggestionCardLoader;
