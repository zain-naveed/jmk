import classNames from "classnames";
import SkeletonLoader from "../skeletonLoader";
import StoryCountLoader from "../storyCountLoader";
import styles from "./style.module.scss";

const ArtCardLoader = () => {
  return (
    <div className={classNames(styles.artContainer, "mt-4 d-flex flex-column")}>
      <SkeletonLoader iconStyle={classNames(styles.artStyle)} />

      <div
        className={classNames(
          "d-flex justify-content-between align-items-center mt-2 position-relative"
        )}
      >
        <div role="button" className={classNames("d-flex gap-2")}>
          <StoryCountLoader
            containerStyle={classNames(styles.categContainer)}
          />
          <StoryCountLoader
            containerStyle={classNames(styles.categContainer)}
          />
        </div>
        <SkeletonLoader iconStyle={classNames(styles.moreIcon)} />
      </div>
      <SkeletonLoader iconStyle={classNames(styles.title, "mt-2")} />
    </div>
  );
};

export default ArtCardLoader;
