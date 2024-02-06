import classNames from "classnames";
import styles from "./style.module.scss";
import { Icons, Images } from "assets";
import moment from "moment";
import { roundNum } from "shared/utils/helper";
import { useEffect, useState } from "react";
import ReportModal from "shared/modal/reportModal";
import { CommentAction, DeleteComment } from "shared/services/storyService";
import { toastMessage } from "shared/components/toast";
import { Report } from "shared/services/generalService";
import DeleteModal from "shared/modal/deleteModal";
import { useSelector } from "react-redux";
import { routeConstant } from "shared/routes/routeConstant";
import { useNavigate } from "react-router";

interface subCommentProps {
  index: number;
  item: any;
  setIsReplying: (val: boolean) => void;
  setComments: (val: any) => void;
  comments: any[];
  setCommentsTotal: (val: any) => void;
  commentsTotal: any;
  setReplyContent: (val: string) => void;
}

const SubComment = ({ index, item, setIsReplying, setComments, comments, commentsTotal, setCommentsTotal, setReplyContent }: Partial<subCommentProps>) => {
  const {
    user: { user },
  } = useSelector((state: any) => state.root);
  const navigate = useNavigate();
  const [reply, setReply] = useState<any>(item);
  const [liked, setLiked] = useState<boolean>(item?.is_liked);
  const [disliked, setDisLiked] = useState<boolean>(item?.is_disliked);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [reportLoader, setReportLoader] = useState<boolean>(false);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);

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
          let cloneCommentDetail = { ...reply };
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
          setReply(cloneCommentDetail);
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
      reportable_id: reply?.id,
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

  const handleDelete = () => {
    setDeleteLoader(true);
    DeleteComment(reply?.id)
      .then(() => {
        let filterArr = comments?.filter((itm, inx) => {
          return itm?.id !== reply?.id;
        });
        setComments?.(filterArr);

        setCommentsTotal?.(commentsTotal - 1);
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
    setReply(item);
    setLiked(item?.is_liked);
    setDisLiked(item?.is_disliked);
    // eslint-disable-next-line
  }, [item?.id]);
  return (
    <div className={classNames("d-flex w-100 ps-2", styles.brdLeft, index !== 0 ? "pt-3" : "pt-0")}>
      <img src={reply?.user?.profile_pic ? reply?.user?.full_profile_pic : Images.Avatar} className={classNames(styles.avatarStyle)} alt="avatar" />
      <div className={classNames("d-flex flex-column ms-2 w-100")}>
        <div className={classNames("d-flex")}>
          <label className={classNames(styles.commentUserName)}>{reply?.user?.name}</label>
          <label className={classNames(styles.dateLabel, "ms-2")}>{moment(reply?.created_at).fromNow()}</label>
        </div>
        <label className={classNames(styles.commentContent)}>
          {reply?.comment.split(" ").map((subText: string, ind: number) => {
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
                {roundNum(reply?.likes_count, 1)}
              </label>
            </div>
            <div className={classNames("d-flex align-items-center ms-2")} role="button" onClick={() => handleCommentAction(disliked, 0)}>
              {disliked ? <Icons.DislikeFill className={classNames(styles.actionIconStyle)} /> : <Icons.Dislike className={classNames(styles.actionIconStyle)} />}
              <label className={classNames(styles.actionlabel, "ms-1")} role="button">
                {roundNum(reply?.dislikes_count, 1)}
              </label>
            </div>
            <div
              className={classNames("d-flex align-items-center ms-2")}
              role="button"
              onClick={(e) => {
                setIsReplying?.(true);
                setReplyContent?.(`@[${item?.user?.name}](${item?.user?.id})`);
              }}
            >
              <Icons.MessageCircleBold className={classNames(styles.replyIcon)} />
              <label className={classNames(styles.actionlabel, "ms-1")} role="button">
                Reply
              </label>
            </div>
          </div>
          {String(user?.id) === String(reply?.user?.id) ? (
            <label className={classNames(styles.reportLabel)} role="button" onClick={handleShowDeleteModal}>
              Delete
            </label>
          ) : (
            <label className={classNames(styles.reportLabel)} role="button" onClick={() => handleShowReportModal()}>
              Report
            </label>
          )}
        </div>
      </div>
      <ReportModal showModal={showReportModal} handleShow={handleShowReportModal} handleClose={handleCloseReportModal} reportText={"Comment"} handleSubmit={async (type, reason) => await handleReport(type, reason)} loader={reportLoader} />
      <DeleteModal showModal={showDelete} handleShow={handleShowDeleteModal} handleClose={handleCloseDeleteModal} handleSubmit={handleDelete} loader={deleteLoader} />
    </div>
  );
};

export default SubComment;
