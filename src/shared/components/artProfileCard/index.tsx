import { Icons, Images } from "assets";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AddArt from "shared/modal/addArt";
import DeleteModal from "shared/modal/deleteModal";
import ReportModal from "shared/modal/reportModal";
import { routeConstant } from "shared/routes/routeConstant";
import { roundNum } from "shared/utils/helper";
import OptionsDropDown from "../../dropsDowns/optionsDropDown";
import StoryCount from "../storyCount";
import { toastMessage } from "../toast";
import TypeCard from "../typeCard";
import styles from "./style.module.scss";
import { DeleteArt } from "shared/services/artsService";
import { Report } from "shared/services/generalService";
import { useDispatch, useSelector } from "react-redux";
import { setSignInReducer } from "shared/redux/reducers/sigInSlice";
import { allForms } from "shared/modal/auth/constants";
import CustomButton from "../customButton";
import {
  resetStoryReducer,
  setStoryReducer,
} from "shared/redux/reducers/postStorySlice";
import PostStoryModal from "shared/modal/postStory";
import { modals } from "shared/modal/commonModal/constants";
import { typesEnum } from "pages/profile/constants";

interface ArtProfileCardProps {
  artDetail: any;
  artList: any;
  setArtList: any;
  existingState: any;
  isSelf: boolean;
  handleArtDefault: any;
}

const ArtProfileCard = ({
  artDetail,
  artList,
  setArtList,
  existingState,
  isSelf,
  handleArtDefault,
}: Partial<ArtProfileCardProps>) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.root);
  const [openSelection, setOpenSelection] = useState<boolean>(false);
  const [hover, setHover] = useState<boolean>(false);
  const [addArtModal, setAddArtModal] = useState<boolean>(false);
  const [art, setArt] = useState<any>(artDetail ? artDetail : {});
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [showReport, setShowReportModal] = useState<boolean>(false);
  const [loader, setLoader] = useState(false);
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
    if (artDetail?.is_opened_contest) {
      dispatch(
        setStoryReducer({
          artCover: artDetail?.full_image_path,
          artTitle: artDetail?.title,
          artDesc: artDetail?.description,
          artId: artDetail?.id,
          contestId: artDetail?.is_opened_contest?.id,
          contest: true,
          category: "Poetry",
          contestEndDate: artDetail?.is_opened_contest?.end_date,
          user_id: artDetail?.user?.id,
        })
      );
    } else {
      dispatch(
        setStoryReducer({
          artCover: artDetail?.full_image_path,
          artTitle: artDetail?.title,
          artDesc: artDetail?.description,
          artId: artDetail?.id,
          contest: false,
          category: "Poetry",
          user_id: artDetail?.user?.id,
        })
      );
    }

    handleShowPostStoryModal();
  };

  const options = [
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
  const publicOptions = [
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

  const handleDelete = () => {
    setLoader(true);
    DeleteArt(art?.id)
      .then(({ data: { message } }) => {
        toastMessage("success", message);
        setLoader(false);
        let temp = [...artList];
        let index = temp.findIndex((i) => i.id === art.id);
        if (index > -1) {
          temp.splice(index, 1);
        }
        setArtList(temp);
      })
      .catch((err) => {
        toastMessage("error", err.response?.data?.message);
        setLoader(false);
      });
  };

  const handleReport = async (type: any, reason: string) => {
    let obj: any = {
      type: type,
      reason: reason,
      reportable_id: art?.id,
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

  useEffect(() => {
    if (existingState) {
      let temp = [...artList];
      let index = temp.findIndex((i) => i.id === existingState.id);
      if (index > -1) {
        temp[index] = existingState;
      } else {
        temp.push(existingState);
      }
      setArtList(temp);
    }
    // eslint-disable-next-line
  }, [existingState]);

  useEffect(() => {
    setArt(artDetail);
    // eslint-disable-next-line
  }, [art?.id]);

  return (
    <>
      <div
        className={classNames(styles.artContainer, "mt-4 d-flex flex-column")}
      >
        <div
          className={classNames("position-relative")}
          onMouseEnter={() => {
            setHover(true);
          }}
          onMouseLeave={() => {
            setHover(false);
          }}
        >
          <div>
            {!!hover && artDetail?.is_approved && isSelf ? (
              <button
                className={classNames(styles.default, "px-2")}
                onClick={() => handleArtDefault(artDetail)}
                disabled={artDetail?.is_default_view}
              >
                {artDetail?.is_default_view
                  ? "Default View"
                  : "Make it Default View"}
              </button>
            ) : (
              ""
            )}
            <img
              alt="art-img"
              src={
                artDetail?.cover_image
                  ? artDetail?.full_cover_image_path
                  : artDetail?.image
                  ? artDetail?.full_image_path
                  : Images.Art
              }
              className={classNames(styles.artStyle)}
              onClick={() =>
                navigate(routeConstant.art.path.replace(":id", artDetail?.id))
              }
            />
          </div>
          {!!hover && (
            <div
              className={classNames(
                styles.infoContainer,
                "d-flex flex-column px-3 py-2"
              )}
            >
              <label className={classNames(styles.infoTitle)}>
                {art?.title}
              </label>
              <label className={classNames(styles.infoSubTitle)}>
                {art?.description}
              </label>
            </div>
          )}
        </div>

        <div
          className={classNames(
            "d-flex justify-content-between align-items-center mt-4 position-relative"
          )}
        >
          <div
            role="button"
            className={classNames("d-flex gap-1")}
            onClick={() =>
              navigate(routeConstant.art.path.replace(":id", artDetail?.id))
            }
          >
            <TypeCard
              time={Number(roundNum(art?.views_count, 1)) + " Views"}
              type="Art"
              isview
              item={art}
            />
            <StoryCount count={Number(roundNum(art?.posts_count, 1))} />
            {!art?.is_approved ? (
              <div
                className={classNames("d-flex px-3", styles.pendingContainer)}
              >
                <label className={classNames(styles.pendingLabel)}>
                  Pending
                </label>
              </div>
            ) : null}
            <div></div>
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
            options={isSelf ? options : publicOptions}
            customContainer={classNames(styles.optionsContainer)}
          />
        </div>
        <label
          className={classNames(styles.title, "mt-2")}
          role="button"
          onClick={() =>
            navigate(routeConstant.art.path.replace(":id", artDetail?.id))
          }
        >
          {art?.title}
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
              navigate(routeConstant.art.path.replace(":id", artDetail?.id));
            }}
          />
          {/* {user?.user?.type === typesEnum.writer ? ( */}
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
          {/* ) : null} */}
        </div>
      </div>
      <AddArt
        show={addArtModal}
        handleClose={handleCloseArtModal}
        artDetail={art}
        update={true}
      />
      <DeleteModal
        showModal={showDelete}
        handleShow={handleShowDeleteModal}
        handleClose={handleCloseDeleteModal}
        handleSubmit={handleDelete}
        loader={loader}
      />
      <ReportModal
        showModal={showReport}
        handleShow={handleShowReportModal}
        handleClose={handleCloseReportModal}
        handleSubmit={handleReport}
        reportText="Art"
        loader={loader}
      />
      <PostStoryModal
        show={showPostStory}
        handleClose={handleClosePostStoryModal}
        handleShow={handleShowPostStoryModal}
        nextModalName={artDetail?.is_opened_contest ? modals.winner.name : null}
      />
    </>
  );
};

export default ArtProfileCard;
