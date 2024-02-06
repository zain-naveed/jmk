import { Icons } from "assets";
import classNames from "classnames";
import { typesEnum } from "pages/profile/constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "shared/components/customButton";
import Footer from "shared/components/footer";
import NavWrapper from "shared/components/navWrapper";
import { useOnScroll } from "shared/hooks/useOnScroll";
import AddArt from "shared/modal/addArt";
import PostStoryModal from "shared/modal/postStory";
import {
  resetStoryReducer,
  setStoryReducer,
} from "shared/redux/reducers/postStorySlice";
import ArtsList from "./artsList";
import {
  verticaArtistTabsEnum,
  verticalArtistTabs,
  verticalWriitersTabs,
  verticalWritersTabsEnum,
} from "./constants";
import DraftsList from "./draftsList";
import StoriesList from "./storiesList";
import styles from "./style.module.scss";

const MyPosts = () => {
  const {
    user: { user },
  } = useSelector((state: any) => state.root);
  const dispatch = useDispatch();
  const [endReach, onScroll] = useOnScroll("my-posts");
  const [verticalTab, setVerticalTab] = useState<string>("");
  const [verticalTabs, setVerticalTabs] = useState<string[]>([]);
  const [verticalTabsEnum, setVerticalTabsEnum] = useState<any>({});
  const [showPostStory, setShowPostStory] = useState<boolean>(false);
  const [openArt, setOpenArt] = useState<boolean>(false);

  const handleCreatePost = () => {
    dispatch(resetStoryReducer());
    dispatch(
      setStoryReducer({
        category: "Poetry",
        wordCount: 255,
        isPublic: false,
        user_id: user?.id,
      })
    );
    handleShowPostStoryModal();
  };

  const handleCreateArt = () => {
    handleOpenArtModal();
  };

  const handleShowPostStoryModal = () => {
    setShowPostStory(true);
  };
  const handleClosePostStoryModal = () => {
    setShowPostStory(false);
  };

  const handleOpenArtModal = () => {
    setOpenArt(true);
  };

  const handleCloseArtModal = () => {
    setOpenArt(false);
  };

  useEffect(() => {
    if (user?.type === typesEnum.writer) {
      setVerticalTabsEnum(verticalWritersTabsEnum);
      setVerticalTab(verticalWriitersTabs[0]);
      setVerticalTabs(verticalWriitersTabs);
    } else if (user?.type === typesEnum.artist) {
      setVerticalTabsEnum(verticaArtistTabsEnum);
      setVerticalTab(verticalArtistTabs[0]);
      setVerticalTabs(verticalArtistTabs);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div
      className={classNames(styles.topMainContainer)}
      id="my-posts"
      onScroll={onScroll}
    >
      <NavWrapper />
      <div className={classNames(styles.myPostsContainer)}>
        <div className={classNames(styles.customContainer)}>
          <div
            className={classNames(
              "d-flex w-100 align-items-start justify-content-between py-5 px-3 px-sm-0"
            )}
          >
            <div
              className={classNames(
                "d-flex flex-column align-items-start jusify-content-between"
              )}
            >
              <label className={classNames(styles.title)}>All Posts</label>
              <label className={classNames(styles.subTitle)}>
                Create and manage all your posts
              </label>
            </div>
            <div className={classNames("position-relative")}>
              <CustomButton
                label={
                  user?.type === typesEnum.writer ? "New Story" : "New Art"
                }
                Icon={Icons.Plus}
                isBlackIcon
                customIconStyle={classNames("me-1", styles.plusIcon)}
                customBtnContainer={classNames(styles.plusBtn, "px-3")}
                onClick={() => {
                  if (user?.type === typesEnum.writer) {
                    handleCreatePost();
                  } else if (user?.type === typesEnum.artist) {
                    handleCreateArt();
                  }
                }}
              />
            </div>
          </div>
          <div className={classNames("d-flex row px-3 px-sm-0")}>
            <div className={classNames("col-3 col-sm-2 d-flex flex-column")}>
              {verticalTabs?.map((item, inx) => {
                return (
                  <div
                    className={classNames(
                      "d-flex align-items-center  justify-content-center justify-content-md-start w-100 py-2 px-0 px-md-3",
                      item === verticalTab
                        ? styles.activeVerticalTabContainer
                        : styles.inActiveVerticalTabContainer
                    )}
                    key={inx}
                    onClick={() => {
                      var elem: any = document.getElementById("my-posts");
                      elem.scrollTop = 0;
                      setVerticalTab(item);
                    }}
                    role="button"
                  >
                    <label
                      className={classNames(
                        item === verticalTab
                          ? styles.activeVerticalTabLabel
                          : styles.inActiveVerticalTabLabel
                      )}
                      role="button"
                    >
                      {item}
                    </label>
                  </div>
                );
              })}
            </div>
            <div className={classNames("col-9 col-sm-10 mb-5")}>
              {verticalTab === verticalTabsEnum?.stories ? (
                <StoriesList endReach={endReach} />
              ) : verticalTab === verticalTabsEnum?.art ? (
                <ArtsList endReach={endReach} />
              ) : (
                verticalTab === verticalTabsEnum?.drafts && (
                  <DraftsList endReach={endReach} />
                )
              )}
            </div>
          </div>
          <PostStoryModal
            show={showPostStory}
            handleClose={handleClosePostStoryModal}
            handleShow={handleShowPostStoryModal}
            nextModalName={null}
          />
          <AddArt
            show={openArt}
            handleClose={handleCloseArtModal}
            handleOpen={handleOpenArtModal}
          />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default MyPosts;
