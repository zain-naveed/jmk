import { Icons, Images } from "assets";
import classNames from "classnames";
import { useEffect, useState } from "react";
import Footer from "shared/components/footer";
import HeaderSection from "shared/components/headerSection";
import NavWrapper from "shared/components/navWrapper";
import NoContentCard from "shared/components/noContentCard";
import SkeletonLoader from "shared/loader/skeletonLoader";
import { getFAQCategories, getFAQsById } from "shared/services/faqService";
import { faqs } from "./constants";
import styles from "./style.module.scss";
import moment from "moment";
import { GetWritingTips } from "shared/services/generalService";
import TipLaoder from "shared/loader/tipLoader";
import { useLocation } from "react-router";

const FAQ = () => {
  const location = useLocation();
  const [tips, setTips] = useState<any>([]);

  useEffect(() => {
    if (location?.state?.tip) {
      setTips([location?.state?.tip]);
    }
  }, [location]);

  return (
    <div className={classNames(styles.topMainContainer)}>
      <NavWrapper />
      <HeaderSection
        title="Writing Tips & Ideas"
        subtitle="We've provided writing tips for writers to embrace."
        // highlightedText={`Current as of ${moment().format("LL")}`}
        displayHighlightedText={true}
      />
      <div
        className={classNames(
          styles.customContainer,
          "d-flex row px-3 px-sm-0 py-5 gap-4 gap-sm-0"
        )}
      >
        <>
          {tips?.length > 0 ? (
            tips?.map((item: any, inx: any) => {
              return (
                <div
                  className={classNames(
                    "d-flex w-100 align-self-start align-items-start gap-3 mb-4"
                  )}
                  key={inx}
                >
                  <Icons.LightOn className={classNames(styles.iconStyle)} />
                  <label className={classNames(styles.subTitle)}>
                    {item?.description}
                  </label>
                </div>
              );
            })
          ) : (
            <NoContentCard
              Icon={Images.NoData}
              label1="No Tips found"
              customIconContianer={classNames(styles.notContent)}
              customLabel1Style={classNames(styles.noContentLabel)}
              customContainer={classNames(
                "gap-1 d-flex align-items-center justify-content-center flex-column"
              )}
            />
          )}
        </>
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;
