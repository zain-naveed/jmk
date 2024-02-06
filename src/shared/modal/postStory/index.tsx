import { Icons } from "assets";
import classNames from "classnames";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "shared/components/customButton";
import CustomRichTextEditor from "shared/components/customRichTextEditor";
import CustomTagInput from "shared/components/customTagInput";
import { toastMessage } from "shared/components/toast";
import OptionsDropDown from "shared/dropsDowns/optionsDropDown";
import {
  resetStoryReducer,
  setStoryReducer,
} from "shared/redux/reducers/postStorySlice";
import { CreateDraft, CreatePost } from "shared/services/storyService";
import { postTypes } from "shared/utils/constants";
import { findCategory, findPostType } from "shared/utils/helper";
import { PostStoryVS } from "shared/utils/validations";
import CommonModal from "../commonModal";
import { modals } from "../commonModal/constants";
import styles from "./style.module.scss";
import { socket } from "shared/services/socketService";

interface PostStoryModalProps {
  show: boolean;
  handleClose: () => void;
  handleShow: () => void;
  nextModalName?: any;
  stories: any[];
  setStories: (val: any) => void;
}

interface InitialValues {
  postType: number;
  category: number;
  tags: string[];
  headline: string;
  desc: string;
}

const PostStoryModal = ({
  show,
  handleClose,
  handleShow,
  nextModalName,
  stories,
  setStories,
}: Partial<PostStoryModalProps>) => {
  const dispatch = useDispatch();
  const { postStory } = useSelector((state: any) => state.root);
  const initialValues: InitialValues = {
    category: findCategory(postStory.category),
    tags: [],
    headline: "",
    desc: "",
    postType: findPostType(postStory.category),
  };
  const [activeModal, setActiveModal] = useState<string>(modals.terms.name);
  const [activeCateg, setActiveCateg] = useState<string>(postStory.category);
  const [categoryOptions, setCategoryOptions] = useState<[]>([]);
  const [showCommonModal, setShowCommonModal] = useState<boolean>(false);
  const [openSelection, setOpenSelection] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [draftloading, setDraftLoading] = useState<boolean>(false);
  const [titleError, setTitleError] = useState<string>("");

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
  const { handleChange, handleSubmit, values, touched, errors, setFieldValue } =
    formik;

  const handleShowCommonModal = () => {
    setActiveModal(modals.terms.name);
    setShowCommonModal(true);
  };

  const handleCloseCommonModal = () => {
    setShowCommonModal(false);
  };

  const handlePostCreation = async () => {
    setLoading(true);
    let params: any = {
      title: values.headline,
      story: values.desc,
      post_type: values.postType,
      category_type: values.category,
      art_id: postStory?.artId,
      tags: values.tags,
      is_published: true, // true for published  and false for draft.
      is_opened_contest: postStory?.contest, //if art open for contest,
      contest_id: postStory?.contestId,
    };
    await CreatePost(params)
      .then(({ data: { data, message, status } }) => {
        if (status) {
          if (postStory?.contest) {
            setActiveModal(modals.winner.name);
          } else {
            handleCloseCommonModal();
          }
          const socket_data = {
            room: postStory?.user_id,
            status: true,
          };
          socket.emit("notification", socket_data);
          let end_date = postStory?.contestEndDate;
          dispatch(resetStoryReducer());
          dispatch(
            setStoryReducer({
              storyId: data?.id,
              contestEndDate: end_date,
            })
          );
          if (stories) {
            let temp: any = [...stories];
            temp.push(data);
            setStories?.(temp);
          }
          toastMessage("success", message);
        } else {
          toastMessage("err", message);
        }
      })
      .catch((err) => {
        console.log("Error", err);
        toastMessage("error", "Failed to create post");
        handleCloseCommonModal();
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleDraftCreation = () => {
    if (values.headline.length === 0) {
      setTitleError("Headline is Required");
    } else {
      setDraftLoading(true);
      let params: any = {
        title: values.headline,
        story: values.desc,
        post_type: values.postType,
        category_type: values.category,
        art_id: postStory?.artId,
        tags: values.tags,
        is_opened_contest: postStory?.contest, //if art open for contest,
        contest_id: postStory?.contestId,
      };
      CreateDraft(params)
        .then(({ data: { data, message, status } }) => {
          if (status) {
            dispatch(resetStoryReducer());
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
    }
  };

  useEffect(() => {
    categoryOptionsGenerator();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setActiveCateg(postStory?.category);
  }, [postStory?.category]);

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
        dialogClassName={classNames(
          postStory?.isPublic ? styles.dialogContent1 : styles.dialogContent2
        )}
        style={{ background: "rgba(255, 255, 255, 0.95)" }}
      >
        <Modal.Body
          className={classNames(
            styles.modalContent,
            "px-3 py-3 px-sm-4 py-sm-4"
          )}
        >
          <div
            className={classNames(
              "d-flex align-items-center justify-content-between w-100 mb-2"
            )}
          >
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
            {postStory?.isPublic ? (
              <>
                {/* <label className={classNames(styles.subTitle, "pt-2 pb-4")}>
                  Selected Art
                </label> */}
                <img
                  src={postStory.artCover}
                  alt="art-cover"
                  className={classNames(styles.art)}
                />
                <label className={classNames(styles.title2, "pt-3 pb-1")}>
                  {postStory.artTitle}
                </label>
                <label className={classNames(styles.desc)}>
                  {postStory.artDesc}
                </label>
              </>
            ) : null}

            <form
              onSubmit={(e) => e.preventDefault()}
              className={classNames("d-flex flex-column w-100 gap-4")}
            >
              <div className={classNames("d-flex flex-column w-100 mt-4")}>
                <div
                  className={classNames(
                    "d-flex w-100 flex-column align-items-start position-relative justify-content-end"
                  )}
                >
                  <label className={classNames(styles.subTitle, "mb-1")}>
                    Select Category
                  </label>
                  <div
                    className={classNames(
                      styles.categContainer,
                      "px-3 position-relative"
                    )}
                    onClick={() => {
                      setOpenSelection(!openSelection);
                    }}
                    role="button"
                  >
                    <label
                      className={classNames(styles.categLabel)}
                      role="button"
                    >
                      {activeCateg}
                    </label>
                    <Icons.ChevDown />
                    {touched.category && errors.category ? (
                      <label className={classNames(styles.error2)}>
                        {errors.category}
                      </label>
                    ) : null}
                  </div>
                  <OptionsDropDown
                    openSelection={openSelection}
                    setOpenSelection={setOpenSelection}
                    options={categoryOptions}
                    customContainer={classNames(styles.optionsContainer)}
                  />
                </div>
                <div className={classNames("w-100 mt-3")}>
                  <CustomTagInput
                    setFieldValue={setFieldValue}
                    tags={values.tags}
                    error={
                      touched.tags && errors.tags
                        ? touched.tags && errors.tags
                        : ""
                    }
                    title="Tag"
                  />
                </div>
              </div>
              <div className={classNames("position-relative")}>
                <input
                  value={values.headline}
                  placeholder="Enter Your Title Here"
                  className={classNames(styles.headlineInput, "px-3 mb-0")}
                  onChange={(e) => {
                    setFieldValue("headline", e.target.value);
                    if (e.target.value.length > 0) {
                      setTitleError("");
                    }
                  }}
                  maxLength={80}
                />

                {(touched.headline && errors.headline) || titleError ? (
                  <label className={classNames(styles.error)}>
                    {errors.headline
                      ? errors.headline
                      : titleError
                      ? titleError
                      : ""}
                  </label>
                ) : (
                  <label className={classNames(styles.inputBtmText)}>
                    {values.headline.length}/80 characters left
                  </label>
                )}
              </div>
              <CustomRichTextEditor
                value={values.desc}
                placeholder="Write your story here..."
                onChange={handleChange("desc")}
                error={touched.desc && errors.desc ? errors.desc : ""}
              />
              <div
                className={classNames(
                  "d-flex w-100 align-items-center justify-content-between gap-3"
                )}
              >
                <CustomButton
                  style2
                  label="Save as Draft"
                  customBtnContainer={classNames("w-50")}
                  loading={draftloading}
                  disabled={draftloading}
                  spinnerColor="#0f1106"
                  onClick={() => handleDraftCreation()}
                />
                <CustomButton
                  label="Post Story"
                  customBtnContainer={classNames("w-50")}
                  onClick={() => handleSubmit()}
                  disabled={draftloading}
                />
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
      <CommonModal
        show={showCommonModal}
        handleClose={handleCloseCommonModal}
        handleShowPostModal={handleShow}
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        nextModal={nextModalName ? nextModalName : null}
        handleAction={async () => await handlePostCreation()}
        loading={loading}
      />
    </>
  );
};

export default PostStoryModal;
