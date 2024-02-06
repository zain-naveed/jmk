import { Icons } from "assets";
import classNames from "classnames";
import CustomButton from "../customButton";
import styles from "./style.module.scss";

interface NotFoundProps {
  title: string;
  subtitle: string;
  buttonTitle: string;
  action: () => void;
}

const NotFound = ({
  title,
  subtitle,
  buttonTitle,
  action,
}: Partial<NotFoundProps>) => {
  return (
    <div
      className={classNames(
        "d-flex align-items-center justify-content-center flex-column gap-1",
        styles.notFoundCountainer
      )}
    >
      <Icons.NotFoundFile className={classNames(styles.iconStyle)} />
      <label className={classNames(styles.notFoundtitle)}>{title}</label>
      <label className={classNames(styles.notFoundSubTitle)}>{subtitle}</label>
      <CustomButton
        label={buttonTitle}
        Icon={Icons.Plus}
        onClick={action}
        customBtnContainer={classNames("mt-3 gap-2 px-3", styles.btnContainer)}
        customIconStyle={classNames(styles.plusIcon)}
        isBlackIcon
      />
    </div>
  );
};

export default NotFound;
