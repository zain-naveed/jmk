import { Icons, Images } from "assets";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import SkeletonLoader from "shared/loader/skeletonLoader";
import { GetFeatureWriters } from "shared/services/generalService";
import styles from "./style.module.scss";
import NoContentCard from "../noContentCard";
import { useNavigate } from "react-router";
import { routeConstant } from "shared/routes/routeConstant";

const FeatureWriterCard = () => {
  const navigate = useNavigate();
  const sliderRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [featureWriters, setFeatureWriters] = useState<any[]>([]);

  const handleBeforeChange = (oldindex: number, newindex: number) => {
    setActiveIndex(newindex);
    var elem: any = document.getElementById(`featureDotsContainer`);
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

  const getFeatureWriters = () => {
    GetFeatureWriters()
      .then(({ data: { data, status, message } }) => {
        if (status) {
          setFeatureWriters(data);
        } else {
          console.log("Error", message);
        }
      })
      .catch((err) => {
        console.log("Error", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    getFeatureWriters();
  }, []);

  return featureWriters?.length > 0 ? (
    <div className={classNames("d-flex flex-column align-items-center justify-content-center pt-5 pb-4 position-relative")}>
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
      ) : featureWriters?.length > 0 ? (
        <>
          <div className={classNames("w-100")}>
            <Slider {...settings} ref={sliderRef}>
              {featureWriters?.map((item: any, key) => {
                return (
                  <div
                    className={classNames("position-relative")}
                    key={key}
                    role="button"
                    onClick={() => {
                      navigate(routeConstant.profile.path.replace(":id", featureWriters[activeIndex]?.id));
                    }}
                  >
                    {item?.profile_pic ? (
                      <img src={item?.full_profile_path} alt="user-profile-pic" className={classNames(styles.avatarStyle)} />
                    ) : (
                      <div className={classNames(styles.noAvatarContainer)}>
                        <Icons.DraftFile />
                      </div>
                    )}

                    <div className={classNames(styles.featureContainer, "px-2 gap-1")}>
                      <Icons.Award className={classNames(styles.annouceIconStyle)} />
                      <label className={classNames(styles.featureTitle)}>Featured</label>
                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>

          <div className={classNames("d-flex gap-1 my-3", styles.dotsContainer, featureWriters?.length > 3 ? "justify-content-start" : "justify-content-center")} id="featureDotsContainer">
            {featureWriters?.map((item, key) => {
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
            <label className={classNames(styles.title)}>Featured Writer</label>
            <label
              className={classNames(styles.subTitle)}
              role="button"
              onClick={() => {
                navigate(routeConstant.profile.path.replace(":id", featureWriters[activeIndex]?.id));
              }}
            >
              {featureWriters[activeIndex]?.name}
            </label>
          </div>
        </>
      ) : (
        <NoContentCard Icon={Images.NoData} label1="No Artists found" customIconContianer={classNames(styles.notContent)} customLabel1Style={classNames(styles.noContentLabel)} customContainer={classNames("gap-1 d-flex align-items-center justify-content-center flex-column")} />
      )}

      <div className={classNames(styles.btmBorder)} />
    </div>
  ) : null;
};

export default FeatureWriterCard;
