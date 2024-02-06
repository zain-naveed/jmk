import { Icons, Images } from "assets";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import Footer from "shared/components/footer";
import HeaderSection from "shared/components/headerSection";
import NavWrapper from "shared/components/navWrapper";
import NoContentCard from "shared/components/noContentCard";
import WritersCard from "shared/components/writersCard";
import OptionsDropDown from "shared/dropsDowns/optionsDropDown";
import useDebounce from "shared/hooks/useDebounce";
import { useOnScroll } from "shared/hooks/useOnScroll";
import { GetWriters } from "shared/services/userService";
import { Filters } from "./constants";
import styles from "./style.module.scss";
import WritersCardLoader from "shared/loader/writersCardLoader";

const Writers = () => {
  const [endReach, onScroll] = useOnScroll("jmk-writers");
  const pageRef = useRef<number>(1);
  const writersRef = useRef<[]>([]);
  const [loadMore, setLoadMore] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(false);
  const [openSelection, setOpenSelection] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [writers, setWriters] = useState<[]>([]);
  const [filter, setFilter] = useState<{ name: string; value: string }>(
    Filters[0]
  );

  const options = [
    {
      title: Filters[0].name,
      Icon: null,
      action: () => {
        setFilter(Filters[0]);
      },
    },
    {
      title: Filters[1].name,
      Icon: null,
      action: () => {
        setFilter(Filters[1]);
      },
    },
    {
      title: Filters[2].name,
      Icon: null,
      action: () => {
        setFilter(Filters[2]);
      },
    },
  ];

  const handleGetArtists = () => {
    GetWriters({
      page: pageRef.current,
      pagination: 12,
      search: searchValue,
      filter: filter.value,
    })
      .then(
        ({
          data: {
            data: { data, current_page, last_page },
            status,
            message,
          },
        }) => {
          if (status) {
            if (current_page === last_page) {
              setLoadMore(false);
            } else {
              setLoadMore(true);
            }
            let cloneArtists: any = [...writersRef.current];
            cloneArtists = [...cloneArtists, ...data];
            setWriters(cloneArtists);
            writersRef.current = cloneArtists;
          } else {
            console.log("Error", message);
          }
        }
      )
      .catch((err) => {
        console.log("Error", err);
      })
      .finally(() => {
        setInitialLoading(false);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (endReach && loadMore && !initialLoading && !loading) {
      setLoading(true);
      pageRef.current = pageRef.current + 1;
      handleGetArtists();
    }
    // eslint-disable-next-line
  }, [endReach]);

  useEffect(() => {
    pageRef.current = 1;
    writersRef.current = [];
    setWriters([]);
    setInitialLoading(true);
    handleGetArtists();
    // eslint-disable-next-line
  }, [filter.name, searchValue]);

  useDebounce(
    () => {
      setSearchValue(search);
    },
    [search],
    800
  );

  return (
    <div
      className={classNames(styles.topMainContainer)}
      id="jmk-writers"
      onScroll={onScroll}
    >
      <NavWrapper />
      <div className={classNames(styles.writersContainer)}>
        <HeaderSection
          title="Contributing Writers"
          subtitle="Welcome to our diverse and vibrant community of artists! Here, you will discover a rich tapestry of artistic voices and expressions, each one unique and captivating in its own way."
          displaySearch
          search={search}
          setSearch={setSearch}
          isContentStyle2
        />
        <div className={classNames(styles.customContainer, "px-3 px-sm-0")}>
          <div
            className={classNames(
              "w-100 d-flex align-items-center justify-content-end mt-5"
            )}
          >
            <div
              className={classNames(
                styles.filterContainer,
                "d-flex justify-content-center align-items-center px-3 gap-2 position-relative"
              )}
              role="button"
              onClick={() => {
                setOpenSelection(!openSelection);
              }}
            >
              <Icons.Filter className={classNames(styles.filterIcon)} />
              <label className={classNames(styles.filterLabel)} role="button">
                {filter.name}
              </label>
              <OptionsDropDown
                openSelection={openSelection}
                setOpenSelection={setOpenSelection}
                options={options}
                customContainer={classNames(styles.optionsContainer)}
              />
            </div>
          </div>
          <div className={classNames("row d-flex mb-4 px-3 px-sm-0 w-100")}>
            {initialLoading ? (
              <>
                {Array.from(Array(6).keys())?.map((itm, inx) => {
                  return <WritersCardLoader key={inx} />;
                })}
              </>
            ) : (
              <>
                {writers?.length > 0 ? (
                  writers?.map((item: any, inx: number) => {
                    return (
                      <WritersCard
                        name={item?.name}
                        counter={item?.contributing_posts_count}
                        key={inx}
                        id={item?.id}
                        avatar={
                          item?.profile_pic ? item?.full_profile_path : null
                        }
                      />
                    );
                  })
                ) : (
                  <div
                    className={classNames(
                      "d-flex align-items-center justify-content-center my-5"
                    )}
                  >
                    <NoContentCard
                      Icon={Images.NoData}
                      label1="No Writers found"
                    />
                  </div>
                )}

                {loading ? (
                  <>
                    <WritersCardLoader />
                    <WritersCardLoader />
                  </>
                ) : null}
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Writers;
