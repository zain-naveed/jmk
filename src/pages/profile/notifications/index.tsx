import classNames from "classnames";
import styles from "./style.module.scss";
import { useEffect, useState } from "react";
import Swtich from "shared/components/switch";
import {
  AdjustNotificationPreference,
  GetNotificationsPreferences,
} from "shared/services/notificationService";
import { toastMessage } from "shared/components/toast";
import SkeletonLoader from "shared/loader/skeletonLoader";

const Notifications = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>(null);
  const getNotificationsPreferences = () => {
    GetNotificationsPreferences()
      .then(({ data: { data, status } }) => {
        if (status) {
          setData(data);
        }
      })
      .catch((err) => {
        console.log("err", err?.response?.data?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getNotificationsPreferences();
  }, []);

  return (
    <div className={classNames("d-flex flex-column w-100 mt-3")}>
      {loading ? (
        <>
          <NotificationToggleLoader />
          <div className={classNames(styles.seperator)} />
          <NotificationToggleLoader />
          <div className={classNames(styles.seperator)} />
          <NotificationToggleLoader />
        </>
      ) : (
        <>
          <NotificationToggle
            title="New Post Notifications"
            subTitle="Get notified in your email when someones uploads a new post."
            isPost
            isActive={data?.is_post}
          />
          <div className={classNames(styles.seperator)} />
          <NotificationToggle
            title="Post Like Notifications"
            subTitle="Get notified in your email when someones likes a post."
            isLike
            isActive={data?.is_like}
          />
          <div className={classNames(styles.seperator)} />
          <NotificationToggle
            title="Comments Notifications"
            subTitle="Get notified in your email when someones comments on a post."
            isComment
            isActive={data?.is_comment}
          />
        </>
      )}
    </div>
  );
};

interface NotificationToggleProps {
  title: string;
  subTitle: string;
  isPost?: boolean;
  isComment?: boolean;
  isLike?: boolean;
  isActive: boolean;
}

const NotificationToggle = ({
  title,
  subTitle,
  isComment,
  isLike,
  isPost,
  isActive,
}: NotificationToggleProps) => {
  const [active, setActive] = useState<boolean>(isActive);

  const toggleNotification = () => {
    let obj: any = {};

    if (isComment) {
      if (active) {
        obj["is_comment"] = 0;
      } else {
        obj["is_comment"] = 1;
      }
    } else if (isLike) {
      if (active) {
        obj["is_like"] = 0;
      } else {
        obj["is_like"] = 1;
      }
    } else if (isPost) {
      if (active) {
        obj["is_post"] = 0;
      } else {
        obj["is_post"] = 1;
      }
    }

    setActive(!active);

    AdjustNotificationPreference(obj)
      .then(({ data: { data, message, status } }) => {
        if (status) {
          toastMessage("success", message);
        } else {
          toastMessage("error", message);
        }
      })
      .catch((err) => {
        toastMessage("error", err?.response?.data?.message);
      });
  };

  return (
    <div
      className={classNames("d-flex flex-column align-items-start gap-2 py-3")}
    >
      <div
        className={classNames(
          "d-flex align-items-center justify-content-between w-100"
        )}
      >
        <label className={classNames(styles.title)}>{title}</label>
        <Swtich toggle={active} handleChange={() => toggleNotification()} />
      </div>
      <label className={classNames(styles.subTitle)}>{subTitle}</label>
    </div>
  );
};

const NotificationToggleLoader = () => {
  return (
    <div
      className={classNames("d-flex flex-column align-items-start gap-2 py-3")}
    >
      <div
        className={classNames(
          "d-flex align-items-center justify-content-between w-100"
        )}
      >
        <SkeletonLoader iconStyle={classNames(styles.titleLoader)} />
        <SkeletonLoader iconStyle={classNames(styles.switchLoader)} />
      </div>
      <SkeletonLoader iconStyle={classNames(styles.subtitleLoader)} />
    </div>
  );
};

export default Notifications;
