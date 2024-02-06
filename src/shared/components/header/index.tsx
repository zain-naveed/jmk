import { Icons, Images } from "assets";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router";
import Notifications from "shared/dropsDowns/notifications";
import useDebounce from "shared/hooks/useDebounce";
import useWindowDimensions from "shared/hooks/useWindowDimentions";
import AuthModal from "shared/modal/auth";
import { allForms } from "shared/modal/auth/constants";
import { setSignInReducer } from "shared/redux/reducers/sigInSlice";
import { routeConstant } from "shared/routes/routeConstant";
import { socket } from "shared/services/socketService";
import OptionsDropDown from "../../dropsDowns/optionsDropDown";
import ProfileDropDown from "../../dropsDowns/profileDropDown";
import CustomButton from "../customButton";
import { navigationItems } from "./constant";
import styles from "./style.module.scss";
import { GetNotificationsCount } from "shared/services/notificationService";

interface HeaderProps {
  isSideCanvas: boolean;
  setIsSideCanvas: (val: boolean) => void;
  isLandingPage: boolean;
}

const Header = ({
  isSideCanvas,
  setIsSideCanvas,
  isLandingPage,
}: HeaderProps) => {
  const params = useParams();
  const dispatch = useDispatch();
  const { user, signIn } = useSelector((state: any) => state.root);
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState<string>(
    params?.search ? params?.search?.split("=")[1] : ""
  );
  const [searchValue, setSearchValue] = useState<string>("");
  const { width } = useWindowDimensions();
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [openSelection, setOpenSelection] = useState<boolean>(false);
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>(location?.pathname);
  const [openPosts, setOpenPosts] = useState<boolean>(false);
  const [innerClose, setInnerClose] = useState<boolean>(false);
  const [noticationCounter, setNotificationCounter] = useState<number>(0);

  const notificationCounter = () => {
    GetNotificationsCount()
      .then(({ data: { data } }) => {
        setNotificationCounter(data?.notificationsCount);
        if (data?.notificationsCount > 0) {
          setNewNotificationDot(true);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const [newNotificationDot, setNewNotificationDot] = useState<boolean>(false);
  const options = [
    {
      title: "Writers",
      Icon: null,
      action: () => {
        navigateToScreen(routeConstant.writers.path);
      },
    },
    {
      title: "Artists",
      Icon: null,
      action: () => {
        navigateToScreen(routeConstant.artists.path);
      },
    },
  ];

  const handleShowSignInModal = (name: string) => {
    dispatch(setSignInReducer({ showModal: true, activeModal: name }));
  };

  const handleShowNotifications = () => {
    setShowNotification(true);
    setNewNotificationDot(false);
  };

  const handleCloseNotifications = () => {
    setShowNotification(false);
  };

  const navigateToScreen = (route: string) => {
    navigate(route);
    setActiveTab(route);
  };

  const handleReceiveNotification = (data: any) => {
    if (data.status) {
      setNewNotificationDot(true);
      notificationCounter();
    }
  };

  const handleKeyDown = (e: any) => {
    if (e?.key === "Enter" && search.length) {
      navigate(`/search/search=${search}`, { state: { search: search } });
    }
  };

  useEffect(() => {
    if (width > 767) {
      setIsSearch(false);
    }
    if (width < 576) {
      setOpenPosts(false);
    }
    // eslint-disable-next-line
  }, [width]);

  useEffect(() => {
    setActiveTab(location?.pathname);
    // eslint-disable-next-line
  }, [location?.pathname]);

  useEffect(() => {
    const room = user?.user?.id;
    socket.emit("join_room", room);
    socket.on("notification_received", handleReceiveNotification);

    return () => {
      socket.removeListener("notification_received", handleReceiveNotification);
    };
    // eslint-disable-next-line
  }, [socket]);

  useDebounce(
    () => {
      setSearchValue(search);
    },
    [search],
    800
  );

  useEffect(() => {
    if (searchValue) {
      navigate(`/search/search=${searchValue}`, {
        state: { search: searchValue },
      });
    } else {
      if (location.pathname.includes("/search/search=")) {
        navigate(`/search/search=${searchValue}`, {
          state: { search: searchValue },
        });
      }
    }
    // eslint-disable-next-line
  }, [searchValue]);

  useEffect(() => {
    if (user?.isLoggedIn) {
      notificationCounter();
    }
  }, []);

  return (
    <nav className={classNames(styles.headerContainer)} id="header">
      <div className={classNames(styles.customContainer, "w-100")}>
        {isSearch ? (
          <div
            className={classNames(
              "d-flex align-items-center justify-content-start d-md-none "
            )}
          >
            <Icons.ArrowLeft
              className={classNames(styles.arrowIcon, "d-flex d-md-none ms-3")}
              onClick={() => setIsSearch(!isSearch)}
              role="button"
            />
            <div
              className={classNames(
                styles.searchContainer,
                "px-3  d-flex w-100 me-4"
              )}
            >
              <div className={classNames("w-100 d-flex  align-items-center")}>
                <Icons.Search className={classNames(styles.iconStyle)} />
                <input
                  placeholder="Search"
                  className={classNames(styles.searchInput, "ms-1")}
                  value={search}
                  onChange={(e) => setSearch?.(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e)}
                />
              </div>
              {search &&
                (search.length > 0 ? (
                  <Icons.Cross
                    role="button"
                    onClick={() => {
                      setSearch("");
                    }}
                  />
                ) : null)}
            </div>
          </div>
        ) : (
          <div
            className={classNames(
              "d-flex justify-content-between align-items-center px-3 px-sm-0"
            )}
          >
            <div
              className={classNames("d-flex align-items-center gap-md-4 gap-3")}
            >
              <Icons.Logo
                className={classNames(styles.logoStyle)}
                onClick={() => {
                  navigateToScreen(routeConstant.landing.path);
                }}
              />
              <div
                className={classNames(
                  "align-items-center gap-lg-4 gap-md-3 gap-3 ",
                  !isLandingPage &&
                    activeTab !== routeConstant.comingSoon.path &&
                    activeTab !== routeConstant.aboutus.path &&
                    activeTab !== routeConstant.contactus.path &&
                    activeTab !== routeConstant.privacy.path &&
                    activeTab !== routeConstant.terms.path &&
                    activeTab !== routeConstant.faq.path &&
                    activeTab !== routeConstant.storyGuide.path
                    ? "d-lg-flex d-none"
                    : "d-flex"
                )}
              >
                {navigationItems.map((item: any, inx) => {
                  return (
                    <label
                      className={classNames(
                        styles.headerLabels,
                        activeTab === item?.route && styles.activeLabel
                      )}
                      onClick={() => {
                        item?.url
                          ? window.open(item?.url, "_blank")
                          : navigateToScreen(item?.route);
                      }}
                      key={inx}
                    >
                      {item?.label}
                    </label>
                  );
                })}
              </div>
            </div>
            {!isLandingPage &&
            activeTab !== routeConstant.comingSoon.path &&
            activeTab !== routeConstant.aboutus.path &&
            activeTab !== routeConstant.contactus.path &&
            activeTab !== routeConstant.privacy.path &&
            activeTab !== routeConstant.faq.path &&
            activeTab !== routeConstant.terms.path &&
            activeTab !== routeConstant.storyGuide.path ? (
              user?.isLoggedIn ? (
                <div
                  className={classNames(
                    "d-flex align-items-center gap-lg-4 gap-md-3 gap-3 position-relative"
                  )}
                >
                  <div
                    className={classNames(
                      styles.searchContainer,
                      "px-3 d-none d-md-flex"
                    )}
                  >
                    <div
                      className={classNames("w-100 d-flex  align-items-center")}
                    >
                      <Icons.Search className={classNames(styles.iconStyle)} />
                      <input
                        placeholder="Search"
                        className={classNames(styles.searchInput, "ms-1")}
                        value={search}
                        onChange={(e) => setSearch?.(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e)}
                      />
                    </div>
                    {search &&
                      (search.length > 0 ? (
                        <Icons.Cross
                          role="button"
                          onClick={() => {
                            setSearch("");
                          }}
                        />
                      ) : null)}
                  </div>
                  <Icons.Search
                    className={classNames(styles.menuIcon, "d-flex d-md-none")}
                    onClick={() => setIsSearch(!isSearch)}
                  />
                  <div className={classNames("position-relative")}>
                    <Icons.Bell
                      className={classNames(styles.menuIcon)}
                      onClick={handleShowNotifications}
                    />
                    {newNotificationDot ? (
                      <div className={styles.newNotification}>
                        {noticationCounter > 9 ? "9+" : noticationCounter}
                      </div>
                    ) : (
                      ""
                    )}
                    {showNotification && (
                      <Notifications
                        show={showNotification}
                        handleClose={handleCloseNotifications}
                      />
                    )}
                  </div>
                  <Icons.Save
                    className={classNames(
                      styles.menuIcon,
                      activeTab === routeConstant.saveStories.path &&
                        styles.activeIcon
                    )}
                    onClick={() => {
                      navigateToScreen(routeConstant.saveStories.path);
                    }}
                  />
                  <button
                    className={classNames(
                      styles.strtbtn,
                      "px-3 d-sm-flex d-none align-items-center justify-content-center position-relative gap-2"
                    )}
                    onClick={() => {
                      setOpenPosts(!openPosts);
                    }}
                  >
                    Explore
                    <Icons.ChevDown className={classNames(styles.downIcon)} />
                    {openPosts && (
                      <OptionsDropDown
                        openSelection={openPosts}
                        setOpenSelection={setOpenPosts}
                        options={options}
                        customContainer={classNames(styles.optionsContainer)}
                        activeTab={activeTab}
                      />
                    )}
                  </button>

                  <div className={classNames("position-relative")}>
                    <img
                      src={
                        user?.user?.profile_pic
                          ? user?.user?.full_profile_path
                          : Images.Avatar
                      }
                      className={classNames(styles.avatar)}
                      role="button"
                      alt="profile-pic"
                      onClick={() => {
                        setOpenSelection(!openSelection);
                      }}
                    />
                    {openSelection && (
                      <ProfileDropDown
                        openSelection={openSelection}
                        setOpenSelection={setOpenSelection}
                      />
                    )}
                  </div>

                  <Icons.Menu
                    className={classNames(styles.menuIcon, "d-flex d-lg-none")}
                    onClick={() => setIsSideCanvas(!isSideCanvas)}
                  />
                </div>
              ) : (
                <div
                  className={classNames(
                    "d-flex align-items-center gap-md-4 gap-3"
                  )}
                >
                  <button
                    className={classNames(
                      styles.strtbtn,
                      "px-3 d-sm-flex d-none align-items-center justify-content-center position-relative gap-2"
                    )}
                    onClick={() => {
                      if (openPosts) {
                        setOpenPosts(false);
                      } else {
                        if (!innerClose) {
                          setOpenPosts(true);
                          setInnerClose(false);
                        } else {
                          setInnerClose(false);
                        }
                      }
                    }}
                  >
                    Explore
                    <Icons.ChevDown className={classNames(styles.downIcon)} />
                    {openPosts && (
                      <OptionsDropDown
                        openSelection={openPosts}
                        setOpenSelection={setOpenPosts}
                        options={options}
                        customContainer={classNames(styles.optionsContainer)}
                        activeTab={activeTab}
                        header
                        setInnerClose={setInnerClose}
                      />
                    )}
                  </button>
                  <label
                    className={classNames(styles.headerLabels)}
                    onClick={() => {
                      handleShowSignInModal(allForms.signin.name);
                    }}
                  >
                    Sign In
                  </label>
                  <CustomButton
                    label="Get Started"
                    onClick={() => {
                      handleShowSignInModal(allForms.signup.name);
                    }}
                  />
                  <Icons.Menu
                    className={classNames(styles.menuIcon, "d-flex d-md-none")}
                    onClick={() => setIsSideCanvas(!isSideCanvas)}
                  />
                </div>
              )
            ) : null}
          </div>
        )}

        <AuthModal show={signIn.showModal} activeModal={signIn.activeModal} />
      </div>
    </nav>
  );
};

export default Header;
