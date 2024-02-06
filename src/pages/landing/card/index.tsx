import { Icons } from "assets";
import classNames from "classnames";
import { useNavigate } from "react-router";
import styles from "./style.module.scss";

interface LandingCardProps {
  title: string;
  Icon: any;
  desc: string;
  path?: string;
  container2?: boolean;
  isURL?: any;
}

const LandingCard = ({
  title,
  Icon,
  desc,
  path,
  container2,
  isURL,
}: LandingCardProps) => {
  const navigate = useNavigate();
  const navigateToShopify = () => {
    window.open("https://store.johnniemaeking.com/", "_blank");
  };
  return (
    <div
      className={classNames(
        "col-11 col-md-6 d-flex flex-column align-items-start p-3"
      )}
    >
      <div
        className={classNames(styles.colummnContainer)}
        onClick={() => {
          if (isURL) {
            window.open(isURL, "_blank");
          } else {
            if (path) {
              navigate(path);
            } else {
              navigateToShopify();
            }
          }
        }}
      >
        <div className={classNames("w-100")}>
          <img src={Icon} alt="banner" className={styles.landingGrid} />
        </div>
        <div
          className={classNames(
            "d-flex ps-3 ps-lg-4 ps-xxl-5 pe-2 pe-lg-3 pe-xxl-4 pt-4 pb-5 position-relative w-100 gap-2",
            container2 ? styles.infoContainer2 : styles.infoContainer
          )}
        >
          <div
            className={classNames(
              "d-flex flex-column justify-space-between  align-items-start w-100"
            )}
          >
            <label className={styles.gridHeading} role="button">
              {title}
            </label>
            <span className={classNames(styles.gridSubHeading, "mt-2")}>
              {desc}
            </span>
          </div>
          <div className={classNames(styles.iconContainer)}>
            <Icons.ArrowDiagonal className={styles.arrowIcon} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingCard;
