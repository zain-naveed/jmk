import { Icons, Images } from "assets";
import classNames from "classnames";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import AddArt from "shared/modal/addArt";
import DeleteModal from "shared/modal/deleteModal";
import ReportModal from "shared/modal/reportModal";
import { routeConstant } from "shared/routes/routeConstant";
import { DeleteArt } from "shared/services/artsService";
import { Report } from "shared/services/generalService";
import { roundNum } from "shared/utils/helper";
import OptionsDropDown from "../../dropsDowns/optionsDropDown";
import StoryCount from "../storyCount";
import { toastMessage } from "../toast";
import TypeCard from "../typeCard";
import styles from "./style.module.scss";

interface SaveArtProps {
  action: () => void;
  isInArtSelection: boolean;
  item: any;
  allArtData: string[];
  setAllArtData: (artData: string[]) => void;
}

const SaveArtCard = ({
  action,
  isInArtSelection,
  item,
  allArtData,
  setAllArtData,
}: Partial<SaveArtProps>) => {
  const navigate = useNavigate();
  const {
    user: { user },
  } = useSelector((state: any) => state.root);
  const [openSelection, setOpenSelection] = useState<boolean>(false);
  const [hover, setHover] = useState<boolean>(false);
  const [showReport, setShowReportModal] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [addArtModal, setAddArtModal] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [sameUser] = useState<boolean>(
    item.user_id === user?.id ? true : false
  );

  const sameUserOptions = [
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

  const handleShowReportModal = () => {
    setShowReportModal(true);
  };

  const handleCloseReportModal = () => {
    setShowReportModal(false);
  };

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

  const handleReport = async (type: any, reason: string) => {
    let obj: any = {
      type: type,
      reason: reason,
      reportable_id: item?.id,
    };

    let formBody = new FormData();
    Object.keys(obj).forEach((key) => {
      formBody.append(key, obj[key]);
    });

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

  const handleDelete = () => {
    setLoader(true);
    DeleteArt(item?.id)
      .then(({ data: { message } }) => {
        toastMessage("success", message);

        if (allArtData && setAllArtData) {
          let temp = [...allArtData];
          let index = temp.findIndex((i: any) => i?.id === item?.id);
          if (index > -1) {
            temp.splice(index, 1);
          }
          setAllArtData(temp);
        }
        setLoader(false);
      })
      .catch((err) => {
        console.log("err", err);
        setLoader(false);
      });
  };

  return (
    <div className={classNames(styles.artContainer, "mt-4 d-flex flex-column")}>
      <div
        className={classNames("position-relative")}
        onMouseEnter={() => {
          setHover(true);
        }}
        onMouseLeave={() => {
          setHover(false);
        }}
      >
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
          role="button"
          onClick={() => {
            if (isInArtSelection) {
              action?.();
            } else navigate(routeConstant.art.path.replace(":id", item?.id));
          }}
        />
        {!!hover && (
          <div
            className={classNames(
              styles.infoContainer,
              "d-flex flex-column px-3 py-2"
            )}
          >
            <label className={classNames(styles.infoTitle)}>
              {item?.title}
            </label>
            <label className={classNames(styles.infoSubTitle)}>
              {item?.description}
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
          className={classNames("d-flex ")}
          onClick={() => {
            if (isInArtSelection) {
              action?.();
            } else navigate(routeConstant.art.path.replace(":id", item?.id));
          }}
        >
          <TypeCard
            time={
              roundNum(
                item?.view_count ? item?.view_count : item?.view_count,
                1
              ) + " Views"
            }
            type="Art"
            isview
            item={item}
          />
          <StoryCount
            count={item?.post_count ? item?.post_count : item?.posts_count}
            containerStyle={classNames("ms-1")}
          />
        </div>
        {!isInArtSelection && (
          <Icons.MoreVertical
            className={classNames(styles.moreIcon)}
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpenSelection(!openSelection);
            }}
          />
        )}
        <OptionsDropDown
          openSelection={openSelection}
          setOpenSelection={setOpenSelection}
          options={sameUser ? sameUserOptions : options}
          customContainer={classNames(styles.optionsContainer)}
        />
      </div>
      <label
        className={classNames(styles.title, "mt-2")}
        role="button"
        onClick={() => {
          if (isInArtSelection) {
            action?.();
          } else navigate(routeConstant.art.path.replace(":id", item?.id));
        }}
      >
        {item?.user?.name}
      </label>
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
        handleSubmit={handleDelete}
        loader={loader}
      />
      <ReportModal
        showModal={showReport}
        handleShow={handleShowReportModal}
        handleClose={handleCloseReportModal}
        handleSubmit={async (type, reason) => await handleReport(type, reason)}
        reportText="Art"
        loader={loader}
      />
    </div>
  );
};

export default SaveArtCard;
