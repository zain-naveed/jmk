import { Icons } from "assets";
import styles from "./style.module.scss";
import classNames from "classnames";

interface CustomCheckBoxProps {
  checked: boolean;
  setCheck: (val: boolean) => void;
}

const CustomCheckBox = ({ checked, setCheck }: CustomCheckBoxProps) => {
  return (
    <div
      className={classNames(
        "d-flex align-items-center justify-content-between"
      )}
      onClick={() => {
        setCheck(!checked);
      }}
      role="button"
    >
      <div
        className={classNames(
          checked ? styles.active : styles.inActive,
          "d-flex align-items-center justify-content-center"
        )}
      >
        {checked ? <Icons.Check /> : null}
      </div>
      <label className={classNames(styles.text, "ms-2")}>
        Remember for 30 days
      </label>
    </div>
  );
};

export default CustomCheckBox;
