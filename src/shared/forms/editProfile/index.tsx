import { Icons, Images } from "assets";
import classNames from "classnames";
import { useFormik } from "formik";
import { useState } from "react";
import { toastMessage } from "shared/components/toast";
import { checkFileType } from "shared/utils/helper";
import { EditProfileVS } from "shared/utils/validations";
import styles from "./style.module.scss";
import CustomInput from "shared/components/customInput";
import CustomTextArea from "shared/components/customTextArea";
import Swtich from "shared/components/switch";
import CustomButton from "shared/components/customButton";
import { useSelector } from "react-redux";
import { UpdateProfile } from "shared/services/userService";
import { useDispatch } from "react-redux";
import { setUser } from "shared/redux/reducers/userSlice";
import { setSignInReducer } from "shared/redux/reducers/sigInSlice";
import { allForms } from "shared/modal/auth/constants";

interface InitialValues {
  name: string;
  email: string;
  bio: string;
  user_name: string;
}

const EditProfileForm = () => {
  const dispatch = useDispatch();

  const {
    user: { user, token, isLoggedIn },
  } = useSelector((state: any) => state.root);
  const { name, user_meta, email, full_profile_path, profile_pic, user_name, is_verified } =
    user;

  const initialValues: InitialValues = {
    email: is_verified && email ? email : "",
    name: name ? name : "",
    bio: user_meta?.bio ? user_meta?.bio : "",
    user_name: user_name ? user_name : "",
  };
  const [profilePicURL, setProfilePicURL] = useState<string>("");
  const [profilePic, setProfilePic] = useState<any>({});
  const [notification, setNotification] = useState<boolean>(
    user_meta?.is_enable_notification
      ? user_meta?.is_enable_notification
      : false
  );

  const [loader, setLoader] = useState<boolean>(false);

  const handleShowAuthModalShow = () => {
    dispatch(
      setSignInReducer({ showModal: true, activeModal: allForms.otp.name })
    );
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: EditProfileVS,
    onSubmit: (value) => {
      handleEditProfile(value);
    },
  });

  const { handleChange, handleSubmit, values, touched, errors } = formik;

  const handleEditProfile = (values: InitialValues, action?: any) => {
    const resp: any = {
      ...values,
      is_enable_notification: notification ? 1 : 0,
    };

    if (values.email === user.email) {
      delete resp.email;
    }

    if (profilePic && profilePic instanceof File) {
      resp["profile_pic"] = profilePic;
    }

    let formBody = new FormData();
    Object.keys(resp).forEach((key) => {
      formBody.append(key, resp[key]);
    });

    setLoader(true);

    UpdateProfile(formBody)
      .then(({ data: { data, message } }) => {
        let resp = {
          isLoggedIn: isLoggedIn,
          user: data,
          token: token,
        };
        dispatch(setUser(resp));
        if (data?.is_verified === 1) {
          toastMessage("success", message);
          setLoader(false);
        } else {
          handleShowAuthModalShow();
          setLoader(false);
        }
      })
      .catch((err) => {
        console.log("Err", err?.response?.data?.message);
        toastMessage("error", err?.response?.data?.message);
        setLoader(false);
      });
  };
  const handleChangeCover = (file: any) => {
    if (checkFileType(file.type)) {
      let url = URL.createObjectURL(file);
      setProfilePicURL(url);
      setProfilePic(file);
    } else {
      toastMessage("error", "Only JPG, JPEG, PNG are supported");
    }
  };
  const toggleNotification = () => {
    setNotification(!notification);
  };

  return (
    <>
      <form
        className={classNames(
          "d-flex col-12 col-sm-11 col-md-10 col-lg-8 col-xl-7 my-5 flex-column align-items-center justify-content-center  py-4 px-4",
          styles.topLevelContainer
        )}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div
          className={classNames(
            "d-flex align-items-center justify-content-center position-relative",
            styles.avatarContainer
          )}
        >
          <img
            className={classNames(styles.imgstyle)}
            src={
              profilePicURL
                ? profilePicURL
                : profile_pic
                ? full_profile_path
                : Images.Avatar
            }
            alt="profile-pic"
          />
          <label
            htmlFor="profileInput"
            className={classNames(
              "d-flex align-items-center justify-content-center",
              styles.iconContainer
            )}
            role="button"
          >
            <input
              type="file"
              id="profileInput"
              name="profileInput"
              style={{ display: "none", width: "100%" }}
              onChange={(e) => handleChangeCover(e?.target?.files?.[0])}
            />
            <Icons.Camera2 className={classNames(styles.cameraIcon)} />
          </label>
        </div>
        <div
          className={classNames(
            "w-100 d-flex align-items-start flex-column gap-1"
          )}
        >
          <label className={classNames(styles.inputLabel)}>Name</label>
          <CustomInput
            placeholder="Enter your name"
            type="text"
            value={values.name}
            error={touched.name && errors.name ? errors.name : ""}
            onChange={handleChange("name")}
          />
        </div>
        <div
          className={classNames(
            "w-100 d-flex align-items-start flex-column gap-1"
          )}
        >
          <label className={classNames(styles.inputLabel)}>Email</label>
          <CustomInput
            placeholder="Enter your email"
            type="email"
            value={values.email}
            error={touched.email && errors.email ? errors.email : ""}
            onChange={handleChange("email")}
            Icon={Icons.Mail}
            customIconStyle={classNames("me-1")}
          />
        </div>
        <div
          className={classNames(
            "w-100 d-flex align-items-start flex-column gap-1"
          )}
        >
          <label className={classNames(styles.inputLabel)}>Username</label>
          <CustomInput
            placeholder="Enter your username"
            type="text"
            value={values.user_name}
            error={
              touched.user_name && errors.user_name ? errors.user_name : ""
            }
            onChange={handleChange("user_name")}
          />
        </div>
        <div
          className={classNames(
            "w-100 d-flex align-items-start flex-column gap-1"
          )}
        >
          <label className={classNames(styles.inputLabel)}>URL</label>
          <CustomInput
            placeholder="Enter your URL"
            type="text"
            value={user_meta?.url}
            disabled={true}
          />
        </div>
        <div
          className={classNames(
            "w-100 d-flex align-items-start flex-column gap-1"
          )}
        >
          <label className={classNames(styles.inputLabel)}>Bio</label>
          <CustomTextArea
            placeholder="Bio"
            type="text"
            value={values.bio}
            error={touched.bio && errors.bio ? errors.bio : ""}
            onChange={handleChange("bio")}
            row={3}
          />
        </div>
        <div
          className={classNames(
            "d-flex align-items-center align-self-start gap-2"
          )}
        >
          <Swtich
            toggle={notification}
            handleChange={() => toggleNotification()}
          />
          <label>Enable Email Notifications</label>
        </div>
        <div
          className={classNames(
            "d-flex align-items-center gap-3 align-self-end", styles.btnContainer
          )}
        >
          <CustomButton
            label="Cancel"
            customBtnContainer={classNames(styles.cancelBtn)}
          />
          <CustomButton
            label="Save Changes"
            customBtnContainer={classNames(styles.saveBtn)}
            onClick={() => {
              handleSubmit();
            }}
            loading={loader}
          />
        </div>
      </form>
    </>
  );
};

export default EditProfileForm;
