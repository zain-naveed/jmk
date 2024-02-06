import { useState } from "react";
import { Icons } from "assets";
import classNames from "classnames";
import CustomButton from "shared/components/customButton";
import SocialLinks from "shared/components/socialLinks";
import styles from "./style.module.scss";
import UserCard from "shared/components/userCard";
import DonationModal from "shared/modal/donation";
import ReportModal from "shared/modal/reportModal";
import { roundNum } from "shared/utils/helper";
import UserCardLoader from "shared/loader/userCardLoader";
import SkeletonLoader from "shared/loader/skeletonLoader";
import CustomButtonLoader from "shared/loader/customButtonLoader";
import SocialLinksLoader from "shared/loader/socialLinksLoader";
import { useDispatch, useSelector } from "react-redux";
import { setSignInReducer } from "shared/redux/reducers/sigInSlice";
import { allForms } from "shared/modal/auth/constants";
import { Report } from "shared/services/generalService";
import { toastMessage } from "shared/components/toast";
import { typesEnum } from "../constants";

interface InfoCardProps {
  isPrivate: boolean;
  userInfo: {
    name: string;
    bio: string;
    id: number;
    pic: string;
  };
  profileData: any;
  action: () => void;
  loading: boolean;
}

const InfoCard = ({ isPrivate, userInfo, action, profileData, loading }: Partial<InfoCardProps>) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.root);
  const [showDonationModal, setShowDonationModal] = useState<boolean>(false);
  const [reportLoader, setReportLoader] = useState<boolean>(false);
  const handleShowDonationnModal = () => {
    if (user?.token) {
      setShowDonationModal(true);
    } else {
      dispatch(setSignInReducer({ showModal: true, activeModal: allForms.signin.name }));
    }
  };

  const handleCloseDonationModal = () => {
    setShowDonationModal(false);
  };
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  const handleShowReportModal = () => {
    if (user?.token) {
      setShowReportModal(true);
    } else {
      dispatch(setSignInReducer({ showModal: true, activeModal: allForms.signin.name }));
    }
  };

  const handleCloseReportModal = () => {
    setShowReportModal(false);
  };

  const handleReport = async (type: any, reason: string) => {
    setReportLoader(true);
    let obj: any = {
      type: type,
      reason: reason,
      reportable_id: userInfo?.id,
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

  return (
    <div className={classNames(styles.infoContainer, "d-flex flex-column align-items-start justify-content-start gap-4")}>
      {profileData?.type !== "Artist" ? (
        <div className={classNames("d-flex flex-column w-100 gap-2 align-items-start ")}>
          {isPrivate ? loading ? <UserCardLoader /> : <UserCard name={userInfo?.name} id={String(userInfo?.id)} avatar={userInfo?.pic} /> : loading ? <SkeletonLoader iconStyle={classNames(styles.titleLoader)} /> : <label className={classNames(styles.title)}>Enjoy the read? Reward the writer !</label>}
          {loading ? (
            <div className={classNames("d-flex flex-column gap-1 w-100")}>
              <SkeletonLoader iconStyle={classNames(styles.subTitleLoader, "w-100")} />
              <SkeletonLoader iconStyle={classNames(styles.subTitleLoader, "w-75")} />
              <SkeletonLoader iconStyle={classNames(styles.subTitleLoader, "w-50")} />
            </div>
          ) : (
            <label className={classNames(styles.subTitle)}>{isPrivate ? userInfo?.bio : `Your tip will go to ${profileData?.name} through a third-party platform of their choice,letting them know you appreciate their story.`}</label>
          )}
        </div>
      ) : (
        ""
      )}
      {loading ? <CustomButtonLoader customBtnContainer={classNames("w-100", styles.btnFont)} /> : profileData?.type !== "Artist" || profileData?.id === user?.user?.id ? <CustomButton label={isPrivate ? "Edit Profile" : "Buy Me Coffee"} Icon={isPrivate ? Icons.Pencil : Icons.Coffee} customBtnContainer={classNames("w-100", styles.btnFont)} customIconStyle={classNames("me-2")} onClick={isPrivate ? action : handleShowDonationnModal} isBlackIcon /> : ""}
      {loading ? (
        <div className={classNames("d-flex flex-column w-100 gap-2")}>
          <div className={classNames("d-flex justify-content-between align-items-center w-100")}>
            <SkeletonLoader iconStyle={classNames(styles.countTitleLoader)} />
            <SkeletonLoader iconStyle={classNames(styles.countSubTitleLoader)} />
          </div>
          <div className={classNames("d-flex justify-content-between align-items-center w-100")}>
            <SkeletonLoader iconStyle={classNames(styles.countTitleLoader)} />
            <SkeletonLoader iconStyle={classNames(styles.countSubTitleLoader)} />
          </div>
        </div>
      ) : (
        <div className={classNames("d-flex flex-column w-100 gap-2")}>
          {profileData?.type === typesEnum.writer ? (
            <div className={classNames("d-flex justify-content-between align-items-center w-100")}>
              <label className={classNames(styles.countTitle)}>Stories</label>
              <label className={classNames(styles.countSubTitle)}>{roundNum(profileData?.posts_count, 1)}</label>
            </div>
          ) : (
            profileData?.type === typesEnum.artist && (
              <div className={classNames("d-flex justify-content-between align-items-center w-100")}>
                <label className={classNames(styles.countTitle)}>Artworks</label>
                <label className={classNames(styles.countSubTitle)}>{roundNum(profileData?.arts_count, 1)}</label>
              </div>
            )
          )}
        </div>
      )}

      {loading ? (
        <div className={classNames("d-flex flex-column w-100 gap-2")}>
          <SkeletonLoader iconStyle={classNames(styles.titleLoader)} />
          <SocialLinksLoader />
        </div>
      ) : profileData?.social_links.length ? (
        <div className={classNames("d-flex flex-column w-100 gap-2")}>
          <label className={classNames(styles.title)}>Find me on the web</label>
          <SocialLinks social_links={profileData?.social_links} />
        </div>
      ) : null}

      {!isPrivate ? (
        loading ? (
          <div className={classNames("d-flex align-items-center gap-1")}>
            <SkeletonLoader iconStyle={classNames(styles.flagIcon)} />
            <SkeletonLoader iconStyle={classNames(styles.reportLabelLoader)} />
          </div>
        ) : // profileData?.type !== "Artist" ?
        //  <div
        //   className={classNames("d-flex align-items-center gap-1")}
        //   role="button"
        //   onClick={handleShowReportModal}
        // >
        //   <Icons.Flag className={classNames(styles.flagIcon)} />
        //   <label className={classNames(styles.reportLabel)} role="button">
        //     Report this user
        //   </label>
        // </div>  : null
        null
      ) : null}
      <DonationModal otherUser={{ id: userInfo?.id }} show={showDonationModal} handleClose={handleCloseDonationModal} />
      <ReportModal showModal={showReportModal} handleShow={handleShowReportModal} handleClose={handleCloseReportModal} reportText={"User"} handleSubmit={async (type, reason) => await handleReport(type, reason)} loader={reportLoader} />
    </div>
  );
};

export default InfoCard;
