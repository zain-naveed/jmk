import { Images } from "assets";
import classNames from "classnames";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { resetUser } from "shared/redux/reducers/userSlice";
import { routeConstant } from "shared/routes/routeConstant";
import { profileDropDownOptions } from "./constants";
import styles from "./style.module.scss";
import { resetStoriesReducer } from "shared/redux/reducers/stories";
import { resetStoryReducer } from "shared/redux/reducers/postStorySlice";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

interface ProfileDropDownProps {
  openSelection: boolean;
  setOpenSelection: (val: boolean) => void;
}

const ProfileDropDown = ({
  openSelection,
  setOpenSelection,
}: ProfileDropDownProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    user: { user },
  } = useSelector((state: any) => state.root);

  const handleLogout = () => {
    setOpenSelection(false);
    dispatch(resetUser());
    dispatch(resetStoriesReducer());
    dispatch(resetStoryReducer());
    // navigate(routeConstant.home.path);
    navigate(routeConstant.landing.path);
  };

  function handleClick(e: any) {
    const elem: any = document.getElementById("profileDropDownContainer");
    if (elem) {
      if (!elem?.contains(e.target)) {
        setOpenSelection(false);
      }
    }
  }

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

  const signOutPressHandler = () => {
    confirmAlert({
      message: "Are you sure you want to Log Out?",

      overlayClassName: "d-flex justify-content-center",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            handleLogout();
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  return (
    <div
      id="profileDropDownContainer"
      style={openSelection ? { display: "flex" } : { display: "none" }}
      className={classNames(styles.optionsContainer, "flex-column pt-2")}
    >
      <div
        className={classNames("d-flex align-items-center px-3")}
        style={{ maxWidth: "250px" }}
      >
        <img
          src={user?.profile_pic ? user?.full_profile_path : Images.Avatar}
          className={classNames(styles.avatar)}
          alt="profile-pic"
        />
        <div
          className={classNames("d-flex flex-column ms-3 align-items-start")}
          style={{ maxWidth: "250px", overflow: "hidden" }}
        >
          <label className={classNames(styles.nameLabel)}>{user?.name}</label>
          <label className={classNames(styles.emailLabel)}>{user?.email}</label>
        </div>
      </div>
      <div className={classNames(styles.seperator, "mt-2")} />
      <div className={classNames("d-flex flex-column w-100")}>
        {profileDropDownOptions.map((item, key) => {
          return (
            <div
              className={classNames(
                "d-flex justify-content-start align-items-center px-3 py-2",
                styles.optionContainer,
                key === profileDropDownOptions?.length - 1 && styles.btmradius
              )}
              key={key}
              role="button"
              onClick={() => {
                document.body.removeEventListener(
                  "click",
                  (event: any) => {
                    handleClick(event);
                  },
                  true
                );
                if (item?.title === "My Profile") {
                  setOpenSelection(false);
                  navigate(routeConstant.profile.path.replace(":id", user?.id));
                } else if (item?.title !== "Log out") {
                  setOpenSelection(false);
                  navigate(item?.route);
                } else {
                  signOutPressHandler();
                }
              }}
            >
              <item.Icon className={classNames(styles.optionIcon)} />
              <label
                className={classNames(styles.optionlabel, "ms-2")}
                role="button"
              >
                {item?.title}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileDropDown;
