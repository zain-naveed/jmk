import classNames from "classnames";
import SkeletonLoader from "../skeletonLoader";
import styles from "./style.module.scss";

interface BtnLoaderProps {
  customBtnContainer: any;
}

const CustomButtonLoader = ({
  customBtnContainer,
}: Partial<BtnLoaderProps>) => {
  return (
    <SkeletonLoader
      iconStyle={classNames(styles.customBtnContainer, customBtnContainer)}
    />
  );
};

export default CustomButtonLoader;
