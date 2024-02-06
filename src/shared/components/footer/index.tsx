import classNames from "classnames";
import styles from "./style.module.scss";
import { useNavigate } from "react-router";
import { routeConstant } from "shared/routes/routeConstant";
import { navigationItems } from "./constant";

const Footer = () => {
  const navigate = useNavigate();

  const navigateToScreen = (route: string) => {
    navigate(route);
  };
  return (
    <>
      <div className={classNames(styles.footerContainer)} />
      <footer className={classNames(styles.toplevelContainer)}>
        <div className={classNames(styles.customContainer)}>
          <div
            className={classNames(
              "d-flex flex-column-reverse flex-md-row  justify-content-center justify-content-md-between align-items-center gap-2 gap-md-0",
              styles.footerContainer
            )}
          >
            <div className={classNames("d-flex align-items-center")}>
              <label className={classNames(styles.footerLabels)}>
                © 2023 JMK. All rights reserved.
              </label>
            </div>
            <div
              className={classNames(
                "d-lg-flex align-items-center gap-4 gap-md-2 gap-lg-4 d-none"
              )}
            >
              {navigationItems.map((item, inx) => {
                return (
                  <label
                    className={classNames(styles.footerLabels)}
                    onClick={() => {
                      navigateToScreen(item?.route);
                    }}
                    key={inx}
                  >
                    {item?.label}
                  </label>
                );
              })}
            </div>
            <div
              className={classNames(
                "d-flex align-items-center gap-4 gap-md-2 gap-lg-4"
              )}
            >
              <label
                className={classNames(styles.footerLabels)}
                onClick={() => {
                  navigateToScreen(routeConstant.privacy.path);
                }}
              >
                Privacy Policy
              </label>
              <label
                className={classNames(styles.footerLabels)}
                onClick={() => {
                  navigateToScreen(routeConstant.terms.path);
                }}
              >
                Terms & Conditions
              </label>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
