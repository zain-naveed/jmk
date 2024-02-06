import { Images } from "assets";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import SaveArtCard from "shared/components/saveArtCard";
import SaveArtCardLoader from "shared/loader/saveArtCardLoader";
import { GetSavedArt } from "shared/services/userService";
import styles from "../style.module.scss";

interface ArtsListProps {
  endReach: boolean;
}

const ArtsList = ({ endReach }: ArtsListProps) => {
  const pageRef = useRef<number>(1);
  const artsRef = useRef<any>([]);
  const [loadMore, setLoadMore] = useState<boolean>(false);
  const [artList, setArtList] = useState<string[]>([]);
  const [initialLoading, setInitialLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const getArt = () => {
    GetSavedArt({ page: pageRef.current })
      .then(
        ({
          data: {
            data: { data, last_page },
            message,
            status,
          },
        }) => {
          if (status) {
            if (pageRef.current === last_page) {
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
      getArt();
    }
    // eslint-disable-next-line
  }, [endReach]);

  useEffect(() => {
    pageRef.current = 1;
    artsRef.current = [];
    setArtList([]);
    setInitialLoading(true);
    getArt();
    // eslint-disable-next-line
  }, []);

  return (
    <div className={classNames("row ", styles.topLevelContainer)}>
      {initialLoading ? (
        <>
          <SaveArtCardLoader />
          <SaveArtCardLoader />
          <SaveArtCardLoader />
        </>
      ) : artList.length ? (
        <>
          {artList?.map((art: any, inx) => {
            return (
              <SaveArtCard
                item={art}
                allArtData={artList}
                setAllArtData={setArtList}
                key={inx}
              />
            );
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
        </div>
      )}
    </div>
  );
};

export default ArtsList;
