import { Icons } from "assets";
import classNames from "classnames";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import CustomButton from "shared/components/customButton";
import CustomRichTextEditor from "shared/components/customRichTextEditor";
import CustomTagInput from "shared/components/customTagInput";
import { toastMessage } from "shared/components/toast";
import OptionsDropDown from "shared/dropsDowns/optionsDropDown";
import { resetStoryReducer } from "shared/redux/reducers/postStorySlice";
import { UpdateDraft, UpdatePost } from "shared/services/storyService";
import { postTypes } from "shared/utils/constants";
import { findCategory, findGenres, findPostType } from "shared/utils/helper";
import { PostStoryVS } from "shared/utils/validations";
import CommonModal from "../commonModal";
import { modals } from "../commonModal/constants";
import styles from "./style.module.scss";
import { useNavigate } from "react-router";

interface UpdateStoryModalProps {
  show: boolean;
  handleClose: () => void;
  story: any;
  setStory: (val: any) => void;
  isPublic: boolean;
  fromDraft: boolean;
}

interface InitialValues {
  postType: number;
  category: number;
  tags: string[];
  headline: string;
  desc: string;
}

const UpdateStoryModal = ({ show, handleClose, story, setStory, isPublic, fromDraft }: Partial<UpdateStoryModalProps>) => {
  const dispatch = useDispatch();
  const initialValues: InitialValues = {
    category: findCategory(story?.category_type),
    tags: findGenres(story?.tags),
    headline: story?.title ? story?.title : "",
    desc: story?.story ? story?.story : "",
    postType: findPostType(story?.category_type),
  };
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<string>(modals.terms.name);
  const [activeCateg, setActiveCateg] = useState<string>(story?.category_type);
  const [categoryOptions, setCategoryOptions] = useState<[]>([]);
  const [showCommonModal, setShowCommonModal] = useState<boolean>(false);
  const [openSelection, setOpenSelection] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [draftloading, setDraftLoading] = useState<boolean>(false);

  const categoryOptionsGenerator = () => {
    let options: any = [];
    postTypes.forEach((item, inx) => {
      let obj: { title: string; Icon: any; action: any } = {
        title: item?.name,
        Icon: null,
        action: (e: any) => {
          e.stopPropagation();
          setFieldValue("category", findCategory(item?.name));
          setActiveCateg(item?.name);
          setFieldValue("postType", findPostType(item?.name));
          setOpenSelection(false);
        },
      };
      options.push(obj);
    });
    setCategoryOptions(options);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: PostStoryVS,
    onSubmit: () => {
      handleClose?.();
      handleShowCommonModal();
    },
  });
  const { handleChange, handleSubmit, values, touched, errors, setFieldValue } = formik;

  const handleShowCommonModal = () => {
    setActiveModal(modals.terms.name);
    setShowCommonModal(true);
  };

  const handleCloseCommonModal = () => {
    setShowCommonModal(false);
  };

  const handleDradtUpdate = () => {
    setDraftLoading(true);

    let params: any = {
      post_id: story?.id,
      title: values.headline,
      story: values.desc,
      post_type: values.postType,
      category_type: values.category,
      art_id: story?.art?.id,
      tags: values.tags,
      status: 0, // 1 for published
    };
    UpdateDraft(params)
      .then(({ data: { data, message, status } }) => {
        if (status) {
          dispatch(resetStoryReducer());
          setStory?.(data);
          toastMessage("success", "Post saved as Draft");
          handleClose?.();
        } else {
          toastMessage("err", message);
        }
      })
      .catch((err) => {
        console.log("Error", err);
        toastMessage("error", err);
      })
      .finally(() => {
        setDraftLoading(false);
      });
  };

  const handlePostUpdate = async () => {
    setLoading(true);
    let params: any = {
      post_id: story?.id,
      title: values.headline,
      story: values.desc,
      post_type: values.postType,
      category_type: values.category,
      art_id: story?.art?.id,
      tags: values.tags,
      status: 1, // 1 for published
    };
    await UpdatePost(params)
      .then(({ data: { data, message, status } }) => {
        if (status) {
          dispatch(resetStoryReducer());
          setStory?.(data);
          handleCloseCommonModal();
          if (fromDraft) {
            navigate("/mypost", { state: data });
          }
        } else {
          toastMessage("err", message);
        }
      })
      .catch((err) => {
        console.log("Error", err);
        toastMessage("error", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    categoryOptionsGenerator();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    console.log("FFF", story?.category_type);
    setActiveCateg(story?.category_type);
  }, [story?.category_type]);

  return (
    <>
      <Modal
        show={show}
        onHide={() => {
          handleClose?.();
        }}
        backdrop="static"
        keyboard={false}
        centered
        className={classNames("d-block d-sm-flex justify-content-center")}
        contentClassName={styles.modalContent}
        dialogClassName={classNames(isPublic ? styles.dialogContent1 : styles.dialogContent2)}
        style={{ background: "rgba(255, 255, 255, 0.95)" }}
      >
        <Modal.Body className={classNames(styles.modalContent, "px-3 py-3 px-sm-4 py-sm-4")}>
          <div className={classNames("d-flex align-items-center justify-content-between w-100 mb-2")}>
            <label className={classNames(styles.title)}>Post a Story</label>
            <Icons.Cross
              className={classNames(styles.crossIcon)}
              role="button"
              onClick={() => {
                handleClose?.();
              }}
            />
          </div>
          <div className={classNames("d-flex align-items-start flex-column")}>
            {isPublic ? (
              <>
                <img src={story?.art?.full_image_path} alt="art-cover" className={classNames(styles.art)} />
                <label className={classNames(styles.title2, "pt-3 pb-1")}>{story?.art?.title}</label>
                <label className={classNames(styles.desc)}>{story?.art?.description}</label>
              </>
            ) : null}

            <form onSubmit={(e) => e.preventDefault()} className={classNames("d-flex flex-column w-100 gap-4")}>
              <div className={classNames("d-flex row w-100 mt-4")}>
                <div className={classNames("col-12 d-flex flex-column align-items-start position-relative justify-content-end")}>
                  <label className={classNames(styles.subTitle, "mb-1")}>Select Category</label>
                  <div
                    className={classNames(styles.categContainer, "px-3 position-relative")}
                    onClick={() => {
                      setOpenSelection(!openSelection);
                    }}
                    role="button"
                  >
                    <label className={classNames(styles.categLabel)} role="button">
                      {activeCateg}
                    </label>
                    <Icons.ChevDown />
                    {touched.category && errors.category ? <label className={classNames(styles.error2)}>{errors.category}</label> : null}
                  </div>
                  <OptionsDropDown openSelection={openSelection} setOpenSelection={setOpenSelection} options={categoryOptions} customContainer={classNames(styles.optionsContainer)} />
                </div>
                <div className={classNames("col-12 mt-3")}>
                  <CustomTagInput setFieldValue={setFieldValue} tags={values.tags} error={touched.tags && errors.tags ? touched.tags && errors.tags : ""} title="Tag" />
                </div>
              </div>
              <div className={classNames("position-relative")}>
                <input value={values.headline} placeholder="What’s your headline?" className={classNames(styles.headlineInput, "px-3 mb-0")} onChange={handleChange("headline")} maxLength={80} />

                {touched.headline && errors.headline ? <label className={classNames(styles.error)}>{errors.headline}</label> : <label className={classNames(styles.inputBtmText)}>{values.headline?.length}/80 characters left</label>}
              </div>
              <CustomRichTextEditor value={values.desc} placeholder="Write your story here..." onChange={handleChange("desc")} error={touched.desc && errors.desc ? errors.desc : ""} />
              <div className={classNames("d-flex w-100 align-items-center justify-content-between gap-3")}>
                <CustomButton style2 label="Save as Draft" customBtnContainer={classNames("w-50")} loading={draftloading} disabled={draftloading || loading} spinnerColor="#0f1106" onClick={() => handleDradtUpdate()} />
                <CustomButton label="Post Story" customBtnContainer={classNames("w-50")} onClick={() => handleSubmit()} disabled={draftloading || loading} loading={loading} />
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
      <CommonModal show={showCommonModal} handleClose={handleCloseCommonModal} activeModal={activeModal} handleAction={async () => await handlePostUpdate()} loading={loading} />
    </>
  );
};

export default UpdateStoryModal;
