import HeaderSection from "shared/components/headerSection";
import styles from "./style.module.scss";
import classNames from "classnames";
import { GetTerms } from "shared/services/landingService";
import { useEffect, useState } from "react";
import SkeletonLoader from "shared/loader/skeletonLoader";
import NavWrapper from "shared/components/navWrapper";
import Footer from "shared/components/footer";
import moment from "moment";

const Terms = () => {
  const [terms, setTerms] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    window?.scrollTo(0, 0);
    setLoading(true);
    GetTerms()
      .then(({ data: { data } }) => {
        setTerms(data?.terms_and_conditions);
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
        title="Terms & Conditions"
        subtitle="Your privacy is important to us at JMK. We respect your privacy regarding any information we may collect from you across our website."
        highlightedText={`Current as of ${moment(terms?.updated_at).format(
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
            dangerouslySetInnerHTML={{ __html: terms?.description }}
            className={classNames(styles.text)}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Terms;
