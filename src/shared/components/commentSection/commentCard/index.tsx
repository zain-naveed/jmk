import { Icons, Images } from "assets";
import classNames from "classnames";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { toastMessage } from "shared/components/toast";
import ReplyCardLoader from "shared/loader/replyCardLoader";
import ReportModal from "shared/modal/reportModal";
import { Report } from "shared/services/generalService";
import { CommentAction, DeleteComment, GetReplies } from "shared/services/storyService";
import { roundNum } from "shared/utils/helper";
import SubComment from "../subComment";
import styles from "./style.module.scss";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import DeleteModal from "shared/modal/deleteModal";
import { useNavigate } from "react-router";
import { routeConstant } from "shared/routes/routeConstant";
import AddCommentInput from "../addComment";
import AddReplyInput from "../addReplyInput";

interface CommentCardProps {
  item: any;
  setIsReplying: (val: boolean) => void;
  isReplying: boolean;
  active: boolean;
  replies: any[];
  setReplies: (val: any) => void;
  setParentComment: (val: any) => void;
  repliesRef: any;
  setComments: (val: any) => void;
  comments: any[];
  setCommentsTotal: (val: any) => void;
  commentsTotal: any;
  handleAddComment: (comment: any, tagsUserIds: number[]) => void;
  loading: boolean;
  reply: string;
  setReply: (val: string) => void;
  replyLoading: boolean;
}

const CommentCard = ({ item, setIsReplying, isReplying, active, replies, setReplies, setParentComment, repliesRef, setComments, comments, commentsTotal, setCommentsTotal, handleAddComment, loading, reply, setReply, replyLoading }: CommentCardProps) => {
  const {
    user: { user },
  } = useSelector((state: any) => state.root);
  const navigate = useNavigate();
  const [initialloading, setInitialLoading] = useState<boolean>(false);
  const [comment, setComment] = useState<any>(item);
  const [liked, setLiked] = useState<boolean>(item?.is_liked);
  const [disliked, setDisLiked] = useState<boolean>(item?.is_disliked);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [reportLoader, setReportLoader] = useState<boolean>(false);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [moreCommentLoader, setMoreCommentLoader] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const currentPageRef = useRef<number>(1);
  const [total, setTotal] = useState<number>(0);

  const handleShowDeleteModal = () => {
    setShowDelete(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDelete(false);
  };

  const handleShowReportModal = () => {
    setShowReportModal(true);
  };

  const handleCloseReportModal = () => {
    setShowReportModal(false);
  };

  const handleCommentAction = (dislike: boolean, type: number) => {
    let params: any = {
      comment_id: item?.id,
      type: type,
    };
    if (dislike) {
      params["unlike"] = 1;
    }

    CommentAction(params)
      .then(({ data: { data, message, status } }) => {
        if (status) {
          let cloneCommentDetail = { ...comment };
          if (cloneCommentDetail?.id) {
            if (type === 1) {
              if (!cloneCommentDetail?.is_liked) {
                cloneCommentDetail.likes_count += 1;
                cloneCommentDetail.is_liked += 1;
                setLiked(true);
                if (cloneCommentDetail?.is_disliked) {
                  cloneCommentDetail.dislikes_count -= 1;
                  cloneCommentDetail.is_disliked -= 1;
                  setDisLiked(false);
                }
              } else {
                cloneCommentDetail.likes_count -= 1;
                cloneCommentDetail.is_liked -= 1;
                setLiked(false);
              }
            } else {
              if (!cloneCommentDetail?.is_disliked) {
                cloneCommentDetail.dislikes_count += 1;
                cloneCommentDetail.is_disliked += 1;
                setDisLiked(true);
                if (cloneCommentDetail?.is_liked) {
                  cloneCommentDetail.likes_count -= 1;
                  cloneCommentDetail.is_liked -= 1;
                  setLiked(false);
                }
              } else {
                cloneCommentDetail.dislikes_count -= 1;
                cloneCommentDetail.is_disliked -= 1;
                setDisLiked(false);
              }
            }
          }
          setComment(cloneCommentDetail);
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
      reportable_id: comment?.id,
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

  const getReplies = () => {
    GetReplies(Number(item?.id), currentPageRef.current, 2)
      .then(
        ({
          data: {
            data: {
              comments: { data, meta },
            },
            message,
            status,
          },
        }) => {
          if (status) {
            let cloneComments = [...repliesRef.current];
            cloneComments = [...cloneComments, ...data];
            setReplies(cloneComments);
            repliesRef.current = cloneComments;
            setTotal(meta?.total);
          } else {
            console.log("Error", message);
          }
        },
      )
      .catch((err) => {
        console.log("Error", err);
      })
      .finally(() => {
        setInitialLoading(false);
        setMoreCommentLoader(false);
      });
  };

  const handleDelete = () => {
    setDeleteLoader(true);
    DeleteComment(comment?.id)
      .then(() => {
        let filterArr = comments.filter((itm, inx) => {
          return itm?.id !== comment?.id;
        });
        setComments(filterArr);

        setCommentsTotal(commentsTotal - 1);
      })
      .catch((err) => {
        console.log("Error", err?.response?.data?.message);
        toastMessage("error", err?.response?.data?.message);
      })
      .finally(() => {
        setDeleteLoader(false);
        handleCloseDeleteModal();
      });
  };

  useEffect(() => {
    setComment(item);
    setLiked(item?.is_liked);
    setDisLiked(item?.is_disliked);
    // eslint-disable-next-line
  }, [item?.id]);

  return (
    <div className={classNames("d-flex w-100")}>
      <img src={comment?.user?.profile_pic ? comment?.user?.full_profile_pic : Images.Avatar} className={classNames(styles.avatarStyle)} alt="avatar" />
      <div className={classNames("d-flex flex-column ms-2 w-100")}>
        <div className={classNames("d-flex")}>
          <label className={classNames(styles.commentUserName)}>{comment?.user?.name}</label>
          <label className={classNames(styles.dateLabel, "ms-2")}>{moment(item?.created_at).fromNow()}</label>
        </div>
        <label className={classNames(styles.commentContent)}>
          {comment?.comment.split(" ").map((subText: string, ind: number) => {
            if (subText.match("@")) {
              return (
                <span
                  className={classNames(styles.tagText)}
                  onClick={() => {
                    navigate(routeConstant.profile.path.replace(":id", subText.replace("@", "")));
                  }}
                  role="button"
                  key={ind}
                >
                  {subText}{" "}
                </span>
              );
            } else {
              return <span key={ind}> {subText} </span>;
            }
          })}
        </label>
        <div className={classNames("d-flex align-items-center justify-content-between mt-2")}>
          <div className={classNames("d-flex")}>
            <div className={classNames("d-flex align-items-center")} role="button" onClick={() => handleCommentAction(liked, 1)}>
              {liked ? <Icons.LikeFill className={classNames(styles.actionIconStyle)} /> : <Icons.Like className={classNames(styles.actionIconStyle)} />}
              <label className={classNames(styles.actionlabel, "ms-1")} role="button">
                {roundNum(comment?.likes_count, 1)}
              </label>
            </div>
            <div className={classNames("d-flex align-items-center ms-2")} role="button" onClick={() => handleCommentAction(disliked, 0)}>
              {disliked ? <Icons.DislikeFill className={classNames(styles.actionIconStyle)} /> : <Icons.Dislike className={classNames(styles.actionIconStyle)} />}
              <label className={classNames(styles.actionlabel, "ms-1")} role="button">
                {roundNum(comment?.dislikes_count, 1)}
              </label>
            </div>
            <div
              className={classNames("d-flex align-items-center ms-3", !active && comment?.comments_count > 0 && styles.replyContainer, !active && "px-2 py-1")}
              role="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsReplying(!isReplying);
                if (active) {
                  setParentComment(null);
                  setReplies([]);
                  repliesRef.current = [];
                  currentPageRef.current = 1;
                } else {
                  setReplies([]);
                  repliesRef.current = [];
                  setInitialLoading(true);
                  setParentComment(item);
                  getReplies();
                  setReply(`@[${item?.user?.name}](${item?.user?.id})`);
                }
              }}
            >
              <Icons.MessageCircleBold className={classNames(styles.replyIcon)} />
              <label className={classNames(styles.actionlabel, "ms-1")} role="button">
                {active || comment?.comments_count === 0 ? "Reply" : roundNum(comment?.comments_count, 1)}
              </label>
            </div>
          </div>
          {String(user?.id) === String(comment?.user?.id) ? (
            <label className={classNames(styles.reportLabel)} role="button" onClick={handleShowDeleteModal}>
              Delete
            </label>
          ) : (
            <label className={classNames(styles.reportLabel)} role="button" onClick={() => handleShowReportModal()}>
              Report
            </label>
          )}
        </div>
        {active ? (
          <>
            <AddReplyInput comment={reply} setComment={setReply} setParentComment={setParentComment} action={handleAddComment} placeholder="Write your reply" item={item} setIsReplying={setIsReplying} replyLoading={replyLoading} />
            {initialloading ? (
              <div
                className={classNames("d-flex flex-column mt-3", styles.repliesListContainer)}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <ReplyCardLoader />
              </div>
            ) : replies?.length > 0 ? (
              <div
                className={classNames("d-flex flex-column mt-3 px-1", styles.repliesListContainer)}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {replies?.map((item, inx) => {
                  return <SubComment key={inx} index={inx} item={item} setIsReplying={setIsReplying} setComments={setReplies} comments={replies} setCommentsTotal={setTotal} commentsTotal={total} setReplyContent={setReply} />;
                })}
              </div>
            ) : null}
          </>
        ) : null}

        {active && replies?.length < total && !initialloading ? (
          <div
            className={classNames(styles.loadMoreContainer, "gap-2 py-2 mt-3")}
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              if (!moreCommentLoader) {
                setMoreCommentLoader(true);
                currentPageRef.current = currentPageRef.current + 1;
                getReplies();
              }
            }}
          >
            {moreCommentLoader ? (
              <Spinner animation={"border"} size="sm" style={{ color: "#deac00" }} />
            ) : (
              <>
                <label className={classNames(styles.loadMoreLabel)} role="button">
                  Load {total - replies?.length} more replies
                </label>
                <Icons.ChevDown className={classNames(styles.loadMoreIcon)} />
              </>
            )}
          </div>
        ) : (
          <div className={classNames(styles.brdBtm, "mt-4")} />
        )}
      </div>
      <ReportModal showModal={showReportModal} handleShow={handleShowReportModal} handleClose={handleCloseReportModal} reportText={"Comment"} handleSubmit={async (type, reason) => await handleReport(type, reason)} loader={reportLoader} />
      <DeleteModal showModal={showDelete} handleShow={handleShowDeleteModal} handleClose={handleCloseDeleteModal} handleSubmit={handleDelete} loader={deleteLoader} />
    </div>
  );
};

export default CommentCard;
