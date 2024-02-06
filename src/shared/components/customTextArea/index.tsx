import classNames from "classnames";
import styles from "./style.module.scss";
import React from "react";
interface InputProps extends React.HTMLProps<HTMLTextAreaElement> {
  error: string;
  labelStyle: any;
  row: number;
  padding: any;
}

const CustomTextArea = ({
  error,
  value,
  placeholder,
  onChange,
  row,
  onKeyDown,
  disabled,
}: Partial<InputProps>) => {
  return (
    <div
      className={classNames(
        "d-flex flex-column position-relative w-100",
        "mb-2"
      )}
    >
      <div className={classNames(styles.inputContainer)}>
        <textarea
          rows={row}
          placeholder={placeholder}
          onKeyDown={onKeyDown}
          className={classNames(styles.inputStyle)}
          value={value}
          disabled={disabled}
          onChange={onChange}
        />
      </div>
      {!!error ? (
        <div className={classNames(styles.error)}>{error}</div>
      ) : (
        <label className={classNames(styles.maxLabel)}>
          255 max characters.
        </label>
      )}
    </div>
  );
};

export default CustomTextArea;
