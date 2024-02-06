import { Icons, Images } from "assets";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router";
import AuthorCard from "shared/components/AuthorCard";
import CommentSection from "shared/components/commentSection";
import NoContentCard from "shared/components/noContentCard";
import ShareSocialMediaLink from "shared/components/shareSocialMediaLink";
import StorySuggestionCard from "shared/components/storySuggestionCard";
import { toastMessage } from "shared/components/toast";
import TypeCard from "shared/components/typeCard";
import SkeletonLoader from "shared/loader/skeletonLoader";
import StoryCountLoader from "shared/loader/storyCountLoader";
import StorySuggestionCardLoader from "shared/loader/storySuggestionLoader";
import { allForms } from "shared/modal/auth/constants";
import DonationModal from "shared/modal/donation";
import ReportModal from "shared/modal/reportModal";
import ShareModal from "shared/modal/shareModal";
import { setSignInReducer } from "shared/redux/reducers/sigInSlice";
import { routeConstant } from "shared/routes/routeConstant";
import { Report } from "shared/services/generalService";
import { socket } from "shared/services/socketService";
import {
  GetMoreFromWriter,
  GetStoryDetail,
  LikeStory,
  SaveStory,
  ShareStory,
} from "shared/services/storyService";
import { roundNum } from "shared/utils/helper";
import styles from "./style.module.scss";
import NavWrapper from "shared/components/navWrapper";
import Footer from "shared/components/footer";
import useWindowDimensions from "shared/hooks/useWindowDimentions";

const Story = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const {
    user: { user, isLoggedIn, token },
  } = useSelector((state: any) => state.root);
  const location = useLocation();
  const commentSectionDiv = useRef<HTMLDivElement>(null);
  const [liked, setLiked] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [storyDetail, setStoryDetail] = useState<any>(null);
  const [reportLoader, setReportLoader] = useState<boolean>(false);
  const [morefromWriterLoader, setMoreFromWriterLoader] =
    useState<boolean>(false);
  const [moreStories, setMoreStories] = useState<any[]>([]);
  const [showDonationModal, setShowDonationModal] = useState<boolean>(false);
  const [storyUserId, setStoryUserId] = useState<number>(0);
  const targetDivRef = useRef<HTMLDivElement | null>(null);

  const scrollToDiv = () => {
    if (targetDivRef.current) {
      // Step 3: Use scrollIntoView() to scroll to the div
      targetDivRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleShowDonationnModal = () => {
    if (token) {
      if (storyDetail?.status !== "Pending") {
        setShowDonationModal(true);
      } else {
        toastMessage("Error", "Story Approval is Pending");
      }
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
    if (storyDetail?.status !== "Pending") {
      setShowShareModal(true);
    } else {
      toastMessage("Error", "Story Approval is Pending");
    }
  };

  const handleCloseShareModal = () => {
    setShowShareModal(false);
  };

  const handleShowReportModal = () => {
    if (isLoggedIn) {
      if (storyDetail?.status !== "Pending") {
        setShowReportModal(true);
      } else {
        toastMessage("Error", "Story Approval is Pending");
      }
    } else {
      dispatch(
        setSignInReducer({ showModal: true, activeModal: allForms.signin.name })
      );
    }
  };

  const handleCloseReportModal = () => {
    setShowReportModal(false);
  };

  const getStoryDetail = () => {
    setLoading(true);
    GetStoryDetail(id)
      .then(({ data: { data, message, status } }) => {
        if (status) {
          if (
            (data?.status === "Pending" || data?.status === "Draft") &&
            String(data?.user?.id) !== String(user?.id)
          ) {
            navigate(routeConstant.home.path);
          } else {
            setStoryDetail(data);
            setLiked(data?.is_liked ? true : false);
            setSaved(data?.is_bookedmark ? true : false);
            getMoreFromWriter(data?.user?.id);
          }
          setStoryUserId(data?.user?.id);
        } else {
          console.log("Error", message);
          navigate(routeConstant.home.path);
        }
      })
      .catch((err) => {
        console.log("Error", err);
        navigate(routeConstant.home.path);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleLike = () => {
    if (isLoggedIn) {
      if (storyDetail?.status !== "Pending") {
        let params = {
          post_id: id,
          type: 1,
        };
        LikeStory(params)
          .then(({ data: { data, message, status } }) => {
            if (status) {
              let cloneStoryDetail = { ...storyDetail };
              if (cloneStoryDetail?.id) {
                if (!cloneStoryDetail?.is_liked) {
                  cloneStoryDetail.likes_count += 1;
                  cloneStoryDetail.is_liked += 1;
                  setLiked(true);
                  if (String(storyUserId) !== String(user?.id)) {
                    const room = storyUserId;
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
              }
              setStoryDetail(cloneStoryDetail);
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

  const handleSave = () => {
    if (isLoggedIn) {
      if (storyDetail?.status !== "Pending") {
        let params = {
          post_id: id,
        };
        SaveStory(params)
          .then(({ data: { data, message, status } }) => {
            if (status) {
              let cloneStoryDetail = { ...storyDetail };
              if (cloneStoryDetail?.id) {
                if (!cloneStoryDetail?.is_bookedmark) {
                  cloneStoryDetail.bookmarks_count += 1;
                  cloneStoryDetail.is_bookedmark += 1;
                  setSaved(true);
                } else {
                  cloneStoryDetail.bookmarks_count -= 1;
                  cloneStoryDetail.is_bookedmark -= 1;
                  setSaved(false);
                }
              }
              setStoryDetail(cloneStoryDetail);
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

  const handleShare = () => {
    let params = {
      post_id: id,
    };
    ShareStory(params)
      .then(({ data: { data, message, status } }) => {
        if (status) {
          let cloneStoryDetail = { ...storyDetail };
          if (cloneStoryDetail?.id) {
            cloneStoryDetail.shares_count += 1;
          }
          setStoryDetail(cloneStoryDetail);
        } else {
          toastMessage("error", message);
        }
      })
      .catch((err) => {
        console.log("Err", err?.response?.data?.message);
        toastMessage("error", err?.response?.data?.message);
      });
  };

  const handleReport = async (type: any, reason: string) => {
    setReportLoader(true);
    let obj: any = {
      type: type,
      reason: reason,
      reportable_id: storyDetail?.id,
    };

    await Report(obj)
      .then(({ data: { data, message } }) => {
        toastMessage("success", message);
      })
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => {
        setReportLoader(false);
        handleCloseReportModal();
      });
  };

  const getMoreFromWriter = (userid: any) => {
    setMoreFromWriterLoader(true);
    GetMoreFromWriter(userid, Number(id))
      .then(({ data: { data, message, status } }) => {
        if (status) {
          setMoreStories(data);
        } else {
          console.log("Error", message);
        }
      })
      .catch((err) => {
        console.log("Error", err);
      })
      .finally(() => {
        setMoreFromWriterLoader(false);
      });
  };

  useEffect(() => {
    getStoryDetail();

    // eslint-disable-next-line
  }, [id]);

  const scrollToComment = () => {
    if (commentSectionDiv.current) {
      commentSectionDiv.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  };

  useEffect(() => {
    if (location?.state?.item) {
      scrollToComment();
    }
    // eslint-disable-next-line
  }, [location?.state?.item]);

  return (
    <div className={classNames(styles.topMainContainer)}>
      <NavWrapper />
      <div className={classNames(styles.customContainer)}>
        <div
          className={classNames(
            "d-flex flex-column flex-lg-row my-5 px-3 px-sm-0"
          )}
        >
          <div
            className={classNames(
              "col-lg-7 col-xl-8  col-12 d-flex flex-column px-0 px-lg-2"
            )}
          >
            <div
              className={classNames(
                "d-flex align-items-center justify-content-between"
              )}
            >
              <div
                className={classNames(
                  "d-flex align-items-center justify-content-start gap-2"
                )}
              >
                {loading ? (
                  <StoryCountLoader
                    containerStyle={classNames(styles.categLoader)}
                  />
                ) : (
                  <>
                    <TypeCard
                      type={storyDetail?.category_type}
                      time={storyDetail?.created_at}
                      containerStyle={classNames(styles.hieght)}
                    />
                    {storyDetail?.status === "Pending" ||
                    storyDetail?.status === "Draft" ? (
                      <div
                        className={classNames(
                          styles.pendingContainer,
                          "px-3 ms-2"
                        )}
                      >
                        <label className={classNames(styles.pendingLabel)}>
                          {storyDetail?.status}
                        </label>
                      </div>
                    ) : null}
                  </>
                )}
              </div>

              <div className={classNames("d-flex align-items-center gap-3")}>
                {loading ? (
                  <StoryCountLoader
                    containerStyle={classNames(styles.categLoader)}
                  />
                ) : (
                  <>
                    <div
                      className={classNames("d-flex align-items-center")}
                      onClick={handleShowShareModal}
                      role="button"
                    >
                      <Icons.ArrowUp
                        className={classNames(styles.actionIconStyle1)}
                      />
                      <label
                        className={classNames(styles.actionLabel1, "ms-2")}
                      >
                        {roundNum(storyDetail?.shares_count, 1)}
                      </label>
                    </div>
                    <div className={classNames("d-flex align-items-center")}>
                      <Icons.MessageCircle
                        className={classNames(styles.actionIconStyle1)}
                      />
                      <label
                        className={classNames(styles.actionLabel1, "ms-2")}
                      >
                        {roundNum(storyDetail?.comments_count, 1)}
                      </label>
                    </div>
                  </>
                )}
              </div>
            </div>
            {loading ? (
              <div className={classNames("gap-1 d-flex flex-column mt-2")}>
                <SkeletonLoader
                  iconStyle={classNames(styles.storyTitleLoader)}
                />
                <SkeletonLoader
                  iconStyle={classNames(styles.storyTitleLoader, "w-50")}
                />
              </div>
            ) : (
              <label className={classNames(styles.storyTitle, "mt-2")}>
                {storyDetail?.title}
              </label>
            )}
            {loading ? (
              <SkeletonLoader
                iconStyle={classNames("my-3", styles.artLoader)}
              />
            ) : storyDetail?.art ? (
              <>
                <img
                  src={
                    storyDetail?.art?.full_cover_image_path
                      ? storyDetail?.art?.full_cover_image_path
                      : Images.Art
                  }
                  className={classNames("my-3", styles.art)}
                  alt="art"
                />
                <label className={classNames(styles.desc)}>
                  {storyDetail?.art?.description}
                </label>
              </>
            ) : null}

            <div
              className={classNames(
                styles.brdBtm,
                storyDetail?.art ? "my-5" : "mb-5 mt-4"
              )}
            />
            <div className={classNames("d-flex flex-column mb-5 ")}>
              {loading ? (
                <div className={classNames("d-flex flex-column gap-2")}>
                  <SkeletonLoader
                    iconStyle={classNames(styles.detailLoader, "w-25")}
                  />
                  <SkeletonLoader
                    iconStyle={classNames(styles.detailLoader, "w-100")}
                  />
                  <SkeletonLoader
                    iconStyle={classNames(styles.detailLoader, "w-100")}
                  />
                  <SkeletonLoader
                    iconStyle={classNames(styles.detailLoader, "w-50")}
                  />
                  <SkeletonLoader
                    iconStyle={classNames(styles.detailLoader, "w-25 mt-2")}
                  />
                  <SkeletonLoader
                    iconStyle={classNames(styles.detailLoader, "w-100")}
                  />
                  <SkeletonLoader
                    iconStyle={classNames(styles.detailLoader, "w-100")}
                  />
                  <SkeletonLoader
                    iconStyle={classNames(styles.detailLoader, "w-50")}
                  />
                  <SkeletonLoader
                    iconStyle={classNames(styles.detailLoader, "w-25 mt-2")}
                  />
                  <SkeletonLoader
                    iconStyle={classNames(styles.detailLoader, "w-100")}
                  />
                  <SkeletonLoader
                    iconStyle={classNames(styles.detailLoader, "w-100")}
                  />
                  <SkeletonLoader
                    iconStyle={classNames(styles.detailLoader, "w-50")}
                  />
                  <SkeletonLoader
                    iconStyle={classNames(styles.detailLoader, "w-25 mt-2")}
                  />
                  <SkeletonLoader
                    iconStyle={classNames(styles.detailLoader, "w-100")}
                  />
                  <SkeletonLoader
                    iconStyle={classNames(styles.detailLoader, "w-100")}
                  />
                  <SkeletonLoader
                    iconStyle={classNames(styles.detailLoader, "w-50")}
                  />
                  <SkeletonLoader
                    iconStyle={classNames(styles.detailLoader, "w-25 mt-2")}
                  />
                  <SkeletonLoader
                    iconStyle={classNames(styles.detailLoader, "w-100")}
                  />
                  <SkeletonLoader
                    iconStyle={classNames(styles.detailLoader, "w-100")}
                  />
                  <SkeletonLoader
                    iconStyle={classNames(styles.detailLoader, "w-50")}
                  />
                </div>
              ) : (
                <div
                  dangerouslySetInnerHTML={{ __html: storyDetail?.story }}
                  className={classNames(styles.detail)}
                />
              )}
            </div>
            <div className={classNames("d-flex align-items-center")}>
              {loading ? (
                <SkeletonLoader iconStyle={classNames(styles.tagLabelLoader)} />
              ) : (
                <label className={classNames(styles.tagLabel)}>Tags:</label>
              )}
              {loading ? (
                <div className={classNames("d-flex gap-2 ms-2 flex-wrap")}>
                  <SkeletonLoader
                    iconStyle={classNames(styles.tagContainerloader)}
                  />
                  <SkeletonLoader
                    iconStyle={classNames(styles.tagContainerloader)}
                  />
                  <SkeletonLoader
                    iconStyle={classNames(styles.tagContainerloader)}
                  />
                </div>
              ) : (
                <div className={classNames("d-flex gap-2 ms-2 flex-wrap")}>
                  {storyDetail?.tags?.map((item: any, inx: any) => {
                    return <Tag name={item?.title} key={inx} />;
                  })}
                </div>
              )}
            </div>
            <div className={classNames(styles.brdBtm, "mt-4")} />
            <div
              className={classNames(
                "d-flex align-items-md-center align-items-start align-items-xl-center align-items-lg-start justify-content-between mt-4 flex-md-row flex-column flex-lg-column flex-xl-row gap-3 gap-md-0 gap-lg-3 gap-xl-0"
              )}
            >
              {loading ? (
                <>
                  <StoryCountLoader
                    containerStyle={classNames(styles.categLoader)}
                  />
                  <StoryCountLoader
                    containerStyle={classNames(styles.categLoader)}
                  />
                </>
              ) : (
                <>
                  <div
                    className={classNames(
                      "d-flex align-items-center justify-content-start gap-2 flex-wrap"
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
                        className={classNames(styles.actionlabel, "ms-1")}
                        role="button"
                      >
                        {roundNum(storyDetail?.likes_count, 1)}
                      </label>
                    </div>
                    <div
                      className={classNames(
                        "d-flex align-items-center justify-content-center"
                      )}
                      role="button"
                      onClick={scrollToDiv}
                    >
                      <Icons.MessageCircle
                        className={classNames(styles.actionIconStyle)}
                      />
                      <label
                        className={classNames(styles.actionlabel, "ms-1")}
                        role="button"
                      >
                        {roundNum(storyDetail?.comments_count, 1)}
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
                        className={classNames(styles.actionlabel, "ms-1")}
                        role="button"
                      >
                        {roundNum(storyDetail?.shares_count, 1)}
                      </label>
                    </div>
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
                      {width > 470 ? (
                        <label
                          className={classNames(styles.actionlabel, "ms-1")}
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
                        className={classNames(
                          saved
                            ? styles.greenActionIconStyle
                            : styles.greyActionIconStyle
                        )}
                      />
                      {width > 470 ? (
                        <label
                          className={classNames(
                            saved
                              ? styles.highlightedLabel
                              : styles.actionlabel,
                            "ms-2"
                          )}
                          role="button"
                        >
                          {saved ? "Saved" : "Save"}
                        </label>
                      ) : null}
                    </div>
                    {String(storyDetail?.user?.id) ===
                    String(user?.id) ? null : (
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
                        {width > 470 ? (
                          <label
                            className={classNames(styles.actionlabel, "ms-2")}
                            role="button"
                          >
                            Buy Me Coffee
                          </label>
                        ) : null}
                      </div>
                    )}
                  </div>
                  <ShareSocialMediaLink
                    link={window.location.href}
                    handleSubmit={handleShare}
                  />
                </>
              )}
            </div>
          </div>
          <div
            className={classNames(
              "col-lg-5 col-xl-4 col-12 mt-lg-0 mt-4 d-flex flex-column gap-4 px-0 px-lg-2"
            )}
          >
            {loading ? (
              <>
                <SkeletonLoader
                  iconStyle={classNames(styles.authorCardLoader)}
                />
              </>
            ) : (
              <AuthorCard
                name={storyDetail?.user?.name}
                id={storyDetail?.user?.id}
                avatar={
                  storyDetail?.user?.profile_pic
                    ? storyDetail?.user?.full_profile_path
                    : null
                }
                bio={storyDetail?.user?.bio}
                social_links={storyDetail?.user?.social_links}
              />
            )}

            <div ref={commentSectionDiv}>
              <CommentSection
                isPending={storyDetail?.status === "Pending"}
                author={storyDetail?.user}
                comment_id={
                  location?.state?.item?.notificationable?.id
                    ? location?.state?.item?.notificationable?.id
                    : null
                }
                refTarget={targetDivRef}
              />
            </div>
            <div className={classNames("d-flex flex-column")}>
              <label className={classNames(styles.moreLabel)}>
                More From This Writer
              </label>
              {morefromWriterLoader || loading ? (
                Array.from(Array(2).keys()).map((item, inx) => {
                  return (
                    <StorySuggestionCardLoader isAuthorStory={true} key={inx} />
                  );
                })
              ) : moreStories.length > 0 ? (
                moreStories.map((item, inx) => {
                  return (
                    <StorySuggestionCard
                      isAuthorStory={true}
                      key={inx}
                      item={item}
                    />
                  );
                })
              ) : (
                <div className={classNames("my-5")}>
                  <NoContentCard
                    Icon={Images.NoData}
                    label1="No Stories found"
                    customIconContianer={classNames(styles.noContentIconStyle)}
                    customLabel1Style={classNames(styles.noContentLabel)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <ReportModal
          showModal={showReportModal}
          handleShow={handleShowReportModal}
          handleClose={handleCloseReportModal}
          reportText={"Story"}
          handleSubmit={async (type, reason) =>
            await handleReport(type, reason)
          }
          loader={reportLoader}
        />
        <ShareModal
          showModal={showShareModal}
          handleShow={handleShowShareModal}
          handleClose={handleCloseShareModal}
          reportText={"Story"}
          link={window.location.href}
          handleSubmit={handleShare}
        />
        <DonationModal
          otherUser={{ id: storyDetail?.user?.id }}
          show={showDonationModal}
          handleClose={handleCloseDonationModal}
        />
      </div>
      <Footer />
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

export default Story;
