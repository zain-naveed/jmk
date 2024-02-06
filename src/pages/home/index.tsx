import { Icons, Images } from "assets";
import classNames from "classnames";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router";
import AnnoucementsCard from "shared/components/annoucementsCard";
import CustomButton from "shared/components/customButton";
// import CustomSlider from "shared/components/customSlider";
import FeatureArtistsCard from "shared/components/featureArtistsCard";
import FeatureWritersCard from "shared/components/featureWritersCard";
import FeedArtCard from "shared/components/feedArtCard";
import NewsLetter from "shared/components/feedNewsLetter";
import FeedWritingTipsCard from "shared/components/feedWritingTips";
import Footer from "shared/components/footer";
import NavWrapper from "shared/components/navWrapper";
import NoContentCard from "shared/components/noContentCard";
import PaidArtworks from "shared/components/paidArtworks";
import { toastMessage } from "shared/components/toast";
import WinnersCard from "shared/components/winnersCard";
import { useOnScroll } from "shared/hooks/useOnScroll";
import ContestCardLoader from "shared/loader/contestCardLoader";
import StoryCardLoader from "shared/loader/storyCardLoader";
// import { routeConstant } from "shared/routes/routeConstant";
import {
  GetAllArtsContests,
  GetAllArtsWithoutContest,
} from "shared/services/artsService";
// import { slides } from "./constants";
import styles from "./style.module.scss";
import useWindowDimensions from "shared/hooks/useWindowDimentions";
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();
  const [endReach, onScroll] = useOnScroll("feed-container");
  const { width } = useWindowDimensions();
  const artsPage = useRef<number>(1);
  const contestPage = useRef<number>(1);
  const artsRef = useRef<[]>([]);
  const contestsRef = useRef<[]>([]);
  const [artsLoadMore, setArtsLoadMore] = useState<boolean>(false);
  const [contestLoadMore, setContestLoadMore] = useState<boolean>(false);
  const [arts, setArts] = useState<[]>([]);
  const [contests, setContests] = useState<[]>([]);
  const [initialLoading, setInitialLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const getArtsContests = (shouldCallArts: boolean) => {
    GetAllArtsContests({ pagination: 2, page: contestPage.current })
      .then(
        ({
          data: {
            data: { data, meta },
            status,
            message,
          },
        }) => {
          if (status) {
            if (meta?.current_page === meta?.last_page) {
              setContestLoadMore(false);
            } else {
              setContestLoadMore(true);
            }
            let cloneContests: any = [...contestsRef.current];
            cloneContests = [...cloneContests, ...data];
            contestsRef.current = cloneContests;
            setContests(cloneContests);
          } else {
            toastMessage("err", message);
          }
        }
      )
      .catch((err) => {
        console.log("Error", err);
      })
      .finally(() => {
        if (shouldCallArts) {
          getArts();
        } else {
          setLoading(false);
          setInitialLoading(false);
        }
      });
  };
  const getArts = () => {
    GetAllArtsWithoutContest({ pagination: 4, page: artsPage.current })
      .then(
        ({
          data: {
            data: { data, meta },
            status,
            message,
          },
        }) => {
          if (status) {
            if (meta?.current_page === meta?.last_page) {
              setArtsLoadMore(false);
            } else {
              setArtsLoadMore(true);
            }
            let cloneArts: any = [...artsRef.current];
            cloneArts = [...cloneArts, ...data];
            artsRef.current = cloneArts;
            setArts(cloneArts);
          } else {
            toastMessage("err", message);
          }
        }
      )
      .catch((err) => {
        console.log("Error", err);
      })
      .finally(() => {
        setLoading(false);
        setInitialLoading(false);
      });
  };

  useEffect(() => {
    if (endReach && !initialLoading && !loading && width > 767) {
      handleMore();
    }
    // eslint-disable-next-line
  }, [endReach]);

  const handleMore = () => {
    if (contestLoadMore) {
      setLoading(true);
      if (artsLoadMore) {
        contestPage.current = contestPage.current + 1;
        artsPage.current = artsPage.current + 1;
        getArtsContests(true);
      } else {
        contestPage.current = contestPage.current + 1;
        getArtsContests(false);
      }
    } else if (artsLoadMore) {
      setLoading(true);
      artsPage.current = artsPage.current + 1;
      getArts();
    }
  };

  useLayoutEffect(() => {
    setInitialLoading(true);
    getArtsContests(true);
    // eslint-disable-next-line
  }, []);
  return (
    <div
      className={classNames(styles.topMainContainer)}
      id="feed-container"
      onScroll={onScroll}
    >
      <NavWrapper />
      <div className={classNames(styles.toplevelContainerMain)}>
        <div
          className={classNames(
            styles.siderContainer,
            styles.headerContainer,
            styles.customContainer
          )}
        >
          <div className={styles.mainLabel}>
            <span>JOHNNIE</span> MAE KING
          </div>
          <div className={classNames(styles.subLabel)}>
            A Creative Story Writing Platform <span>BETA</span>
          </div>
          <div className={styles.subLevelLabel}>
            Exploring the Intersection of Art and Creative Narratives.{" "}
            <br className={styles.displayNone} /> Browse the Art, Read the
            Stories, or Contribute your own...
          </div>
          <div>
            <CustomButton
              label="About Johnnie..."
              style2
              customBtnContainer={classNames(styles.btnStyleAbout)}
              disabled={loading || initialLoading}
              loading={loading}
              onClick={() => navigate("/aboutus")}
            />{" "}
          </div>
        </div>
      </div>
      <div className={classNames(styles.customContainer, "mb-5")}>
        <div
          className={classNames(
            styles.containerSpacing,
            "d-flex row mx-0 px-3 px-sm-0 position-relative"
          )}
        >
          <div className={classNames("col-lg-8 col-md-7 col-12 px-0 mt-4")}>
            {initialLoading ? (
              <div className={classNames("row px-0 mx-0")}>
                <ContestCardLoader
                  customContainer={classNames("col-12 px-0 mx-0 px-md-3")}
                />
                <StoryCardLoader
                  customContainer={classNames(
                    "col-12 col-lg-6 px-0 mx-0 px-md-3"
                  )}
                />
                <StoryCardLoader
                  customContainer={classNames("col-12 col-lg-6 px-0 px-md-3")}
                />
              </div>
            ) : (
              <div className={classNames("row px-0 mx-0")}>
                {contests?.length > 0 || arts?.length > 0 ? (
                  <>
                    {Array.from(
                      Array(
                        contests?.length > arts?.length
                          ? contests.length
                          : arts.length
                      ).keys()
                    ).map((itm, inx) => {
                      return (
                        <FeedArtCard
                          contests={contests.slice(inx, inx + 1)}
                          arts={arts.slice(inx * 2, (inx + 1) * 2)}
                          key={inx}
                          index={inx}
                        />
                      );
                    })}

                    {loading ? (
                      <div
                        className={classNames(
                          "d-md-flex d-none  order-last mt-4"
                        )}
                      >
                        <StoryCardLoader
                          customContainer={classNames(
                            "col-12 col-lg-6 px-0 mx-0 px-md-3"
                          )}
                        />
                        <StoryCardLoader
                          customContainer={classNames(
                            "col-12 col-lg-6 px-0 px-md-3"
                          )}
                        />
                      </div>
                    ) : null}
                    {artsLoadMore || contestLoadMore ? (
                      <div
                        className={classNames(
                          "w-100 d-flex d-md-none align-items-center justify-content-center order-last mt-4"
                        )}
                      >
                        <CustomButton
                          label="Load More"
                          style2
                          customBtnContainer={classNames(styles.btnStyle)}
                          disabled={loading || initialLoading}
                          loading={loading}
                          onClick={handleMore}
                        />
                      </div>
                    ) : null}
                  </>
                ) : (
                  <div className={classNames("w-100 my-5")}>
                    <NoContentCard
                      Icon={Images.NoData}
                      label2="Oops! Nothing here yet."
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          <div
            className={classNames(
              "col-lg-4 col-md-5 col-12 px-4 px-xl-5 mt-4",
              styles.rightContainer
            )}
          >
            <PaidArtworks />
            <WinnersCard />
            <FeedWritingTipsCard />
            <FeatureArtistsCard />
            <FeatureWritersCard />
            <AnnoucementsCard />
            <NewsLetter />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
