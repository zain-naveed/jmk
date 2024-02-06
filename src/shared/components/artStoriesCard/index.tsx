import classNames from "classnames";
import { storiesType } from "shared/utils/constants";
import StorySuggestionCard from "../storySuggestionCard";
import { useEffect, useRef, useState } from "react";
import styles from "./style.module.scss";
import { useParams } from "react-router";
import { GetArtStories } from "shared/services/artsService";
import { useSelector } from "react-redux";
import StorySuggestionCardLoader from "shared/loader/storySuggestionLoader";
import NoContentCard from "../noContentCard";
import { Images } from "assets";

interface ArtStoriesProps {
  endReach: boolean;
  stories: any[];
  setStories: (val: any) => void;
}

const ArtStories = ({ endReach, stories, setStories }: ArtStoriesProps) => {
  const {
    user: { user },
  } = useSelector((state: any) => state.root);
  const { id } = useParams();
  const pageRef = useRef<number>(1);
  const storiesRef = useRef<any>([]);
  const filtersRef = useRef<[]>([]);

  const [loadMore, setLoadMore] = useState<boolean>(false);

  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFilters, setSelectedFilters] = useState<number[]>([]);

  const getStories = () => {
    GetArtStories({
      id: id,
      page: pageRef.current,
      pagination: 6,
      filter: JSON.stringify(filtersRef.current),
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
            if (pageRef.current === meta.last_page) {
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
        console.log("Error", err);
      })
      .finally(() => {
        setLoading(false);
        setInitialLoading(false);
      });
  };

  useEffect(() => {
    if (endReach && !loading && loadMore && !initialLoading) {
      setLoading(true);
      pageRef.current = pageRef.current + 1;
      getStories();
    }
    // eslint-disable-next-line
  }, [endReach]);

  useEffect(() => {
    pageRef.current = 1;
    storiesRef.current = [];
    setStories([]);
    setInitialLoading(true);
    getStories();
    // eslint-disable-next-line
  }, [selectedFilters]);
  return (
    <>
      <div
        className={classNames(
          "w-100 d-flex align-items-start align-items-lg-center justify-content-between px-3 px-sm-0 flex-column flex-lg-row"
        )}
      >
        <label className={classNames(styles.contributeLabel)}>
          Read The Submitted Stories Below or Submit Your Own
        </label>
        <div className={classNames("d-flex gap-2 mt-3 mt-lg-0 flex-wrap")}>
          {storiesType.map((item, key) => {
            return (
              <FilterTag
                item={item}
                key={key}
                setSelectedFilters={setSelectedFilters}
                selectedFilters={selectedFilters}
                filtersRef={filtersRef}
                loading={initialLoading || loading}
              />
            );
          })}
        </div>
      </div>

      {initialLoading ? (
        <div className={classNames("d-flex row")}>
          <StorySuggestionCardLoader />
          <StorySuggestionCardLoader />
          <StorySuggestionCardLoader />
          <StorySuggestionCardLoader />
        </div>
      ) : (
        <div
          className={classNames(
            "d-flex flex-column flex-sm-row flex-wrap mt-2 mb-5 px-3 px-sm-0 justify-content-start gap-0"
          )}
        >
          {stories?.length > 0 ? (
            <>
              {stories?.map((item: any, inx) => {
                return (
                  <StorySuggestionCard
                    key={inx}
                    item={item}
                    isPrivate={item?.user?.id === user?.id}
                    setStories={setStories}
                    stories={stories}
                  />
                );
              })}
            </>
          ) : (
            <div className={classNames("mt-5 w-100")}>
              <NoContentCard Icon={Images.NoData} label1="No results found" />
            </div>
          )}

          {loading ? (
            <div className={classNames("d-flex row")}>
              <StorySuggestionCardLoader />
              <StorySuggestionCardLoader />
            </div>
          ) : null}
        </div>
      )}
    </>
  );
};

const FilterTag = ({
  item,
  setSelectedFilters,
  selectedFilters,
  filtersRef,
  loading,
}: any) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const handleSelection = () => {
    if (!loading) {
      setIsActive(!isActive);
      if (!isActive) {
        let temp = filtersRef.current.filter((itm: any, inx: number) => {
          return itm !== item?.value;
        });
        temp.push(item?.value);
        setSelectedFilters(temp);
        filtersRef.current = temp;
      } else {
        let temp = filtersRef.current.filter((itm: any, inx: number) => {
          return itm !== item?.value;
        });
        setSelectedFilters(temp);
        filtersRef.current = temp;
      }
    }
  };
  return (
    <div
      className={classNames(isActive ? styles.activeTag : styles.inActiveTag)}
      role="button"
      onClick={() => {
        handleSelection();
      }}
    >
      <label
        className={classNames(
          isActive ? styles.activeLabel : styles.inActiveLabel,
          "px-2"
        )}
        role="button"
      >
        {item?.name}
      </label>
    </div>
  );
};

export default ArtStories;
