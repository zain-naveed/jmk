import { Icons } from "assets";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import CustomButton from "shared/components/customButton";
import { toastMessage } from "shared/components/toast";
import styles from "./style.module.scss";

interface ShareProps {
  showModal: boolean;
  handleShow: () => void;
  handleClose: () => void;
  handleSubmit: (type: any, reason: string) => void;
  reportText: string;
  loader: boolean;
}

const options = [
  { label: "Spam", value: "option1" },
  { label: "Harassment", value: "option2" },
  { label: "Rules Violation", value: "option3" },
  { label: "Other", value: "option4" },
];

const ReportModal = ({
  showModal,
  handleShow,
  handleClose,
  handleSubmit,
  reportText,
  loader,
}: Partial<ShareProps>) => {
  const [selectedOption, setSelectedOption] = useState<string>(
    options.length ? options[0].label : ""
  );
  const [text, setText] = useState<string>("");
  const [showTextField, setShowTextField] = useState<boolean>(false);

  const handleOptionChange = (value: string, label: string) => {
    setSelectedOption(label);

    if (value === "option4") {
      setShowTextField(true);
    } else {
      setShowTextField(false);
    }
  };

  const onClose = () => {
    setShowTextField(false);
    setText("");

    setSelectedOption(options.length ? options[0].label : "");
    if (handleClose) {
      handleClose();
    }
  };

  const handleReport = async () => {
    if (selectedOption === "Other" && text.length === 0) {
      toastMessage("error", "Type something in report description");
    } else {
      if (handleSubmit) {
        await handleSubmit(
          reportText === "Art"
            ? 1
            : reportText === "Story"
            ? 3
            : reportText === "Comment"
            ? 2
            : reportText === "User"
            ? 4
            : null,
          selectedOption !== "Other" ? selectedOption : text
        );
        setText("");
        setSelectedOption(options.length ? options[0].label : "");
        setShowTextField(false);
      }
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
      onHide={onClose}
      centered
      style={{
        background: "rgba(255, 255, 255, 0.95)",
      }}
      dialogClassName={styles.reportDialog}
      contentClassName={styles.content}
    >
      <Modal.Body style={{ padding: "0px" }}>
        <Icons.ReportIcon />
        <p className={styles.labelText}>Report {reportText}</p>
        <div>
          {options.map((type) => (
            <div key={`inline-${type.value}`} className="mb-2">
              <Form.Check
                inline
                label={type.label}
                name="group1"
                type="radio"
                id={`inline-${type.value}-1`}
                onChange={() => handleOptionChange(type.value, type.label)}
                checked={selectedOption === type.label}
                className={styles.radioCheckbox}
              />
            </div>
          ))}
        </div>

        {showTextField ? (
          <textarea
            style={{ resize: "none" }}
            className={styles.textAreaComp}
            value={text}
            onChange={(e: any) => setText(e.target.value)}
            placeholder="Write your reason here..."
          />
        ) : (
          ""
        )}

        <div className={classNames("d-flex mt-4 gap-3")}>
          <CustomButton
            label="Cancel"
            customBtnContainer={styles.cancelButton}
            onClick={handleClose}
          />

          <CustomButton
            label="Report"
            onClick={handleReport}
            customBtnContainer={styles.reportButton}
            loading={loader}
          />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ReportModal;
