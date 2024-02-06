import classNames from "classnames";
import styles from "./style.module.scss";
import { useEffect, useRef, useState } from "react";
import { Icons } from "assets";
import { GetTags } from "shared/services/generalService";
import useDebounce from "shared/hooks/useDebounce";
import { Spinner } from "react-bootstrap";
import SkeletonLoader from "shared/loader/skeletonLoader";

interface CutomTagInputProps {
  tags: any[];
  setFieldValue: (key: any, val: any) => void;
  error?: any;
  title: string;
}

const CustomTagInput = ({
  title,
  tags,
  setFieldValue,
  error,
}: CutomTagInputProps) => {
  const pageRef = useRef<number>(1);
  const allTagsRef = useRef<[]>([]);
  const [onInputFocus, setOnInputFocus] = useState<boolean>(false);
  const [dropDown, setDropDown] = useState<boolean>(false);
  const [tag, setTag] = useState<string>("");
  const [tagValue, setTagValue] = useState<string>("");
  const [allTags, setAllTags] = useState<any[]>([]);
  const [initialLoading, setInitialLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadMore, setLoadMore] = useState<boolean>(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);

  const handleKeyPress = (e: any) => {
    if (e.keyCode === 13) {
      //enter
      e.preventDefault();
      if (tag) {
        let arr = tags?.filter((itm) => {
          return itm !== tag;
        });
        arr.push(tag);
        setFieldValue("tags", arr);
        setTag("");
      } else {
        if (
          activeSuggestionIndex > 0 &&
          activeSuggestionIndex < allTagsRef.current.length
        ) {
          let inp: any = allTagsRef.current[activeSuggestionIndex - 1];
          let arr = tags?.filter((itm) => {
            return itm !== inp.title;
          });
          let arr2: any = allTags?.filter((itm) => {
            return itm.title !== inp?.title;
          });
          allTagsRef.current = arr2;
          setAllTags(arr2);
          arr.push(inp?.title);
          setFieldValue("tags", arr);
        }
      }
      setActiveSuggestionIndex(0);
    } else if (e.keyCode === 38) {
      //up
      if (activeSuggestionIndex === 0) {
        setActiveSuggestionIndex(0);
      } else {
        setActiveSuggestionIndex(activeSuggestionIndex - 1);
      }
    } else if (e.keyCode === 40) {
      //down
      if (activeSuggestionIndex === allTagsRef.current.length) {
        setActiveSuggestionIndex(activeSuggestionIndex);
      } else {
        setActiveSuggestionIndex(activeSuggestionIndex + 1);
      }
    } else if (e.keyCode === 8) {
      //backspace
      if (tag === "") {
        let arr = [...tags];
        let item = arr.pop();
        let tempArr: any = [...allTagsRef.current];
        tempArr.push({ id: 1, title: item });
        setAllTags(tempArr);
        allTagsRef.current = tempArr;
        setFieldValue("tags", arr);
      }
    }
  };

  function handleOutsideClick(e: any) {
    const elem: any = document.getElementById("allTagsDropDown");

    if (elem) {
      if (!elem?.contains(e.target)) {
        setDropDown(false);
      }
    }
  }

  const handleTags = () => {
    GetTags({ page: pageRef.current, search: tagValue, pagination: 10 })
      .then(
        ({
          data: {
            data: {
              tags: { data, last_page, current_page },
            },
            message,
            status,
          },
        }) => {
          if (status) {
            if (current_page === last_page) {
              setLoadMore(false);
            } else {
              setLoadMore(true);
            }
            let temp: any = [...allTagsRef.current];
            temp = [...temp, ...data];
            setAllTags(temp);
            allTagsRef.current = temp;
          } else {
            console.log("Error", message);
          }
        }
      )
      .catch((err) => {
        console.log("Error", err);
      })
      .finally(() => {
        setInitialLoading(false);
        setLoading(false);
      });
  };

  const onScrollEnd = () => {
    const element: any = document.getElementById("allTagsDropDown");

    if (element.scrollTop + element.offsetHeight >= element.scrollHeight) {
      if (loadMore && !initialLoading && !loading) {
        setLoading(true);
        pageRef.current = pageRef.current + 1;
        handleTags();
      }
    }
  };

  useEffect(() => {
    document.body.addEventListener(
      "click",
      (event: any) => {
        handleOutsideClick(event);
      },
      true
    );

    return () => {
      document.body.removeEventListener(
        "click",
        (event: any) => {
          handleOutsideClick(event);
        },
        true
      );
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    pageRef.current = 1;
    allTagsRef.current = [];
    setAllTags([]);
    setInitialLoading(true);
    handleTags();
    // eslint-disable-next-line
  }, [tagValue]);

  useDebounce(
    () => {
      setTagValue(tag);
    },
    [tag],
    800
  );

  return (
    <div
      className={classNames(
        "col-12 d-flex flex-column align-items-start justify-content-end position-relative"
      )}
    >
      <label className={classNames(styles.subTitle, "mb-1")}>{title}</label>
      <div
        className={classNames(
          styles.tagsContainer,
          "position-relative d-flex align-items-center justify-content-start px-3 gap-2 ",
          tags?.length > 0 ? "py-2" : ""
        )}
        role="button"
        onClick={() => {
          setOnInputFocus(true);
          setDropDown(true);
        }}
      >
        <>
          {tags?.length > 0 ? (
            <>
              {tags?.map((item, inx) => {
                return (
                  <div
                    className={classNames(
                      styles.genreContainer,
                      "d-flex align-items-center justify-content-between px-2"
                    )}
                    key={inx}
                  >
                    <label className={classNames(styles.genreLabel)}>
                      {item}
                    </label>
                    <Icons.Cross
                      className={classNames(styles.genreCrossIcon)}
                      role="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        let arr = tags?.filter((itm) => {
                          return itm !== item;
                        });
                        let tempArr: any = [...allTagsRef.current];
                        tempArr.push({ id: 1, title: item });
                        setAllTags(tempArr);
                        allTagsRef.current = tempArr;
                        setFieldValue("tags", arr);
                      }}
                    />
                  </div>
                );
              })}
            </>
          ) : null}
          <input
            type="text"
            className={classNames(styles.tagsInput)}
            onBlur={() => {
              setOnInputFocus(false);
            }}
            onFocus={() => {
              setOnInputFocus(true);
            }}
            autoFocus={onInputFocus}
            onChange={(e) => {
              setTag(e.target.value);
            }}
            value={tag}
            onKeyDown={handleKeyPress}
            placeholder="Search or Enter Tags"
          />
        </>

        {error ? (
          <label className={classNames(styles.error2)}>{error}</label>
        ) : null}
      </div>
      {dropDown ? (
        <>
          {initialLoading ? (
            <div className={classNames(styles.spinnerContainer)}>
              <Spinner
                animation="border"
                size="sm"
                style={{ color: "black" }}
              />
            </div>
          ) : (
            <div
              className={classNames(styles.allTagsHoverContainer, "gap-2")}
              onClick={(e) => {
                e.stopPropagation();
              }}
              id="allTagsDropDown"
              onScroll={onScrollEnd}
            >
              {allTags?.length > 0 ? (
                <>
                  {allTags?.map((item, inx) => {
                    return (
                      <div
                        className={classNames(
                          "d-flex align-items-center gap-2 py-3 px-3",
                          styles.optionContainer,
                          inx === allTags?.length - 1 &&
                            allTags?.length !== 1 &&
                            styles.btmradius,
                          inx === 0 && styles.topradius,
                          activeSuggestionIndex - 1 === inx ? styles.active : ""
                        )}
                        style={
                          inx === allTags?.length - 1 && allTags?.length !== 1
                            ? { borderBottom: "0px" }
                            : {}
                        }
                        key={inx}
                        role="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOnInputFocus(true);
                          let arr = tags?.filter((itm) => {
                            return itm !== item?.title;
                          });
                          let arr2: any = allTags?.filter((itm) => {
                            return itm.title !== item?.title;
                          });
                          arr.push(item?.title);
                          setFieldValue("tags", arr);
                          allTagsRef.current = arr2;
                          setAllTags(arr2);
                          setTag("");
                        }}
                        id="suggestionLabel"
                      >
                        <label
                          className={classNames(styles.labelStyle)}
                          role="button"
                        >
                          {item?.title}
                        </label>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div
                  className={classNames(
                    styles.optionContainerLoader,
                    "d-flex align-items-center justify-content-center"
                  )}
                >
                  <label className={classNames(styles.labelStyle)}>
                    No {title}s found
                  </label>
                </div>
              )}

              {loading ? (
                <SkeletonLoader
                  iconStyle={classNames(styles.optionContainerLoader)}
                />
              ) : null}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
};

export default CustomTagInput;
