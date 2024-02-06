import classNames from "classnames";
import HeaderSection from "shared/components/headerSection";
import styles from "pages/terms/style.module.scss";
import { useEffect, useState } from "react";
import { GetPrivacyPolicy } from "shared/services/landingService";
import SkeletonLoader from "shared/loader/skeletonLoader";
import NavWrapper from "shared/components/navWrapper";
import Footer from "shared/components/footer";
import moment from "moment";

const Privacy = () => {
  const [privacy, setPrivacy] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    window?.scrollTo(0, 0);
    setLoading(true);
    GetPrivacyPolicy()
      .then(({ data: { data } }) => {
        setPrivacy(data?.privacy_policy);
      })
      .catch((err) => {
        console.log("Error", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className={classNames(styles.topMainContainer)}>
      <NavWrapper />
      <HeaderSection
        title="Privacy Policy"
        subtitle="Your privacy is important to us at JMK. We respect your privacy regarding any information we may collect from you across our website."
        highlightedText={`Current as of ${moment(privacy?.updated_at).format(
          "LL"
        )}`}
        displayHighlightedText={true}
        loading={loading}
      />

      <div
        className={classNames(
          styles.customContainer,
          "px-3 px-sm-0 d-flex flex-column align-items-start py-5"
        )}
      >
        {loading ? (
          <>
            <>
              {Array.from(Array(4).keys()).map((item, inx) => {
                return (
                  <SkeletonLoader
                    iconStyle={classNames(
                      styles.paragraph_container_loader,
                      "mb-2 w-100"
                    )}
                    key={inx}
                  />
                );
              })}
              <SkeletonLoader
                iconStyle={classNames(
                  styles.paragraph_container_loader,
                  "mb-2 w-50"
                )}
              />
            </>
            <br />
            <>
              {Array.from(Array(4).keys()).map((item, inx) => {
                return (
                  <SkeletonLoader
                    iconStyle={classNames(
                      styles.paragraph_container_loader,
                      "mb-2 w-100"
                    )}
                    key={inx}
                  />
                );
              })}
              <SkeletonLoader
                iconStyle={classNames(
                  styles.paragraph_container_loader,
                  "mb-2 w-50"
                )}
              />
            </>
          </>
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: privacy?.description }}
            className={classNames(styles.text)}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;
