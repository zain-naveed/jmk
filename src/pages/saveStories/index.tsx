import classNames from "classnames";
import { useRef, useState } from "react";
import CustomTab from "shared/components/customTabs";
import Footer from "shared/components/footer";
import NavWrapper from "shared/components/navWrapper";
import { useOnScroll } from "shared/hooks/useOnScroll";
import ArtsList from "./artsList";
import { TabEnums, Tabs } from "./constant";
import StoriesList from "./storiesList";
import styles from "./style.module.scss";

const SaveStories = () => {
  const [endReach, onScroll] = useOnScroll("save-stories");
  const TabsDiv = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<string>(Tabs[0]);

  const handleActiveTab = (val: string) => {
    if (TabsDiv.current) {
      TabsDiv.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
    setActiveTab(val);
  };

  return (
    <div
      className={classNames(styles.topMainContainer)}
      id="save-stories"
      onScroll={onScroll}
    >
      <NavWrapper />
      <div className={classNames(styles.saveStoriesContainer)}>
        <div
          className={classNames(
            styles.customContainer,
            "w-100 position-relative mb-5"
          )}
        >
          <div className={classNames(" d-flex  w-100")}>
            <div
              className={classNames(
                " d-flex flex-column align-items-start justify-content-center w-100"
              )}
            >
              <div
                className={classNames(
                  "d-flex  flex-column align-items-start justify-content-start py-5 px-3 px-sm-0"
                )}
              >
                <label className={classNames(styles.label)}>
                  Saved Stories
                </label>
                <label className={classNames(styles.subTitle)}>
                  Stories saved from different contributors
                </label>
              </div>

              <div className={classNames("d-flex  px-3 px-sm-0 w-100")}>
                <div
                  className={classNames("d-flex flex-column w-100")}
                  ref={TabsDiv}
                >
                  <CustomTab
                    tabs={Tabs}
                    activeTab={activeTab}
                    handleActiveTab={handleActiveTab}
                  />
                  {TabEnums.stories === activeTab ? (
                    <StoriesList endReach={endReach} />
                  ) : (
                    TabEnums.arts === activeTab && (
                      <ArtsList endReach={endReach} />
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default SaveStories;
