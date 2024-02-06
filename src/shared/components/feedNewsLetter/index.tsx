import classNames from "classnames";
import styles from "./style.module.scss";
import { Icons } from "assets";
import CustomInput from "../customInput";
import CustomButton from "../customButton";
import { useFormik } from "formik";
import { EmailVerifyVS } from "shared/utils/validations";
import { NewsLetterApi } from "shared/services/generalService";
import { toastMessage } from "../toast";

interface InitialValues {
  email: string;
  name: string;
}

const NewsLetter = () => {
  const initialValues: InitialValues = {
    email: "",
    name:""
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
  const { handleChange, handleSubmit, values, touched, errors, isSubmitting } =
    formik;

  const handleNewsLetter = (values: InitialValues, action?: any) => {
    let params = {
      email: values.email,
      name: values.name
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
        console.log("Error", err?.response?.data?.message);
        toastMessage("error", err?.response?.data?.message);
      })
      .finally(() => {
        action.setSubmitting(false);
      });
  };

  return (
    <div
      className={classNames(
        "py-5 d-flex flex-column align-items-center justify-content-center  w-100 position-relative"
      )}
    >
      <div className={classNames(styles.iconContainer)}>
        <Icons.EmailMarketing className={classNames(styles.iconStyle)} />
      </div>

      <label className={classNames(styles.title, "mt-4")}>
        Sign up for our newsletter
      </label>
      <label className={classNames(styles.subTitle)}>
        Be the first to know about releases and industry news and insights.
      </label>
      <div
        className={classNames(
          "d-flex flex-column w-100 position-relative mt-3"
        )}
      >
        <CustomInput
          placeholder="Name"
          type="name"
          value={values.name}
          error={touched.name && errors.name ? errors.name : ""}
          onChange={handleChange("name")}
        />
        <CustomInput
          placeholder="Enter your email"
          type="email"
          value={values.email}
          error={touched.email && errors.email ? errors.email : ""}
          onChange={handleChange("email")}
        />
      </div>

      <CustomButton
        label="Subscribe"
        customBtnContainer={classNames("w-100")}
        onClick={() => handleSubmit()}
        loading={isSubmitting}
        disabled={isSubmitting}
      />
      <div className={classNames(styles.btmBorder)} />
    </div>
  );
};

export default NewsLetter;
