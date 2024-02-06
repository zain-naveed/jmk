import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import CustomTab from "shared/components/customTabs";
import ArtsList from "./artsList";
import { TabEnums, Tabs } from "./constant";
import StoriesList from "./storiesList";
import styles from "./style.module.scss";
import NavWrapper from "shared/components/navWrapper";
import Footer from "shared/components/footer";
import { useOnScroll } from "shared/hooks/useOnScroll";

const Search = () => {
  const location = useLocation();
  const [endReach, onScroll] = useOnScroll("search-screen");
  const TabsDiv = useRef<HTMLDivElement>(null);
  const [searchText, setSearchText] = useState<string>("");
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

  useEffect(() => {
    let text: any = location?.state?.search;
    setSearchText(text);

    // eslint-disable-next-line
  }, [location?.state?.search, activeTab]);

  return (
    <div
      className={classNames(styles.topMainContainer)}
      id="search-screen"
      onScroll={onScroll}
    >
      <NavWrapper />
      <div className={classNames(styles.searchScreenContainer)}>
        <div
          className={classNames(
            styles.customContainer,
            "w-100 position-relative mb-4"
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
                  Results for{" "}
                  <span className={classNames(styles.labelSearch)}>
                    "{searchText ? searchText : ` `}"
                  </span>
                </label>
              </div>
              <div className={classNames("d-flex px-3 px-sm-0 w-100")}>
                <div
                  className={classNames("d-flex flex-column w-100 mb-3")}
                  ref={TabsDiv}
                >
                  <CustomTab
                    tabs={Tabs}
                    activeTab={activeTab}
                    handleActiveTab={handleActiveTab}
                  />
                  {TabEnums.stories === activeTab ? (
                    <StoriesList searchText={searchText} endReach={endReach} />
                  ) : (
                    TabEnums.arts === activeTab && (
                      <ArtsList searchText={searchText} endReach={endReach} />
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

export default Search;
