import { Icons, Images } from "assets";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import OptionsDropDown from "shared/dropsDowns/optionsDropDown";
import { allForms } from "shared/modal/auth/constants";
import DeleteModal from "shared/modal/deleteModal";
import DonationModal from "shared/modal/donation";
import UpdateStoryModal from "shared/modal/updateStory";
import { setSignInReducer } from "shared/redux/reducers/sigInSlice";
import { routeConstant } from "shared/routes/routeConstant";
import { socket } from "shared/services/socketService";
import {
  DeleteStory,
  LikeStory,
  SaveStory,
  ShareStory,
} from "shared/services/storyService";
import { roundNum } from "shared/utils/helper";
import { toastMessage } from "../toast";
import TypeCard from "../typeCard";
import UserCard from "../userCard";
import styles from "./style.module.scss";
import ShareModal from "shared/modal/shareModal";
import { Report } from "shared/services/generalService";
import ReportModal from "shared/modal/reportModal";
import useWindowDimensions from "shared/hooks/useWindowDimentions";

interface StorySuggestionProps {
  isAuthorStory: boolean;
  isInProfile: boolean;
  isPrivate: boolean;
  item: any;
  setStories: any;
  stories: any;
  isPersonalStory: boolean;
  isPending: boolean;
}

const StorySuggestionCard = ({
  isAuthorStory,
  isInProfile,
  item,
  isPrivate,
  setStories,
  stories,
  isPersonalStory,
}: Partial<StorySuggestionProps>) => {
  const {
    user: { isLoggedIn, token, user },
  } = useSelector((state: any) => state.root);
  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [story, setStory] = useState<any>(item);
  const [liked, setLiked] = useState<boolean>(item?.is_liked);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [openSelection, setOpenSelection] = useState<boolean>(false);
  const [loader, setLoader] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(item.is_bookedmark);
  const [wordCount, setWordCount] = useState(
    item?.story ? extractTextFromHtml(item?.story).split(" ").length : null
  );

  function extractTextFromHtml(input: any) {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = input;
    return tempElement.textContent || tempElement.innerText || "";
  }

  console.log("items in art", item?.story);

  const handleShowDonationnModal = () => {
    if (token) {
      setShowDonationModal(true);
    } else {
      dispatch(
        setSignInReducer({ showModal: true, activeModal: allForms.signin.name })
      );
    }
  };

  const handleCloseDonationModal = () => {
    setShowDonationModal(false);
  };

  const handleShowShareModal = () => {
    if (item?.status !== "Pending") {
      setShowShareModal(true);
    } else {
      toastMessage("Error", "Story Approval is Pending");
    }
  };

  const handleCloseShareModal = () => {
    setShowShareModal(false);
  };

  const handleReport = async (type: any, reason: string) => {
    let obj: any = {
      type: type,
      reason: reason,
      reportable_id: story?.id,
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

  const options = [
    {
      title: "Edit Story",
      Icon: Icons.Edit,
      action: () => {
        handleShowEditModal();
      },
    },
    {
      title: "Delete Story",
      Icon: Icons.Delete,
      action: () => {
        handleShowDeleteModal();
      },
    },
  ];

  const handleShowDeleteModal = () => {
    setShowDelete(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDelete(false);
  };
  const handleShowEditModal = () => {
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleShowReportModal = () => {
    if (isLoggedIn) {
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

  const handleDelete = () => {
    setLoader(true);
    DeleteStory(story?.id)
      .then(({ data: { message } }) => {
        toastMessage("success", message);
        setLoader(false);
        let temp = stories.filter((itm: any) => {
          return itm.id !== story?.id;
        });
        setStories(temp);
      })
      .catch((err) => {
        console.log("err", err);
        setLoader(false);
      });
  };

  const handleLike = () => {
    if (isLoggedIn) {
      if (item?.status !== "Pending") {
        let params = {
          post_id: item?.id,
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
                  if (String(user?.id) !== String(item?.user?.id)) {
                    const room = item?.user?.id;
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
              } else {
                toastMessage("error", message);
              }
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

  const handleShare = () => {
    let params = {
      post_id: item?.id,
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

  useEffect(() => {
    setStory(item);
    //eslint-disable-next-line
  }, [item?.id]);

  const handleSave = () => {
    if (isLoggedIn) {
      let params = {
        post_id: item?.id,
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

  console.log("item", item);

  return (
    <>
      <div
        className={classNames(
          isAuthorStory || isInProfile || isPersonalStory
            ? "col-12 mt-4"
            : "col-12 col-lg-6 mt-4 px-lg-3 px-0",
          isAuthorStory
            ? styles.topContainer2
            : isInProfile
            ? styles.topContainer3
            : styles.topContainer,
          "position-relative"
        )}
      >
        <div className={classNames("d-flex flex-column flex-sm-row row")}>
          {isInProfile && (
            <div
              className={classNames("col-12 col-sm-5 col-md-4 col-xl-3 m-0")}
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
          )}

          <div
            className={classNames(
              isInProfile
                ? "col-12 col-sm-7 col-md-8 col-xl-9 m-0"
                : "col-12 m-0"
            )}
          >
            <div
              className={classNames(
                "d-flex align-items-start align-items-sm-center  justify-content-center justify-content-sm-start flex-column flex-sm-row"
              )}
            >
              {!isAuthorStory && !isInProfile && !isPersonalStory ? (
                <UserCard
                  name={item?.user?.name}
                  avatar={
                    item?.user?.profile_pic
                      ? item?.user?.full_profile_path
                      : null
                  }
                  id={item?.user?.id}
                  isStyle2
                />
              ) : null}
              <TypeCard
                time={story?.created_at}
                type={story?.category_type}
                containerStyle={classNames(
                  styles.hieght,
                  !isAuthorStory && !isInProfile && !isPersonalStory
                    ? "ms-0 ms-sm-3 mt-3 mt-sm-0"
                    : ""
                )}
              />

              {item?.status === "Pending" ? (
                <div
                  className={classNames(
                    styles.pendingContainer,
                    "px-2 ms-0 ms-sm-3 mt-3 mt-sm-0"
                  )}
                >
                  <label className={classNames(styles.pendingLabel)}>
                    Pending
                  </label>
                </div>
              ) : null}
              {item?.is_contest_story && !isInProfile ? (
                <div
                  className={classNames(
                    styles.timerContainer,
                    "px-2 ms-0 ms-sm-3 mt-3 mt-sm-0"
                  )}
                >
                  <label className={classNames(styles.timerLabel)}>
                    Contest Story
                  </label>
                </div>
              ) : null}
            </div>
            <div
              className={classNames(
                "d-flex justify-content-between align-items-start mt-3 position-relative"
              )}
            >
              <label
                className={classNames(
                  styles.storyLabel,
                  (isInProfile || isAuthorStory) && styles.singleLine
                )}
                onClick={() => {
                  navigate(routeConstant.story.path.replace(":id", story?.id));
                }}
              >
                {story?.title} [{wordCount} {wordCount == 1 ? "word" : "words"}]
              </label>
              {isPrivate ? (
                <Icons.MoreHorizontal
                  className={classNames(styles.iconUpArrow)}
                  role="button"
                  onClick={() => {
                    setOpenSelection(true);
                  }}
                />
              ) : (
                <Icons.ArrowUpRight
                  className={classNames(styles.iconUpArrow)}
                  role="button"
                  onClick={() => {
                    navigate(
                      routeConstant.story.path.replace(":id", story?.id)
                    );
                  }}
                />
              )}
              <OptionsDropDown
                openSelection={openSelection}
                setOpenSelection={setOpenSelection}
                options={options}
                customContainer={classNames(styles.optionsContainer)}
              />
            </div>
            <div
              className={classNames(
                isAuthorStory || isInProfile
                  ? styles.descStyle2Container
                  : styles.descStyleContainer
              )}
            >
              <div
                className={classNames(
                  isAuthorStory || isInProfile
                    ? styles.descStyle2
                    : styles.descStyle,
                  isInProfile && styles.doubleLine
                )}
                dangerouslySetInnerHTML={{ __html: story?.story }}
                onClick={() => {
                  navigate(routeConstant.story.path.replace(":id", story?.id));
                }}
                role="button"
              />
            </div>

            {!isAuthorStory ? (
              <div
                className={classNames(
                  "mt-3 d-flex align-items-center justify-content-start gap-3 flex-wrap"
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
                    <Icons.Love
                      className={classNames(styles.actionIconStyle)}
                    />
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
                    navigate(routeConstant.story.path.replace(":id", item?.id))
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
                  onClick={handleShowShareModal}
                >
                  <Icons.ArrowUp
                    className={classNames(styles.actionIconStyle)}
                  />
                  <label
                    className={classNames(styles.actionlabel, "ms-2")}
                    role="button"
                  >
                    {roundNum(story?.shares_count, 1)}
                  </label>
                </div>
                {!isPrivate ? (
                  <>
                    <div
                      className={classNames(
                        "d-flex align-items-center justify-content-center"
                      )}
                      role="button"
                      onClick={() => handleShowReportModal()}
                    >
                      <Icons.Flag
                        className={classNames(styles.actionIconStyle)}
                      />
                      {width > 576 ? (
                        <label
                          className={classNames(styles.actionlabel, "ms-2")}
                          role="button"
                        >
                          report
                        </label>
                      ) : null}
                    </div>
                    <div
                      className={classNames(
                        "d-flex align-items-center justify-content-center"
                      )}
                      role="button"
                      onClick={handleSave}
                    >
                      <Icons.Save
                        className={
                          isBookmarked
                            ? styles.greenActionIconStyle
                            : styles.greyActionIconStyle
                        }
                      />
                      {width > 576 ? (
                        <label
                          className={classNames(styles.actionlabel, "ms-2")}
                          role="button"
                        >
                          {isBookmarked ? "Saved" : "Save"}
                        </label>
                      ) : null}
                    </div>
                    <div
                      className={classNames(
                        "d-flex align-items-center justify-content-center"
                      )}
                      role="button"
                      onClick={handleShowDonationnModal}
                    >
                      <Icons.Coffee
                        className={classNames(styles.greyActionIconStyle)}
                      />
                      {width > 576 ? (
                        <label
                          className={classNames(styles.actionlabel, "ms-2")}
                          role="button"
                        >
                          Buy Me Coffee
                        </label>
                      ) : null}
                    </div>
                  </>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
        <div
          className={classNames(
            isAuthorStory ? styles.line : styles.btmBorder,
            isAuthorStory ? "mt-0" : "mt-4"
          )}
        />
      </div>
      <DeleteModal
        showModal={showDelete}
        handleShow={handleShowDeleteModal}
        handleClose={handleCloseDeleteModal}
        handleSubmit={handleDelete}
        loader={loader}
      />
      <UpdateStoryModal
        show={showEditModal}
        handleClose={handleCloseEditModal}
        story={story}
        setStory={setStory}
        isPublic={!isPersonalStory}
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
          routeConstant.story.path.replace(":id", item?.id)
        }
        handleSubmit={handleShare}
      />
      <DonationModal
        otherUser={{ id: item?.user?.id }}
        show={showDonationModal}
        handleClose={handleCloseDonationModal}
      />
      <ReportModal
        showModal={showReportModal}
        handleShow={handleShowReportModal}
        handleClose={handleCloseReportModal}
        reportText={"Story"}
        handleSubmit={async (type, reason) => await handleReport(type, reason)}
        loader={loader}
      />
    </>
  );
};

export default StorySuggestionCard;
