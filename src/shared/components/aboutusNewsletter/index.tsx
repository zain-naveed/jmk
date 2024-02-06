import classNames from "classnames";
import CustomInput from "../customInput";
import styles from "./style.module.scss";
import CustomButton from "../customButton";
import { useFormik } from "formik";
import { EmailVerifyVS } from "shared/utils/validations";
import { NewsLetterApi } from "shared/services/generalService";
import { toastMessage } from "../toast";
import { useNavigate } from "react-router";
import { routeConstant } from "shared/routes/routeConstant";

interface InitialValues {
  email: string;
  name: string;
}

interface NewsletterProp {
  landing: boolean;
}

const AboutUsNewsLetter = ({ landing }: Partial<NewsletterProp>) => {
  const navigate = useNavigate();
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
  const { handleChange, handleSubmit, values, touched, errors, isSubmitting } =
    formik;

  const handleNewsLetter = (values: InitialValues, action?: any) => {
    let params = {
      email: values.email,
      name: values?.name,
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
    <div
      className={classNames(
        styles.contactContainer,
        "d-flex align-items-center justify-content-center flex-column py-5 px-3 px-sm-5"
      )}
    >
      {landing && (
        <label className={styles.landingNewsTitle}>
          Subscribe To Newsletter
        </label>
      )}
      <label className={classNames(styles.newsTitle, !landing && "pt-5")}>
        {landing
          ? "Stay Tuned For The Official Launch Of Our Platform"
          : "Sign up for our newsletter"}
      </label>
      {!landing && (
        <label className={classNames(styles.newsSubTitle)}>
          Be the first to know about releases and industry news and insights.
        </label>
      )}
      <form
        onSubmit={(e) => e.preventDefault()}
        className={classNames(
          " mt-4 gap-0 gap-sm-4 pb-5 flex-column flex-sm-row align-items-center align-items-sm-start"
        )}
      >
        <div
          className={classNames(
            "d-flex align-items-start flex-column mb-3 mb-sm-0"
          )}
        >
          <CustomInput
            placeholder="Enter your name"
            required
            type="name"
            value={values.name}
            customContainer={classNames(styles.newsletterInput)}
            onChange={handleChange("name")}
            error={touched.name && errors.name ? errors.name : ""}
            margin={touched.name && errors.name ? "mb-0" : "mb-2"}
          />
          <CustomInput
            placeholder="Enter your email"
            required
            type="email"
            value={values.email}
            customContainer={classNames(styles.newsletterInput)}
            onChange={handleChange("email")}
            error={touched.email && errors.email ? errors.email : ""}
            margin={touched.email && errors.email ? "mb-0" : "mb-2"}
          />

          <CustomButton
            label="Subscribe"
            onClick={() => handleSubmit()}
            loading={isSubmitting}
            disabled={isSubmitting}
            customBtnContainer={styles.subscribeButton}
          />
          <label className={classNames(styles.btmLabel, "ms-2 mt-2")}>
            We care about your data in our{" "}
            <label
              className={classNames(styles.prvLabel)}
              onClick={() => navigate(routeConstant.privacy.path)}
            >
              privacy policy
            </label>
          </label>
        </div>
      </form>
    </div>
  );
};

export default AboutUsNewsLetter;
