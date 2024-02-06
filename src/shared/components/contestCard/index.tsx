import { Icons, Images } from "assets";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { allForms } from "shared/modal/auth/constants";
import { modals } from "shared/modal/commonModal/constants";
import PostStoryModal from "shared/modal/postStory";
import ReadMore from "shared/modal/readMoreModal";
import {
  resetStoryReducer,
  setStoryReducer,
} from "shared/redux/reducers/postStorySlice";
import { setSignInReducer } from "shared/redux/reducers/sigInSlice";
import { routeConstant } from "shared/routes/routeConstant";
import CustomButton from "../customButton";
import StoryCount from "../storyCount";
import TypeCard from "../typeCard";
import styles from "./style.module.scss";
import useWindowDimensions from "shared/hooks/useWindowDimentions";
// import { typesEnum } from "pages/profile/constants";
import LinesEllipsis from "react-lines-ellipsis";

interface ContestCardProps {
  customContainer: any;
  item: any;
}

const ContestCard = ({ customContainer, item }: Partial<ContestCardProps>) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const { user } = useSelector((state: any) => state.root);
  const [showPostStory, setShowPostStory] = useState<boolean>(false);
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const handleClose = () => setShow(false);
  const handleOpen = () => setShow(true);

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
    dispatch(
      setStoryReducer({
        artCover: item?.full_image_path,
        artTitle: item?.title,
        artDesc: item?.description,
        artId: item?.id,
        contestId: item?.contest?.id,
        contest: true,
        category: "Poetry",
        contestEndDate: item?.contest?.end_date,
        user_id: item?.user?.id,
      })
    );
    handleShowPostStoryModal();
  };
  useEffect(() => {
    if (width > 576) {
      setIsMobileView(false);
    } else {
      setIsMobileView(true);
    }
    // eslint-disable-next-line
  }, [width]);

  const handleReadMore = (e: any) => {
    e.stopPropagation();
    handleOpen();
  };

  return (
    <>
      <div
        className={classNames(
          "d-flex flex-column position-relative",
          styles.contestCardContainer,
          customContainer && customContainer
        )}
        onClick={() =>
          navigate(routeConstant.art.path.replace(":id", item?.id))
        }
      >
        <img
          src={
            item?.cropped_image
              ? item?.cropped_image
              : item?.cover_image
              ? item?.full_cover_image_path
              : item?.image
              ? item?.full_image_path
              : Images.Art
          }
          className={classNames(styles.artStyle)}
          alt="art"
          role="button"
        />
        {item?.challenge ? (
          <div className={classNames(styles.submitStoryContainer)}>
            {/* <Icons.Apperture className={classNames(styles.appertureIcon)} /> */}
            <label className={classNames(styles.submitLabel, "ms-1")}>
              Writing challenge
            </label>
          </div>
        ) : null}
        {item?.contest ? (
          <div
            className={classNames(styles.submitStoryContainer)}
            onClick={(e) => {
              e.stopPropagation();
              if (user?.isLoggedIn) {
                handleContribution();
              } else {
                handleShowSignInModal();
              }
            }}
          >
            <Icons.Apperture className={classNames(styles.appertureIcon)} />
            <label className={classNames(styles.submitLabel, "ms-1")}>
              Submit Story for Contest
            </label>
          </div>
        ) : null}

        <div
          className={classNames(
            isMobileView ? "d-flex mt-3 mb-3" : "d-flex mt-4 mb-3"
          )}
        >
          <TypeCard
            time={item?.created_at}
            type="Art"
            containerStyle={classNames(styles.hieght)}
            fontSize={isMobileView ? 9 : 12}
            item={item}
          />
          <StoryCount
            count={item?.post_count}
            containerStyle={classNames("ms-2", styles.hieght)}
            fontSize={isMobileView ? 9 : 12}
            dotSize={isMobileView ? 4 : 6}
          />
        </div>

        {item?.challenge || item?.contest?.instructions ? (
          <label
            className={classNames(
              // styles.storyLabel,
              styles.readMoreText
            )}
          >
            <LinesEllipsis
              text={
                item?.challenge ? item?.challenge : item?.contest?.instructions
              }
              maxLine={width > 576 ? "3" : "4"}
              ellipsis={
                <>
                  ...{" "}
                  <span
                    onClick={(e: any) => handleReadMore(e)}
                    // className={styles.readMoreText}
                    style={
                      width > 576
                        ? { fontSize: "16px", cursor: "pointer" }
                        : { fontSize: "12px" }
                    }
                  >
                    Read more
                  </span>
                </>
              }
              trimRight
              basedOn="letters"
            />
          </label>
        ) : item?.winner_story && item?.winner_story?.is_public ? (
          <div
            className={classNames(styles.descStyle)}
            dangerouslySetInnerHTML={{ __html: item?.winner_story?.story }}
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(
                routeConstant.story.path.replace(":id", item?.winner_story?.id)
              );
            }}
          />
        ) : (
          <label className={classNames(styles.descStyle)} role="button">
            {item?.description}
          </label>
        )}
        <div
          className={classNames(
            "d-flex justify-content-between w-100 flex-row  flex-md-column flex-lg-row",
            styles.actionContainer
          )}
        >
          <div className={classNames("d-flex align-items-center")}>
            <CustomButton
              label="Read Stories"
              style2
              Icon={Icons.File}
              onClick={(e) => {
                e.stopPropagation();
                navigate(routeConstant.art.path.replace(":id", item?.id));
              }}
              customBtnContainer={classNames(
                styles.btnContainer,
                "gap-1 gap-sm-0"
              )}
              customIconStyle={classNames(styles.btnIcon)}
            />
            {/* {user?.user?.type !== typesEnum.artist ? ( */}
            <CustomButton
              label="Contribute"
              style2
              Icon={Icons.Pencil}
              customBtnContainer={classNames(
                "ms-2 ms-md-3 gap-1 gap-sm-0",
                styles.btnContainer
              )}
              onClick={(e) => {
                e.stopPropagation();
                if (user?.isLoggedIn) {
                  handleContribution();
                } else {
                  handleShowSignInModal();
                }
              }}
              customIconStyle={classNames(styles.btnIcon)}
            />
            {/* ) : null} */}
          </div>
        </div>
      </div>
      <PostStoryModal
        show={showPostStory}
        handleClose={handleClosePostStoryModal}
        handleShow={handleShowPostStoryModal}
        nextModalName={modals.winner.name}
      />
      <ReadMore show={show} handleClose={handleClose} item={item} />
    </>
  );
};

export default ContestCard;
