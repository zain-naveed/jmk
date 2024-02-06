import { Icons } from "assets";
import classNames from "classnames";
import CustomButton from "shared/components/customButton";
import styles from "./style.module.scss";
import { routeConstant } from "shared/routes/routeConstant";
import { useState } from "react";

interface TermsPopupProps {
  handleClose: () => void;
  handleAction: () => void;
  loading: boolean;
  termsModalText: string;
  handleCancelArt: () => void;
}

const TermsPopup = ({
  handleClose,
  handleAction,
  loading,
  termsModalText,
  handleCancelArt,
}: Partial<TermsPopupProps>) => {
  const [conditions, setConditions] = useState<any>({
    terms: false,
    home: false,
  });

  const handleChange = (value: any, key: any) => {
    setConditions({
      ...conditions,
      [key]: !conditions[`${key}`],
    });
  };

  return (
    <div className={classNames("d-flex flex-column gap-5")}>
      <div className={classNames("d-flex flex-column gap-2")}>
        <Icons.Bolt className={classNames(styles.iconStyle)} />
        <label className={classNames(styles.title)}>
          I have read and understood the platform policies !
        </label>
        <div className={classNames("form-check mt-1")}>
          <input
            className={classNames("form-check-input")}
            type="checkbox"
            name="terms"
            value={conditions.terms}
            id="flexCheckDefault"
            onChange={(e) => handleChange(e.target.value, e.target.name)}
          />
          <label className={classNames("form-check-label")}>
            <span
              onClick={() => window.open(routeConstant.terms.path, "_blank")}
              className={styles.link}
            >
              Terms & Conditions
            </span>{" "}
            and
            <span
              onClick={() => window.open(routeConstant.privacy.path, "_blank")}
              className={styles.link}
            >
              {" "}
              Privacy Policy
            </span>
          </label>
        </div>
        <div className={classNames("form-check")}>
          <input
            className={classNames("form-check-input")}
            type="checkbox"
            name="home"
            value={conditions.home}
            id="flexCheckDefault"
            onChange={(e) => handleChange(e.target.value, e.target.name)}
          />
          <label
            className={classNames("form-check-label", styles.link)}
            onClick={() => window.open(routeConstant.guideRules.path, "_blank")}
          >
            Platform Rules
          </label>
        </div>
      </div>

      <div
        className={classNames(
          "d-flex justify-content-between align-items-center w-100 gap-3"
        )}
      >
        <CustomButton
          label="Cancel"
          customBtnContainer={classNames(styles.cancelBtn, "w-50")}
          onClick={handleCancelArt ? handleCancelArt : handleClose}
        />
        <CustomButton
          label={`Submit ${termsModalText ? termsModalText : "Story"}`}
          customBtnContainer={classNames(
            "w-50",
            (!conditions.terms || !conditions.home) && styles.btnDisabled
          )}
          onClick={handleAction}
          loading={loading}
          disabled={loading || !conditions.terms || !conditions.home}
        />
      </div>
    </div>
  );
};

export default TermsPopup;
