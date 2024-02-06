import { Icons, Images } from "assets";
import classNames from "classnames";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import NotificationLoader from "shared/loader/notificationLoader";
import { routeConstant } from "shared/routes/routeConstant";
import {
  GetNotifications,
  GetNotificationsCount,
  ReadAllNotifications,
  ReadNotification,
} from "shared/services/notificationService";
import styles from "./style.module.scss";
import { toastMessage } from "shared/components/toast";
import NoContentCard from "shared/components/noContentCard";

interface NotificationsProps {
  show: boolean;
  handleClose: () => void;
}

const Notifications = ({ show, handleClose }: NotificationsProps) => {
  const pageRef = useRef<number>(1);
  const notificationsRef = useRef<any[]>([]);

  const [notification, setNotification] = useState<string[]>([]);
  const [noticationCounter, setNotificationCounter] = useState<number>(0);
  const [initialLoading, setInitialLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadMore, setLoadMore] = useState<boolean>(false);
  const navigate = useNavigate();

  const onScrollEnd = () => {
    const element: any = document.getElementById("notificationList");
    if (element.scrollTop + element.offsetHeight >= element.scrollHeight) {
      if (loadMore && !initialLoading && !loading) {
        setLoading(true);
        pageRef.current = pageRef.current + 1;
        getAllNotifications();
      }
    }
  };

  function handleClick(e: any) {
    const elem: any = document.getElementById("notificationsDropDown");
    if (elem) {
      if (!elem?.contains(e.target)) {
        handleClose();
      }
    }
  }

  const getAllNotifications = () => {
    GetNotifications({ page: pageRef.current })
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
              setLoadMore(false);
            } else {
              setLoadMore(true);
            }
            let temp: any = [...notificationsRef.current];
            temp = [...temp, ...data];
            setNotification(temp);
            notificationsRef.current = temp;
          } else {
            console.log("Error", message);
          }
        }
      )
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => {
        setInitialLoading(false);
        setLoading(false);
      });
  };

  const notificationCounter = () => {
    GetNotificationsCount()
      .then(({ data: { data } }) => {
        setNotificationCounter(data?.notificationsCount);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handleNavigation = (item: any) => {
    if (item?.notificationable) {
      if (item?.notification_type === "post_like") {
        navigate(
          routeConstant.story.path.replace(":id", item?.notificationable?.id)
        );
      } else if (
        item?.notification_type === "post_comment" ||
        item?.notification_type === "comment_reply" ||
        item?.notification_type === "mention_in_comment"
      ) {
        navigate(
          routeConstant.story.path.replace(
            ":id",
            item?.notificationable?.post_id
          ),
          { state: { item: item } }
        );
      } else if (
        item?.notification_type === "art_approve" &&
        item?.notificationable
      ) {
        navigate(
          routeConstant.art.path.replace(":id", item?.notificationable?.id)
        );
      }
      handleClose();
    } else {
      toastMessage("Error", "This content may have been deleted by its owner");
    }
  };

  const handleProfile = (item: any) => {
    if (item?.sender) {
      navigate(routeConstant.profile.path.replace(":id", item?.sender?.id), {
        state: item,
      });
    } else {
      handleNavigation(item);
    }

    handleClose();
  };

  const handleReadAllNotifications = () => {
    ReadAllNotifications()
      .then(() => {
        setNotificationCounter(0);
        pageRef.current = 1;
        notificationsRef.current = [];
        setNotification([]);
        setInitialLoading(true);
        getAllNotifications();
      })
      .catch((err) => {
        toastMessage("error", err?.response?.data?.message);
        console.log("err", err);
      });
  };

  useEffect(() => {
    document.body.addEventListener(
      "click",
      (event: any) => {
        handleClick(event);
      },
      true
    );

    return () => {
      document.body.removeEventListener(
        "click",
        (event: any) => {
          handleClick(event);
        },
        true
      );
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    pageRef.current = 1;
    notificationsRef.current = [];
    setNotification([]);
    setInitialLoading(true);
    getAllNotifications();
    notificationCounter();
    // eslint-disable-next-line
  }, []);

  return (
    <div
      className={classNames(
        "d-flex flex-column px-3 pt-4 pb-4",
        styles.notificationContainer
      )}
      id="notificationsDropDown"
      style={show ? { display: "flex" } : { display: "none" }}
    >
      <div
        className={classNames(
          "d-flex align-items-center justify-content-between w-100"
        )}
      >
        <div
          className={classNames(
            "d-flex align-items-center justify-content-between gap-3"
          )}
        >
          <label className={classNames(styles.title)}>Notifications</label>
          {noticationCounter ? (
            <div className={classNames(styles.counterContainer)}>
              <label className={classNames(styles.countLabel)}>
                {noticationCounter}
              </label>
            </div>
          ) : (
            ""
          )}
        </div>
        {noticationCounter > 0 ? (
          <label
            className={classNames(styles.highlightedLabel)}
            role="button"
            onClick={handleReadAllNotifications}
          >
            Mark all as read
          </label>
        ) : null}
      </div>
      <div
        className={classNames(
          "d-flex align-items-start justify-content-start flex-column w-100 position-relative",
          styles.listContainter
        )}
        id="notificationList"
        onScroll={onScrollEnd}
      >
        {initialLoading ? (
          <>
            <NotificationLoader />
            <NotificationLoader />
          </>
        ) : (
          <>
            {notification.length > 0 ? (
              <>
                {notification.map((item: any, inx) => {
                  return (
                    <NotifyCard
                      {...item}
                      index={inx}
                      notification={notification}
                      key={inx}
                      handleNavigation={handleNavigation}
                      handleProfile={handleProfile}
                      setNotificationCounter={setNotificationCounter}
                      noticationCounter={noticationCounter}
                      item={item}
                      is_read={item?.is_read}
                    />
                  );
                })}
              </>
            ) : (
              <div className={classNames(styles.noContentContainer, "mt-3")}>
                <NoContentCard
                  Icon={Icons.NoNotifications}
                  customIconContianer={classNames(styles.noContentIcon)}
                  label2="No notifications yet!"
                  customLabel2Style={classNames(styles.noContentLabel)}
                />
              </div>
            )}

            {loading ? (
              <>
                <NotificationLoader />
                <NotificationLoader />
              </>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

interface NotifyCardProps {
  content: string;
  highlighted: string;
  created_at: any;
  sender: any;
  notification_type: string;
  handleNavigation: (item: any) => void;
  handleProfile: (item: any) => void;
  notificationable: any;
  notification: any;
  key: any;
  index?: number;
  is_read: any;
  id: any;
  setNotificationCounter: (val: any) => void;
  noticationCounter: any;
  item: any;
}

const NotifyCard = ({
  content,
  highlighted,
  created_at,
  notificationable,
  sender,
  notification_type,
  notification,
  handleNavigation,
  handleProfile,
  index,
  is_read,
  id,
  setNotificationCounter,
  noticationCounter,
  item,
}: Partial<NotifyCardProps>) => {
  const [isRead, setIsRead] = useState<number>(is_read);
  const handleReadNotifications = () => {
    ReadNotification(id)
      .then(() => {
        setNotificationCounter?.(noticationCounter - 1);
        setIsRead(1);
      })
      .catch((err) => {
        toastMessage("error", err?.response?.data?.message);
        console.log("err", err);
      });
  };
  useEffect(() => {
    setIsRead(is_read);
    // eslint-disable-next-line
  }, [item?.id]);
  return (
    <>
      <div
        className={classNames(
          "d-flex align-items-start justify-content-start w-100 gap-3 pt-3 position-relative"
        )}
      >
        {index !== notification?.length - 1 ? (
          <div className={classNames(styles.notifyCardContainer, "mt-3")} />
        ) : null}

        {notification_type === "art_approve" ? (
          <Icons.SuccessAnimation className={classNames(styles.succIcon)} />
        ) : (
          <img
            src={
              sender?.profile_pic ? sender?.full_profile_path : Images.Avatar
            }
            alt="user-avatar"
            className={classNames(styles.avatar)}
            onClick={(e) => {
              e.stopPropagation();
              handleProfile?.(item);
              handleReadNotifications();
            }}
          />
        )}
        <div
          className={classNames(
            "d-flex flex-column  align-items-start justify-content-start position-relative"
          )}
        >
          <div
            className={classNames(
              "d-flex align-items-center justify-content-start gap-2"
            )}
          >
            <label
              className={classNames(styles.userTitle)}
              role="button"
              onClick={(e) => {
                e.stopPropagation();
                handleProfile?.(item);
                handleReadNotifications();
              }}
            >
              {sender ? sender?.name : "Art Approved !"}
            </label>
            <label className={classNames(styles.time)}>
              {moment.utc(created_at).local().fromNow()}
            </label>
          </div>
          <label className={classNames(styles.notifyLabel)}>
            {notification_type === "post_like" ? (
              <p>
                Liked your{" "}
                <span
                  className={styles.post}
                  onClick={(e) => {
                    handleNavigation?.(item);
                    handleReadNotifications();
                  }}
                >
                  post
                </span>{" "}
              </p>
            ) : notification_type === "post_comment" ? (
              <p>
                Left a comment on your
                <span
                  className={styles.post}
                  onClick={(e) => {
                    handleNavigation?.(item);
                    handleReadNotifications();
                  }}
                >
                  {" "}
                  post
                </span>
              </p>
            ) : notification_type === "comment_reply" ? (
              <p>
                Replied to your comment:
                <span
                  className={styles.post}
                  onClick={(e) => {
                    handleNavigation?.(item);
                    handleReadNotifications();
                  }}
                >
                  {" "}
                  '{notificationable?.comment}'
                </span>
              </p>
            ) : notification_type === "mention_in_comment" ? (
              <p>
                Mentioned you in a comment:
                <span
                  className={styles.post}
                  onClick={(e) => {
                    handleNavigation?.(item);
                    handleReadNotifications();
                  }}
                >
                  {" "}
                  '{notificationable?.comment}'
                </span>
              </p>
            ) : (
              <p
                onClick={(e) => {
                  handleNavigation?.(item);
                  handleReadNotifications();
                }}
              >
                {content}
              </p>
            )}
            <span
              className={classNames(styles.notifyLabelHighlighted)}
              role="button"
            >
              {highlighted}
            </span>
          </label>
        </div>
        {!isRead ? (
          <div className={classNames(styles.greenDot, "mt-3")} />
        ) : null}
      </div>
    </>
  );
};

export default Notifications;
