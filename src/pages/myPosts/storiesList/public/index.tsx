import { Icons, Images } from "assets";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import NoContentCard from "shared/components/noContentCard";
import PostCard from "shared/components/postCard";
import OptionsDropDown from "shared/dropsDowns/optionsDropDown";
import useDebounce from "shared/hooks/useDebounce";
import PostCardLoader from "shared/loader/PostCardLoader";
import { getAllPosts } from "shared/services/storyService";
import styles from "../style.module.scss";

interface ListProps {
  endReach: boolean;
}

const PublicStories = ({ endReach }: ListProps) => {
  const {
    user: { user },
  } = useSelector((state: any) => state.root);

  const pageRef = useRef<number>(1);
  const storiesRef = useRef<any>([]);

  const [loadMore, setLoadMore] = useState<boolean>(false);
  const [stories, setStories] = useState<string[]>([]);
  const [initialLoading, setInitialLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [openSelection, setOpenSelection] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("Most Recent");
  const [selection, setSelection] = useState<string>("most_recent");

  const options = [
    {
      title: "All",
      Icon: null,
      action: (e: any) => {
        e.stopPropagation();
        setSelectedFilter("All");
        setOpenSelection(false);
        setSelection("all");
      },
    },
    {
      title: "Most Recent",
      Icon: null,
      action: (e: any) => {
        e.stopPropagation();
        setSelectedFilter("Most Recent");
        setOpenSelection(false);
        setSelection("most_recent");
      },
    },
    {
      title: "Most Liked",
      Icon: null,
      action: (e: any) => {
        e.stopPropagation();
        setSelectedFilter("Most Liked");
        setOpenSelection(false);
        setSelection("most_liked");
      },
    },
    {
      title: "Most Views",
      Icon: null,
      action: (e: any) => {
        e.stopPropagation();
        setSelectedFilter("Most Views");
        setOpenSelection(false);
        setSelection("most_views");
      },
    },
    {
      title: "Ascending A-Z",
      Icon: null,
      action: (e: any) => {
        e.stopPropagation();
        setSelectedFilter("Ascending A-Z");
        setOpenSelection(false);
        setSelection("a-z");
      },
    },
    {
      title: "Descending Z-A",
      Icon: null,
      action: (e: any) => {
        e.stopPropagation();
        setSelectedFilter("Descending Z-A");
        setOpenSelection(false);
        setSelection("z-a");
      },
    },
  ];

  const getStories = () => {
    getAllPosts({
      id: user?.id,
      page: pageRef.current,
      filter: selection,
      type: "published",
      search: search,
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
    var elem: any = document.getElementById("my-posts");
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
    pageRef.current = 1;
    storiesRef.current = [];
    setStories([]);
    setInitialLoading(true);
    getStories();
    // eslint-disable-next-line
  }, [searchValue, selection]);

  useDebounce(
    () => {
      setSearchValue(search);
    },
    [search],
    800
  );

  return (
    <>
      <div
        className={classNames(
          "d-flex align-items-center justify-content-between w-100 mt-3"
        )}
      >
        <label
          className={classNames(styles.selectedFilter, "d-none d-md-flex")}
        >
          {selectedFilter}
        </label>
        <div
          className={classNames(
            "d-flex flex-column-reverse flex-sm-row align-items-start align-items-sm-center justify-content-center gap-2"
          )}
        >
          <div
            className={classNames(
              "d-flex  align-items-center justify-content-center gap-1 gap-sm-2 position-relative px-3",
              styles.filterContainer
            )}
            role="button"
            onClick={() => setOpenSelection(!openSelection)}
          >
            <Icons.Filter className={classNames(styles.filterIcon)} />
            <label className={classNames(styles.filterLabel)} role="button">
              {selectedFilter}
            </label>
            <OptionsDropDown
              openSelection={openSelection}
              setOpenSelection={setOpenSelection}
              options={options}
              customContainer={classNames(styles.optionsContainer)}
            />
          </div>
          <div className={classNames(styles.searchContainer, "px-3 d-flex")}>
            <div className={classNames("w-100 d-flex  align-items-center")}>
              <Icons.Search className={classNames(styles.iconStyle)} />
              <input
                placeholder="Search"
                className={classNames(styles.searchInput, "ms-1")}
                value={search}
                onChange={(e) => setSearch?.(e.target.value)}
              />
            </div>
            {search &&
              (search.length > 0 ? (
                <Icons.Cross
                  role="button"
                  onClick={() => {
                    setSearch("");
                  }}
                />
              ) : null)}
          </div>
        </div>
      </div>
      <div className={classNames("d-flex row px-3 px-sm-0")}>
        {initialLoading ? (
          <>
            <PostCardLoader />
            <PostCardLoader />
          </>
        ) : stories?.length > 0 ? (
          <>
            {stories?.map((item: any, inx) => {
              return (
                <PostCard
                  {...item}
                  key={inx}
                  item={item}
                  items={stories}
                  setItems={setStories}
                  isPublic={true}
                />
              );
            })}
            {loading ? (
              <>
                <PostCardLoader />
                <PostCardLoader />
              </>
            ) : null}
          </>
        ) : (
          <div className={classNames("my-5")}>
            <NoContentCard Icon={Images.NoData} label1="No Stories found" />
          </div>
        )}
      </div>
    </>
  );
};

export default PublicStories;
