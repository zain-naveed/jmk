import { Icons, Images } from "assets";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import ShareSocialMediaLink from "shared/components/shareSocialMediaLink";
import { toastMessage } from "shared/components/toast";
import styles from "./style.module.scss";

interface ShareProps {
  showModal: boolean;
  handleShow: () => void;
  handleClose: () => void;
  handleSubmit?: () => void;
  reportText: string;
  link: string;
}

const Share: React.FC<ShareProps> = ({
  showModal,
  handleShow,
  handleClose,
  handleSubmit,
  reportText,
  link,
}) => {
  const [value, setValue] = useState<string>(link);

  useEffect(() => {
    if (link.length) {
      setValue(link);
    }
  }, [link]);

  const handleCopyToClipboard = () => {
    const textToCopy = value; 
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        handleSubmit?.();
        toastMessage("success", "Link copied");
      })
      .catch((error) => {
        console.error("Failed to copy text: ", error);
      });
  };

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      centered
      style={{
        background: "rgba(255, 255, 255, 0.95)",
      }}
      dialogClassName={styles.shareDialog}
      contentClassName={styles.content}
    >
      <div className={styles.closeIcon} onClick={handleClose}>
        <Icons.Cross />
      </div>

      <Modal.Body className={styles.modalBody}>
        <img
          src={Images.GroupShare}
          className={styles.groupImage}
          alt="group-img"
        />

        <p className={styles.titleText}>Share This {reportText}</p>
        <p className={styles.subTitle}>
          Share this {reportText.toLowerCase()} by copying share link and by
          your socials
        </p>

        <p className={styles.copyHeading}>Copy Share link</p>

        <div style={{ position: "relative" }}>
          <input value={value} disabled={true} className={styles.linkText} />
          <Icons.CopyText
            className={styles.copyIcon}
            onClick={handleCopyToClipboard}
          />
        </div>

        <div
          className={classNames("d-flex justify-content-between")}
          style={{ marginTop: "20px" }}
        >
          <p className={styles.shareSocial}>Share on your socials</p>

          <ShareSocialMediaLink link={value} />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Share;
