import { Icons, Images } from "assets";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import SkeletonLoader from "shared/loader/skeletonLoader";
import { GetWinnersList } from "shared/services/generalService";
import styles from "./style.module.scss";
import NoContentCard from "../noContentCard";
import { findCategoryType } from "shared/utils/helper";
import { useNavigate } from "react-router";
import { routeConstant } from "shared/routes/routeConstant";

const WinnersCard = () => {
  const navigate = useNavigate();
  const sliderRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [winners, setWinners] = useState<any[]>([]);

  const handleBeforeChange = (oldindex: number, newindex: number) => {
    setActiveIndex(newindex);
    var elem: any = document.getElementById(`winnerDotsContainer`);
    var imgElem: any = document.getElementById(`dot${newindex}`);
    if (newindex === 0) {
      elem?.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } else {
      const scrollRect = elem?.getBoundingClientRect();
      const activeRect = imgElem.getBoundingClientRect();
      elem.scrollLeft = elem.scrollLeft + (activeRect.left - scrollRect.left - scrollRect.width / 2 + activeRect.width / 2);
    }
  };

  const settings = {
    beforeChange: handleBeforeChange,
    autoplay: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const getWinners = () => {
    GetWinnersList()
      .then(
        ({
          data: {
            data: { winners },
            status,
            message,
          },
        }) => {
          if (status) {
            setWinners(winners);
          } else {
            console.log("Error", message);
          }
        },
      )
      .catch((err) => {
        console.log("Error", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    getWinners();
  }, []);


  return (
    winners.length ? <div className={classNames("d-flex flex-column align-items-center justify-content-center pt-4 pb-4 position-relative")}>
      <div className={classNames("d-flex align-items-center justify-content-between mb-4 w-100")}>
        <label className={classNames(styles.title)}>Winners of Contests</label>
        <Icons.Medal />
      </div>
      {loading ? (
        <>
          <div className={classNames("w-100")}>
            <SkeletonLoader iconStyle={classNames(styles.noAvatarContainer)} />
          </div>
          <div className={classNames("d-flex flex-column align-items-start justify-content-start w-100 gap-1 mt-3")}>
            <SkeletonLoader iconStyle={classNames(styles.titleLoader)} />
            <SkeletonLoader iconStyle={classNames(styles.subTitleLoader)} />
          </div>
        </>
      ) : winners?.length > 0 ? (
        <>
          <div className={classNames("w-100")}>
            <Slider {...settings} ref={sliderRef}>
              {winners?.map((item: any, key) => {
                return (
                  <div key={key}>
                    {item?.profile_pic ? (
                      <img src={item?.full_profile_path} alt="user-profile-pic" className={classNames(styles.avatarStyle)} key={key} />
                    ) : (
                      <div className={classNames(styles.noAvatarContainer)} key={key}>
                        <Icons.DraftFile />
                      </div>
                    )}
                  </div>
                );
              })}
            </Slider>
          </div>

          <div className={classNames("d-flex gap-1 my-3", styles.dotsContainer, winners?.length > 3 ? "justify-content-start" : "justify-content-center")} id="winnerDotsContainer">
            {winners?.map((item, key) => {
              return (
                <div
                  className={classNames(activeIndex === key ? styles.activeDot : styles.inActiveDot)}
                  key={key}
                  onClick={() => {
                    setActiveIndex(key);
                    sliderRef.current.slickGoTo(key);
                  }}
                  id={`dot${key}`}
                />
              );
            })}
          </div>

          <div className={classNames("d-flex flex-column align-items-start justify-content-start w-100")}>
            <label className={classNames(styles.title)} role="button" onClick={() => navigate(routeConstant.profile.path.replace(":id", winners[activeIndex]?.id))}>
              {winners[activeIndex]?.name}
            </label>
            <label className={classNames(styles.subTitle)}>{findCategoryType(winners[activeIndex]?.post_type)}</label>
          </div>
        </>
      ) : (
        <NoContentCard Icon={Images.NoData} label1="No Winners found" customIconContianer={classNames(styles.notContent)} customLabel1Style={classNames(styles.noContentLabel)} customContainer={classNames("gap-1 d-flex align-items-center justify-content-center flex-column")} />
      )}

      <div className={classNames(styles.btmBorder)} />
    </div> : null
  );
};

export default WinnersCard;
