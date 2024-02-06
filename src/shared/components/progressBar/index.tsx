import { ProgressBar } from "react-bootstrap";
import styles from "./style.module.scss";
import "./progress.scss";

interface CustomProgressProps {
  percentage: any;
}

const CustomProgressB = ({ percentage }: Partial<CustomProgressProps>) => {
  return (
    <div className={styles.progressContainer}>
      <ProgressBar
        now={percentage}
        variant="success"
        className={styles.progressBar}
      />
      <span className={styles.progressText}>{`${percentage}%`}</span>
    </div>
  );
};

export default CustomProgressB;
