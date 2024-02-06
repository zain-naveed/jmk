import classNames from "classnames";
import CustomButtonLoader from "../customButtonLoader";
import SkeletonLoader from "../skeletonLoader";
import StoryCountLoader from "../storyCountLoader";
import styles from "./style.module.scss";

interface StoryCardLoaderProps {
  customContainer: any;
}

const StoryCardLoader = ({
  customContainer,
}: Partial<StoryCardLoaderProps>) => {
  return (
    <div
      className={classNames(
        "d-flex  position-relative mt-4 flex-row flex-sm-column  gap-2 gap-sm-4",
        styles.contestCardContainer,
        customContainer && customContainer
      )}
    >
      <SkeletonLoader iconStyle={classNames(styles.artStyle)} />
      <div className={classNames("w-100")}>
        <div className={classNames("d-flex gap-2")}>
          <StoryCountLoader
            containerStyle={classNames(styles.categContainer)}
          />
          <StoryCountLoader
            containerStyle={classNames(styles.categContainer)}
          />
        </div>
        <div
          className={classNames(
            "d-flex align-items-start justify-content-between gap-2 mt-2 mt-sm-3"
          )}
        >
          <div
            className={classNames(
              "d-flex flex-column align-items-start gap-2 w-100"
            )}
          >
            <SkeletonLoader iconStyle={classNames(styles.descStyle)} />
            <SkeletonLoader iconStyle={classNames(styles.descStyle, "w-75")} />
            <SkeletonLoader iconStyle={classNames(styles.descStyle, "w-50")} />
          </div>
          <SkeletonLoader iconStyle={classNames(styles.iconUpArrow)} />
        </div>

        <div className={classNames(styles.actionContainerBg)} />
        <div
          className={classNames(
            "d-flex align-items-center justify-content-start w-100 gap-1 gap-sm-2",
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
    </div>
  );
};

export default StoryCardLoader;
