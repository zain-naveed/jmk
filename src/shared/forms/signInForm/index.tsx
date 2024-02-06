import classNames from "classnames";
import { Icons } from "assets";
import CustomButton from "shared/components/customButton";
import CustomCheckBox from "shared/components/customCheckBox";
import CustomInput from "shared/components/customInput";
import SocialAuth from "shared/components/socialAuth";
import { useState } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { LoginVS } from "shared/utils/validations";
import { toastMessage } from "shared/components/toast";
import { setUser } from "shared/redux/reducers/userSlice";
import styles from "./style.module.scss";
import { allForms } from "shared/modal/auth/constants";
import { LoginUser } from "shared/services/authService";
import { setSignInReducer } from "shared/redux/reducers/sigInSlice";
import Cookies from "universal-cookie";

interface InitialValues {
  email: string;
  password: string;
}
interface AuthFormProps {
  handleClose: () => void;
}

const SignInForm = ({ handleClose }: AuthFormProps) => {
  const cookies = new Cookies();
  const cookieValue = cookies.get("jmk_credentials");
  const initialValues: InitialValues = {
    email: cookieValue?.email ? cookieValue?.email : "",
    password: cookieValue?.password ? cookieValue?.password : "",
  };
  const [checked, setCheck] = useState<boolean>(false);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: LoginVS,
    onSubmit: (value, action) => {
      handleLogIn(value, action);
    },
  });
  const dispatch = useDispatch();
  const { signIn } = useSelector((state: any) => state.root);
  const { handleChange, handleSubmit, values, touched, errors, isSubmitting } =
    formik;
  const handleLogIn = (values: InitialValues, action?: any) => {
    action.setSubmitting(true);
    let formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);
    LoginUser(formData)
      .then(({ data: { status, data, message } }) => {
        if (data?.is_blocked) {
          toastMessage("Error", message);
        } else if (!data?.is_verified) {
          toastMessage("success", "Please verify your email");
          dispatch(
            setUser({
              user: {
                email: values.email,
                password: values.password,
              },
              resetPassword: false,
            })
          );

          dispatch(
            setSignInReducer({ ...signIn, activeModal: allForms.otp.name })
          );
        } else {
          let resp = {
            isLoggedIn: true,
            user: data,
            token: data?.token,
            resetPassword: false,
          };
          dispatch(setUser(resp));
          if (checked) {
            const cookieValue = cookies.get("jmk_credentials");
            if (cookieValue?.email !== values?.email) {
              const expirationDate = new Date();
              expirationDate.setDate(expirationDate.getDate() + 30);
              cookies.set(
                "jmk_credentials",
                JSON.stringify({
                  email: values.email,
                  password: values.password,
                }),
                { expires: expirationDate }
              );
            }
          }
          handleClose();
          toastMessage("success", "Logged In!");
        }
      })
      .catch((err) => {
        console.log("ERR", err?.response?.data?.message);
        toastMessage("Error", err?.response?.data?.message);
      })
      .finally(() => {
        action.setSubmitting(false);
      });
  };

  const handleResetPassword = () => {
    dispatch(setUser({ resetPassword: true }));
    dispatch(
      setSignInReducer({ ...signIn, activeModal: allForms.emailVerify.name })
    );
  };

  return (
    <>
      <div
        className={classNames(
          "d-flex align-items-center justify-content-end mt-3"
        )}
      >
        <Icons.Cross
          onClick={handleClose}
          className={classNames(styles.crossIcon)}
          role="button"
        />
      </div>
      <form
        className={classNames("d-flex flex-column align-items-center")}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Icons.Logo className={classNames(styles.logo)} />
        <label className={classNames(styles.headText, "my-4")}>
          Already have an account, quickly log back in
        </label>
        <CustomInput
          placeholder="Enter your email"
          type="email"
          value={values.email}
          error={touched.email && errors.email ? errors.email : ""}
          onChange={handleChange("email")}
        />
        <CustomInput
          placeholder="••••••••"
          type="password"
          value={values.password}
          error={touched.password && errors.password ? errors.password : ""}
          onChange={handleChange("password")}
          isPassword
        />
        <div
          className={classNames(
            "d-flex justify-content-between align-items-center w-100"
          )}
        >
          <CustomCheckBox checked={checked} setCheck={setCheck} />
          <label
            className={classNames(styles.forgetText)}
            onClick={handleResetPassword}
            role="button"
          >
            Forgot password
          </label>
        </div>
        <CustomButton
          label="Sign In"
          customBtnContainer={classNames("w-100 my-4")}
          onClick={() => handleSubmit()}
          loading={isSubmitting}
          disabled={isSubmitting}
        />
        <div className={classNames(styles.divider, "mb-4")}>
          <label className={classNames(styles.dividerTxt)}>OR</label>
        </div>
        <SocialAuth handleClose={handleClose} />
        <label className={classNames(styles.btmText1, "mb-4 mt-2")}>
          New here?{" "}
          <label
            className={classNames(styles.btmText2)}
            role="button"
            onClick={() =>
              dispatch(
                setSignInReducer({
                  ...signIn,
                  activeModal: allForms.signup.name,
                })
              )
            }
          >
            Sign up
          </label>
        </label>
      </form>
    </>
  );
};

export default SignInForm;
