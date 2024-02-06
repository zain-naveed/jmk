import classNames from "classnames";
import ContestCard from "../contestCard";
import StoryCard from "../storyCard";

interface FeedArtCardProps {
  index: number;
  contests: any[];
  arts: any[];
}

const FeedArtCard = ({ index, contests, arts }: FeedArtCardProps) => {
  return (
    <>
      {contests?.length > 0
        ? contests?.map((item, inx) => {
            return (
              <ContestCard
                customContainer={classNames(
                  "col-12 px-0 mx-0 px-md-3",
                  index !== 0 ? "mt-5" : "mt-0"
                )}
                key={inx}
                item={item}
              />
            );
          })
        : null}
      {arts?.length > 0
        ? arts?.map((item, inx) => {
            return (
              <StoryCard
                customContainer={classNames("col-12 col-lg-6  px-0 px-md-3")}
                key={inx}
                item={item}
              />
            );
          })
        : null}
    </>
  );
};

export default FeedArtCard;
