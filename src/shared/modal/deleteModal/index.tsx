import { Icons } from "assets";
import classNames from "classnames";
import { useEffect } from "react";
import { Modal } from "react-bootstrap";
import CustomButton from "shared/components/customButton";
import styles from "./style.module.scss";

interface DeleteModalProps {
  showModal: boolean;
  handleShow: () => void;
  handleClose: () => void;
  handleSubmit: () => void;
  loader: boolean;
}

const DeleteModal = ({
  showModal,
  handleShow,
  handleClose,
  handleSubmit,
  loader,
}: Partial<DeleteModalProps>) => {
  const handleDelete = () => {
    if (handleSubmit) {
      handleSubmit();
    }
  };

  useEffect(() => {
    if (handleClose && !loader) {
      handleClose();
    }
    // eslint-disable-next-line
  }, [loader]);

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      centered
      dialogClassName={styles.deleteDialog}
      contentClassName={styles.content}
      style={{
        background: "rgba(255, 255, 255, 0.95)",
      }}
      animation={false}
    >
      <Modal.Body className={styles.modalBody}>
        <Icons.ReportIcon />
        <div>
          <label className={styles.labelText}>
            Are you sure you want to delete?
          </label>
        </div>

        <div className={classNames("d-flex")}>
          <CustomButton
            customBtnContainer={styles.cancelButton}
            onClick={handleClose}
            label="Cancel"
          />
          <CustomButton
            customBtnContainer={styles.deleteButton}
            onClick={handleDelete}
            label="Delete"
            loading={loader}
            disabled={loader}
            spinnerColor="white"
          />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteModal;
