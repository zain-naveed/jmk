import classNames from "classnames";
import styles from "./style.module.scss";
import { Icons } from "assets";
import { useNavigate } from "react-router";
import { routeConstant } from "shared/routes/routeConstant";

interface TestimonialSliderProps {
  testimonials: { name: string; quote: string; avatar: string }[];
}

const TestimonialSlider = ({ testimonials }: TestimonialSliderProps) => {
  return (
    <div
      className={classNames(
        "d-flex justify-content-center align-items-center",
        styles.toplevelContainer
      )}
    >
      <div
        className={classNames(
          styles.customContainer,
          "d-flex align-items-center  w-100",
          styles.siderContainer
        )}
        id="quotesContainer"
      >
        {testimonials?.map((item, inx) => {
          return (
            <div
              className={classNames(
                "col-12 d-flex justify-content-center align-items-center w-100"
              )}
              key={inx}
            >
              <Testimonial {...item} index={inx} testimonials={testimonials} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface TestimonialProps {
  name: string;
  quote: string;
  avatar: string;
  index: number;
  testimonials: any[];
  user: any;
  review: string;
}

const Testimonial = ({
  name,
  quote,
  avatar,
  index,
  testimonials,
  user,
  review,
}: Partial<TestimonialProps>) => {
  const navigate = useNavigate();
  const scrollRight = () => {
    let elem: any = document.getElementById("quotesContainer");
    let width: any = document.getElementById("quotesContainer")?.clientWidth;
    elem.scrollLeft = elem?.scrollLeft + width;
  };
  const scrollLeft = () => {
    let elem: any = document.getElementById("quotesContainer");
    let width: any = document.getElementById("quotesContainer")?.clientWidth;
    elem.scrollLeft = elem.scrollLeft - width;
  };
  return (
    <div
      className={classNames(
        "d-flex justify-content-center align-items-start  align-items-xxl-center col-12 col-xl-10 gap-5 gap-md-4  flex-column flex-md-row  px-3 px-sm-0"
      )}
      style={{ minHeight: "420px" }}
    >
      <div
        className={classNames(
          "d-flex justify-content-center align-items-center position-relative "
        )}
        onClick={() => {
          navigate(routeConstant.profile.path.replace(":id", user?.id));
        }}
        role="button"
      >
        <img
          src={user?.profile_pic ? user?.full_profile_path : avatar}
          alt="testimonial-user-1"
          className={classNames(styles.userImage)}
        />
        <Icons.QuoteLeft className={classNames(styles.quoteIcon)} />
      </div>
      <div className={classNames("d-flex flex-column gap-3 gap-md-5 w-100")}>
        <div style={{ minHeight: "270px" }}>
          <label className={classNames(styles.quoteLabel)}>“{review}”</label>
        </div>
        <div
          className={classNames(
            "d-flex align-items-center justify-content-between w-100"
          )}
        >
          <label
            className={classNames(styles.nameLabel)}
            onClick={() => {
              navigate(routeConstant.profile.path.replace(":id", user?.id));
            }}
            role="button"
          >
            — {user?.name}
          </label>
          {testimonials && testimonials?.length > 1 ? (
            <div className={classNames("d-flex align-items-center gap-3")}>
              <Icons.ArrowLeft2
                className={classNames(
                  styles.arrowIcon,
                  index === 0 ? styles.inActive : styles.active
                )}
                onClick={scrollLeft}
              />
              <Icons.ArrowRight2
                className={classNames(
                  styles.arrowIcon,
                  testimonials && index === testimonials?.length - 1
                    ? styles.inActive
                    : styles.active
                )}
                onClick={scrollRight}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TestimonialSlider;
