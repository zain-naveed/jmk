import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import CustomButtonLoader from "shared/loader/customButtonLoader";
import SkeletonLoader from "shared/loader/skeletonLoader";
import { GetPaidArtworks } from "shared/services/generalService";
import CustomButton from "../customButton";
import styles from "./style.module.scss";

const PaidArtworks = () => {
  const sliderRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [paidArtworks, setPaidArtworks] = useState<any[]>([]);

  const handleBeforeChnage = (oldindex: number, newindex: number) => {
    setActiveIndex(newindex);
    var elem: any = document.getElementById(`paidArtworkDotsContainer`);
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
    beforeChange: handleBeforeChnage,
    autoplay: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const getPaidArtWorks = () => {
    GetPaidArtworks()
      .then(
        ({
          data: {
            data: { data },
            status,
            message,
          },
        }) => {
          if (status) {
            setPaidArtworks(data);
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
    getPaidArtWorks();
  }, []);

  return (
    <>
      {loading ? (
        <div className={classNames("d-flex flex-column align-items-center justify-content-center py-5 position-relative")}>
          <>
            <div className={classNames("w-100")}>
              <SkeletonLoader iconStyle={classNames(styles.noAvatarContainer)} />
            </div>

            <div className={classNames("d-flex flex-column align-items-start justify-content-start w-100 gap-1 mt-3")}>
              <SkeletonLoader iconStyle={classNames(styles.titleLoader)} />
              <SkeletonLoader iconStyle={classNames(styles.subTitleLoader)} />
            </div>
            <CustomButtonLoader customBtnContainer={classNames("w-100 mt-3")} />
          </>
          <div className={classNames(styles.btmBorder)} />
        </div>
      ) : paidArtworks?.length > 0 ? (
        <div className={classNames("d-flex flex-column align-items-center justify-content-center py-5 position-relative")}>
          <>
            <div className={classNames(styles.paidArtStyle, "position-relative")}>
              <Slider {...settings} ref={sliderRef}>
                {paidArtworks?.map((item, key) => {
                  return <img src={item?.full_image_path} alt="paid-artwork" className={classNames(styles.artStyle)} key={key} />;
                })}
              </Slider>
            </div>
            <div className={classNames("d-flex gap-1 my-3", styles.dotsContainer, paidArtworks?.length > 3 ? "justify-content-start" : "justify-content-center")} id="paidArtworkDotsContainer">
              {paidArtworks?.map((item, key) => {
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
              <label className={classNames(styles.title)}>{paidArtworks[activeIndex]?.title}</label>
              <div className={classNames("d-flex align-items-center justify-content-start gap-1")}>
                {paidArtworks[activeIndex]?.price !== paidArtworks[activeIndex]?.flat_fee ? (
                  <>
                    <label className={classNames(styles.subTitle)}>${paidArtworks[activeIndex]?.price}</label>
                    <label className={classNames(styles.dashStyle)}>-</label>
                  </>
                ) : (
                  ""
                )}
                <label className={classNames(styles.highlightedText)}>${paidArtworks[activeIndex]?.flat_fee}</label>
              </div>
            </div>
            <CustomButton
              label="Purchase Now"
              customBtnContainer={classNames("w-100 mt-3")}
              onClick={() => {
                let url = paidArtworks[activeIndex]?.payment_link.match(/^http[s]?:\/\//) ? paidArtworks[activeIndex]?.payment_link : "https://" + paidArtworks[activeIndex]?.payment_link;
                window.open(url, "_blank");
              }}
            />
          </>
          <div className={classNames(styles.btmBorder)} />
        </div>
      ) : null}
    </>
  );
};

export default PaidArtworks;
