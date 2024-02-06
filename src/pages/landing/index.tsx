import { Images } from "assets";
import classNames from "classnames";
import AboutUsNewsLetter from "shared/components/aboutusNewsletter";
import Footer from "shared/components/footer";
import NavWrapper from "shared/components/navWrapper";
import LandingCard from "./card";
import { infoCards } from "./constant";
import styles from "./style.module.scss";

const LandingPage = () => {
  return (
    <div className={classNames(styles.topMainContainer)}>
      <NavWrapper isLandingPage />
      <div className={classNames(styles.toplevelContainerMain)}>
        <div className={classNames(styles.siderContainer)}>
          <div
            className={classNames(
              "d-flex flex-column flex-lg-row  justify-content-start align-items-center gap-2 gap-lg-2 gap-xl-5 py-5 py-lg-0",
              styles.h100
            )}
          >
            <img
              src={Images.LandingAsset}
              className={classNames(styles.gifImage)}
              alt="gif"
            />
            <div
              className={classNames(
                " d-flex flex-column justify-content-center align-items-center",
                styles.h100,
                styles.textContainer
              )}
            >
              <div className={classNames(styles.mainLabel)}>JOHNNIE</div>
              <div className={classNames(styles.subLabel)}>MAE KING</div>
              <div className={classNames(styles.subContainer)}>
                <div className={classNames(styles.subHeadingLabel)}>
                  A Story of Drama, Mystery, or Adventure...
                </div>
                <div className={classNames(styles.subHeadingLabel)}>
                  Waiting for You to Tell!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={classNames(
          styles.customContainer,
          "px-3 px-sm-0 mt-5",
          styles.marginContainer
        )}
      >
        <div
          className={classNames(
            "d-flex row align-items-start justify-content-center justify-content-md-between pb-5 mt-5 gap-5  gap-md-0 mx-0"
          )}
        >
          {infoCards?.map((item, index) => {
            return (
              <LandingCard
                {...item}
                key={index}
                container2={index > 1}
                isURL={item?.url ? item.url : null}
              />
            );
          })}
        </div>
      </div>
      <AboutUsNewsLetter landing />
      <Footer />
    </div>
  );
};

export default LandingPage;
