import { Images } from "assets";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import SaveStoryCard from "shared/components/saveStoryCard";
import SaveStoryCardLoader from "shared/loader/saveStoryCardLoader";
import { SearchPost } from "shared/services/storyService";
import styles from "../style.module.scss";

const StoriesList = ({ searchText, endReach }: any) => {
  const pageRef = useRef<number>(1);
  const storiesRef = useRef<any>([]);
  const [loadMore, setLoadMore] = useState<boolean>(false);
  const [stories, setStories] = useState<string[]>([]);
  const [initialLoading, setInitialLoading] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const getSaveStories = () => {
    SearchPost({
      text: searchText,
      type: "story",
      page: pageRef.current,
      pagination: 6,
    })
      .then(
        ({
          data: {
            data: { data, meta },
            status,
            message,
          },
        }) => {
          if (status) {
            if (meta?.current_page === meta?.last_page) {
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
        },
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
    var elem: any = document.getElementById("search-screen");
    if (endReach && elem.scrollTop !== 0 && !loading && loadMore && !initialLoading) {
      setLoading(true);
      pageRef.current = pageRef.current + 1;
      getSaveStories();
    }
    // eslint-disable-next-line
  }, [endReach]);

  useEffect(() => {
    if (!initialLoading) {
      storiesRef.current = [];
      setStories([]);
      pageRef.current = 1;
      getSaveStories();
      setInitialLoading(true);
    }

    // eslint-disable-next-line
  }, [searchText]);

  

  return (
    <div className={classNames("d-flex justify-content-start align-items-start row")}>
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
          <label className={styles.noResults}>No results found</label>
          <br />
          <label className={styles.noResultsSub}>You search "{searchText}" didn’t match any stories OR art. Please try again.</label>
        </div>
      )}
    </div>
  );
};

export default StoriesList;
