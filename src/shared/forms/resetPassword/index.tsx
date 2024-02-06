import { Icons } from "assets";
import classNames from "classnames";
import { useFormik } from "formik";
import CustomButton from "shared/components/customButton";
import CustomInput from "shared/components/customInput";
import { toastMessage } from "shared/components/toast";
import { ResetPasswordVS } from "shared/utils/validations";
import styles from "./style.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { ResetPassword } from "shared/services/authService";
import { allForms } from "shared/modal/auth/constants";
import { setSignInReducer } from "shared/redux/reducers/sigInSlice";

interface InitialValues {
  password: string;
  confirmPassword: string;
}

interface AuthFormProps {
  handleClose: () => void;
}

const ResetPasswordForm = ({ handleClose }: AuthFormProps) => {
  const initialValues: InitialValues = {
    password: "",
    confirmPassword: "",
  };
  const dispatch = useDispatch();
  const { user, signIn } = useSelector((state: any) => state.root);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: ResetPasswordVS,
    onSubmit: (value, action) => {
      handleResetPassword(value, action);
    },
  });
  const { handleChange, handleSubmit, values, touched, errors, isSubmitting } =
    formik;

  const handleResetPassword = (values: InitialValues, action?: any) => {
    action.setSubmitting(true);
    let formData = new FormData();
    formData.append("email", user?.user?.email);
    formData.append("otp", user?.user?.otp);
    formData.append("password", values.password);
    formData.append("password_confirmation", values.confirmPassword);
    ResetPassword(formData)
      .then(() => {
        toastMessage("success", "Password Changed Successfully");
        dispatch(
          setSignInReducer({ ...signIn, activeModal: allForms.signin.name })
        );
      })
      .catch((err) => {
        console.log("ERR", err?.response?.data?.message);
        toastMessage("Error", err?.response?.data?.message);
      })
      .finally(() => {
        action.setSubmitting(false);
      });
  };
  return (
    <>
      <div
        className={classNames(
          "d-flex align-items-center justify-content-end mt-2"
        )}
      >
        <Icons.Cross
          onClick={() => {
            handleClose();
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
          Create New Password
        </label>
        <label className={classNames(styles.headText)}>
          Please enter your new password credentials.
        </label>

        <div className="position-relative w-100 mt-4">
          <CustomInput
            placeholder="New Password"
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
        </div>
        <CustomButton
          label="Update Password"
          customBtnContainer={classNames("w-100 mb-4")}
          onClick={() => handleSubmit()}
          loading={isSubmitting}
          disabled={isSubmitting}
        />
      </form>
    </>
  );
};

export default ResetPasswordForm;
