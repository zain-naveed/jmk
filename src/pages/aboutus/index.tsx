import { Icons, Images } from "assets";
import classNames from "classnames";
import { useEffect, useState } from "react";
import AboutUsNewsLetter from "shared/components/aboutusNewsletter";
import CustomButton from "shared/components/customButton";
import Footer from "shared/components/footer";
import NavWrapper from "shared/components/navWrapper";
import TestimonialSlider from "shared/components/testimonialSlider";
import { getTestimonials } from "shared/services/generalService";
import { steps, users, writingTips } from "./constants";
import styles from "./style.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { setSignInReducer } from "shared/redux/reducers/sigInSlice";
import { allForms } from "shared/modal/auth/constants";
import { useNavigate } from "react-router";
import { routeConstant } from "shared/routes/routeConstant";
import HeaderSection from "shared/components/headerSection";
import useWindowDimensions from "shared/hooks/useWindowDimentions";

const AboutUs = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    user: { isLoggedIn },
  } = useSelector((state: any) => state.root);
  const [allTestimonials, setAllTestimonials] = useState<[]>([]);
  const { width } = useWindowDimensions();

  const getTestimonial = () => {
    getTestimonials()
      .then(({ data: { data } }) => {
        setAllTestimonials(data.testimonials);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handleStartWriting = () => {
    if (isLoggedIn) {
      navigate(routeConstant.home.path);
    } else {
      dispatch(
        setSignInReducer({ showModal: true, activeModal: allForms.signin.name })
      );
    }
  };

  useEffect(() => {
    getTestimonial();
  }, []);

  return (
    <div className={classNames(styles.topMainContainer)}>
      <NavWrapper />
      <HeaderSection
        title={`About Johnnie Mae King`}
        subtitle={`Meet Johnnie Mae King, affectionately known as "Aunt Johnnie" — an extraordinary character who embarks on a remarkable journey of fate and imagination.`}
        displayHighlightedText={true}
        loading={false}
      />

      <div className={classNames(styles.customContainer, "px-3 px-sm-0")}>
        <div
          className={classNames(
            "d-flex row align-items-start py-0 py-md-4 mt-5 mt-md-5 gap-5  gap-md-0 mx-0",
            styles.respTopContainer
          )}
        >
          <div
            className={classNames(
              "col-12 col-lg-6 d-flex flex-column align-items-start p-0"
            )}
          >
            <label className={styles.mainTitle}>
              The Johnnie Mae King Backstory
            </label>
            <div className={styles.subHeading}>
              <br />
              <label>
                Meet Johnnie Mae King, affectionately known as "Aunt Johnnie" —
                an extraordinary character who embarks on a remarkable journey
                of fate and imagination.
              </label>
              <label style={{ marginTop: "10px" }}>
                As a Black woman, born and raised in the American South during
                the period of the early mid-20th century, Johnnie’s ambitions
                and dreams are challenged by the social constructs of her time.
                However, she refuses to be confined by the constraints of that
                reality. 
              </label>
              <label style={{ marginTop: "10px" }}>
                Having an indomitable spirit and a boundless imagination, she
                embraces the power of her mind to transcend every obstacle and
                limitation that challenges her zeal for exploring life’s
                fullest. Her imagination allows her to escape into a realm of
                endless possibilities, where she can become anyone she desires,
                go wherever she dreams and experience the wonders of a world
                free from the limiting systems of her time.
              </label>
            </div>
          </div>
          <div
            className={classNames(
              "col-12 col-lg-6 d-flex align-items-center justify-content-end mx-0 p-0 p-md-3"
            )}
          >
            <div className={classNames("col-12  d-flex flex-column mx-0 px-0")}>
              <img
                src={Images.TwinsGIF}
                alt="about-us"
                className={styles.gifStyle}
              />
            </div>
          </div>
        </div>
        <div className={styles.subHeading}>
          Her power to dream and imagine allows her to experience the world
          unlike any other.  With each adventure, Aunt Johnnie assumes new
          identities and personas that reflect the spirit of her audacity to be
          her unique self. Guided by her imagination, Johnnie becomes an
          unsuspected time traveler that embarks upon adventures that could be
          wild, mundane, or somewhere in between - it’s all up to you! This
          becomes her sanctuary, offering solace and inspiration amidst
          adversities, or less than ideal circumstances. It is here that she
          discovers her own resilience, unleashes her creativity, and finds the
          strength to overcome the barriers that surround her. Johnnie Mae King
          is not just a character; she represents all of us. In her, we find a
          reflection of our collective yearning for purpose, self-expression,
          and the pursuit of endless possibilities. She reminds us that within
          each of us lies the strength to transcend boundaries, both real and
          imagined, and to challenge the limitations that societies may impose
          upon us. The Johnnie Mae King project presents you the opportunity to
          take this character into your world of endless possibilities and
          adventures. This community narrative developing collaboration will be
          accompanied by incentives and prizes that are soon to be announced
          with the Johnnie Mae King creative story writing platform… coming
          soon!
        </div>

        <div>
          <label
            className={styles.mainTitle}
            style={{ marginTop: "80px", marginBottom: "24px" }}
          >
            From the Creator
          </label>
        </div>
        <div className={styles.subHeading}>
          Hi, my name is Ronald Jackson. I am an artist and a painter who
          believes that storytelling is the greatest form of art. It is with
          stories that we can engage various concepts & ideas, or even explore
          the experiences of others.
        </div>

        <div
          className={classNames(
            "d-flex row align-items-center   mx-0"
            // styles.bdrTop
          )}
        >
          <div
            className={classNames(
              "col-12 col-lg-6 d-flex flex-column align-items-start mt-0 mt-md-5 mb-0 mb-md-5 "
            )}
          >
            <img
              src={Images.AboutUsArt5}
              alt="about-us"
              style={{ width: "100%", height: "646px", objectFit: "cover" }}
              className={styles.coulmn2}
            />

            {/* <Icons.OverHead
              className={classNames(styles.overheadStyle, "ms-0 ms-sm-2")}
            /> */}
            {/* <label className={classNames(styles.title2, "mt-2")}>
              Upload artworks & let people contribute to your artwork stories
            </label> */}
            {/* <div
              className={classNames(
                "d-flex align-items-center flex-column gap-3 my-4"
              )}
            >
              {steps.map((item, inx) => {
                return (
                  <div
                    className={classNames(
                      "d-flex align-items-start justify-content-start gap-3"
                    )}
                    key={inx}
                  >
                    <div className={classNames(styles.numberOuterContainer)}>
                      <div className={classNames(styles.numberInnerContainer)}>
                        <item.Icon />
                      </div>
                    </div>
                    <div
                      className={classNames(
                        "d-flex flex-column align-items-start"
                      )}
                    >
                      <label className={classNames(styles.title3, "py-2")}>
                        {item.name}
                      </label>
                      <label className={classNames(styles.greyLabel2)}>
                        {item.desc}
                      </label>
                    </div>
                  </div>
                );
              })}
            </div> */}
          </div>
          <div
            className={classNames(
              "col-12 col-lg-6 mb-0 mb-md-5 px-0 px-md-5  d-flex flex-column",
              styles.subHeading
            )}
          >
            As a visual artist, I usually have a story in mind for each work
            that I create, but most times those stories never develop beyond the
            parameters of my canvas.
            <br />
            <br />
            This has led me to creating the imagined character Johnnie Mae King.
            Johnnie was created with the goal of exploring the dynamics of
            creative storytelling, but more importantly, she represents my
            appeal to the writing community… to join me in bringing her stories
            and adventures to life.
            <br />
            <br />
            The JMK project offers the unique opportunity for storytelling
            creatives to help shape and suggest narratives as I depict the
            character in various scenarios via paintings, drawings, and prints.
            <br />
            <br />
            With the soon coming JMK creative writing platform, I will be
            extending the same type of experience for writers to engage with a
            variety of artists/artwork to choose from. I am grateful for your
            interest and I invite you to embark on this journey with me.
          </div>
        </div>
      </div>
      <AboutUsNewsLetter />
      <Footer />
    </div>
  );
};

export default AboutUs;
