import { Icons } from "assets";
import classNames from "classnames";
import styles from "./style.module.scss";
import CustomButton from "shared/components/customButton";
import CustomInput from "shared/components/customInput";
import { useFormik } from "formik";
import { EmailVerifyVS } from "shared/utils/validations";
import { setUser } from "shared/redux/reducers/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { allForms } from "shared/modal/auth/constants";
import { SendOtp } from "shared/services/authService";
import { toastMessage } from "shared/components/toast";
import { setSignInReducer } from "shared/redux/reducers/sigInSlice";

interface InitialValues {
  email: string;
}

interface AuthFormProps {
  handleClose: () => void;
}

const EmailVerifyForm = ({ handleClose }: AuthFormProps) => {
  const initialValues: InitialValues = {
    email: "",
  };
  const dispatch = useDispatch();
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: EmailVerifyVS,
    onSubmit: (value, action) => {
      handleEmailVerify(value, action);
    },
  });
  const { signIn } = useSelector((state: any) => state.root);
  const { handleChange, handleSubmit, values, touched, errors, isSubmitting } = formik;

  const handleEmailVerify = (values: InitialValues, action?: any) => {
    action.setSubmitting(true);
    let formData = new FormData();
    formData.append("email", values.email);
    SendOtp(formData)
      .then((res) => {
        if (res?.data?.data?.sent === true) {
          toastMessage("success", "Otp Sent to your email.");
          dispatch(
            setUser({
              user: {
                email: values.email,
              },
            }),
          );
          dispatch(setSignInReducer({ ...signIn, activeModal: allForms.otp.name }));
        } else {
          toastMessage("Error", res.data.message);
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
  return (
    <>
      <div className={classNames("d-flex align-items-center justify-content-end mt-2")}>
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
          if (formik?.values?.email) {
            handleEmailVerify(formik?.values, formik);
          }
        }}
      >
        <Icons.Logo className={classNames(styles.logo)} />
        <label className={classNames(styles.heading, "mt-4")}>Email Address</label>
        <label className={classNames(styles.headText)}>Please enter your email address below, we’ll send you a 4-digit code to update your password.</label>

        <div className="position-relative w-100 mt-4">
          <CustomInput placeholder="Enter your email" type="email" value={values.email} error={touched.email && errors.email ? errors.email : ""} onChange={handleChange("email")} />
        </div>
        <CustomButton label="Send Code" customBtnContainer={classNames("w-100 mb-4")} onClick={() => handleSubmit()} loading={isSubmitting} disabled={isSubmitting} />
      </form>
    </>
  );
};

export default EmailVerifyForm;
