import classNames from "classnames";
import { useFormik } from "formik";
import CustomButton from "shared/components/customButton";
import CustomInput from "shared/components/customInput";
import { toastMessage } from "shared/components/toast";
import { changePasswordVS } from "shared/utils/validations";
import styles from "./style.module.scss";
import { UpdatePassword } from "shared/services/userService";
import { useState } from "react";

interface InitialValues {
  old_password: string;
  password: string;
  password_confirmation: string;
}

const EditPasswordForm = () => {
  const [loader, setLoader] = useState<boolean>(false);
  const initialValues: InitialValues = {
    old_password: "",
    password: "",
    password_confirmation: "",
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: changePasswordVS,
    onSubmit: (value) => {
      handleEditProfile(value);
    },
  });

  const { handleChange, handleSubmit, values, touched, errors } = formik;

  const handleEditProfile = (values: InitialValues, action?: any) => {
    setLoader(true);
    UpdatePassword({ ...values })
      .then(({ data: { data, message } }) => {
        setLoader(false);
        toastMessage("success", message);
        handleCancel();
      })
      .catch((err) => {
        setLoader(false);
        console.log("ERR", err?.response?.data?.message);
        toastMessage("Error", err?.response?.data?.message);
      });
  };

  const handleCancel = () => {
    formik.resetForm({ values: initialValues });
  };

  return (
    <div
      className={classNames(
        "d-flex col-12 col-sm-11 col-md-10 col-lg-8 col-xl-7 my-5 flex-column align-items-center justify-content-center  py-4 px-4",
        styles.topLevelContainer
      )}
    >
      <label className={classNames(styles.titleLabel, "mb-3")}>
        Change Password
      </label>
      <div
        className={classNames(
          "w-100 d-flex align-items-start flex-column gap-1"
        )}
      >
        <label className={classNames(styles.inputLabel)}>
          Current Password
        </label>
        <CustomInput
          isPassword
          placeholder="••••••••"
          type="password"
          value={values.old_password}
          error={
            touched.old_password && errors.old_password
              ? errors.old_password
              : ""
          }
          onChange={handleChange("old_password")}
        />
      </div>
      <div
        className={classNames(
          "w-100 d-flex align-items-start flex-column gap-1"
        )}
      >
        <label className={classNames(styles.inputLabel)}>New Password</label>
        <CustomInput
          isPassword
          placeholder="••••••••"
          type="password"
          value={values.password}
          error={touched.password && errors.password ? errors.password : ""}
          onChange={handleChange("password")}
        />
      </div>
      <div
        className={classNames(
          "w-100 d-flex align-items-start flex-column gap-1"
        )}
      >
        <label className={classNames(styles.inputLabel)}>
          Confirm New Password
        </label>
        <CustomInput
          isPassword
          placeholder="••••••••"
          type="password"
          value={values.password_confirmation}
          error={
            touched.password_confirmation && errors.password_confirmation
              ? errors.password_confirmation
              : ""
          }
          onChange={handleChange("password_confirmation")}
        />
      </div>
      <div
        className={classNames("d-flex align-items-center gap-3 align-self-end")}
      >
        <CustomButton
          label="Cancel"
          customBtnContainer={classNames(styles.cancelBtn)}
          onClick={handleCancel}
        />
        <CustomButton
          label="Save Changes"
          customBtnContainer={classNames(styles.saveBtn)}
          onClick={() => {
            handleSubmit();
          }}
          loading={loader}
        />
      </div>
    </div>
  );
};

export default EditPasswordForm;
