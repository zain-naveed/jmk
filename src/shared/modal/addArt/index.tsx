import { Icons, Images } from "assets";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { Button, Modal, Row, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import CustomTagInput from "shared/components/customTagInput";
import { toastMessage } from "shared/components/toast";
import UploadImageButton from "shared/components/uploadImage";
import { CreateArt, UpdateArt } from "shared/services/artsService";
import CommonModal from "../commonModal";
import { modals } from "../commonModal/constants";
import styles from "./style.module.scss";

interface AddArtProps {
  show: boolean;
  handleClose: () => void;
  artDetail: any;
  update: boolean;
  getArt: any;
  handleOpen: () => void;
  handleAddArt: any;
}

const AddArt = ({
  show,
  handleClose,
  artDetail,
  update,
  getArt,
  handleOpen,
  handleAddArt,
}: Partial<AddArtProps>) => {
  const location = useLocation();
  const { user } = useSelector((state: any) => state.root);
  const [titleArt, setTitleArt] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [hashtags, setHashTags] = useState<string[]>([]);
  const [image, setImage] = useState<any>({ preview: "", raw: "" });
  const [loader, setLoader] = useState<boolean>(false);
  const [showTerms, setShowTerms] = useState<boolean>(false);
  const [isSample, setIsSample] = useState<boolean>(true);
  const [imagePath, setImagePath] = useState<string>("");
  const [percentage, setPercentage] = useState<number>(0);
  const [activeModal, setActiveModal] = useState<string>(modals.terms.name);

  const [saveCoverPic, setsaveCoverPic] = useState<any>(null);

  const navigate = useNavigate();
  const setFieldValue = (key: any, value: any) => {
    setHashTags(value);
  };

  const onClose = () => {
    setIsSample(true);
    setText("");
    setTitleArt("");
    setLoader(false);
    setHashTags([]);
    handleClose?.();
    setImage({ preview: "", raw: "" });
  };

  const handleShowCommonModal = () => {
    setActiveModal(modals.terms.name);
    setShowTerms(true);
  };

  const handleCloseCommonModal = () => {
    setShowTerms(false);
  };

  const handleSubmit = async () => {
    setLoader(true);
    let resp: any = {
      title: titleArt,
      description: text,
      // tags: JSON.stringify(hashtags),
    };

    if (hashtags.length) {
      resp["tags"] = JSON.stringify(hashtags);
    }

    if (!image?.preview?.startsWith("http")) {
      // resp["image"] = image.raw;
      resp["image"] = imagePath;
    }

    let formBody = new FormData();
    Object.keys(resp).forEach((key) => {
      formBody.append(key, resp[key]);
    });
    formBody.append("cover_image", saveCoverPic);

    if (!update) {
      await CreateArt(formBody)
        .then(({ data: { data, message } }) => {
          setLoader(false);
          onClose();
          // setActiveModal(modals.approval.name);
          toastMessage("success", message);
          handleAddArt?.(data);
          if (location.pathname.startsWith("/mypost")) {
            navigate(`/mypost`, {
              state: { art: { ...data, user: user?.user } },
            });
          }
        })
        .catch((err) => {
          setLoader(false);
          console.log("ERR", err);
          toastMessage("Error", err);
        });
    } else {
      await UpdateArt(formBody, artDetail?.id)
        .then(({ data: { data, message } }) => {
          setLoader(false);
          onClose();
          toastMessage("success", message);
          if (location.pathname.startsWith("/mypost")) {
            navigate(`/mypost`, {
              state: { updateArt: { ...data, user: user?.user } },
            });
          }
        })
        .catch((err) => {
          setLoader(false);
          console.log("ERR", err);
          toastMessage("Error", err);
        });
    }
  };

  const handleCancel = () => {
    if (handleOpen) {
      handleOpen();
    }
    handleCloseCommonModal();
  };

  const handleArtCreation = () => {
    handleClose?.();
    handleShowCommonModal();
  };

  const handleSample = () => {
    setLoader(true);
    setTimeout(() => {
      setIsSample(false);
      setLoader(false);
      var elem: any = document.getElementById("topScroll");
      elem.scrollTop = 0;
    }, 300);
  };

  useEffect(() => {
    if (artDetail) {
      const { title, description, tags, full_image_path } = artDetail;
      setTitleArt(title || "");
      setText(description || "");
      setHashTags(tags?.map((tag: any) => tag.title));
      setImage({ preview: full_image_path || "", raw: "" });
      setIsSample(!update ? true : false);
    }
    // eslint-disable-next-line
  }, [show]);

  return (
    <>
      <Modal
        show={show}
        onHide={onClose}
        centered
        className={classNames(styles.modalBackground)}
        style={{ background: "rgba(255, 255, 255, 0.95)" }}
        contentClassName={styles.content}
        dialogClassName={styles.addArtModal}
        backdrop="static"
        id="topScroll"
      >
        <Modal.Body className={classNames(styles.modalBody)}>
          {!isSample ? (
            <>
              <div className={classNames(styles.addArtLabel, "d-flex")}>
                <label className={styles.labelAddArt}>Post an Art</label>
                <Icons.Cross className={styles.cross} onClick={onClose} />
              </div>
              <Row style={{ marginTop: "49px" }}>
                <div style={{ marginBottom: "3%" }}>
                  <CustomTagInput
                    setFieldValue={setFieldValue}
                    tags={hashtags}
                    title="Tag"
                  />
                </div>
              </Row>

              <div
                className={
                  image?.preview
                    ? classNames(
                        styles.uploadedImageContainer,
                        styles.uploadImageContainer
                      )
                    : classNames(styles.uploadImageContainer)
                }
              >
                <UploadImageButton
                  image={image}
                  setImage={setImage}
                  update={update ? true : false}
                  setImagePath={setImagePath}
                  percentage={percentage}
                  setPercentage={setPercentage}
                  setsaveCoverPic={setsaveCoverPic}
                />
              </div>

              <input
                value={titleArt}
                placeholder="What’s your title?"
                className={classNames(styles.headlineInput, "px-3 mb-0")}
                onChange={(e: any) => setTitleArt(e.target.value)}
                maxLength={80}
              />

              <textarea
                style={{ resize: "none" }}
                className={styles.textAreaComp}
                value={text}
                onChange={(e: any) => setText(e.target.value)}
                placeholder="Enter description..."
              />
              <p className={styles.textAreaLength}>
                {text?.length} characters added.
              </p>

              <Button
                className={
                  titleArt?.length && text?.length && image?.preview
                    ? styles.publishButton
                    : classNames(styles.disabledButton, styles.publishButton)
                }
                disabled={
                  titleArt?.length && text?.length && image?.preview?.length
                    ? false
                    : true
                }
                onClick={update ? handleSubmit : handleArtCreation}
              >
                {loader ? (
                  <Spinner
                    size="sm"
                    animation="border"
                    style={{ color: "black" }}
                  />
                ) : (
                  "Publish Art"
                )}
              </Button>
            </>
          ) : (
            <>
              <div className={classNames(styles.addArtLabel, "d-flex")}>
                <label className={styles.labelAddArt}>Post an Art!</label>
                <Icons.Cross className={styles.cross} onClick={onClose} />
              </div>
              <div className={styles.sampleDiv}>
                <img
                  src={Images.Art}
                  className={styles.sampleImg}
                  alt="cover"
                />
                <p className={styles.sampleHeading}>
                  5 Ways Women Sabotage Their Own Success -{" "}
                  <span> Sample Art</span>
                </p>
                <p className={styles.sampleSubHeading}>
                  Whether you are an AI enthusiast, a tech professional, or
                  simply someone who wants to stay ahead of the curve, these
                  posts will provide you with valuable insights into the latest
                  developments in the world of artificial intelligence.Whether
                  you are an AI enthusiast, a tech professional...
                </p>
                <Button
                  className={styles.sampleButton}
                  onClick={() => handleSample()}
                >
                  {!loader ? (
                    "Upload Artwork"
                  ) : (
                    <Spinner
                      style={{
                        width: "20px",
                        height: "20px",
                        fontSize: "10px",
                        color: "black",
                      }}
                    />
                  )}
                </Button>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
      <CommonModal
        show={showTerms}
        handleClose={handleCloseCommonModal}
        activeModal={activeModal}
        termsModalText={"art"}
        loading={loader}
        handleAction={async () => await handleSubmit()}
        handleCancelArt={handleOpen ? handleCancel : () => {}}
        nextModal={!update ? modals.approval.name : null}
      />
    </>
  );
};

export default AddArt;
