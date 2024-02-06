import { Images } from "assets";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import SaveArtCard from "shared/components/saveArtCard";
import SaveArtCardLoader from "shared/loader/saveArtCardLoader";
import { SearchPost } from "shared/services/storyService";
import styles from "../style.module.scss";

const ArtsList = ({ searchText, endReach }: any) => {
  const pageRef = useRef<number>(1);
  const artsRef = useRef<any>([]);
  const [loadMore, setLoadMore] = useState<boolean>(false);
  const [artList, setArtList] = useState<string[]>([]);
  const [initialLoading, setInitialLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const getArt = () => {
    SearchPost({
      text: searchText,
      type: "art",
      page: pageRef.current,
      pagination: 6,
    })
      .then(
        ({
          data: {
            data: { data, meta },
            message,
            status,
          },
        }) => {
          if (status) {
            if (meta?.current_page === meta?.last_page) {
              setLoadMore(false);
            } else {
              setLoadMore(true);
            }
            let cloneArts: any = [...artsRef.current];
            cloneArts = [...cloneArts, ...data];
            artsRef.current = cloneArts;
            setArtList(cloneArts);
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
    var elem: any = document.getElementById("search-screen");
    if (
      endReach &&
      elem.scrollTop !== 0 &&
      !loading &&
      loadMore &&
      !initialLoading
    ) {
      setLoading(true);
      pageRef.current = pageRef.current + 1;
      getArt();
    }
    // eslint-disable-next-line
  }, [endReach]);

  useEffect(() => {
    if (!initialLoading) {
      artsRef.current = [];
      setArtList([]);
      pageRef.current = 1;
      setInitialLoading(true);
      getArt();
    }

    // eslint-disable-next-line
  }, [searchText]);

  return (
    <div className={classNames("row mb-3", styles.topLevelContainer)}>
      {initialLoading ? (
        <>
          <SaveArtCardLoader />
          <SaveArtCardLoader />
          <SaveArtCardLoader />
        </>
      ) : artList.length ? (
        <>
          {artList?.map((art: any, inx) => {
            return <SaveArtCard item={art} key={inx} />;
          })}

          {loading ? (
            <>
              <SaveArtCardLoader />
              <SaveArtCardLoader />
              <SaveArtCardLoader />
            </>
          ) : null}
        </>
      ) : (
        <div className={classNames("d-flex flex-column align-items-center")}>
          <Images.NoData style={{ marginTop: "5%" }} />
          <label className={styles.noResults}>No results found</label>
          <br />
          <label className={styles.noResultsSub}>
            You search "{searchText}" didn’t match any stories OR art. Please
            try again.
          </label>
        </div>
      )}
    </div>
  );
};

export default ArtsList;
