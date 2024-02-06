import classNames from "classnames";
import styles from "./style.module.scss";
import { Icons } from "assets";
import CustomButton from "shared/components/customButton";
import { useFormik } from "formik";
import { EmailVerifyVS } from "shared/utils/validations";
import { NewsLetterApi } from "shared/services/generalService";
import { toastMessage } from "shared/components/toast";

interface InitialValues {
  email: string;
  name: string;
}

const ProfileNewsLetter = () => {
  const initialValues: InitialValues = {
    email: "",
    name: "",
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: EmailVerifyVS,
    onSubmit: (value, action) => {
      action.setSubmitting(true);
      handleNewsLetter(value, action);
    },
  });
  const { handleChange, handleSubmit, values, touched, errors, isSubmitting } = formik;

  const handleNewsLetter = (values: InitialValues, action?: any) => {
    let params = {
      email: values.email,
    };
    NewsLetterApi(params)
      .then(({ data: { data, message, status } }) => {
        if (status) {
          toastMessage("success", message);
        } else {
          toastMessage("error", message);
        }
      })
      .catch((err) => {
        console.log("Error", err);
        toastMessage("error", err?.response?.data?.message);
      })
      .finally(() => {
        action.setSubmitting(false);
      });
  };
  return (
    <div className={classNames(styles.newsLetterContainer, "d-flex align-items-center justify-content-center px-4 py-5  mt-4 mt-sm-5 gap-4 flex-column flex-md-row")}>
      <div className={classNames(styles.iconContainer)}>
        <Icons.EmailMarketing className={classNames(styles.icon)} />
      </div>
      <div className={classNames("d-flex align-items-start justify-content-center flex-column gap-3", styles.contentContainer)}>
        <div className={classNames("d-flex align-items-start justify-content-center flex-column ")}>
          <label className={classNames(styles.title)}>Stay in the Know !</label>
          <label className={classNames(styles.subTitle)}>Be the first to know about releases and industry news and insights.</label>
        </div>

        <div className={classNames(styles.inputContainer, "d-flex align-items-center px-1 position-relative")}>
          <input className={classNames(styles.inputStyle, "px-3")} placeholder="Enter your name" type="name" value={values.name} onChange={handleChange("name")} />
          <input className={classNames(styles.inputStyle, "px-3")} placeholder="Enter your email" type="email" value={values.email} onChange={handleChange("email")} />

          <CustomButton label="Subscribe" customBtnContainer={classNames(styles.btnContainer)} onClick={() => handleSubmit()} loading={isSubmitting} disabled={isSubmitting} />
          {touched.email && errors.email && <div className={classNames(styles.error)}>{touched.email && errors.email}</div>}
        </div>
      </div>
    </div>
  );
};

export default ProfileNewsLetter;
