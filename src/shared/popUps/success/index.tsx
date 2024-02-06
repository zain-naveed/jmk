import { Icons } from "assets";
import classNames from "classnames";
import CustomButton from "shared/components/customButton";
import styles from "./style.module.scss";
import { routeConstant } from "shared/routes/routeConstant";
import { useNavigate } from "react-router";

interface SuccessPopupProps {
  handleClose: () => void;
  amount: number;
  id: any;
}

const SuccessPopup = ({
  amount,
  handleClose,
  id,
}: Partial<SuccessPopupProps>) => {
  const navigate = useNavigate();
  return (
    <div className={classNames("d-flex flex-column gap-5")}>
      <div
        className={classNames("d-flex flex-column gap-4 align-items-center")}
      >
        <Icons.SuccessAnimation className={classNames(styles.iconStyle)} />
        <div className={classNames("d-flex flex-column align-items-center")}>
          <label className={classNames(styles.title)}>
            You have successfully bought a coffee to writer!
          </label>
          <label className={classNames(styles.subTitle)}>${amount} Sent</label>
        </div>
      </div>

      <CustomButton
        label="Go to writer profile"
        customBtnContainer={classNames("w-100")}
        onClick={() => {
          handleClose?.();
          navigate(routeConstant.profile.path.replace(":id", id));
        }}
      />
    </div>
  );
};

export default SuccessPopup;
