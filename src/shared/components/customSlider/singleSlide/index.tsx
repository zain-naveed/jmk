import classNames from "classnames";
import styles from "./style.module.scss";

interface SingleSlideInterface {
  item: any;
  index: number;
}

const SingleSlide = ({ item, index }: SingleSlideInterface) => {
  return (
    <div
      className={classNames(
        "d-flex justify-content-start justify-content-md-end w-100"
      )}
    >
      <img
        src={item?.image}
        className={classNames(styles.sliderImg, "py-3 py-md-0")}
        alt="slider-img"
      />
    </div>
  );
};

export default SingleSlide;
