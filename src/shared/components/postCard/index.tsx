import { Icons } from "assets";
import classNames from "classnames";
import moment from "moment";
import styles from "./style.module.scss";
import { useEffect, useState } from "react";
import OptionsDropDown from "../../dropsDowns/optionsDropDown";
import { useNavigate } from "react-router";
import { routeConstant } from "shared/routes/routeConstant";
import { DeleteStory } from "shared/services/storyService";
import { toastMessage } from "../toast";
import UpdateStoryModal from "shared/modal/updateStory";
import DeleteModal from "shared/modal/deleteModal";
import AddArt from "shared/modal/addArt";
import { DeleteArt } from "shared/services/artsService";

interface PostCardProps {
  title: string;
  isPublish: boolean;
  cover: any;
  date: string;
  created_at: string;
  status: string;
  art: any;
  full_image_path: any;
  is_approved: any;
  isArt: boolean;
  id: number;
  item: any;
  items: any;
  setItems: (val: any) => void;
  isPublic: boolean;
  artItem: any;
}

const PostCard = ({
  is_approved,
  isArt,
  id,
  item,
  items,
  setItems,
  isPublic,
  artItem,
}: Partial<PostCardProps>) => {
  const navigate = useNavigate();
  const [Item, setItem] = useState<any>(item);
  const [openSelection, setOpenSelection] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [addArtModal, setAddArtModal] = useState<boolean>(false);

  const [loader, setLoader] = useState(false);
  const options = [
    {
      title: `Edit ${isArt ? "Art" : "Story"}`,
      Icon: null,
      action: () => {
        if (!isArt) {
          handleShowEditModal();
        } else {
          handleOpenArtModal();
        }
      },
    },
    {
      title: `Delete ${isArt ? "Art" : "Story"}`,
      Icon: null,
      action: () => {
        // if (!isArt) {
        handleShowDeleteModal();
        // }
      },
    },
  ];

  const handleShowDeleteModal = () => {
    setShowDelete(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDelete(false);
  };
  const handleShowEditModal = () => {
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleOpenArtModal = () => {
    setAddArtModal(true);
  };

  const handleCloseArtModal = () => {
    setAddArtModal(false);
  };

  const handleDelete = () => {
    setLoader(true);
    if (!isArt) {
      DeleteStory(Item?.id)
        .then(({ data: { message } }) => {
          toastMessage("success", message);
          setLoader(false);
          let temp = items.filter((itm: any) => {
            return itm.id !== Item?.id;
          });
          setItems?.(temp);
        })
        .catch((err) => {
          console.log("err", err);
          setLoader(false);
        });
    } else {
      DeleteArt(artItem?.id)
        .then(({ data: { message } }) => {
          toastMessage("success", message);
          setLoader(false);
          let temp = [...items];
          let index = items.findIndex((itm: any) => itm.id === artItem?.id);
          if (index > -1) {
            temp.splice(index, 1);
          }
          setItems?.(temp);
        })
        .catch((err) => {
          toastMessage("error", err.response?.data?.message);
          setLoader(false);
        });
    }
  };

  useEffect(() => {
    setItem(item);
    // eslint-disable-next-line
  }, [item?.id]);

  return (
    <div className={classNames("col-12 col-md-6 col-lg-4 px-0 mt-4")}>
      <div className={classNames(styles.postCardContainer)}>
        <div
          className={classNames(
            "d-flex align-items-center justify-content-center",
            styles.imgContainer
          )}
        >
          {Item?.image ? (
            <img
              className={classNames(styles.postImg)}
              src={
                Item?.cover_image
                  ? Item?.full_cover_image_path
                  : Item?.full_image_path
              }
              alt="post-img"
            />
          ) : Item?.art?.image ? (
            <img
              className={classNames(styles.postImg)}
              src={
                Item?.art?.cover_image
                  ? Item?.art?.full_cover_image_path
                  : Item?.art?.full_image_path
              }
              alt="post-img"
            />
          ) : (
            <Icons.DraftFile />
          )}
        </div>
        <div
          className={classNames(
            "d-flex align-items-center justify-content-between px-3 py-3"
          )}
        >
          <label
            className={classNames(styles.title)}
            role="button"
            onClick={() => {
              if (isArt) {
                navigate(routeConstant.art.path.replace(":id", String(id)));
              } else {
                navigate(routeConstant.story.path.replace(":id", String(id)));
              }
            }}
          >
            {Item?.title}
          </label>
          <div className={classNames("position-relative")}>
            <Icons.MoreVertical
              className={classNames(styles.moreIcon)}
              role="button"
              onClick={() => {
                setOpenSelection(!openSelection);
              }}
            />
            <OptionsDropDown
              openSelection={openSelection}
              setOpenSelection={setOpenSelection}
              options={options}
              customContainer={classNames(styles.optionsContainer)}
            />
          </div>
        </div>
        <div
          className={classNames(
            "d-flex align-items-center justify-content-between px-3 pt-1 pb-3"
          )}
        >
          <div
            className={classNames(
              "d-flex align-items-center justify-content-center gap-1"
            )}
          >
            <Icons.Calendar className={classNames(styles.dateIcon)} />
            <label className={classNames(styles.dateLabel)}>
              {moment(Item?.created_at).format("ll")}
            </label>
          </div>
          <div
            className={classNames(
              Item?.status === "Published"
                ? styles.publishTagContainer
                : styles.draftTagContainer,
              "px-2"
            )}
          >
            <label
              className={classNames(
                is_approved
                  ? styles.publishTag
                  : Item?.status === "Published"
                  ? styles.publishTag
                  : styles.draftTag
              )}
            >
              {is_approved === 1
                ? "Published"
                : is_approved === 0
                ? "Pending"
                : Item?.status
                ? Item?.status
                : "Draft"}
            </label>
          </div>
        </div>
      </div>
      <DeleteModal
        showModal={showDelete}
        handleShow={handleShowDeleteModal}
        handleClose={handleCloseDeleteModal}
        handleSubmit={handleDelete}
        loader={loader}
      />
      <AddArt
        show={addArtModal}
        handleClose={handleCloseArtModal}
        artDetail={artItem ? artItem : {}}
        update={true}
      />
      <UpdateStoryModal
        show={showEditModal}
        handleClose={handleCloseEditModal}
        story={item}
        setStory={setItem}
        isPublic={isPublic}
        fromDraft={true}
      />
    </div>
  );
};

export default PostCard;
