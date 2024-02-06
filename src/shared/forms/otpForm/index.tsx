import { Icons } from "assets";
import classNames from "classnames";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import CustomButton from "shared/components/customButton";
import { toastMessage } from "shared/components/toast";
import useCountDown from "shared/hooks/useCountdown";
import { allForms } from "shared/modal/auth/constants";
import { setSignInReducer } from "shared/redux/reducers/sigInSlice";
import { resetUser, setUser } from "shared/redux/reducers/userSlice";
import { routeConstant } from "shared/routes/routeConstant";
import {
  SendOtp,
  VerifyOTP,
  VerifyOTPReset,
} from "shared/services/authService";
import { OtpVS } from "shared/utils/validations";
import styles from "./style.module.scss";

interface InitialValues {
  otp: string;
}

interface AuthFormProps {
  handleClose: () => void;
}

const OTPForm = ({ handleClose }: AuthFormProps) => {
  const { user, signIn } = useSelector((state: any) => state.root);
  const [runTimer, setRunTimer] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const counter = useCountDown(2, runTimer, setRunTimer, [runTimer]);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const initialValues: InitialValues = {
    otp: "",
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: OtpVS,
    onSubmit: (value, action) => {
      handleOtp(value, action);
    },
  });
  const { setFieldValue, handleSubmit, values, touched, errors, isSubmitting } =
    formik;
  const handleOtp = (values: InitialValues, action?: any) => {
    action.setSubmitting(true);
    if (user?.resetPassword) {
      let formData = new FormData();
      formData.append("email", user?.user?.email);
      formData.append("otp", values.otp);
      VerifyOTPReset(formData)
        .then((res) => {
          if (res?.data?.data?.verify) {
            let user = { ...res.data.data.user, otp: values.otp };
            let resp = {
              isLoggedIn: false,
              user: user,
            };
            dispatch(setUser(resp));
            toastMessage("success", "Email Verified");
            dispatch(
              setSignInReducer({
                ...signIn,
                activeModal: allForms.resetPassword.name,
              })
            );
          } else {
            toastMessage("Error", res?.data?.message);
          }
        })
        .catch((err) => {
          console.log("ERR", err?.response?.data?.message);
          toastMessage("Error", err?.response?.data?.message);
        })
        .finally(() => {
          action.setSubmitting(false);
        });
    } else {
      let formData = new FormData();
      formData.append("email", user?.user?.email);
      formData.append("otp", values.otp);
      VerifyOTP(formData)
        .then((res) => {
          if (res?.data?.data?.verify) {
            let resp = {
              isLoggedIn: true,
              user: res.data.data.user,
              token: res?.data?.data?.user?.token,
              resetPassword: false,
            };
            dispatch(setUser(resp));
            handleClose();
            toastMessage("success", "Logged In!");
          } else {
            toastMessage("Error", res?.data?.message);
          }
        })
        .catch((err) => {
          console.log("ERR", err);
          toastMessage("Error", err);
        })
        .finally(() => {
          action.setSubmitting(false);
        });
    }
  };

  const handleResendOtp = () => {
    let formData = new FormData();
    formData.append("email", user?.user?.email);
    setLoading(true);
    SendOtp(formData)
      .then((res) => {
        if (res?.data?.data?.sent === true) {
          toastMessage("success", "Otp Sent to your email.");
        } else {
          toastMessage("Error", res.data.message);
        }
      })
      .catch((err) => {
        console.log("ERR", err);
        toastMessage("Error", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const togglerTimer = () => {
    if (!runTimer) {
      setRunTimer((t) => !t);
    }
  };

  //@ts-ignore
  const seconds = String(counter % 60).padStart(2, 0);
  //@ts-ignore
  const minutes = String(Math.floor(counter / 60)).padStart(2, 0);

  useEffect(() => {
    setRunTimer(true);
  }, []);

  return (
    <>
      <div
        className={classNames(
          "d-flex align-items-center justify-content-end mt-2"
        )}
      >
        <Icons.Cross
          onClick={() => {
            if (location?.pathname?.startsWith("/edit-profile")) {
              dispatch(resetUser());
              navigate(routeConstant.home.path);
              handleClose();
            } else {
              handleClose();
            }
          }}
          className={classNames(styles.crossIcon)}
          role="button"
        />
      </div>
      <form
        className={classNames("d-flex flex-column align-items-center mt-3")}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Icons.Logo className={classNames(styles.logo)} />
        <label className={classNames(styles.heading, "mt-4")}>
          OTP Verification Code
        </label>
        <label className={classNames(styles.headText)}>
          We have sent the code verification to your email
        </label>

        <div className="position-relative w-100 mt-3">
          <OtpInput
            containerStyle="w-100 justify-content-between mb-3"
            renderSeparator={<span>-</span>}
            renderInput={(props) => (
              <input
                {...props}
                type="number"
                onPaste={(e) => {
                  setFieldValue("otp", e.clipboardData.getData("text"));
                }}
                className={classNames(styles.otpInputStyle)}
              />
            )}
            value={values.otp}
            onChange={(e) => {
              setFieldValue("otp", e);
            }}
            numInputs={4}
          />
          <div className={classNames(styles.error)}>
            {touched.otp && errors.otp ? errors.otp : ""}
          </div>
        </div>
        <div
          className={classNames(
            "d-flex justify-content-between w-100 my-4 gap-3"
          )}
        >
          <CustomButton
            label="Resend"
            customBtnContainer={classNames(
              "w-50",
              styles.btnStyle,
              (runTimer || loading) && styles.disable
            )}
            onClick={() => {
              togglerTimer();
              handleResendOtp();
            }}
            style2
            disabled={runTimer || loading}
            loading={loading}
            spinnerColor={"black"}
          />
          <CustomButton
            label="Confirm"
            customBtnContainer={classNames("w-50", styles.btnStyle)}
            onClick={() => handleSubmit()}
            loading={isSubmitting}
            disabled={isSubmitting}
          />
        </div>
        <label className={classNames(styles.timerText, "mb-4 mt-2")}>
          Resend Code After{" "}
          <label className={classNames(styles.timerTextHighlighted)}>
            {minutes}:{seconds}
          </label>
        </label>
      </form>
    </>
  );
};

export default OTPForm;
