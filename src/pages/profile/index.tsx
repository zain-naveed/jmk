import { Icons, Images } from "assets";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router";
import CustomTab from "shared/components/customTabs";
import NewsLetter from "shared/components/newsLetter";
import { toastMessage } from "shared/components/toast";
import WriterTipsCard from "shared/components/writerTipsCard";
import { routeConstant } from "shared/routes/routeConstant";
import { checkFileType, roundNum } from "shared/utils/helper";
import ArtsList from "./artsList";
import InfoCard from "./infoCard";
import Payments from "./payments";
import StoriesList from "./storiesList";
import styles from "./style.module.scss";
import { GetUserProfile, UpdateCoverPhoto } from "shared/services/userService";
import { setUser } from "shared/redux/reducers/userSlice";
import SkeletonLoader from "shared/loader/skeletonLoader";
import PersonalStoriesList from "./personalStoriesList";
import NavWrapper from "shared/components/navWrapper";
import Footer from "shared/components/footer";
import { useOnScroll } from "shared/hooks/useOnScroll";
import CustomTabsLoader from "shared/loader/customTabsLoader";
import CustomButton from "shared/components/customButton";
import SocialLinks from "shared/components/socialLinks";
import { setSignInReducer } from "shared/redux/reducers/sigInSlice";
import { allForms } from "shared/modal/auth/constants";
import ReportModal from "shared/modal/reportModal";
import { Report } from "shared/services/generalService";
import DonationModal from "shared/modal/donation";
import ProfileNewsLetter from "./newsLetter";
import {
  privateArtistTabEnums,
  privateArtistTabs,
  privateWriterTabEnums,
  privateWriterTabs,
  publicArtistTabEnums,
  publicArtistTabs,
  publicWriterTabEnums,
  publicWriterTabs,
  typesEnum,
} from "./constants";
import Notifications from "./notifications";

const Profile = () => {
  const { id } = useParams();
  const [endReach, onScroll] = useOnScroll("user-profile");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state: any) => state.root);
  const TabsDiv = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [coverUrl, setCoverUrl] = useState<string>("");
  const isPrivate =
    String(profileData?.id) === String(user?.user?.id) && user?.isLoggedIn;
  const [activeTab, setActiveTab] = useState<string>("");
  const [tabsEnums, setTabsEnums] = useState<any>([]);
  const [tabs, setTabs] = useState<any>([]);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [reportLoader, setReportLoader] = useState<boolean>(false);
  const [showDonationModal, setShowDonationModal] = useState<boolean>(false);

  const handleShowReportModal = () => {
    if (user?.token) {
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

  const handleShowDonationnModal = () => {
    if (user?.token) {
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

  const handleActiveTab = (val: string) => {
    if (TabsDiv.current) {
      TabsDiv.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
    setActiveTab(val);
  };

  const navigateToEditProfile = () => {
    navigate(routeConstant.editProfile.path);
  };

  const getUserProfile = () => {
    GetUserProfile(String(id))
      .then(({ data: { data, status, message } }) => {
        if (status) {
          if (data) {
            setProfileData(data);
            if (
              String(data?.id) === String(user?.user?.id) &&
              user?.isLoggedIn
            ) {
              dispatch(
                setUser({
                  ...user,
                  user: { ...data },
                })
              );
            }
            if (
              String(data?.id) === String(user?.user?.id) &&
              user?.isLoggedIn
            ) {
              if (data?.type === typesEnum.writer) {
                setTabsEnums(privateWriterTabEnums);
                setActiveTab(privateWriterTabs[0]);
                setTabs(privateWriterTabs);
              } else if (data?.type === typesEnum.artist) {
                setTabsEnums(privateArtistTabEnums);
                setActiveTab(privateArtistTabs[0]);
                setTabs(privateArtistTabs);
              }
            } else {
              if (data?.type === typesEnum.writer) {
                setTabsEnums(publicWriterTabEnums);
                setActiveTab(publicWriterTabs[0]);
                setTabs(publicWriterTabs);
              } else if (data?.type === typesEnum.artist) {
                setTabsEnums(publicArtistTabEnums);
                setActiveTab(publicArtistTabs[0]);
                setTabs(publicArtistTabs);
              }
            }
          } else {
            navigate(routeConstant.home.path);
          }
        } else {
          toastMessage("error", message);
        }
      })
      .catch((err) => {
        console.log("Error", err);
        toastMessage("Error", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const updateCoverPhoto = (file: any) => {
    let formData = new FormData();
    formData.append("cover_image", file);
    UpdateCoverPhoto(formData)
      .then(({ data: { data, status, message } }) => {
        if (status) {
          setProfileData({ ...profileData, user_meta: data?.user_meta });
          if (String(id) === String(user?.user?.id) && user?.isLoggedIn) {
            dispatch(
              setUser({
                ...user,
                user: { ...user?.user, user_meta: data?.user_meta },
              })
            );
          }
        } else {
          toastMessage("error", message);
        }
      })
      .catch((err) => {
        setCoverUrl("");
        console.log("Error", err);
        toastMessage("Error", err);
      })
      .finally(() => {});
  };

  const handleChangeCover = (file: any) => {
    if (checkFileType(file.type)) {
      updateCoverPhoto(file);
      let url = URL.createObjectURL(file);
      setCoverUrl(url);
      let elem = document.getElementById("coverContainer");
      //@ts-ignore
      elem.style = `background-image: linear-gradient(0deg, rgba(29, 41, 57, 0.5), rgba(29, 41, 57, 0.5)),url(${url});
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;`;
    } else {
      toastMessage("error", "Only JPG, JPEG, PNG are supported");
    }
  };

  const handleReport = async (type: any, reason: string) => {
    setReportLoader(true);
    let obj: any = {
      type: type,
      reason: reason,
      reportable_id: profileData?.id,
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

  useEffect(() => {
    setLoading(true);
    getUserProfile();

    // eslint-disable-next-line
  }, [id, user?.isLoggedIn]);

  useEffect(() => {
    if (profileData?.user_meta?.full_cover_image_path) {
      if (coverUrl === "") {
        let elem = document.getElementById("coverContainer");
        //@ts-ignore
        elem.style = `background-image: linear-gradient(0deg, rgba(29, 41, 57, 0.5), rgba(29, 41, 57, 0.5)),url(${profileData?.user_meta?.full_cover_image_path});
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;`;
      }
    }
    // eslint-disable-next-line
  }, [profileData, id]);

  return (
    <div
      className={classNames(styles.topMainContainer)}
      id="user-profile"
      onScroll={onScroll}
    >
      <NavWrapper />
      {loading ? (
        <SkeletonLoader
          iconStyle={classNames(
            styles.coverContainer,
            "d-flex align-items-center"
          )}
        />
      ) : (
        <>
          <div
            className={classNames(
              styles.coverContainer,
              "d-flex align-items-center"
            )}
            id="coverContainer"
          >
            <div
              className={classNames(
                styles.customContainer,
                "w-100 position-relative"
              )}
            >
              <div
                className={classNames(
                  "col-12  col-md-10 col-lg-8 px-3 px-sm-0"
                )}
              >
                <div className={classNames("d-flex align-items-center")}>
                  <img
                    alt="profile-pic"
                    src={
                      profileData?.profile_pic
                        ? profileData?.full_profile_path
                        : Images.Avatar
                    }
                    className={classNames(styles.avatar)}
                  />
                  <div
                    className={classNames(
                      "d-flex flex-column align-items-start justify-content-start ms-3"
                    )}
                  >
                    <label className={classNames(styles.name)}>
                      {profileData?.name}
                    </label>
                    {profileData?.contest_win_count ? (
                      <label className={classNames(styles.winnerLabel)}>
                        🥇 Contest Winner •{" "}
                        <label className={classNames(styles.winnerTimes)}>
                          {roundNum(profileData?.contest_win_count, 1)} Time
                          {profileData?.contest_win_count > 1 ? "s" : ""}
                        </label>
                      </label>
                    ) : null}
                  </div>
                </div>
                <label className={classNames(styles.bio, "mt-3")}>
                  {profileData?.user_meta?.bio}
                </label>
              </div>
              {isPrivate ? (
                <div className={classNames(styles.editCoverContainer)}>
                  <label
                    htmlFor="coverInput"
                    className={classNames(
                      "d-flex align-items-center justify-content-center"
                    )}
                    role="button"
                  >
                    <input
                      type="file"
                      id="coverInput"
                      name="coverInput"
                      style={{ display: "none", width: "100%" }}
                      onChange={(e) => handleChangeCover(e?.target?.files?.[0])}
                    />
                    <Icons.Camera
                      className={classNames(styles.cameraIcon, "me-2")}
                    />
                    <span className={classNames(styles.editLabel)}>
                      Change Cover
                    </span>
                  </label>
                </div>
              ) : null}
            </div>
          </div>
        </>
      )}

      {loading ? (
        <div
          className={classNames(
            styles.customContainer,
            "d-flex row flex-lg-row flex-column-reverse mb-4 mb-sm-5 px-3 px-sm-0"
          )}
        >
          <div
            className={classNames(
              "d-flex flex-column col-lg-8  col-12 mt-4 mt-sm-5"
            )}
            ref={TabsDiv}
          >
            <CustomTabsLoader />
          </div>
          <div
            className={classNames(
              "d-flex flex-column col-lg-4 col-12 gap-4 mt-4 mt-sm-5"
            )}
          >
            <div
              className={classNames(
                styles.donationContainer,
                "justify-content-start justify-content-lg-center "
              )}
            >
              <SkeletonLoader
                iconStyle={classNames(styles.donationAmountLoader)}
              />
            </div>
            <InfoCard loading={loading} />
          </div>
        </div>
      ) : profileData?.posts_count === 0 &&
        profileData?.arts_count === 0 &&
        String(profileData?.id) !== String(user?.user?.id) &&
        user?.isLoggedIn ? (
        <div
          className={classNames(
            styles.customContainer,
            "d-flex row  mb-4 mb-sm-5 px-3 px-sm-0 mt-4 mt-sm-5"
          )}
        >
          <div
            className={classNames(
              "d-flex col-12 col-md-8 flex-column align-items-start justify-content-center gap-3 mb-4 mb-md-0"
            )}
          >
            <label className={classNames(styles.title)}>
              Enjoy the read? Reward the writer !
            </label>
            <label className={classNames(styles.subTitle)}>
              {`Your tip will go to ${profileData?.name} through a third-party platform
              of their choice,letting them know you appreciate their story.`}
            </label>
            <CustomButton
              Icon={Icons.Coffee}
              isBlackIcon
              label="Buy Me Coffee"
              customBtnContainer={classNames(styles.cstmBtn, "gap-2")}
              customIconStyle={classNames(styles.btIcon)}
              onClick={handleShowDonationnModal}
            />
            {profileData?.social_links.length ? (
              <div
                className={classNames(
                  "d-flex flex-column align-items-start justify-content-center gap-3 mt-3"
                )}
              >
                <label className={classNames(styles.subTitle2)}>
                  Find me on the web
                </label>
                <SocialLinks social_links={profileData?.social_links} />
              </div>
            ) : null}
          </div>
          <div className={classNames("d-flex col-12 col-md-4")}>
            <div
              className={classNames(
                styles.donationContainer,
                "justify-content-center flex-column w-100"
              )}
            >
              <>
                <label className={classNames(styles.donationLabel, "ms-2")}>
                  Donations made
                </label>
                <label className={classNames(styles.donationAmount)}>
                  {roundNum(profileData?.total_donation_given, 1)}{" "}
                </label>
                <div className={classNames(styles.seperator, "mt-3 mb-4")} />
              </>
            </div>
          </div>
          <ProfileNewsLetter />
        </div>
      ) : (
        <div
          className={classNames(
            styles.customContainer,
            "d-flex row flex-lg-row flex-column-reverse mb-4 mb-sm-5 px-3 px-sm-0"
          )}
        >
          <div
            className={classNames(
              "d-flex flex-column col-lg-8  col-12 mt-4 mt-sm-5"
            )}
            ref={TabsDiv}
          >
            <CustomTab
              tabs={tabs}
              activeTab={activeTab}
              handleActiveTab={handleActiveTab}
            />
            {tabsEnums.stories === activeTab ? (
              <StoriesList
                isPrivate={isPrivate}
                endReach={endReach}
                id={profileData?.id}
              />
            ) : tabsEnums.arts === activeTab ? (
              <ArtsList
                existingState={location?.state?.user}
                endReach={endReach}
                id={profileData?.id}
              />
            ) : tabsEnums.personalStories === activeTab ? (
              <PersonalStoriesList
                isPrivate={isPrivate}
                endReach={endReach}
                id={profileData?.id}
              />
            ) : tabsEnums.notifications === activeTab ? (
              <Notifications />
            ) : (
              tabsEnums.payments && <Payments />
            )}
          </div>
          <div
            className={classNames(
              "d-flex flex-column col-lg-4 col-12 gap-4 mt-4 mt-sm-5"
            )}
          >
            {!isPrivate && profileData?.type !== typesEnum.artist ? (
              <div
                className={classNames(
                  styles.donationContainer,
                  "justify-content-start justify-content-lg-center "
                )}
              >
                <>
                  <label className={classNames(styles.donationAmount)}>
                    {roundNum(profileData?.total_donation_given, 1)}{" "}
                    <label style={{ color: "#0f1106" }}>-</label>
                  </label>
                  <label className={classNames(styles.donationLabel, "ms-2")}>
                    donations made
                  </label>
                </>
              </div>
            ) : null}
            <InfoCard
              isPrivate={isPrivate}
              userInfo={{
                name: profileData?.name,
                bio: profileData?.user_meta?.bio,
                id: profileData?.id,
                pic: profileData?.profile_pic
                  ? profileData?.full_profile_path
                  : null,
              }}
              action={navigateToEditProfile}
              profileData={profileData}
              loading={loading}
            />
            {isPrivate ? null : (
              <div className={classNames(" gap-4  flex-column d-flex")}>
                <WriterTipsCard />
                <div className={classNames("d-none d-lg-flex ")}>
                  <NewsLetter />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <ReportModal
        showModal={showReportModal}
        handleShow={handleShowReportModal}
        handleClose={handleCloseReportModal}
        reportText={"User"}
        handleSubmit={async (type, reason) => await handleReport(type, reason)}
        loader={reportLoader}
      />
      <DonationModal
        otherUser={{ id: profileData?.id }}
        show={showDonationModal}
        handleClose={handleCloseDonationModal}
      />
      <Footer />
    </div>
  );
};

export default Profile;
