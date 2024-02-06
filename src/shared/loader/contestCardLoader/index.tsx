import classNames from "classnames";
import CustomButtonLoader from "../customButtonLoader";
import SkeletonLoader from "../skeletonLoader";
import StoryCountLoader from "../storyCountLoader";
import styles from "./style.module.scss";

interface ContestCardLoaderProps {
  customContainer: any;
}

const ContestCardLoader = ({
  customContainer,
}: Partial<ContestCardLoaderProps>) => {
  return (
    <div
      className={classNames(
        "d-flex flex-column position-relative",
        styles.contestCardContainer,
        customContainer && customContainer
      )}
    >
      <SkeletonLoader iconStyle={classNames(styles.artStyle)} />

      <div className={classNames("d-flex mt-4 gap-2")}>
        <StoryCountLoader containerStyle={classNames(styles.categContainer)} />
        <StoryCountLoader containerStyle={classNames(styles.categContainer)} />
      </div>
      <div
        className={classNames(
          "d-flex flex-column align-items-start gap-2 mt-3"
        )}
      >
        <SkeletonLoader iconStyle={classNames(styles.descStyle)} />
        <SkeletonLoader iconStyle={classNames(styles.descStyle, "w-75")} />
        <SkeletonLoader iconStyle={classNames(styles.descStyle, "w-50")} />
      </div>
      <div
        className={classNames(
          "d-flex align-items-center justify-content-start w-100 gap-1 gap-sm-3 mt-3",
          styles.actionContainer
        )}
      >
        <CustomButtonLoader
          customBtnContainer={classNames(styles.btnContainer)}
        />
        <CustomButtonLoader
          customBtnContainer={classNames(styles.btnContainer)}
        />
      </div>
    </div>
  );
};

export default ContestCardLoader;
