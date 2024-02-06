import { Icons } from "assets";
import axios from "axios";
import classNames from "classnames";
import React, { ChangeEvent, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import CustomProgressBar from "shared/components/progressBar";
import { toastMessage } from "shared/components/toast";
import CropperModal from "shared/modal/cropper";
import { BaseURL, Endpoint } from "shared/utils/endpoints";
import styles from "./style.module.scss";

interface ImageData {
  preview: string;
  raw: File;
}

interface UploadImageButtonProps {
  image: ImageData;
  setImage: React.Dispatch<React.SetStateAction<ImageData>>;
  update: boolean;
  setImagePath: any;
  percentage: number;
  setPercentage: any;
  setsaveCoverPic: (val: any) => void;
}

const UploadImageButton: React.FC<UploadImageButtonProps> = ({
  image,
  setImage,
  update,
  setImagePath,
  percentage,
  setPercentage,
  setsaveCoverPic,
}) => {
  const [coverPic, setcoverPic] = useState<any>(null);
  const [coverFile, setCoverFile] = useState<any>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  // showCropper()
  const closeCropper = () => setShowModal(!showModal);
  const showCropper = () => setShowModal(true);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleImageUpload(file);
  };

  const handleImageUpload = useCallback(
    (file: File | undefined) => {
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const img = new Image();
          img.src = reader.result as string;
          img.alt = "art-cover";
          img.onload = () => {
            if (
              file.type === "image/svg+xml" ||
              file.type === "image/png" ||
              file.type === "image/jpeg" ||
              file.type === "image/gif"
              // &&
              // img.width <= 800 &&
              // img.height <= 400
            ) {
              setCoverFile(file);
              let url = URL.createObjectURL(file);
              setcoverPic(url);
              showCropper();
            } else {
              toastMessage("error", "Please upload an SVG, PNG, JPG, or GIF");
            }
          };
        };
        reader.readAsDataURL(file);
      }
    },
    // eslint-disable-next-line
    [setImage]
  );

  const handleProgressBar = (image: any) => {
    const formData: any = new FormData();
    formData.append("image", image);

    axios
      .post(BaseURL + Endpoint.art.uploadImage, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setPercentage(percentage);
        },
      })
      .then((response: any) => {
        console.log("Path", response?.data?.data?.image);
        setImagePath(response?.data?.data?.image);
      })
      .catch((error) => {
        console.error("Upload failed!", error);
      });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      handleImageUpload(acceptedFiles[0]);
    },
    noClick: true,
  });

  return (
    <>
      <div className={styles.uploadImageTab}>
        <label
          htmlFor={!update ? "upload-button" : ""}
          className={classNames(
            "w-100",
            image?.preview?.startsWith("http") ? "" : styles.labelForUpload
          )}
          {...getRootProps()}
        >
          {image?.preview?.startsWith("http") ? (
            <img
              src={image?.preview}
              className={styles.imageLink}
              alt="art-cover"
            />
          ) : image.preview ? (
            <div>
              <div className={classNames("d-flex justify-content-between")}>
                <div className={classNames("d-flex")}>
                  <Icons.UploadedIcon />
                  <div
                    className={classNames(
                      "text-start",
                      styles.uploadedImageText
                    )}
                  >
                    {image.raw.name}
                    <br />
                    <span className={styles.fileSize}>
                      {(image.raw.size / 1024).toFixed(0)} KB
                    </span>
                  </div>
                </div>
                <div>
                  <Icons.TickFill />
                </div>
              </div>
              <div className={styles.progressBar}>
                <CustomProgressBar percentage={percentage} />
              </div>
            </div>
          ) : (
            <>
              <div
                className={classNames(styles.upholder, {
                  [styles.dragActive]: isDragActive,
                })}
              >
                {isDragActive ? (
                  <p className={styles.labelGrey}>Drop the files here</p>
                ) : (
                  <>
                    <Icons.UploadIcon />
                    <p className={styles.labelGrey}>
                      <span className={styles.labelGreen}>
                        Click to upload your story image
                      </span>{" "}
                      or drag and drop
                      <br />
                      SVG, PNG, JPG or GIF
                      {/* (max. 800x400px) */}
                    </p>
                  </>
                )}
              </div>
            </>
          )}
        </label>
        <input
          {...getInputProps()}
          type="file"
          id="upload-button"
          style={{ display: "none" }}
          onChange={handleChange}
        />
        <br />
      </div>
      <CropperModal
        show={showModal}
        handleClose={closeCropper}
        coverPic={coverPic}
        setSaveCoverPic={setsaveCoverPic}
        setPercentage={setPercentage}
        setImage={setImage}
        handleProgressBar={handleProgressBar}
        coverFile={coverFile}
      />
    </>
  );
};

export default UploadImageButton;
