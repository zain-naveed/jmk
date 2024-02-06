import classNames from "classnames";
import styles from "./style.module.scss";
interface SwitchInterface {
  toggle: boolean;
  handleChange: any;
}

function Swtich(props: SwitchInterface) {
  const { toggle, handleChange } = props;

  return (
    <label className={classNames(styles.switch)}>
      <input type="checkbox" checked={toggle} onChange={handleChange} />
      <span
        className={classNames(styles.slider, styles.round, "slider round")}
      ></span>
    </label>
  );
}

export default Swtich;
