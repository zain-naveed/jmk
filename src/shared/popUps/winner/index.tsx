import { Icons } from "assets";
import classNames from "classnames";
import CustomButton from "shared/components/customButton";
import styles from "./style.module.scss";
import { routeConstant } from "shared/routes/routeConstant";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import moment from "moment";

interface WinnerPopupProps {
  handleClose: () => void;
}

const WinnerPopup = ({ handleClose }: Partial<WinnerPopupProps>) => {
  const navigate = useNavigate();
  const { postStory } = useSelector((state: any) => state.root);
  return (
    <div className={classNames("d-flex flex-column gap-5")}>
      <div
        className={classNames("d-flex flex-column gap-4 align-items-center")}
      >
        <Icons.AnnoucementAnimation className={classNames(styles.iconStyle)} />
        <div className={classNames("d-flex flex-column align-items-center")}>
          <label className={classNames(styles.title)}>
            The Winner will be announced on
          </label>
          <label className={classNames(styles.subTitle)}>
            {moment(postStory?.contestEndDate)
              .format("L")
              .replace("/", "-")
              .replace("/", "-")}
          </label>
        </div>
      </div>

      <CustomButton
        label="Go to your Story"
        customBtnContainer={classNames("w-100")}
        onClick={() => {
          handleClose?.();
          navigate(routeConstant.story.path.replace(":id", postStory?.storyId));
        }}
      />
    </div>
  );
};

export default WinnerPopup;
