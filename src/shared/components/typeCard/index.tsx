import classNames from "classnames";
import moment from "moment";
import styles from "./style.module.scss";
import useWindowDimensions from "shared/hooks/useWindowDimentions";
import { useEffect, useState } from "react";

interface TypeCardProps {
  type: string;
  time: string;
  isview: boolean;
  fontSize: number;
  containerStyle: any;
  item: any;
}

const TypeCard = ({
  type,
  time,
  isview,
  fontSize,
  containerStyle,
  item,
}: Partial<TypeCardProps>) => {
  const { width } = useWindowDimensions();
  const [isMobileView, setIsMobileView] = useState<boolean>(false);

  useEffect(() => {
    if (width > 576) {
      setIsMobileView(false);
    } else {
      setIsMobileView(true);
    }
    // eslint-disable-next-line
  }, [width]);


  return (
    <div
      className={classNames(
        "d-flex align-items-center justify-content-between py-1",
        styles.container,
        containerStyle && containerStyle
      )}
    >
      <div className={classNames(styles.typeContainer, "ms-1 me-2 px-2")}>
        <label
          className={classNames(styles.typeLabel, isview && "py-0")}
          style={{ fontSize: fontSize }}
        >
          {item && isMobileView && type === "Art"
            ? `Artwork by  ${
                item?.user?.name?.split(" ").length > 1
                  ? item?.user?.name?.split(" ")[1]
                  : item?.user?.name?.split(" ")[0]
              }`
            : item && type === "Art"
            ? `Artwork by  ${item?.user?.name}`
            : type}
        </label>
      </div>

      <label
        className={classNames(styles.timeLabel)}
        style={{ fontSize: fontSize }}
      >
        {isMobileView && type === "Art" && !isview
          ? moment(time).format("DD-MM-YY")
          : isview
          ? time
          : moment(time).format("MMM D YYYY")}
      </label>
    </div>
  );
};

export default TypeCard;
