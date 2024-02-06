import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import SingleSlide from "./singleSlide";
import "./style.scss";
import { Icons } from "assets";
import { percentage } from "shared/utils/helper";
interface SliderInterface {
  slides: any[];
}
function CustomSlider(props: SliderInterface) {
  const { slides } = props;
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef<any>(null);

  const handleBeforeChange = (oldindex: number, newindex: number) => {
    setActiveIndex(newindex);
    var elem = document.getElementById(`highlighted-slide`);
    let percent = percentage(newindex + 1, slides.length);
    //@ts-ignore
    elem.style.width = `${percent}%`;
  };

  const settings = {
    beforeChange: handleBeforeChange,
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 500,
    infinite: true,
  };

  const handleLeft = () => {
    sliderRef.current.slickPrev();
  };
  const handleRight = () => {
    sliderRef.current.slickNext();
  };

  useEffect(() => {
    var elem = document.getElementById(`highlighted-slide`);
    let percent = percentage(activeIndex + 1, slides.length);
    //@ts-ignore
    elem.style.width = `${percent}%`;
    // eslint-disable-next-line
  }, []);
  return (
    <div className="sliderImg position-relative">
      <Slider {...settings} ref={sliderRef}>
        {slides?.map((item, key) => {
          return <SingleSlide item={item} index={key} key={key} />;
        })}
      </Slider>
      <div className="arrowContainer">
        <div className="position-relative slider-bg">
          <div className="highlighted-slide" id="highlighted-slide" />
          <label className="sliderIndexText mt-2">
            {activeIndex < 9 ? 0 : ""}
            {activeIndex + 1}
          </label>
        </div>
        <div className="d-flex justify-content-between align-items-center ms-3 ms-xl-0">
          <div className="arrowIconContainer" onClick={handleLeft}>
            <Icons.Left />
          </div>
          <div className="arrowIconContainer ms-2 " onClick={handleRight}>
            <Icons.Right />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomSlider;
