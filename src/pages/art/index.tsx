import { Icons, Images } from "assets";
import classNames from "classnames";
import { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import ContibutersList from "shared/components/contributersList";
import CustomButton from "shared/components/customButton";
import StoryCount from "shared/components/storyCount";
import TypeCard from "shared/components/typeCard";
import UserCard from "shared/components/userCard";
import CustomButtonLoader from "shared/loader/customButtonLoader";
import SkeletonLoader from "shared/loader/skeletonLoader";
import StoryCountLoader from "shared/loader/storyCountLoader";
import UserCardLoader from "shared/loader/userCardLoader";
import { modals } from "shared/modal/commonModal/constants";
import PostStoryModal from "shared/modal/postStory";
import {
  resetStoryReducer,
  setStoryReducer,
} from "shared/redux/reducers/postStorySlice";
import { routeConstant } from "shared/routes/routeConstant";
import { GetArtDetail, SaveArt } from "shared/services/artsService";
import { checkImg, roundNum } from "shared/utils/helper";
import styles from "./style.module.scss";
import ArtStories from "shared/components/artStoriesCard";
import { toastMessage } from "shared/components/toast";
import { setSignInReducer } from "shared/redux/reducers/sigInSlice";
import { allForms } from "shared/modal/auth/constants";
import NavWrapper from "shared/components/navWrapper";
import Footer from "shared/components/footer";
import { useOnScroll } from "shared/hooks/useOnScroll";
import { typesEnum } from "pages/profile/constants";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import { createBlob } from "shared/services/generalService";

const Art = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    user: { user, isLoggedIn },
  } = useSelector((state: any) => state.root);
  const [endReach, onScroll] = useOnScroll("artDetail");
  const [loading, setLoading] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [artDetail, setArtDetail] = useState<any>(null);
  const [stories, setStories] = useState<string[]>([]);
  const [showPostStory, setShowPostStory] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<any>(0);
  const [displaySeconds, setDisplaySeconds] = useState<any>(0);
  const [hours, setHours] = useState<any>(0);
  const [minutes, setMinutes] = useState<any>(0);
  const [days, setDays] = useState<any>(0);
  const [coverFile, setCoverFile] = useState<string>("");
  const [openLightBox, setOpenLightBox] = useState<boolean>(false);

  let interval: any = null;

  const handleShowPostStoryModal = () => {
    setShowPostStory(true);
  };

  const handleClosePostStoryModal = () => {
    setShowPostStory(false);
  };

  const handleContribution = () => {
    dispatch(resetStoryReducer());
    if (artDetail?.isOpenedContest) {
      dispatch(
        setStoryReducer({
          artCover: artDetail?.full_cover_image_path,
          artTitle: artDetail?.title,
          artDesc: artDetail?.description,
          artId: artDetail?.id,
          contestId: artDetail?.isOpenedContest?.id,
          contest: true,
          category: "Poetry",
          contestEndDate: artDetail?.isOpenedContest?.end_date,
          user_id: artDetail?.user?.id,
        })
      );
    } else {
      dispatch(
        setStoryReducer({
          artCover: artDetail?.full_cover_image_path,
          artTitle: artDetail?.title,
          artDesc: artDetail?.description,
          artId: artDetail?.id,
          contest: false,
          category: "Poetry",
          user_id: artDetail?.user?.id,
        })
      );
    }

    handleShowPostStoryModal();
  };

  const getArtDetail = () => {
    GetArtDetail(id)
      .then(({ data: { data, status, message } }) => {
        if (status) {
          if (
            !data?.is_approved &&
            String(data?.user?.id) !== String(user?.id)
          ) {
            navigate(routeConstant.home.path);
          } else {
            setArtDetail(data);
            setSaved(data?.is_bookedmark);
          }
        } else {
          console.log("Error", message);
        }
      })
      .catch((err) => {
        console.log("Error", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleShowSignInModal = () => {
    dispatch(
      setSignInReducer({ showModal: true, activeModal: allForms.signin.name })
    );
  };

  const handleSave = () => {
    if (isLoggedIn) {
      if (artDetail?.status !== "Pending") {
        let params = {
          art_id: id,
        };
        SaveArt(params)
          .then(({ data: { data, message, status } }) => {
            if (status) {
              let cloneStoryDetail = { ...artDetail };
              if (cloneStoryDetail?.id) {
                if (!cloneStoryDetail?.is_bookedmark) {
                  cloneStoryDetail.is_bookedmark += 1;
                  setSaved(true);
                } else {
                  cloneStoryDetail.is_bookedmark -= 1;
                  setSaved(false);
                }
              }
              setArtDetail(cloneStoryDetail);
            } else {
              toastMessage("error", message);
            }
          })
          .catch((err) => {
            console.log("Err", err?.response?.data?.message);
            toastMessage("error", err?.response?.data?.message);
          });
      } else {
        toastMessage("Error", "Story Approval is Pending");
      }
    } else {
      dispatch(
        setSignInReducer({ showModal: true, activeModal: allForms.signin.name })
      );
    }
  };

  const timeGenerator = (seconds: any) => {
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    if (hours > 24) {
      let days = Math.floor(hours / 24);
      let remHours = hours % 24;
      setDays(days);
      setHours(remHours);
    } else {
      setDays(0);
      setHours(hours);
    }
    seconds = seconds % 60;
    minutes = minutes % 60;
    setDisplaySeconds(seconds);
    setMinutes(minutes);
  };

  const makeBlob = () => {
    let obj = {
      image_url: artDetail?.full_image_path,
    };
    createBlob(obj)
      .then(({ data }) => {
        setCoverFile(artDetail?.full_image_path);
      })
      .catch((err) => {
        setCoverFile(artDetail?.full_cover_image_path);
      });
  };

  useEffect(() => {
    if (artDetail?.isOpenedContest?.end_date) {
      var t: any = new Date(artDetail?.isOpenedContest?.end_date);
      var newT: any = new Date();
      var diffTime: any = Math.abs(newT - t);
      let secondss = Math.floor(diffTime / 1000);
      setSeconds(secondss);
      timeGenerator(secondss);
      // eslint-disable-next-line
      interval = setInterval(function () {
        setSeconds((pre: any) => pre - 1);
      }, 1000); // update about every second
    }
  }, [artDetail?.isOpenedContest?.end_date]);

  useLayoutEffect(() => {
    return () => {
      if (artDetail?.isOpenedContest?.end_date) {
        if (interval) {
          clearInterval(interval);
        }
      }
    };
    // eslint-disable-next-line
  }, [artDetail?.isOpenedContest?.end_date]);

  useEffect(() => {
    setLoading(true);
    getArtDetail();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    timeGenerator(seconds);
  }, [seconds]);

  useEffect(() => {
    if (artDetail) {
      makeBlob();
    }
  }, [artDetail]);

  let slider = {
    src: coverFile,
    title: artDetail?.title,
    description: artDetail?.description,
  };

  return (
    <div
      className={classNames(styles.topMainContainer)}
      onScroll={onScroll}
      id="artDetail"
    >
      <NavWrapper />
      <div className={classNames(styles.customContainer)}>
        <div
          className={classNames(
            "d-flex flex-column-reverse flex-lg-row justify-content-between align-items-center mt-4 px-3 px-sm-0",
            styles.artContainer
          )}
        >
          <div
            className={classNames(
              "d-flex flex-column col-12 col-lg-6 pe-0 pe-lg-4 my-4 "
            )}
          >
            <div
              className={classNames(
                "d-flex align-items-center justify-content-start gap-2"
              )}
            >
              {loading ? (
                <SkeletonLoader
                  iconStyle={classNames(
                    "d-flex align-items-center justify-content-evenly",
                    styles.timerContainer
                  )}
                />
              ) : (
                <>
                  {artDetail?.isOpenedContest ? (
                    <div
                      className={classNames(
                        "d-flex align-items-center justify-content-center gap-1",
                        styles.timerContainer
                      )}
                    >
                      <Icons.Annoucement
                        className={classNames(styles.annouceIconStyle)}
                      />
                      <label className={classNames(styles.timerLabel)}>
                        Winner in {days}d : {hours}h : {minutes} :{" "}
                        {displaySeconds}
                      </label>
                    </div>
                  ) : null}
                  {!artDetail?.is_approved ? (
                    <div
                      className={classNames(
                        "d-flex px-3",
                        styles.pendingContainer
                      )}
                    >
                      <label className={classNames(styles.pendingLabel)}>
                        Pending
                      </label>
                    </div>
                  ) : null}
                </>
              )}
            </div>

            <div
              className={classNames(
                "d-flex align-items-start align-items-md-center align-items-lg-start align-items-xl-center flex-column flex-md-row flex-lg-column flex-xl-row mt-3"
              )}
            >
              {loading ? (
                <>
                  <UserCardLoader />

                  <div
                    className={classNames(
                      "d-flex align-items-center mt-3 mt-md-0 mt-lg-3 mt-xl-0 "
                    )}
                  >
                    <StoryCountLoader
                      containerStyle={classNames(
                        "ms-0 ms-md-2 ms-lg-0 ms-xl-2",
                        styles.categLoader
                      )}
                    />
                    <StoryCountLoader containerStyle={classNames("ms-2")} />
                    <StoryCountLoader containerStyle={classNames("ms-2")} />
                  </div>
                </>
              ) : (
                <>
                  <UserCard
                    name={artDetail?.user?.name}
                    avatar={
                      artDetail?.user?.profile_pic
                        ? artDetail?.user?.full_profile_pic
                        : null
                    }
                    id={artDetail?.user?.id}
                  />
                  <div
                    className={classNames(
                      "d-flex align-items-center mt-3 mt-md-0 mt-lg-3 mt-xl-0 gap-2 flex-wrap ms-0 ms-md-2"
                    )}
                  >
                    <TypeCard
                      time={artDetail?.created_at}
                      type="Art"
                      containerStyle={classNames(styles.height)}
                      item={artDetail}
                    />
                    <div className={classNames(styles.viewsContainer)}>
                      <label className={classNames(styles.viewLabel)}>
                        {roundNum(artDetail?.views_count, 1)} Views
                      </label>
                    </div>
                    <StoryCount
                      count={artDetail?.posts_count}
                      containerStyle={classNames(styles.height)}
                    />
                  </div>
                </>
              )}
            </div>
            {loading ? (
              <div
                className={classNames(
                  "d-flex flex-column align-items-start justify-content-center gap-1 my-4"
                )}
              >
                <SkeletonLoader
                  iconStyle={classNames("w-100", styles.descLoader)}
                />
                <SkeletonLoader
                  iconStyle={classNames("w-100", styles.descLoader)}
                />
                <SkeletonLoader
                  iconStyle={classNames("w-100", styles.descLoader)}
                />
                <SkeletonLoader
                  iconStyle={classNames("w-100", styles.descLoader)}
                />
                <SkeletonLoader
                  iconStyle={classNames("w-75", styles.descLoader)}
                />
                <SkeletonLoader
                  iconStyle={classNames("w-50", styles.descLoader)}
                />
              </div>
            ) : (
              <label className={classNames(styles.descLabel, "my-4")}>
                {artDetail?.description}
              </label>
            )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <label className={classNames(styles.tagLabel)}>Tags:</label>
              <div className={classNames("d-flex gap-2 ms-2 flex-wrap")}>
                {artDetail?.tags?.map((item: any, inx: any) => {
                  return <Tag name={item?.title} key={inx} />;
                })}
              </div>
            </div>
            <div
              className={classNames(
                "d-flex align-items-center justify-content-start mb-4"
              )}
              role="button"
              onClick={handleSave}
            >
              {loading ? (
                <>
                  <SkeletonLoader
                    iconStyle={classNames(styles.greenActionIconStyle)}
                  />
                </>
              ) : (
                <>
                  <Icons.Save
                    className={classNames(
                      saved
                        ? styles.greenActionIconStyle
                        : styles.greyActionIconStyle
                    )}
                  />
                  <label
                    className={classNames(
                      saved ? styles.highlightedLabel : styles.actionlabel,
                      "ms-2"
                    )}
                    role="button"
                  >
                    {saved ? "Saved" : "Save"}
                  </label>
                </>
              )}
            </div>

            {loading ? (
              <CustomButtonLoader />
            ) : (
              <CustomButton
                label="Contribute"
                Icon={Icons.Pencil}
                customBtnContainer={classNames(styles.btnContainer)}
                customIconStyle={classNames("me-1 h-100")}
                onClick={() => {
                  if (isLoggedIn) {
                    handleContribution();
                  } else {
                    handleShowSignInModal();
                  }
                }}
              />
            )}
          </div>
          <div
            className={classNames(
              "position-relative col-12 col-lg-6 d-flex justify-content-start justify-content-lg-end align-items-end"
            )}
          >
            {loading ? (
              <>
                <SkeletonLoader iconStyle={classNames(styles.artPicLoader)} />
              </>
            ) : (
              <div className={classNames("position-relative")}>
                <div>
                  <CustomButton
                    customIconStyle={styles.customIcon}
                    Icon={Icons.FullScreenIcon}
                    customBtnContainer={styles.containerBtn}
                    onClick={() => setOpenLightBox(true)}
                  />
                  <object
                    data={artDetail?.full_image_path}
                    type="image/png"
                    className={classNames(styles.artPic)}
                  >
                    <img
                      src={artDetail?.full_cover_image_path}
                      className={classNames(styles.artPic)}
                      alt="art-pic"
                      onClick={() => setOpenLightBox(true)}
                    />
                  </object>
                </div>
                {artDetail?.isOpenedContest ? (
                  <div
                    className={classNames(styles.submitStoryContainer)}
                    onClick={() => {
                      if (isLoggedIn) {
                        handleContribution();
                      } else {
                        handleShowSignInModal();
                      }
                    }}
                  >
                    <Icons.Apperture
                      className={classNames(styles.appertureIcon)}
                    />
                    <label className={classNames(styles.submitLabel, "ms-1")}>
                      Submit Story for Contest
                    </label>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
        <div
          className={classNames(
            "w-100 d-flex flex-column align-items-start my-5 px-3 px-sm-0"
          )}
        >
          <label className={classNames(styles.contributeLabel)}>
            Contributing Writers
          </label>
          <ContibutersList />
        </div>
        <ArtStories
          endReach={endReach}
          stories={stories}
          setStories={setStories}
        />
        <PostStoryModal
          show={showPostStory}
          handleClose={handleClosePostStoryModal}
          handleShow={handleShowPostStoryModal}
          nextModalName={artDetail?.isOpenedContest ? modals.winner.name : null}
          stories={stories}
          setStories={setStories}
        />
      </div>
      <Footer />
      <Lightbox
        open={openLightBox}
        close={() => setOpenLightBox(false)}
        slides={[slider]}
        plugins={[Zoom, Captions, Fullscreen]}
        render={{
          buttonPrev: () => null,
          buttonNext: () => null,
        }}
      />
    </div>
  );
};

const Tag = ({ name }: any) => {
  return (
    <div className={classNames(styles.tagContainer)}>
      <label className={classNames(styles.tag, "py-1 px-2")}>{name}</label>
    </div>
  );
};

export default Art;
