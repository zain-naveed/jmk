import classNames from "classnames";
import styles from "./style.module.scss";
import { Icons } from "assets";

interface NoContentCardProps {
  label1: string;
  label2: string;
  Icon: any;
  customIconContianer: any;
  customLabel1Style: any;
  customLabel2Style: any;
  customContainer: any;
}

const NoContentCard = ({
  label1,
  label2,
  Icon,
  customIconContianer,
  customLabel1Style,
  customLabel2Style,
  customContainer,
}: Partial<NoContentCardProps>) => {
  return (
    <div
      className={classNames(
        customContainer
          ? customContainer
          : "d-flex flex-column align-items-center gap-3"
      )}
    >
      {Icon ? (
        <Icon
          className={classNames(
            styles.noContentImg,
            customIconContianer && customIconContianer
          )}
        />
      ) : (
        <img
          src={Icons.NoContent}
          className={classNames(
            styles.noContentImg,
            customIconContianer && customIconContianer
          )}
          alt="no-content"
        />
      )}

      <div
        className={classNames(
          styles.labalContainer,
          "gap-1 d-flex flex-column align-items-center"
        )}
      >
        <label
          className={classNames(
            styles.label1,
            customLabel1Style && customLabel1Style
          )}
        >
          {label1}
        </label>
        <label
          className={classNames(
            styles.label2,
            customLabel2Style && customLabel2Style
          )}
        >
          {label2}
        </label>
      </div>
    </div>
  );
};

export default NoContentCard;
