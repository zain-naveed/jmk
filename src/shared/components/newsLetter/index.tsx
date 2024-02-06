import classNames from "classnames";
import CustomButton from "../customButton";
import CustomInput from "../customInput";
import styles from "./style.module.scss";
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
      name: values?.name
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
    <div className={classNames(styles.container, " d-flex flex-column align-items-start justify-content-start gap-3 w-100")}>
      <label className={classNames(styles.title)}>Newsletter</label>
      <label className={classNames(styles.title)} style={{ color: "black" }}>
        Stay in the Know !
      </label>
      <form
        className={classNames("d-flex flex-column w-100")}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="position-relative w-100">
          <CustomInput placeholder="Enter your name" type="name" value={values.name} error={touched.name && errors.name ? errors.name : ""} onChange={handleChange("name")} />
          <CustomInput placeholder="Enter your email" type="email" value={values.email} error={touched.email && errors.email ? errors.email : ""} onChange={handleChange("email")} />
        </div>
        <CustomButton label="Subscribe" customBtnContainer={classNames("w-100")} onClick={() => handleSubmit()} loading={isSubmitting} disabled={isSubmitting} />
      </form>
    </div>
  );
};

export default NewsLetter;
