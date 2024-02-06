import classNames from "classnames";
import SkeletonLoader from "../skeletonLoader";
import StoryCountLoader from "../storyCountLoader";
import styles from "./style.module.scss";

interface SaveArtLoaderProps {
  isInArtSelection: boolean;
}

const SaveArtCardLoader = ({
  isInArtSelection,
}: Partial<SaveArtLoaderProps>) => {
  return (
    <div className={classNames(styles.artContainer, "mt-4 d-flex flex-column")}>
      <SkeletonLoader iconStyle={classNames(styles.artStyle)} />

      <div
        className={classNames(
          "d-flex justify-content-between align-items-center mt-4 position-relative"
        )}
      >
        <div className={classNames("d-flex gap-2 ")}>
          <StoryCountLoader
            containerStyle={classNames(styles.categContainer)}
          />
          <StoryCountLoader />
        </div>
        {!isInArtSelection && (
          <SkeletonLoader iconStyle={classNames(styles.moreIcon)} />
        )}
      </div>
      <SkeletonLoader iconStyle={classNames(styles.title, "mt-2")} />
    </div>
  );
};

export default SaveArtCardLoader;
