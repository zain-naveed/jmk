import classNames from "classnames";
import { Modal } from "react-bootstrap";
import SignInForm from "shared/forms/signInForm";
import SignUpForm from "shared/forms/signUpForm";
import { allForms } from "./constants";
import styles from "./style.module.scss";
import OTPForm from "shared/forms/otpForm";
import EmailVerifyForm from "shared/forms/emailVerifyForm";
import ResetPasswordForm from "shared/forms/resetPassword";
import { useDispatch } from "react-redux";
import { resetSignInReducer } from "shared/redux/reducers/sigInSlice";

interface SignInModalProps {
  show: boolean;
  activeModal: string;
}

const AuthModal = ({ show, activeModal }: SignInModalProps) => {
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(resetSignInReducer());
  };
  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      centered
      className={classNames("d-block d-sm-flex justify-content-center")}
      contentClassName={
        activeModal === allForms.otp.name ||
        activeModal === allForms.emailVerify.name ||
        activeModal === allForms.resetPassword.name
          ? styles.otpModalContent
          : styles.modalContent
      }
      dialogClassName={classNames(
        activeModal === allForms.signin.name
          ? styles.signinDailogContent
          : activeModal === allForms.signup.name
          ? styles.signupDailogContent
          : activeModal === allForms.otp.name
          ? styles.otpDailogContent
          : activeModal === allForms.emailVerify.name
          ? styles.emailDailogContent
          : activeModal === allForms.resetPassword.name
          ? styles.passwordDailogContent
          : null
      )}
      style={{ background: "rgba(255, 255, 255, 0.95)" }}
    >
      <Modal.Body
        className={classNames(
          activeModal === allForms.otp.name ||
            activeModal === allForms.emailVerify.name ||
            activeModal === allForms.resetPassword.name
            ? styles.otpModalContent
            : styles.modalContent,
          "px-4"
        )}
      >
        {activeModal === allForms.signin.name ? (
          <SignInForm handleClose={handleClose} />
        ) : activeModal === allForms.signup.name ? (
          <SignUpForm handleClose={handleClose} />
        ) : activeModal === allForms.otp.name ? (
          <OTPForm handleClose={handleClose} />
        ) : activeModal === allForms.emailVerify.name ? (
          <EmailVerifyForm handleClose={handleClose} />
        ) : activeModal === allForms.resetPassword.name ? (
          <ResetPasswordForm handleClose={handleClose} />
        ) : null}
      </Modal.Body>
    </Modal>
  );
};

export default AuthModal;
