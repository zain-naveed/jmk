import { Icons } from "assets";
import classNames from "classnames";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import CustomButton from "shared/components/customButton";
import { routeConstant } from "shared/routes/routeConstant";
import styles from "./style.module.scss";

interface ApprovalPopupProps {
  handleClose: () => void;
  termsModalText: string;
}

const ApprovalPopup = ({
  handleClose,
  termsModalText,
}: Partial<ApprovalPopupProps>) => {
  const navigate = useNavigate();
  const { postStory } = useSelector((state: any) => state.root);
  return (
    <div className={classNames("d-flex flex-column gap-5")}>
      <div className={classNames("d-flex flex-column gap-3")}>
        <Icons.Clock className={classNames(styles.iconStyle)} />
        <label className={classNames(styles.title)}>
          Your {termsModalText ? termsModalText : "Story"} has been sent for
          Approval !
        </label>
        <label className={classNames(styles.subTitle)}>
          This {termsModalText ? termsModalText : "story"} post has been
          submitted for approval. Admin will be able to{" "}
          {termsModalText ? "deny this art" : "edit this post"} and republish
          changes.
        </label>
      </div>

      <CustomButton
        label={termsModalText ? "Close" : "View Story"}
        customBtnContainer={classNames("w-100")}
        onClick={
          !termsModalText
            ? () => {
                handleClose?.();
                setTimeout(() => {
                  navigate(
                    routeConstant.story.path.replace(":id", postStory?.storyId)
                  );
                }, 500);
              }
            : () => {
                handleClose?.();
              }
        }
      />
    </div>
  );
};

export default ApprovalPopup;
