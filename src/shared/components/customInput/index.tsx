import classNames from "classnames";
import styles from "./style.module.scss";
import { Icons } from "assets";
import { useState } from "react";

interface InputProps extends React.HTMLProps<HTMLInputElement> {
  error: string;
  customContainer: any;
  margin: string;
  Icon: any;
  customIconStyle: any;
  isPassword: boolean;
}

const CustomInput = ({
  error,
  value,
  placeholder,
  type,
  onChange,
  margin,
  customContainer,
  Icon,
  customIconStyle,
  isPassword,
  disabled,
}: Partial<InputProps>) => {
  const [inputType, setInputType] = useState<string>(type ? type : "");
  return (
    <div
      className={classNames(
        "position-relative  w-100",
        margin ? margin : error ? "mb-2" : "mb-4"
      )}
    >
      <div
        className={classNames(
          styles.inputContainer,
          customContainer && customContainer
        )}
      >
        {Icon && (
          <Icon className={classNames(customIconStyle && customIconStyle)} />
        )}
        <input
          type={inputType}
          placeholder={placeholder}
          className={classNames(styles.inputStyle)}
          value={value}
          onChange={onChange}
          disabled={disabled}
          autoComplete=""
        />
        {isPassword &&
          (inputType === "password" ? (
            <Icons.EyeDisable
              role="button"
              onClick={() => setInputType("text")}
              className={classNames(styles.iconStyle)}
            />
          ) : (
            <Icons.Eye
              role="button"
              onClick={() => setInputType("password")}
              className={classNames(styles.iconStyle)}
            />
          ))}
      </div>
      {!!error && <div className={classNames(styles.error)}>{error}</div>}
    </div>
  );
};

export default CustomInput;
