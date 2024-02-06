import { Icons, Images } from "assets";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import TypeCard from "shared/components/typeCard";
import UserCard from "shared/components/userCard";
import ReportModal from "shared/modal/reportModal";
import ShareModal from "shared/modal/shareModal";
import { routeConstant } from "shared/routes/routeConstant";
import { Report } from "shared/services/generalService";
import { socket } from "shared/services/socketService";
import { LikeStory, SaveStory, ShareStory } from "shared/services/storyService";
import { roundNum } from "shared/utils/helper";
import { toastMessage } from "../toast";
import styles from "./style.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { setSignInReducer } from "shared/redux/reducers/sigInSlice";
import { allForms } from "shared/modal/auth/constants";
import { SaveArt } from "shared/services/artsService";

interface StoryCardProps {
  storyData: any;
}

const SaveStoryCard = ({ storyData }: Partial<StoryCardProps>) => {
  const {
    user: { user },
  } = useSelector((state: any) => state.root);
  const userLocal = useSelector((state: any) => state.root);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [liked, setLiked] = useState<boolean>(storyData?.is_liked);
  const [story, setStory] = useState<any>(storyData);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [loader, setLoader] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(
    storyData.is_bookedmark
  );
  const [wordCount, setWordCount] = useState(
    storyData?.story
      ? extractTextFromHtml(storyData?.story).split(" ").length
      : null
  );

  const handleLike = () => {
    if (userLocal?.user?.isLoggedIn) {
      let params = {
        post_id: story?.id,
        type: 1,
      };

      LikeStory(params)
        .then(({ data: { data, message, status } }) => {
          if (status) {
            let cloneStoryDetail = { ...story };
            if (cloneStoryDetail?.id) {
              if (!cloneStoryDetail?.is_liked) {
                cloneStoryDetail.likes_count += 1;
                cloneStoryDetail.is_liked += 1;
                setLiked(true);
                if (String(user?.id) !== String(storyData?.user?.id)) {
                  const room = storyData?.user?.id;
                  const data = {
                    room: room,
                    status: true,
                  };
                  socket.emit("notification", data);
                }
              } else {
                cloneStoryDetail.likes_count -= 1;
                cloneStoryDetail.is_liked -= 1;
                setLiked(false);
              }
              setStory(cloneStoryDetail);
            }
          } else {
            toastMessage("error", message);
          }
        })
        .catch((err) => {
          console.log("Err", err?.response?.data?.message);
          toastMessage("error", err?.response?.data?.message);
        });
    } else {
      dispatch(
        setSignInReducer({ showModal: true, activeModal: allForms.signin.name })
      );
    }
  };

  const handleShowShareModal = () => {
    setShowShareModal(true);
  };

  const handleCloseShareModal = () => {
    setShowShareModal(false);
  };

  const handleShowReportModal = () => {
    if (userLocal?.user?.isLoggedIn) {
      setShowReportModal(true);
    } else {
      dispatch(
        setSignInReducer({ showModal: true, activeModal: allForms.signin.name })
      );
    }
  };

  const handleCloseReportModal = () => {
    setShowReportModal(false);
  };

  const handleReport = async (type: any, reason: string) => {
    let obj: any = {
      type: type,
      reason: reason,
      reportable_id: storyData?.id,
    };

    let formBody = new FormData();
    Object.keys(obj).forEach((key) => {
      formBody.append(key, obj[key]);
    });

    setLoader(true);

    await Report(obj)
      .then(({ data: { data, message } }) => {
        toastMessage("success", message);
        setLoader(false);
      })
      .catch((err) => {
        console.log("err", err);
        setLoader(false);
      });
  };

  const handleShare = () => {
    let params = {
      post_id: story?.id,
    };
    ShareStory(params)
      .then(({ data: { data, message, status } }) => {
        if (status) {
          let cloneStoryDetail = { ...story };
          if (cloneStoryDetail?.id) {
            cloneStoryDetail.shares_count += 1;
          }
          setStory(cloneStoryDetail);
        } else {
          toastMessage("error", message);
        }
      })
      .catch((err) => {
        console.log("Err", err?.response?.data?.message);
        toastMessage("error", err?.response?.data?.message);
      });
  };

  const handleSave = () => {
    if (userLocal?.user?.isLoggedIn) {
      let params = {
        post_id: story?.id,
      };
      SaveStory(params)
        .then(({ data: { data, message, status } }) => {
          if (status) {
            setIsBookmarked(!isBookmarked);
          } else {
            toastMessage("error", message);
          }
        })
        .catch((err) => {
          console.log("Err", err?.response?.data?.message);
          toastMessage("error", err?.response?.data?.message);
        });
    } else {
      dispatch(
        setSignInReducer({ showModal: true, activeModal: allForms.signin.name })
      );
    }
  };

  useEffect(() => {
    setStory(storyData);
    // eslint-disable-next-line
  }, [storyData?.id]);

  function extractTextFromHtml(input: any) {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = input;
    return tempElement.textContent || tempElement.innerText || "";
  }

  return (
    <>
      <div
        className={classNames(
          "col-12 col-xl-6 mt-4 position-relative",
          styles.topContainer
        )}
      >
        <div className={classNames("d-flex flex-column flex-sm-row row")}>
          {story?.art ? (
            <div
              className={classNames("col-12 col-sm-4 col-md-3 col-xl-4 m-0")}
            >
              <img
                src={
                  story?.art?.cover_image
                    ? story?.art?.full_cover_image_path
                    : story?.art?.image
                    ? story?.art?.full_image_path
                    : Images.Art
                }
                className={classNames(styles.artStyle, "mb-3 mb-sm-0")}
                alt="art-pic"
                onClick={() => {
                  navigate(routeConstant.story.path.replace(":id", story?.id));
                }}
                role="button"
              />
            </div>
          ) : null}

          <div
            className={classNames(
              story?.art
                ? "col-12 col-sm-8 col-md-9 col-xl-8  m-0"
                : "col-12 m-0"
            )}
          >
            <div
              className={classNames(
                "d-flex align-items-start align-items-md-center  justify-content-center justify-content-md-start flex-column flex-md-row"
              )}
            >
              <UserCard
                name={story?.user?.name}
                id={story?.user?.id}
                avatar={
                  story?.user?.profile_pic
                    ? story?.user?.full_profile_path
                    : null
                }
                isStyle2
              />
              <TypeCard
                time={story?.created_at}
                type={story?.category_type}
                containerStyle={classNames(
                  styles.hieght,
                  "ms-0 ms-md-3 mt-2 mt-md-0"
                )}
              />
            </div>
            <div
              className={classNames(
                "d-flex justify-content-between align-items-start mt-3 position-relative"
              )}
              onClick={() => {
                navigate(routeConstant.story.path.replace(":id", story?.id));
              }}
            >
              <label
                className={classNames(
                  styles.storyLabel,
                  styles.storyLabelSave,
                  styles.singleLine
                )}
                onClick={() => {
                  navigate(routeConstant.story.path.replace(":id", story?.id));
                }}
              >
                {story?.title} - [{wordCount}{" "}
                {wordCount == 1 ? "word" : "words"}]
              </label>

              <Icons.ArrowUpRight
                className={classNames(styles.iconUpArrow)}
                role="button"
              />
            </div>
            <label
              className={classNames(styles.descStyle2)}
              dangerouslySetInnerHTML={{ __html: story?.story }}
              onClick={() => {
                navigate(routeConstant.story.path.replace(":id", story?.id));
              }}
              role="button"
            ></label>

            <div
              className={classNames(
                "mt-3 d-flex align-items-center justify-content-start gap-3"
              )}
            >
              <div
                className={classNames(
                  "d-flex align-items-center justify-content-center"
                )}
                role="button"
                onClick={handleLike}
              >
                {liked ? (
                  <Icons.LoveFill
                    className={classNames(styles.actionIconStyle)}
                  />
                ) : (
                  <Icons.Love className={classNames(styles.actionIconStyle)} />
                )}

                <label
                  className={classNames(styles.actionlabel, "ms-2")}
                  role="button"
                >
                  {roundNum(story?.likes_count, 1)}
                </label>
              </div>
              <div
                className={classNames(
                  "d-flex align-items-center justify-content-center"
                )}
                role="button"
                onClick={() =>
                  navigate(routeConstant.story.path.replace(":id", story?.id))
                }
              >
                <Icons.MessageCircle
                  className={classNames(styles.actionIconStyle)}
                />
                <label
                  className={classNames(styles.actionlabel, "ms-2")}
                  role="button"
                >
                  {roundNum(story?.comments_count, 1)}
                </label>
              </div>
              <div
                className={classNames(
                  "d-flex align-items-center justify-content-center"
                )}
                role="button"
                onClick={() => handleShowShareModal()}
              >
                <Icons.ArrowUp className={classNames(styles.actionIconStyle)} />
                <label
                  className={classNames(styles.actionlabel, "ms-2")}
                  role="button"
                >
                  {roundNum(story?.shares_count, 1)}
                </label>
              </div>
              <div
                className={classNames(
                  "d-flex align-items-center justify-content-center"
                )}
                role="button"
                onClick={() => handleSave()}
              >
                <Icons.Save
                  className={
                    isBookmarked
                      ? styles.greenActionIconStyle
                      : styles.greyActionIconStyle
                  }
                />
                <label
                  className={classNames(styles.actionlabel, "ms-2")}
                  role="button"
                >
                  {isBookmarked ? "Saved" : "Save"}
                </label>
              </div>

              <div
                className={classNames(
                  "d-flex align-items-center justify-content-center"
                )}
                role="button"
                onClick={() => handleShowReportModal()}
              >
                <Icons.Flag className={classNames(styles.actionIconStyle)} />
                <label
                  className={classNames(styles.actionlabel, "ms-2")}
                  role="button"
                >
                  report
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className={classNames(styles.btmBorder)} />
      </div>
      <ReportModal
        showModal={showReportModal}
        handleShow={handleShowReportModal}
        handleClose={handleCloseReportModal}
        reportText={"Story"}
        handleSubmit={async (type, reason) => await handleReport(type, reason)}
        loader={loader}
      />
      <ShareModal
        showModal={showShareModal}
        handleShow={handleShowShareModal}
        handleClose={handleCloseShareModal}
        reportText={"Story"}
        link={
          window.location.protocol +
          "//" +
          window.location.host +
          routeConstant.story.path.replace(":id", story?.id)
        }
        handleSubmit={handleShare}
      />
    </>
  );
};

export default SaveStoryCard;
