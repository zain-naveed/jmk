import { Images } from "assets";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import SaveStoryCard from "shared/components/saveStoryCard";
import SaveStoryCardLoader from "shared/loader/saveStoryCardLoader";
import { GetSavedStories } from "shared/services/userService";
import styles from "../style.module.scss";

interface StoriesListProps {
  endReach: boolean;
}

const StoriesList = ({ endReach }: StoriesListProps) => {
  const pageRef = useRef<number>(1);
  const storiesRef = useRef<any>([]);
  const [loadMore, setLoadMore] = useState<boolean>(false);
  const [stories, setStories] = useState<string[]>([]);
  const [initialLoading, setInitialLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const getSaveStories = () => {
    GetSavedStories({ page: pageRef.current })
      .then(
        ({
          data: {
            data: { data, meta },
            status,
            message,
          },
        }) => {
          if (status) {
            if (meta?.current_page === meta.last_page) {
              setLoadMore(false);
            } else {
              setLoadMore(true);
            }
            let cloneStories: any = [...storiesRef.current];
            cloneStories = [...cloneStories, ...data];
            storiesRef.current = cloneStories;
            setStories(cloneStories);
          } else {
            console.log("Error", message);
          }
        }
      )
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => {
        setLoading(false);
        setInitialLoading(false);
      });
  };

  useEffect(() => {
    var elem: any = document.getElementById("save-stories");
    if (
      endReach &&
      elem.scrollTop !== 0 &&
      !loading &&
      loadMore &&
      !initialLoading
    ) {
      setLoading(true);
      pageRef.current = pageRef.current + 1;
      getSaveStories();
    }
    // eslint-disable-next-line
  }, [endReach]);

  useEffect(() => {
    pageRef.current = 1;
    storiesRef.current = [];
    setStories([]);
    setInitialLoading(true);
    getSaveStories();
    // eslint-disable-next-line
  }, []);

  return (
    <div className={classNames("row ")}>
      {initialLoading ? (
        <>
          <SaveStoryCardLoader />
          <SaveStoryCardLoader />
        </>
      ) : stories.length ? (
        <>
          {stories?.map((item: any, inx) => {
            return <SaveStoryCard storyData={item} key={inx} />;
          })}
          {loading ? (
            <>
              <SaveStoryCardLoader />
              <SaveStoryCardLoader />
            </>
          ) : null}
        </>
      ) : (
        <div className={classNames("d-flex flex-column align-items-center")}>
          <Images.NoData style={{ marginTop: "5%" }} />
          <label className={styles.noResults}>No Posts found</label>
          <br />
        </div>
      )}
    </div>
  );
};

export default StoriesList;
