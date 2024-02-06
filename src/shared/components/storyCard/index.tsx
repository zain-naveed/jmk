import { Icons, Images } from "assets";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import useWindowDimensions from "shared/hooks/useWindowDimentions";
import { allForms } from "shared/modal/auth/constants";
import PostStoryModal from "shared/modal/postStory";
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
import LinesEllipsis from "react-lines-ellipsis";
import ReadMore from "shared/modal/readMoreModal";

interface StoryCardProps {
  customContainer: any;
  item: any;
}

const StoryCard = ({ customContainer, item }: Partial<StoryCardProps>) => {
  const [show, setShow] = useState<boolean>(false);
  const handleClose = () => setShow(false);
  const handleOpen = () => setShow(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const { user } = useSelector((state: any) => state.root);
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
    dispatch(
      setStoryReducer({
        artCover: item?.full_cover_image_path,
        artTitle: item?.title,
        artDesc: item?.description,
        artId: item?.id,
        contest: false,
        category: "Poetry",
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
          "d-flex  position-relative mt-5 mt-sm-3 mt-md-5 flex-row flex-sm-column gap-2 gap-sm-4",
          styles.contestCardContainer,
          customContainer && customContainer
        )}
        onClick={() =>
          navigate(routeConstant.art.path.replace(":id", item?.id))
        }
      >
        {item?.challenge ? (
          <div className={classNames(styles.submitStoryContainer)}>
            <label className={classNames(styles.submitLabel, "ms-1")}>
              Writing challenge
            </label>
          </div>
        ) : null}
        <img
          src={
            item?.cover_image
              ? item?.full_cover_image_path
              : item?.image
              ? item?.full_image_path
              : Images.Art
          }
          className={classNames(styles.artStyle)}
          alt="art"
          role="button"
        />

        <div className={classNames("w-100")}>
          <div className={classNames("d-flex flex-wrap gap-2")}>
            <TypeCard
              time={item?.created_at}
              type={"Art"}
              containerStyle={classNames(styles.typeContainer)}
              fontSize={width > 576 ? 12 : width > 400 && width < 576 ? 8 : 7}
              item={item}
            />
            <StoryCount
              count={item?.post_count}
              containerStyle={classNames(styles.typeContainer)}
              fontSize={width > 576 ? 12 : width > 400 && width < 576 ? 8 : 7}
              dotSize={isMobileView ? 3 : 6}
            />
          </div>
          {isMobileView ? (
            <div
              className={classNames(
                "d-flex align-items-start justify-content-between mt-1"
              )}
            >
              {item?.challenge ? (
                <label
                  className={classNames(
                    // styles.storyLabel,
                    styles.readMoreMobile
                  )}
                >
                  <LinesEllipsis
                    text={item?.challenge}
                    maxLine="2"
                    ellipsis={
                      <>
                        ...{" "}
                        <span
                          onClick={(e: any) => handleReadMore(e)}
                          // className={styles.readMoreText}
                          style={{ fontSize: "14px" }}
                        >
                          Read more
                        </span>
                      </>
                    }
                    trimRight
                    basedOn="letters"
                  />
                </label>
              ) : (
                <label className={classNames(styles.storyLabel)}>
                  {item?.description}
                </label>
              )}
            </div>
          ) : null}

          {!isMobileView ? (
            <>
              {item?.challenge ? (
                <label className={styles.readMoreText}>
                  <LinesEllipsis
                    text={item?.challenge}
                    maxLine={width < 576 ? "4" : "4"}
                    ellipsis={
                      <>
                        ...{" "}
                        <span onClick={(e: any) => handleReadMore(e)}>
                          Read more
                        </span>
                      </>
                    }
                    trimRight
                    basedOn="letters"
                  />
                </label>
              ) : (
                <label className={classNames(styles.descStyle, "my-3")}>
                  {item?.description}{" "}
                </label>
              )}
            </>
          ) : null}

          <div
            className={classNames(
              "d-flex align-items-center justify-content-start  gap-1 gap-sm-3",
              isMobileView ? "" : "w-100"
            )}
          >
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

            <CustomButton
              label="Contribute"
              style2
              Icon={Icons.Pencil}
              customBtnContainer={classNames(
                styles.btnContainer,
                "gap-1 gap-sm-0"
              )}
              onClick={(e) => {
                e.stopPropagation();
                user?.isLoggedIn
                  ? handleContribution()
                  : handleShowSignInModal();
              }}
              customIconStyle={classNames(styles.btnIcon)}
            />
          </div>
        </div>
      </div>
      <PostStoryModal
        show={showPostStory}
        handleClose={handleClosePostStoryModal}
        handleShow={handleShowPostStoryModal}
        nextModalName={null}
      />
      <ReadMore show={show} handleClose={handleClose} item={item} />
    </>
  );
};

export default StoryCard;
