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

interface Category {
  categoryName: string;
  categoryId: string;
}

interface FAQs {
  title: string;
  description: string;
  id: number;
  faqId: number;
}

const FAQ = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [questionLoading, setQuestionLoading] = useState<boolean>(false);
  const [FAQCategories, setFAQCategories] = useState<Category[]>([]);
  const [FAQs, setFAQs] = useState<FAQs[]>([]);
  const [activeOption, setActiveOption] = useState<string>("");
  const [activeQuestion, setActiveQuestion] = useState<number>(-1);
  const handleActiveQuestion = (inx: number) => {
    if (activeQuestion === inx) {
      setActiveQuestion(-1);
    } else {
      setActiveQuestion(inx);
    }
  };

  const getfaqCategories = () => {
    setLoading(true);
    getFAQCategories()
      .then(({ data: { data } }) => {
        const faqCategories = data?.faqsCategories?.map((category: any) => ({
          categoryName: category.name,
          categoryId: category.id,
        }));
        setFAQCategories(faqCategories || []);
        setActiveOption(faqCategories[0].categoryId);
      })
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getfaqCategories();
    // getAllFAQ();
  }, []);

  useEffect(() => {
    setQuestionLoading(true);
    if (activeOption !== "") {
      getFAQsById(activeOption)
        .then(({ data: { data } }) => {
          // console.log("data", data);
          setFAQs(data?.faqs);
          setQuestionLoading(false);
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  }, [activeOption]);

  return (
    <div className={classNames(styles.topMainContainer)}>
      <NavWrapper />
      <HeaderSection
        title="FAQs"
        subtitle="We have put together some most commonly asked questions to provide more information about us."
        highlightedText={`Current as of ${moment().format("LL")}`}
        displayHighlightedText={true}
        loading={loading}
      />
      <div
        className={classNames(
          styles.customContainer,
          "d-flex row px-3 px-sm-0 py-5 gap-4 gap-sm-0"
        )}
      >
        <div
          className={classNames(
            "col-12 col-sm-4 d-flex align-items-start justify-content-end"
          )}
        >
          {loading ? (
            <SkeletonLoader
              iconStyle={classNames(styles.optionsContainerLoader)}
            />
          ) : (
            <div
              className={classNames(
                "d-flex flex-column",
                styles.optionsContainer
              )}
            >
              {FAQCategories.map((item, inx) => {
                return (
                  <div
                    className={classNames(
                      "d-flex align-items-center justify-content-between py-3 px-3",
                      styles.optionContainer,
                      activeOption === item.categoryId && styles.bgColor,
                      inx === 0 && styles.brdTop,
                      inx === faqs.length - 1 && styles.brdbtm
                    )}
                    key={inx}
                    onClick={() => {
                      setActiveOption(item?.categoryId);
                    }}
                  >
                    <label
                      className={classNames(styles.optionTitle)}
                      role="button"
                    >
                      {item?.categoryName}
                    </label>
                    <Icons.Right className={classNames(styles.arrowIcon)} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className={classNames("col-12 col-sm-8")}>
          {questionLoading ? (
            Array.from(Array(4).keys()).map((item, inx) => {
              return (
                <div
                  className={classNames(
                    "d-flex flex-column align-items-start ps-3 gap-2",
                    styles.questionContainer,
                    activeQuestion === inx && styles.brdLeft,
                    inx === 0 && styles.brdTop2
                  )}
                  onClick={() => handleActiveQuestion(inx)}
                  key={inx}
                >
                  <div
                    className={classNames(
                      "d-flex align-items-center justify-content-between pt-3 w-100",
                      activeQuestion !== inx && "pb-3"
                    )}
                  >
                    <SkeletonLoader
                      iconStyle={classNames(styles.faqLabelLoader)}
                    />
                    <SkeletonLoader
                      iconStyle={classNames(styles.iconContainer)}
                    />
                  </div>
                </div>
              );
            })
          ) : FAQs.length ? (
            FAQs?.map((item, inx) => {
              return (
                <div
                  className={classNames(
                    "d-flex flex-column align-items-start ps-3 gap-2",
                    styles.questionContainer,
                    activeQuestion === inx && styles.brdLeft,
                    inx === 0 && styles.brdTop2
                  )}
                  onClick={() => handleActiveQuestion(inx)}
                  key={inx}
                >
                  <div
                    className={classNames(
                      "d-flex align-items-center justify-content-between pt-3 w-100",
                      activeQuestion !== inx && "pb-3"
                    )}
                  >
                    <label
                      className={classNames(styles.faqLabel)}
                      role="button"
                    >
                      {item?.title}
                    </label>
                    <div className={classNames(styles.iconContainer)}>
                      {activeQuestion === inx ? (
                        <Icons.ChevUp />
                      ) : (
                        <Icons.ChevDown />
                      )}
                    </div>
                  </div>
                  {activeQuestion === inx ? (
                    <label className={classNames(styles.faqAnswer, "pb-3")}>
                      {item?.description}
                    </label>
                  ) : null}
                </div>
              );
            })
          ) : (
            <NoContentCard
              Icon={Images.NoData}
              label2={"No results found"}
              customIconContianer={styles.noContentIcon}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;
