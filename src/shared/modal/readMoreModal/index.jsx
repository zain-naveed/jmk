import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import styles from "./style.module.scss"
import CustomButton from 'shared/components/customButton';
import { Icons } from 'assets';
import { useNavigate } from 'react-router';
import { routeConstant } from 'shared/routes/routeConstant';
import classNames from 'classnames';

function Example({ show, handleClose, item }) {
  const navigate = useNavigate();

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        centered
      >
        <Modal.Header closeButton className={styles.header}>
          <Modal.Title>Challenge</Modal.Title>
        </Modal.Header>
        <Modal.Body>{item?.challenge}</Modal.Body>
        <Modal.Footer className={styles.footer}>
          <div style={{ display: "flex", width: "100%" }}>
            <CustomButton
              label="Details"
              style2
              onClick={(e) => {
                e.stopPropagation();
                navigate(routeConstant.art.path.replace(":id", item?.id));
              }}
              customBtnContainer={classNames(styles.btnContainer, styles.route, "gap-1 gap-sm-0")}
              customIconStyle={classNames(styles.btnIcon)}
            />
            <CustomButton
              label="Close"
              style2
              onClick={(e) => {
                handleClose();
              }}
              customBtnContainer={classNames(styles.btnContainer, "gap-1 gap-sm-0")}
              customIconStyle={classNames(styles.btnIcon)}
            />
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Example;