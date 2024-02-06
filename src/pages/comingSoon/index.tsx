import { Images } from "assets";
import classNames from "classnames";
import { useRef } from "react";
import AboutUsNewsLetter from "shared/components/aboutusNewsletter";
import CustomButton from "shared/components/customButton";
import Footer from "shared/components/footer";
import NavWrapper from "shared/components/navWrapper";
import { steps, steps2 } from "./constant";
import styles from "./style.module.scss";

const ComingSoon = () => {
  const messagesEndRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className={classNames(styles.topMainContainer)}>
      <NavWrapper />
      <div
        className={classNames(
          "d-flex justify-content-center align-items-center",
          styles.toplevelContainerMain
        )}
      >
        <div
          className={classNames(
            styles.customContainer,
            "d-flex align-items-center w-100 flex-column py-5 px-3 px-sm-0"
          )}
        >
          <div className="row p-0 m-0">
            <div className="col-md-10 col-lg-9 col-xl-7 col-12 p-0 d-flex justify-content-start m-0">
              <div
                className={classNames(
                  "d-flex flex-column justify-content-center align-items-start",
                  styles.labelContainer
                )}
              >
                <label className={styles.mainHeadingContainer}>
                  JOHNNIE MAE KING CREATIVE STORY WRITING PLATFORM
                </label>
                <label className={styles.subHeading}>
                  The Johnnie Mae King creative writing platform, an
                  intersection of art and creative narratives.
                </label>
                <CustomButton
                  label="Subscribe"
                  customBtnContainer={classNames(
                    "w-100 mb-2",
                    styles.buttonWidth
                  )}
                  onClick={() => scrollToBottom()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={classNames(styles.customContainer, "px-3 px-sm-0")}>
        <div
          className={classNames(
            "d-flex row align-items-center py-0 py-md-5  mx-0 px-0",
            styles.respContainer
          )}
        >
          {/* <div
            className={classNames(
              "col-12 col-md-6 d-flex flex-column align-items-start mt-0 mt-md-5 mb-0 mb-md-5 "
            )}
          >
            <div
              className={classNames(
                "d-flex align-items-center flex-column gap-3 my-4 w-100"
              )}
            >
              <img
                src={Images.SliderImg1}
                alt="banner"
                className={styles.imgContainer}
              />
            </div>
          </div> */}
          <div
            className={classNames(
              "col-12 d-flex flex-column align-items-start mt-0 mt-md-5 mb-0 mb-md-5 p-0 mx-0"
            )}
          >
            <div
              className={classNames(
                "d-flex align-items-center flex-column gap-3 my-4 p-0 px-md-2"
              )}
            >
              <div>
                <label className={styles.greyLabel}>
                  We are very close to launching our online platform that aims
                  to bring together art and creative writing, fostering a
                  community of collaboration and inspiration. <br />
                  <br />
                  Our platform will feature artists and their work, providing a
                  space for writers to engage with art as writing prompts. The
                  result? A collaboration of visual art and creative
                  storytelling, where each image can suggest a world of endless
                  narratives. The platform will consist of artists, writers, and
                  those who love art, or those who simply enjoy a good story. It
                  is essentially a community platform that allows individuals to
                  like, comment, and share their creative ideas with one
                  another.
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={classNames(styles.customContainer, "px-3 px-sm-0")}>
        <div>
          <label className={classNames(styles.mainHeading)}>
            The JMK Story Writing Platform will offer the following features:
          </label>
        </div>
        <div
          className={classNames(
            "d-flex row align-items-center py-0 py-md-5  mx-0"
          )}
        >
          <div
            className={classNames(
              "col-12 col-md-6 d-flex flex-column align-items-start mb-0 mb-md-5 "
            )}
          >
            <div
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
            </div>
          </div>
          <div
            className={classNames(
              "col-12 col-md-6 d-flex flex-column align-items-start mb-0 mb-md-5 "
            )}
          >
            <div
              className={classNames(
                "d-flex align-items-center flex-column gap-3 my-4"
              )}
            >
              {steps2.map((item, inx) => {
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
            </div>
          </div>
        </div>
      </div>
      <AboutUsNewsLetter />
      <Footer />
      <div ref={messagesEndRef}></div>
    </div>
  );
};

export default ComingSoon;
