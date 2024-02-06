import classNames from "classnames";
import styles from "./style.module.scss";

interface StoryCountProps {
  count: number;
  containerStyle: any;
  fontSize: number;
  dotSize: number;
}

const StoryCount = ({
  fontSize,
  count,
  containerStyle,
  dotSize,
}: Partial<StoryCountProps>) => {
  return (
    <div
      className={classNames(
        styles.counterContainer,
        containerStyle && containerStyle,
        "pe-3"
      )}
    >
      <div
        className={classNames(styles.dot)}
        style={{ height: dotSize, width: dotSize }}
      />
      <label
        className={classNames(styles.counterLabel, "ms-1")}
        style={{ fontSize: fontSize }}
      >
        {count ? count : "0"} Stor{count && count > 1 ? "ies" : "y"}
      </label>
    </div>
  );
};

export default StoryCount;
