import { Icons, Images } from "assets";
import classNames from "classnames";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import AddArt from "shared/modal/addArt";
import { allForms } from "shared/modal/auth/constants";
import DeleteModal from "shared/modal/deleteModal";
import PostStoryModal from "shared/modal/postStory";
import ReportModal from "shared/modal/reportModal";
import {
  resetStoryReducer,
  setStoryReducer,
} from "shared/redux/reducers/postStorySlice";
import { setSignInReducer } from "shared/redux/reducers/sigInSlice";
import { routeConstant } from "shared/routes/routeConstant";
import { Report } from "shared/services/generalService";
import { roundNum } from "shared/utils/helper";
import OptionsDropDown from "../../dropsDowns/optionsDropDown";
import CustomButton from "../customButton";
import StoryCount from "../storyCount";
import { toastMessage } from "../toast";
import TypeCard from "../typeCard";
import styles from "./style.module.scss";
import { modals } from "shared/modal/commonModal/constants";

const ArtCard = ({ item, handleDelete, deleteLoader }: any) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.root);
  const [loader, setLoader] = useState(false);
  const [openSelection, setOpenSelection] = useState<boolean>(false);
  const [showReport, setShowReportModal] = useState<boolean>(false);
  const [addArtModal, setAddArtModal] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [showPostStory, setShowPostStory] = useState<boolean>(false);

  const handleShowSignInModal = () => {
    dispatch(
      setSignInReducer({ showModal: true, activeModal: allForms.signin.name })
    );
  };

  const handleShowPostStoryModal = () => {
    setShowPostStory(true);
  };
  const handleClosePostStoryModal = () => {
    setShowPostStory(false);
  };
  const handleContribution = () => {
    dispatch(resetStoryReducer());
    if (item?.isOpenedContest) {
      dispatch(
        setStoryReducer({
          artCover: item?.full_image_path,
          artTitle: item?.title,
          artDesc: item?.description,
          artId: item?.id,
          contestId: item?.isOpenedContest?.id,
          contest: true,
          category: "Poetry",
          contestEndDate: item?.isOpenedContest?.end_date,
          user_id: item?.user?.id,
        })
      );
    } else {
      dispatch(
        setStoryReducer({
          artCover: item?.full_image_path,
          artTitle: item?.title,
          artDesc: item?.description,
          artId: item?.id,
          contest: false,
          category: "Poetry",
          user_id: item?.user?.id,
        })
      );
    }

    handleShowPostStoryModal();
  };

  const options = [
    {
      title: "Report Artwork",
      Icon: Icons.Flag,
      action: (e: any) => {
        e.stopPropagation();
        handleShowReportModal();
        setOpenSelection(false);
      },
    },
  ];

  const privateOptions = [
    {
      title: "Edit Artwork",
      Icon: Icons.Edit,
      action: (e: any) => {
        e.stopPropagation();
        handleOpenArtModal();
        setOpenSelection(false);
      },
    },
    {
      title: "Delete Artwork",
      Icon: Icons.Delete,
      action: (e: any) => {
        e.stopPropagation();
        handleShowDeleteModal();
        setOpenSelection(false);
      },
    },
  ];

  const handleOpenArtModal = () => {
    setAddArtModal(true);
  };

  const handleCloseArtModal = () => {
    setAddArtModal(false);
  };

  const handleShowDeleteModal = () => {
    setShowDelete(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDelete(false);
  };

  const handleDeleteArt = async () => {
    await handleDelete(item);
  };

  const handleShowReportModal = () => {
    if (user?.token) {
      setShowReportModal(true);
    } else {
      dispatch(
        setSignInReducer({ showModal: true, activeModal: allForms.signin.name })
      );
    }
  };
  const handleCloseReportModal = () => {
    setShowReportModal(false);
  };
  const handleReport = async (type: any, reason: string) => {
    let obj: any = {
      type: type,
      reason: reason,
      reportable_id: item?.id,
    };
    setLoader(true);
    await Report(obj)
      .then(({ data: { data, message } }) => {
        toastMessage("success", message);
        setLoader(false);
      })
      .catch((err) => {
        console.log("err", err);
        setLoader(false);
      });
  };
  return (
    <div className={classNames(styles.artContainer, "mt-4 d-flex flex-column")}>
      <img
        alt="art-img"
        src={
          item?.cover_image
            ? item?.full_cover_image_path
            : item?.image
            ? item?.full_image_path
            : Images.Art
        }
        className={classNames(styles.artStyle)}
        onClick={() =>
          navigate(routeConstant.art.path.replace(":id", item?.id))
        }
        role="button"
      />
      <div
        className={classNames(
          "d-flex justify-content-between align-items-center mt-2 position-relative"
        )}
        onClick={() =>
          navigate(routeConstant.art.path.replace(":id", item?.id))
        }
      >
        <div className={classNames("d-flex ")}>
          <TypeCard
            time={roundNum(item?.views_count, 1) + " Views"}
            type="Art"
            isview
            fontSize={7}
            item={item}
          />
          <StoryCount
            count={item?.posts_count}
            containerStyle={classNames("ms-1")}
            fontSize={7.1}
            dotSize={3.56}
          />
        </div>

        <Icons.MoreVertical
          className={classNames(styles.moreIcon)}
          role="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpenSelection(!openSelection);
          }}
        />
        <OptionsDropDown
          openSelection={openSelection}
          setOpenSelection={setOpenSelection}
          options={
            String(item?.user?.id) === String(user?.user?.id)
              ? privateOptions
              : options
          }
          customContainer={classNames(styles.optionsContainer)}
        />
      </div>
      <label
        className={classNames(styles.title, "mt-2")}
        role="button"
        onClick={() =>
          navigate(routeConstant.art.path.replace(":id", item?.id))
        }
      >
        {item?.user?.name}
      </label>
      <div
        className={classNames(
          "d-flex align-items-center justify-content-start gap-2 mt-2"
        )}
      >
        <CustomButton
          customBtnContainer={classNames(styles.bttnContainer, "gap-2")}
          customIconStyle={classNames(styles.btnIcon)}
          label="Read Stories"
          Icon={Icons.File}
          onClick={(e) => {
            e.stopPropagation();
            navigate(routeConstant.art.path.replace(":id", item?.id));
          }}
        />

        <CustomButton
          customBtnContainer={classNames(styles.bttnContainer, "gap-2")}
          customIconStyle={classNames(styles.btnIcon)}
          label="Contribute"
          onClick={(e) => {
            e.stopPropagation();
            if (user?.isLoggedIn) {
              handleContribution();
            } else {
              handleShowSignInModal();
            }
          }}
          Icon={Icons.Pencil}
        />
      </div>
      <ReportModal
        showModal={showReport}
        handleShow={handleShowReportModal}
        handleClose={handleCloseReportModal}
        handleSubmit={async (type, reason) => await handleReport(type, reason)}
        reportText="Art"
        loader={loader}
      />
      <AddArt
        show={addArtModal}
        handleClose={handleCloseArtModal}
        artDetail={item}
        update={true}
      />
      <DeleteModal
        showModal={showDelete}
        handleShow={handleShowDeleteModal}
        handleClose={handleCloseDeleteModal}
        handleSubmit={async () => await handleDeleteArt()}
        loader={deleteLoader}
      />
      <PostStoryModal
        show={showPostStory}
        handleClose={handleClosePostStoryModal}
        handleShow={handleShowPostStoryModal}
        nextModalName={
          item?.isOpenedContest ? modals.winner.name : modals.approval.name
        }
      />
    </div>
  );
};

export default ArtCard;
