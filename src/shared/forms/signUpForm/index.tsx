import { Icons } from "assets";
import classNames from "classnames";
import styles from "../signInForm/style.module.scss";
import { allForms } from "shared/modal/auth/constants";
import SocialAuth from "shared/components/socialAuth";
import CustomButton from "shared/components/customButton";
import { useFormik } from "formik";
import { SignUpVS } from "shared/utils/validations";
import CustomInput from "shared/components/customInput";
import { toastMessage } from "shared/components/toast";
import { RegisterUser } from "shared/services/authService";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "shared/redux/reducers/userSlice";
import { setSignInReducer } from "shared/redux/reducers/sigInSlice";

interface InitialValues {
  email: string;
  password: string;
  confirmPassword: string;
  fullname: string;
  username: string;
}

interface AuthFormProps {
  handleClose: () => void;
}

const SignUpForm = ({ handleClose }: AuthFormProps) => {
  const dispatch = useDispatch();
  const initialValues: InitialValues = {
    email: "",
    password: "",
    fullname: "",
    confirmPassword: "",
    username: "",
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: SignUpVS,
    onSubmit: (value, action) => {
      handleSignUp(value, action);
    },
  });
  const { signIn } = useSelector((state: any) => state.root);
  const { handleChange, handleSubmit, values, touched, errors, isSubmitting } =
    formik;
  const handleSignUp = (values: InitialValues, action?: any) => {
    action.setSubmitting(true);
    let formData = new FormData();
    formData.append("name", values.fullname);
    formData.append("user_name", values.username);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("password_confirmation", values.confirmPassword);
    RegisterUser(formData)
      .then((res) => {
        if (res?.data?.data) {
          toastMessage("success", "Otp Sent");
          dispatch(
            setUser({
              user: {
                email: values.email,
                name: values.fullname,
              },
              resetPassword: false,
            })
          );
          dispatch(
            setSignInReducer({ ...signIn, activeModal: allForms.otp.name })
          );
        } else {
          toastMessage("Error", res.data.message);
        }
      })
      .catch((err) => {
        console.log("ERR", err?.response?.data?.message);
        toastMessage("Error", err?.response?.data?.message);
      })
      .finally(() => {
        action?.setSubmitting(false);
      });
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
          placeholder="Enter your full name"
          type="text"
          value={values.fullname}
          error={touched.fullname && errors.fullname ? errors.fullname : ""}
          onChange={handleChange("fullname")}
        />
        <CustomInput
          placeholder="Enter your email"
          type="email"
          value={values.email}
          error={touched.email && errors.email ? errors.email : ""}
          onChange={handleChange("email")}
        />
        <CustomInput
          placeholder="Enter your username"
          type="text"
          value={values.username}
          error={touched.username && errors.username ? errors.username : ""}
          onChange={handleChange("username")}
        />
        <CustomInput
          placeholder="Password"
          type="password"
          value={values.password}
          error={touched.password && errors.password ? errors.password : ""}
          onChange={handleChange("password")}
          isPassword
        />
        <CustomInput
          placeholder="Confirm Password"
          type="password"
          value={values.confirmPassword}
          error={
            touched.confirmPassword && errors.confirmPassword
              ? errors.confirmPassword
              : ""
          }
          onChange={handleChange("confirmPassword")}
          isPassword
        />
        <CustomButton
          label="Sign up with email"
          customBtnContainer={classNames("w-100 mb-4")}
          //@ts-ignore
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
        />
        <div className={classNames(styles.divider, "mb-4")}>
          <label className={classNames(styles.dividerTxt)}>OR</label>
        </div>
        <SocialAuth handleClose={handleClose} />
        <label className={classNames(styles.btmText1, "mb-4 mt-2")}>
          Already have an account?{" "}
          <label
            className={classNames(styles.btmText2)}
            onClick={() =>
              dispatch(
                setSignInReducer({
                  ...signIn,
                  activeModal: allForms.signin.name,
                })
              )
            }
            role="button"
          >
            Sign In
          </label>
        </label>
      </form>
    </>
  );
};

export default SignUpForm;
