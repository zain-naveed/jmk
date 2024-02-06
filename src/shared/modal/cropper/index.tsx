import { Icons } from "assets";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Cropper from "react-easy-crop";
import CustomButton from "shared/components/customButton";
import getCroppedImg from "./cropImage";
import "./cropper.css";
import styles from "./style.module.scss";
interface ModalProps {
  show: boolean;
  handleClose: () => void;
  coverPic: any;
  setSaveCoverPic: any;
  setPercentage: (val: any) => void;
  setImage: (val: any) => void;
  handleProgressBar: (val: any) => void;
  coverFile: any;
}

function CropperModal(props: ModalProps) {
  const {
    show,
    handleClose,
    coverPic,
    setSaveCoverPic,
    setPercentage,
    setImage,
    handleProgressBar,
    coverFile,
  } = props;
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  // eslint-disable-next-line
  const [croppedArea, setCroppedArea] = useState<any>(null);
  const [slider, setSlider] = useState<number>(0);
  const [ImageCropFile, setImageCropFile] = useState("");
  useEffect(() => {
    // @ts-ignore
    if (document.getElementById("myinput")) {
      // @ts-ignore
      document.getElementById("myinput").oninput = function () {
        // @ts-ignore
        var value = ((this.value - this.min) / (this.max - this.min)) * 100;
        // @ts-ignore
        this.style.background =
          "linear-gradient(to right, #deac00 0%, #deac00 " +
          value +
          "%, #F0F3F6 " +
          value +
          "%, #F0F3F6 100%)";
      };
    }
  });

  const CROP_AREA_ASPECT = 4 / 3;
  const onCropComplete = async (croppedArea: any, croppedAreaPixels: any) => {
    if (coverPic) {
      let imgFile = await getCroppedImg(coverPic, croppedAreaPixels);
      setImageCropFile(imgFile);
      setSaveCoverPic(imgFile);
    }
  };

  const saveCrop = () => {
    handleClose();
    setPercentage(0);
    setImage({
      preview: URL.createObjectURL(coverFile),
      raw: coverFile,
    });
    handleProgressBar(coverFile);
    setSaveCoverPic(ImageCropFile);
  };

  return (
    <div>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Body>
          <div
            className={classNames("container", styles.main_container)}
            id="main"
          >
            <Icons.Cross className={styles.cross} onClick={handleClose} />
            <div className={classNames(styles.heading_margin)}>
              <label className={classNames(styles.heading)}>
                Your Default View
              </label>
            </div>
            <Cropper
              image={coverPic}
              aspect={CROP_AREA_ASPECT}
              crop={crop}
              zoom={zoom}
              onCropChange={(size) => {
                console.log("Crop", size);
                setCrop(size);
              }}
              onZoomChange={(size) => {
                console.log("Zoom", size);
                setZoom(size);
              }}
              showGrid={false}
              onCropComplete={onCropComplete}
              onCropAreaChange={(croppedArea) => {
                setCroppedArea(croppedArea);
              }}
              cropShape={"rect"}
              objectFit="contain"
            />
            <div className="d-flex justify-content-center px-4 my-2">
              <div className="d-flex align-items-center">
                <Icons.MediaIcon className={styles.small_icon} />
                <input
                  id="myinput"
                  min="1"
                  step={0.5}
                  max="60"
                  onChange={(e: any) => {
                    if (e.target.value !== 0) {
                      setZoom(e.target.value);
                      setSlider(e.target.value);
                      setCrop({ x: -e.target.value, y: -e.target.value });
                    } else {
                      setZoom(1);
                    }
                  }}
                  type="range"
                  value={slider}
                />
                <Icons.MediaIcon className={styles.large_icon} />
              </div>
            </div>
            <div className={classNames("d-flex justify-content-end mt-3")}>
              <div className="d-flex">
                <CustomButton
                  label="Cancel"
                  onClick={handleClose}
                  customBtnContainer={styles.cancel}
                />
                <CustomButton
                  label="Save"
                  onClick={saveCrop}
                  customBtnContainer={styles.save}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default CropperModal;
