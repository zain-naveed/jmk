import classNames from "classnames";
import SkeletonLoader from "../skeletonLoader";
import styles from "./style.module.scss";

const ArtistCardLoader = () => {
  return (
    <div
      className={classNames(
        "d-flex flex-column align-items-center justify-content-center gap-2 mt-5",
        styles.artistsContainer
      )}
    >
      <SkeletonLoader iconStyle={classNames(styles.artistsStyle)} />

      <div
        className={classNames(
          "d-flex flex-column align-items-start justify-content-center w-100 gap-1"
        )}
      >
        <SkeletonLoader iconStyle={classNames(styles.title, "w-75")} />
        <SkeletonLoader iconStyle={classNames(styles.subTitle, "w-50")} />
      </div>
    </div>
  );
};

export default ArtistCardLoader;
