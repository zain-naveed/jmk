import classNames from "classnames";
import styles from "./style.module.scss";
import { Spinner } from "react-bootstrap";

interface BtnProps extends React.HTMLProps<HTMLButtonElement> {
  customBtnContainer: any;
  style2: boolean;
  Icon: any;
  isBlackIcon: boolean;
  customIconStyle: any;
  loading: boolean;
  spinnerColor: string;
}

const CustomButton = ({
  onClick,
  label,
  customBtnContainer,
  style2,
  Icon,
  disabled,
  isBlackIcon,
  customIconStyle,
  loading,
  spinnerColor,
}: Partial<BtnProps>) => {
  return (
    <button
      className={classNames(
        style2 ? styles.customBtnContainer2 : styles.customBtnContainer,
        customBtnContainer
      )}
      onClick={onClick}
      type="submit"
      disabled={disabled}
    >
      {loading ? (
        <Spinner
          size="sm"
          animation="border"
          style={{ color: spinnerColor ? spinnerColor : "black" }}
        />
      ) : (
        <>
          {Icon && (
            <Icon
              className={classNames(
                isBlackIcon && styles.iconStyle,
                customIconStyle && customIconStyle
              )}
            />
          )}
          {label}
        </>
      )}
    </button>
  );
};

export default CustomButton;
