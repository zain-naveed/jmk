import { Icons } from "assets";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import NotFound from "shared/components/notFound";
import PostCard from "shared/components/postCard";
import OptionsDropDown from "shared/dropsDowns/optionsDropDown";
import useDebounce from "shared/hooks/useDebounce";
import PostCardLoader from "shared/loader/PostCardLoader";
import AddArt from "shared/modal/addArt";
import { getAllMyArts } from "shared/services/artsService";
import styles from "../storiesList/style.module.scss";

interface ListProps {
  endReach: boolean;
}

const ArtsList = ({ endReach }: ListProps) => {
  const {
    user: { user },
  } = useSelector((state: any) => state.root);

  const pageRef = useRef<number>(1);
  const artsRef = useRef<any>([]);
  const location = useLocation();
  const [loadMore, setLoadMore] = useState<boolean>(false);
  const [artList, setArtList] = useState<string[]>([]);
  const [initialLoading, setInitialLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [openArt, setOpenArt] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [openSelection, setOpenSelection] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("Most Recent");
  const [selection, setSelection] = useState<string>("most_recent");

  const handleOpenArtModal = () => {
    setOpenArt(true);
  };

  const handleCloseArtModal = () => {
    setOpenArt(false);
  };

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
      title: "Approved",
      Icon: null,
      action: (e: any) => {
        e.stopPropagation();
        setSelectedFilter("Approved");
        setOpenSelection(false);
        setSelection("approved");
      },
    },
    {
      title: "Unapproved",
      Icon: null,
      action: (e: any) => {
        e.stopPropagation();
        setSelectedFilter("Unapproved");
        setOpenSelection(false);
        setSelection("unapproved");
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

  useEffect(() => {
    if (location?.state?.art) {
      const artId = location?.state?.art?.id;
      const artExists = artList.find((item: any) => item?.id === artId);
      if (!artExists) {
        setArtList([...artList, location?.state?.art]);
      }
    }

    if (location?.state?.updateArt) {
      const artId = location?.state?.updateArt?.id;
      const updatedArtList = artList.map((item: any) =>
        item?.id === artId ? location?.state?.updateArt : item
      );
      setArtList(updatedArtList);
    }
    // eslint-disable-next-line
  }, [location]);

  const getArt = () => {
    getAllMyArts({
      id: user?.id,
      page: pageRef.current,
      filter: selection,
      search: search,
    })
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
    pageRef.current = 1;
    artsRef.current = [];
    artsRef.current = [];
    setArtList([]);
    setInitialLoading(true);
    getArt();
    // eslint-disable-next-line
  }, [searchValue, selection]);

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
      getArt();
    }
    // eslint-disable-next-line
  }, [endReach]);

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
            "d-flex flex-column-reverse flex-sm-row align-items-start align-items-sm-center justify-content-center gap-0"
          )}
        >
          <div
            className={classNames(
              "d-flex align-items-center justify-content-center gap-1 gap-sm-2 position-relative px-3 mt-2 mt-sm-0",
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
        ) : artList?.length ? (
          <>
            {artList?.map((item: any, inx) => {
              return (
                <PostCard
                  {...item}
                  key={inx}
                  artItem={item}
                  items={artList}
                  setItems={setArtList}
                  isArt={true}
                  item={item}
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
          <div>
            <NotFound
              title="Create your first Art"
              subtitle="Click on the “+ New Art” button to get started"
              buttonTitle="New Art"
              action={handleOpenArtModal}
            />
          </div>
        )}
      </div>

      <AddArt
        show={openArt}
        handleClose={handleCloseArtModal}
        handleOpen={handleOpenArtModal}
      />
    </>
  );
};

export default ArtsList;
