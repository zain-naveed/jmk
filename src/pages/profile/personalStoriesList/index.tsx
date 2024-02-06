import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import NoContentCard from "shared/components/noContentCard";
import StorySuggestionCard from "shared/components/storySuggestionCard";
import StorySuggestionCardLoader from "shared/loader/storySuggestionLoader";
import { GetUserPersonalStories } from "shared/services/storyService";
import styles from "./styles.module.scss";
import { Images } from "assets";

interface PersonalStoriesListProps {
  isPrivate: boolean;
  endReach: boolean;
  id: number;
}

const PersonalStoriesList = ({
  isPrivate,
  endReach,
  id,
}: Partial<PersonalStoriesListProps>) => {
  const pageRef = useRef<number>(1);
  const storiesRef = useRef<any>([]);
  const [loadMore, setLoadMore] = useState<boolean>(false);
  const [stories, setStories] = useState<string[]>([]);
  const [initialLoading, setInitialLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const getPersonalStories = () => {
    GetUserPersonalStories({
      id: id,
      page: pageRef.current,
      filter: "most_recent",
      type: "published",
      search: "",
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
      getPersonalStories();
    }
    // eslint-disable-next-line
  }, [endReach]);

  useEffect(() => {
    pageRef.current = 1;
    storiesRef.current = [];
    setInitialLoading(true);
    getPersonalStories();
    // eslint-disable-next-line
  }, []);

  return (
    <div className={classNames("d-flex flex-column mt-3")}>
      {initialLoading ? (
        <>
          <StorySuggestionCardLoader isPrivate={isPrivate} isPersonalStory />
          <StorySuggestionCardLoader isPrivate={isPrivate} isPersonalStory />
        </>
      ) : (
        <>
          {stories.length > 0 ? (
            <>
              {stories?.map((item, inx) => {
                return (
                  <StorySuggestionCard
                    isPersonalStory
                    key={inx}
                    isPrivate={isPrivate}
                    item={item}
                    setStories={setStories}
                    stories={stories}
                  />
                );
              })}
            </>
          ) : (
            <div className={classNames(styles.noContentTopContainer)}>
              <NoContentCard
                Icon={Images.NoData}
                label1="No Personal Stories found"
                label2="Please start writing & uploading stories to see here."
              />
            </div>
          )}

          {loading ? (
            <>
              <StorySuggestionCardLoader
                isInProfile
                isPrivate={isPrivate}
                isPersonalStory
              />
              <StorySuggestionCardLoader
                isInProfile
                isPrivate={isPrivate}
                isPersonalStory
              />
            </>
          ) : null}
        </>
      )}
    </div>
  );
};

export default PersonalStoriesList;
