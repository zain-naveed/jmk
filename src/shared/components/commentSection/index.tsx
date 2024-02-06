import { Icons } from "assets";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import CommentCardLoader from "shared/loader/commentCardLoader";
import { AddComment, GetComments } from "shared/services/storyService";
import NoContentCard from "../noContentCard";
import CommentCard from "./commentCard";
import styles from "./style.module.scss";
import { toastMessage } from "../toast";
import { Spinner } from "react-bootstrap";
import { socket } from "shared/services/socketService";
import AddCommentInput from "./addComment";

interface CommentSectionProps {
  isPending: boolean;
  author: any;
  comment_id: any;
  refTarget: any;
}

const CommentSection = ({
  isPending,
  author,
  comment_id,
  refTarget,
}: CommentSectionProps) => {
  const { id } = useParams();
  const { user } = useSelector((state: any) => state.root);
  const currentPageRef = useRef<number>(1);
  const commentsRef = useRef<[]>([]);
  const repliesRef = useRef<any[]>([]);
  const [initialloading, setInitialLoading] = useState<boolean>(false);
  const [comments, setComments] = useState<any[]>([]);
  const [replies, setReplies] = useState<any[]>([]);
  const [comment, setComment] = useState<string>("");
  const [reply, setReply] = useState<string>("");
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [parentComment, setParentComment] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [replyLoading, setReplyLoading] = useState<boolean>(false);
  const [moreCommentLoader, setMoreCommentLoader] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);

  const getComments = () => {
    GetComments({
      id: Number(id),
      page: currentPageRef.current,
      pagination: 5,
      comment_id: comment_id,
    })
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
            let cloneComments: any = [...commentsRef.current];
            cloneComments = [...cloneComments, ...data];
            setComments(cloneComments);
            commentsRef.current = cloneComments;
            setTotal(meta?.total);
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
        setMoreCommentLoader(false);
      });
  };

  const handleAddComment = (comm: string, tagUserIds: number[]) => {
    if (comment.length > 255) {
      toastMessage("error", "Must not be greater than 255 characters");
    } else {
      if (isReplying) {
        setReplyLoading(true);
      } else {
        setLoading(true);
      }

      let obj: any = {
        comment: comm,
        post_id: id,
      };
      if (isReplying) {
        obj["comment_id"] = parentComment?.id;
      }
      if (tagUserIds?.length > 0) {
        obj["userIds"] = JSON.stringify(tagUserIds);
      }

      AddComment(obj)
        .then(({ data: { data, message, status } }) => {
          if (status) {
            if (!isReplying) {
              let cloneComments = [...comments];
              cloneComments.unshift(data);
              setComments(cloneComments);
            } else {
              let cloneReplies = [...repliesRef.current];
              cloneReplies.unshift(data);
              setReplies(cloneReplies);
              repliesRef.current = cloneReplies;
            }
            setComment("");
            setReply("");
            if (String(author?.id) !== String(user?.user?.id)) {
              const room = author?.id;
              const sendData = {
                room: room,
                status: true,
              };
              socket.emit("notification", sendData);
            }
            for (let i = 0; i < tagUserIds?.length; i++) {
              if (String(tagUserIds[i]) !== String(user?.user?.id)) {
                const room = tagUserIds[i];
                const sendData = {
                  room: room,
                  status: true,
                };
                socket.emit("notification", sendData);
              }
            }
          } else {
            toastMessage("error", message);
          }
        })
        .catch((err) => {
          console.log("err", err);
          toastMessage("error", err);
        })
        .finally(() => {
          setLoading(false);
          setReplyLoading(false);
        });
    }
  };

  useEffect(() => {
    commentsRef.current = [];
    setComments([]);
    setInitialLoading(true);
    getComments();
    // eslint-disable-next-line
  }, [id]);

  return (
    <div
      className={classNames(
        "d-flex flex-column p-3 p-sm-4",
        styles.commentContainer
      )}
      ref={refTarget}
    >
      <label className={classNames(styles.title)}>Interactive Comments</label>
      {user?.isLoggedIn && !isPending ? (
        <>
          <label className={classNames(styles.desc)}>
            Leave your comments on the selected text block
          </label>
          <AddCommentInput
            comment={comment}
            setComment={setComment}
            action={handleAddComment}
            loading={loading}
            setParentComment={setParentComment}
            setIsReplying={setIsReplying}
          />
        </>
      ) : null}
      <div
        className={classNames(
          "d-flex mt-4 flex-column gap-3 px-1",
          styles.commentListContainer
        )}
      >
        {initialloading ? (
          <>
            <CommentCardLoader />
            <CommentCardLoader />
          </>
        ) : (
          <>
            {comments?.length > 0 ? (
              <>
                {comments?.map((item, inx) => {
                  return (
                    <CommentCard
                      replyLoading={replyLoading}
                      key={inx}
                      item={item}
                      setIsReplying={setIsReplying}
                      isReplying={isReplying}
                      active={parentComment?.id === item?.id}
                      replies={replies}
                      setReplies={setReplies}
                      repliesRef={repliesRef}
                      setParentComment={setParentComment}
                      setComments={setComments}
                      comments={comments}
                      setCommentsTotal={setTotal}
                      commentsTotal={total}
                      handleAddComment={handleAddComment}
                      loading={loading}
                      reply={reply}
                      setReply={setReply}
                    />
                  );
                })}
              </>
            ) : (
              <div className={classNames(styles.noContentContainer)}>
                <NoContentCard
                  Icon={Icons.NoComment}
                  label1="No Comments Yet"
                  label2="Be the first to share what you think."
                  customIconContianer={classNames(styles.noContentIcon)}
                  customLabel1Style={classNames(styles.noContentLabel1)}
                  customLabel2Style={classNames(styles.noContentLabel2)}
                />
              </div>
            )}
          </>
        )}
      </div>
      {comments?.length < total && !initialloading ? (
        <div
          className={classNames(styles.loadMoreContainer, "gap-2 py-3 mt-3")}
          role="button"
          onClick={() => {
            if (!moreCommentLoader) {
              setMoreCommentLoader(true);
              currentPageRef.current = currentPageRef.current + 1;
              getComments();
            }
          }}
        >
          {moreCommentLoader ? (
            <Spinner
              animation={"border"}
              size="sm"
              style={{ color: "#deac00" }}
            />
          ) : (
            <>
              <label className={classNames(styles.loadMoreLabel)} role="button">
                Load {total - comments?.length} more comments
              </label>
              <Icons.ChevDown className={classNames(styles.loadMoreIcon)} />
            </>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default CommentSection;
