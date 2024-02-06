import { Icons, Images } from "assets";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import ArtistCard from "shared/components/artistCard";
import Footer from "shared/components/footer";
import HeaderSection from "shared/components/headerSection";
import NavWrapper from "shared/components/navWrapper";
import { useOnScroll } from "shared/hooks/useOnScroll";
import styles from "./style.module.scss";
import { Filters } from "./constant";
import OptionsDropDown from "shared/dropsDowns/optionsDropDown";
import ArtistCardLoader from "shared/loader/artistCardLoader";
import { GetArtists } from "shared/services/userService";
import useDebounce from "shared/hooks/useDebounce";
import NoContentCard from "shared/components/noContentCard";
import { GetAllFeatureArtists } from "shared/services/generalService";
import SkeletonLoader from "shared/loader/skeletonLoader";

const Artists = () => {
  const [endReach, onScroll] = useOnScroll("jmk-artists");
  const pageRef = useRef<number>(1);
  const artistsRef = useRef<[]>([]);
  const [loadMore, setLoadMore] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(false);
  const [featureArtistLoading, setFeatureArtistLoading] =
    useState<boolean>(false);
  const [openSelection, setOpenSelection] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [artists, setArtists] = useState<[]>([]);
  const [featureArtists, setFeatureArtists] = useState<any[]>([]);
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
    GetArtists({
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
            let cloneArtists: any = [...artistsRef.current];
            cloneArtists = [...cloneArtists, ...data];
            setArtists(cloneArtists);
            artistsRef.current = cloneArtists;
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

  const getFeatureArtists = () => {
    GetAllFeatureArtists()
      .then(({ data: { data, status, message } }) => {
        if (status) {
          setFeatureArtists(data);
        } else {
          console.log("Error", message);
        }
      })
      .catch((err) => {
        console.log("Error", err);
      })
      .finally(() => {
        setFeatureArtistLoading(false);
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
    artistsRef.current = [];
    setArtists([]);
    setInitialLoading(true);
    handleGetArtists();
    // eslint-disable-next-line
  }, [filter.name, searchValue]);

  useEffect(() => {
    setFeatureArtistLoading(true);
    getFeatureArtists();
  }, []);

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
      id="jmk-artists"
      onScroll={onScroll}
    >
      <NavWrapper />
      <div className={classNames(styles.artistsContainer)}>
        <HeaderSection
          title="JMK Artists"
          subtitle="Welcome to our diverse and vibrant community of artists! Here, you will discover a rich tapestry of artistic voices and expressions, each one unique and captivating in its own way."
          displaySearch
          search={search}
          setSearch={setSearch}
          isContentStyle2
        />
        <div className={classNames(styles.customContainer, "px-3 px-sm-0")}>
          {featureArtistLoading ? (
            <>
              <div
                className={classNames(
                  "d-flex align-items-center justify-content-center mt-5"
                )}
              >
                <SkeletonLoader iconStyle={classNames(styles.titleLoader)} />
              </div>
              <div
                className={classNames(
                  "row  d-flex mb-4 px-3 px-sm-0 w-100 py-4",
                  styles.featureArtistContainer
                )}
              >
                {Array.from(Array(5).keys())?.map((itm, inx) => {
                  return <ArtistCardLoader key={inx} />;
                })}
              </div>
            </>
          ) : featureArtists?.length > 0 ? (
            <>
              <div
                className={classNames(
                  "d-flex align-items-center justify-content-center mt-5"
                )}
              >
                <label className={classNames(styles.title)}>
                  Featured Artist
                </label>
              </div>
              <div className={classNames("row d-flex mb-4 px-3 px-sm-0 w-100")}>
                {featureArtists?.map((item: any, inx: number) => {
                  return (
                    <ArtistCard
                      name={item?.name}
                      counter={item?.arts_count}
                      key={inx}
                      id={item?.id}
                      defaultArt={
                        item?.default_view_art?.cover_image
                          ? item?.default_view_art?.full_cover_image_path
                          : item?.default_view_art?.image
                          ? item?.default_view_art?.full_image_path
                          : null
                      }
                    />
                  );
                })}
              </div>
            </>
          ) : null}
          <div
            className={classNames(
              "w-100 d-flex align-items-center justify-content-between mt-5"
            )}
          >
            {initialLoading ? (
              <>
                <SkeletonLoader iconStyle={classNames(styles.titleLoader)} />
                <SkeletonLoader
                  iconStyle={classNames(styles.filterContainerLoader)}
                />
              </>
            ) : (
              <>
                <label className={classNames(styles.title)}>All Artists</label>
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
                  <label
                    className={classNames(styles.filterLabel)}
                    role="button"
                  >
                    {filter.name}
                  </label>
                  <OptionsDropDown
                    openSelection={openSelection}
                    setOpenSelection={setOpenSelection}
                    options={options}
                    customContainer={classNames(styles.optionsContainer)}
                  />
                </div>
              </>
            )}
          </div>
          <div className={classNames("row d-flex mb-4 px-3 px-sm-0 w-100")}>
            {initialLoading ? (
              <>
                {Array.from(Array(5).keys())?.map((itm, inx) => {
                  return <ArtistCardLoader key={inx} />;
                })}
              </>
            ) : (
              <>
                {artists?.length > 0 ? (
                  artists?.map((item: any, inx: number) => {
                    return (
                      <ArtistCard
                        name={item?.name}
                        counter={item?.arts_count}
                        key={inx}
                        id={item?.id}
                        defaultArt={
                          item?.default_view_art?.cover_image
                            ? item?.default_view_art?.full_cover_image_path
                            : item?.default_view_art?.image
                            ? item?.default_view_art?.full_image_path
                            : null
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
                      label1="No Artists found"
                    />
                  </div>
                )}

                {loading ? (
                  <>
                    <ArtistCardLoader />
                    <ArtistCardLoader />
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

export default Artists;
