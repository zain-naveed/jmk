import classNames from "classnames";
import { useFormik } from "formik";
import { useState } from "react";
import { useSelector } from "react-redux";
import AboutUsNewsLetter from "shared/components/aboutusNewsletter";
import CustomButton from "shared/components/customButton";
import CustomInput from "shared/components/customInput";
import CustomRichTextEditor from "shared/components/customRichTextEditor";
import Footer from "shared/components/footer";
import HeaderSection from "shared/components/headerSection";
import NavWrapper from "shared/components/navWrapper";
import { toastMessage } from "shared/components/toast";
import { ContactUsService } from "shared/services/landingService";
import { ContactUsVS } from "shared/utils/validations";
import styles from "./style.module.scss";

interface InitialValues {
  email: string;
  name: string;
  description: string;
}

const ContactUs = () => {
  const { user } = useSelector((state: any) => state.root);
  const initialValues: InitialValues = {
    email: user?.user?.email ? user?.user?.email : "",
    name: user?.user?.name ? user?.user?.name : "",
    description: "",
  };
  const [loader, setLoader] = useState<boolean>(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: ContactUsVS,
    onSubmit: (value) => {
      handleRequest(value);
    },
  });
  const { handleChange, handleSubmit, values, touched, errors, resetForm } = formik;

  const handleRequest = (values: InitialValues, action?: any) => {
    setLoader(true);
    ContactUsService({ ...values })
      .then(({ data: { data, message } }) => {
        toastMessage("success", message);
      })
      .catch((err) => {
        console.log("er", err);
      })
      .finally(() => {
        setLoader(false);
        resetForm();
      });
  };

  return (
    <div className={classNames(styles.topMainContainer)}>
      <NavWrapper />
      <HeaderSection
        title="Need something cleared up?"
        subtitle="Here are our most frequently asked questions.."
        // highlightedText="Support 24/7"
        displayHighlightedText={true}
      />

      <>
        <div className={classNames(styles.customContainer, "d-flex px-3 px-sm-0 py-5  align-items-center justify-content-center")}>
          <form
            className={classNames(styles.requestContainer, "col-12 col-md-10 col-lg-8 d-flex flex-column p-3")}
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className={classNames("d-flex align-items-center justify-content-between")}>
              <label className={classNames(styles.crossLabel)}>Submit a request</label>
            </div>
            <div className={classNames("d-flex d-flex flex-sm-row flex-column align-items-center gap-sm-3 gap-0 mt-4")}>
              <div className={classNames("d-flex flex-column w-100 ")}>
                <label className={classNames(styles.requestInputLabel, "mb-1")}>Your email address</label>
                <CustomInput type="email" value={values.email} error={touched.email && errors.email ? errors.email : ""} onChange={handleChange("email")} />
              </div>
              <div className={classNames("d-flex flex-column w-100")}>
                <label className={classNames(styles.requestInputLabel, "mb-1")}>Your JMK Name</label>
                <CustomInput type="text" value={values.name} error={touched.name && errors.name ? errors.name : ""} onChange={handleChange("name")} />
              </div>
            </div>
            <label className={classNames(styles.requestInputLabel, "mb-1")}>Description</label>
            <CustomRichTextEditor value={values.description} error={touched.description && errors.description ? errors.description : ""} onChange={handleChange("description")} placeholder="leave comment or question here" />
            <CustomButton label="Submit" customBtnContainer={classNames("w-100 mb-2")} onClick={() => handleSubmit()} loading={loader} />
          </form>
        </div>

        <AboutUsNewsLetter />
      </>
      <Footer />
    </div>
  );
};

export default ContactUs;
