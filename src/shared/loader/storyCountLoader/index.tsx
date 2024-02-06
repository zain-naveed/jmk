import classNames from "classnames";
import styles from "./style.module.scss";
import SkeletonLoader from "../skeletonLoader";

interface StoryCountLoaderProps {
  containerStyle: any;
}

const StoryCountLoader = ({
  containerStyle,
}: Partial<StoryCountLoaderProps>) => {
  return (
    <SkeletonLoader
      iconStyle={classNames(
        styles.counterContainer,
        containerStyle && containerStyle,
        "pe-3"
      )}
    />
  );
};

export default StoryCountLoader;
