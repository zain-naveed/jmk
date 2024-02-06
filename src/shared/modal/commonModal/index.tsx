import classNames from "classnames";
import { Modal } from "react-bootstrap";
import ApprovalPopup from "shared/popUps/approval";
import SuccessPopup from "shared/popUps/success";
import TermsPopup from "shared/popUps/terms";
import WinnerPopup from "shared/popUps/winner";
import { modals } from "./constants";
import styles from "./style.module.scss";

interface CommonModalProps {
  show: boolean;
  handleClose: () => void;
  handleAction: () => void;
  activeModal: string;
  setActiveModal: (val: string) => void;
  handleShowPostModal: () => void;
  nextModal: any;
  amount: number;
  loading: boolean;
  termsModalText: string;
  handleCancelArt: () => void;
  userID: any;
}

const CommonModal = ({ show, handleClose, handleAction, activeModal, setActiveModal, handleShowPostModal, nextModal, amount, loading, termsModalText, handleCancelArt, userID }: Partial<CommonModalProps>) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      centered
      className={classNames("d-block d-sm-flex justify-content-center")}
      contentClassName={activeModal === modals.success.name ? styles.successModalContent : styles.modalContent}
      dialogClassName={classNames(activeModal === modals.terms.name ? styles.termsDailogContent : activeModal === modals.approval.name ? styles.approvalDailogContent : activeModal === modals.success.name ? styles.successDailogContent : activeModal === modals.winner.name ? styles.winnerDailogContent : null)}
      style={{ background: "rgba(255, 255, 255, 0.95)" }}
    >
      <Modal.Body className={classNames(activeModal === modals.success.name ? styles.successModalContent : styles.modalContent, "px-4 py-4")}>
        {activeModal === modals.terms.name ? (
          <TermsPopup
            handleClose={() => {
              handleClose?.();
              handleShowPostModal?.();
            }}
            handleAction={async () => {
              await handleAction?.();
              if (termsModalText !== "art") {
                setActiveModal?.(nextModal);
              }
              handleClose?.();
            }}
            loading={loading}
            termsModalText={termsModalText}
            handleCancelArt={
              handleCancelArt
                ? () => handleCancelArt?.()
                : () => {
                    handleClose?.();
                    handleShowPostModal?.();
                  }
            }
          />
        ) : activeModal === modals.approval.name ? (
          <ApprovalPopup
            handleClose={() => {
              handleClose?.();
            }}
            termsModalText={termsModalText}
          />
        ) : activeModal === modals.winner.name ? (
          <WinnerPopup
            handleClose={() => {
              handleClose?.();
            }}
          />
        ) : activeModal === modals.success.name ? (
          <SuccessPopup
            handleClose={() => {
              handleClose?.();
            }}
            amount={amount}
            id={userID}
          />
        ) : null}
      </Modal.Body>
    </Modal>
  );
};

export default CommonModal;
