import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NoContentCard from "shared/components/noContentCard";
import StorySuggestionCard from "shared/components/storySuggestionCard";
import StorySuggestionCardLoader from "shared/loader/storySuggestionLoader";
import { setStoriesReducer } from "shared/redux/reducers/stories";
import { GetUserStories } from "shared/services/storyService";
import styles from "./styles.module.scss";
import { Images } from "assets";

interface StoriesListProps {
  isPrivate: boolean;
  endReach: boolean;
  id: number;
}

const StoriesList = ({
  isPrivate,
  endReach,
  id,
}: Partial<StoriesListProps>) => {
  const dispatch = useDispatch();
  const pageRef = useRef<number>(1);
  const storiesRef = useRef<any>([]);
  const { user } = useSelector((state: any) => state.root);
  const [loadMore, setLoadMore] = useState<boolean>(false);
  const [stories, setStories] = useState<string[]>([]);
  const [initialLoading, setInitialLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const getStories = () => {
    GetUserStories({ id: id, page: pageRef.current })
      .then(
        ({
          data: {
            data: { data, meta },
            message,
            status,
          },
        }) => {
          if (status) {
            if (pageRef.current === meta.last_page) {
              setLoadMore(false);
            } else {
              setLoadMore(true);
            }
            let cloneStories: any = [...storiesRef.current];
            cloneStories = [...cloneStories, ...data];
            storiesRef.current = cloneStories;
            if (isPrivate) {
              dispatch(
                setStoriesReducer({
                  stories: cloneStories,
                })
              );
            }
            setStories(cloneStories);
          } else {
            console.log("Error", message);
          }
        }
      )
      .catch((err) => {
        console.log("Error", err);
      })
      .finally(() => {
        setLoading(false);
        setInitialLoading(false);
      });
  };

  useEffect(() => {
    let doc: any = window.document.getElementById("mainContainer");
    let nested: any = window.document.getElementById("scroll");

    if (doc) {
      doc.style.overflowY = "visible";
      nested.style.overflowY = "scroll";
      nested.style.overflowX = "hidden";
      nested.style.height = "calc(100vh)";
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    var elem: any = document.getElementById("user-profile");
    if (
      endReach &&
      elem.scrollTop !== 0 &&
      !loading &&
      loadMore &&
      !initialLoading
    ) {
      setLoading(true);
      pageRef.current = pageRef.current + 1;
      getStories();
    }
    // eslint-disable-next-line
  }, [endReach]);

  useEffect(() => {
    if (id) {
      pageRef.current = 1;
      storiesRef.current = [];
      setStories([]);
      setInitialLoading(true);
      getStories();
    }

    // eslint-disable-next-line
  }, [id, user?.isLoggedIn]);

  return (
    <div
      className={classNames(
        "d-flex flex-column mt-3",
        styles.topLevelContainer
      )}
    >
      {initialLoading ? (
        <>
          <StorySuggestionCardLoader isInProfile isPrivate={isPrivate} />
          <StorySuggestionCardLoader isInProfile isPrivate={isPrivate} />
        </>
      ) : (
        <>
          {stories.length > 0 ? (
            <>
              {stories?.map((item: any, inx) => {
                return (
                  <StorySuggestionCard
                    isInProfile
                    key={inx}
                    isPrivate={isPrivate}
                    item={item}
                    setStories={setStories}
                    stories={stories}
                    isPending={item?.status === "Pending" ? true : false}
                  />
                );
              })}
            </>
          ) : (
            <div className={classNames(styles.noContentTopContainer)}>
              <NoContentCard
                Icon={Images.NoData}
                label1="No Stories found"
                label2="Please start writing & uploading stories to see here."
              />
            </div>
          )}

          {loading ? (
            <>
              <StorySuggestionCardLoader isInProfile isPrivate={isPrivate} />
              <StorySuggestionCardLoader isInProfile isPrivate={isPrivate} />
            </>
          ) : null}
        </>
      )}
    </div>
  );
};

export default StoriesList;
