import { Icons, Images } from "assets";
import classNames from "classnames";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import CustomButton from "shared/components/customButton";
import CustomInput from "shared/components/customInput";
import CustomRichTextEditor from "shared/components/customRichTextEditor";
import Footer from "shared/components/footer";
import NavWrapper from "shared/components/navWrapper";
import { toastMessage } from "shared/components/toast";
import { guestStory } from "shared/services/storyService";
import { GuestStoryVS } from "shared/utils/validations";
import { steps } from "./constants";
import styles from "./style.module.scss";
import { GetContestDescription } from "shared/services/generalService";
import SkeletonLoader from "shared/loader/skeletonLoader";

interface InitialValues {
  email: string;
  name: string;
  description: string;
  title: string;
}

const AboutUs = () => {
  const [loader, setLoader] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [contestDesc, setContestDesc] = useState<any>({});
  const navigate = useNavigate();

  const initialValues: InitialValues = {
    email: "",
    name: "",
    description: "",
    title: "",
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: GuestStoryVS,
    onSubmit: (value) => {
      let obj = {
        name: value?.name,
        email: value?.email,
        description: value?.description,
        title: value?.title,
      };
      handleSubmitStory(obj);
    },
  });
  const { handleChange, handleSubmit, values, touched, errors, setFieldValue } =
    formik;

  const handleSubmitStory = (obj: any) => {
    setLoader(true);

    guestStory(obj)
      .then(({ data }) => {
        setLoader(false);
        toastMessage("success", data?.message);
        formik?.resetForm();
      })
      .catch((err) => {
        setLoader(false);
        toastMessage("err", err?.response?.data?.message);
      });
  };

  const handleGetContestDescription = () => {
    GetContestDescription()
      .then(({ data: { data, message, status } }) => {
        if (status) {
          setContestDesc(data?.contest);
        } else {
          console.log("Error", message);
        }
      })
      .catch((err) => {
        console.log("err", err?.response?.data?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    handleGetContestDescription();
  }, []);

  return (
    <div className={classNames(styles.topMainContainer)}>
      <NavWrapper />

      <div className={classNames(styles.toplevelContainerHeader)}>
        <div
          className={classNames(styles.customContainer, "px-3 px-sm-0 w-100")}
        >
          <div className={styles.textContainer}>
            <div className={classNames(styles.labelHeader)}>ENTER THE AUNT</div>
            <div className={classNames(styles.labelHeader, styles.margins)}>
              <span>JOHNNIE</span>
              <> CREATIVE</>
            </div>
            <div className={classNames(styles.labelHeader, styles.margins2)}>
              WRITING CONTEST!
            </div>
          </div>
        </div>
      </div>
      {/*to here*/}
      <div
        className={classNames(
          styles.customContainer,
          "px-3 px-sm-0 mt-md-0 mt-5"
        )}
      >
        <div
          className={classNames(
            "d-flex row align-items-start py-0 py-md-5 my-0 my-md-5 gap-5  gap-md-0 mx-0",
            styles.respTopContainer
          )}
        >
          <div
            className={classNames(
              "col-11 col-md-6 d-flex flex-column align-items-start p-0"
            )}
          >
            <label className={classNames(styles.description)}>
              Johnnie is a character who invites you to write your own creative
              narrative for her, or to take her on a creative adventure that is
              only limited by your imagination.
            </label>
            <br />
            <label className={classNames(styles.description)}>
              In this contest, we ask that you reference the backstory of the
              Johnnie character as a launching point for your unique story. You
              can read her backstory{" "}
              <span
                className={classNames(styles.link)}
                onClick={() => navigate("/aboutus")}
              >
                [here]
              </span>
              .
            </label>
            <br />
            <label className={classNames(styles.description)}>
              Consider any of the illustrations of Johnnie on the site, if
              visualizing the character would help generate inspiration. Whether
              you choose speculative fiction, mystery, suspense, poetry, or
              drama, Aunt Johnnie’s world is yours to explore.
            </label>
            <br />
            <label className={classNames(styles.description)}>
              With a firm word count of 300 to 500 words, craft a creative
              narrative that would leave the reader wanting to read more!
            </label>
            <br />
            <label
              className={classNames(styles.description2, styles.description3)}
            >
              * Details regarding panel judges, selection of winners, and dates
              will be provided via email and instagram. Writers will maintain
              complete ownership of their stories, however, by submitting your
              entry, participants authorize the posting of winning stories to
              the Johnnie Mae King website and corresponding social media
              accounts- accompanied by the author credits.
            </label>
          </div>
          <div
            className={classNames(
              "col-12 col-md-6 d-flex align-items-center justify-content-end mx-0 px-0"
            )}
          >
            <div
              className={classNames(
                "col-12 col-md-10 d-flex flex-column mx-0 px-0"
              )}
            >
              <img src={Images.AboutUsArt6} alt="guide" />
              <label className={classNames(styles.captionLabel)}>
                Subscribe below to receive information about the release of this
                signed & numbered timed edition JMK print.
              </label>
            </div>
          </div>
        </div>

        <div
          className={classNames(
            styles.customContainer,
            "px-3 px-sm-0 mt-3 mt-md-0"
          )}
        >
          {loading ? (
            <>
              <SkeletonLoader
                iconStyle={classNames(styles.mainHeadingLoader)}
              />

              <div
                className={classNames(
                  "d-flex align-items-center justufy-content-start flex-wrap gap-2 py-3 py-md-5"
                )}
              >
                <SkeletonLoader
                  iconStyle={classNames(styles.deadlineContainerLoader)}
                />
                <SkeletonLoader
                  iconStyle={classNames(styles.deadlineContainerLoader)}
                />
              </div>
            </>
          ) : (
            <>
              {contestDesc ? (
                <>
                  <label className={classNames(styles.mainHeading)}>
                    Contest Deadline
                  </label>
                  <div
                    className={classNames(
                      "d-flex align-items-center justufy-content-start flex-wrap gap-3 py-2 py-md-5"
                    )}
                    style={{ paddingLeft: "10px" }}
                  >
                    <div
                      className={classNames(
                        styles.deadlineContainer,
                        "px-3 py-2"
                      )}
                    >
                      <label
                        className={classNames(styles.deadlineContainerLabel)}
                      >
                        {contestDesc?.open_contest_deadline_description}
                      </label>
                    </div>
                    <div
                      className={classNames(
                        styles.deadlineContainer,
                        "px-3 py-2"
                      )}
                    >
                      <label
                        className={classNames(styles.deadlineContainerLabel)}
                      >
                        {contestDesc?.contest_submission_deadline_description}
                      </label>
                    </div>
                  </div>
                </>
              ) : null}
            </>
          )}

          <div className={classNames("mt-3 mt-md-5")}>
            <label className={classNames(styles.mainHeading)}>
              Guidelines and Rules{" "}
            </label>
          </div>
          <div
            className={classNames(
              "d-flex row align-items-start py-0 py-md-5  mx-0"
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
                  return inx % 2 === 0 ? (
                    <div
                      className={classNames(
                        "d-flex align-items-center justify-content-start gap-3 w-100"
                      )}
                      key={inx}
                    >
                      <div className={classNames(styles.numberOuterContainer)}>
                        <div
                          className={classNames(styles.numberInnerContainer)}
                        >
                          <item.Icon />
                        </div>
                      </div>
                      <div
                        className={classNames(
                          "d-flex flex-column align-items-start"
                        )}
                        dangerouslySetInnerHTML={{ __html: item.desc }}
                      ></div>
                    </div>
                  ) : null;
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
                {steps.map((item, inx) => {
                  return inx % 2 !== 0 ? (
                    <div
                      className={classNames(
                        "d-flex align-items-center justify-content-start gap-3 w-100"
                      )}
                      key={inx}
                    >
                      <div className={classNames(styles.numberOuterContainer)}>
                        <div
                          className={classNames(styles.numberInnerContainer)}
                        >
                          <item.Icon />
                        </div>
                      </div>
                      <div
                        className={classNames(
                          "d-flex flex-column align-items-start"
                        )}
                        dangerouslySetInnerHTML={{ __html: item.desc }}
                      ></div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={classNames(
          "d-flex justify-content-center align-items-center",
          styles.toplevelContainerPrize
        )}
      >
        <div
          className={classNames(
            styles.customContainer,
            "d-flex align-items-center  w-100 flex-column",
            styles.siderContainer
          )}
          id="quotesContainer"
        >
          <label className={classNames(styles.title2)}>PRIZES</label>
          <label className={classNames(styles.description, "mt-2")}>
            5 Honorable Mentions will be awarded $100 each
          </label>
          <div className="container mt-5">
            <div className="row">
              <div className={classNames("col-md-4 col-12")}>
                <div className={styles.prizeColumns}>
                  <div className={classNames(styles.submitStoryContainer)}>
                    <Icons.Apperture
                      className={classNames(styles.appertureIcon)}
                    />
                    <label className={classNames(styles.submitLabel, "ms-1")}>
                      1st Prize - $750
                    </label>
                  </div>
                  <img
                    src={Images.Prize1}
                    alt="prize"
                    className={classNames(styles.prize1)}
                  />
                </div>
              </div>

              <div className={classNames("col-md-4 col-12")}>
                <div className={styles.prizeColumns}>
                  <div className={classNames(styles.submitStoryContainer)}>
                    <Icons.Apperture
                      className={classNames(styles.appertureIcon)}
                    />
                    <label className={classNames(styles.submitLabel, "ms-1")}>
                      2nd Prize - $500
                    </label>
                  </div>
                  <img
                    src={Images.Prize2}
                    alt="prize"
                    className={classNames(styles.prize2)}
                  />
                </div>
              </div>
              <div className={classNames("col-md-4 col-12")}>
                <div className={styles.prizeColumns}>
                  <div className={classNames(styles.submitStoryContainer)}>
                    <Icons.Apperture
                      className={classNames(styles.appertureIcon)}
                    />
                    <label className={classNames(styles.submitLabel, "ms-1")}>
                      3rd Prize - $300
                    </label>
                  </div>
                  <img
                    src={Images.Prize3}
                    alt="prize"
                    className={classNames(styles.prize3)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={classNames(
          styles.customContainer,
          "d-flex px-3 px-sm-0 py-5  align-items-center justify-content-center"
        )}
      >
        <form
          className={classNames(
            styles.requestContainer,
            "col-12 col-md-10 col-lg-8 d-flex flex-column p-3"
          )}
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div
            className={classNames(
              "d-flex flex-column  justify-content-between"
            )}
          >
            <label className={classNames(styles.crossLabel)}>
              WRITE YOUR TEXT{" "}
            </label>

            <label className={classNames("mb-3 mt-2", styles.formDescription)}>
              You have the complete freedom to place Johnnie in any world,
              scene, or scenario of your choosing. You also have the creative
              liberty to shape her personality and voice. We look forward to
              entering the world and narrative that you create for her. Good
              luck!
            </label>
          </div>
          <div>
            <input
              value={values.title}
              placeholder="Enter Your Title Here"
              className={classNames(styles.headlineInput, "px-3 mb-0")}
              onChange={handleChange("title")}
              maxLength={80}
            />
            <div className={styles.error}>
              {touched.name && errors.title ? errors.title : ""}
            </div>
          </div>
          <div
            className={classNames(
              "d-flex d-flex flex-sm-row flex-column align-items-center gap-sm-3 gap-0 mt-4"
            )}
          >
            <div className={classNames("d-flex flex-column w-100")}>
              <label className={classNames(styles.requestInputLabel, "mb-1")}>
                Your name or nickname{" "}
              </label>
              <CustomInput
                type="text"
                value={values.name}
                error={touched.name && errors.name ? errors.name : ""}
                onChange={handleChange("name")}
              />
            </div>
            <div className={classNames("d-flex flex-column w-100 ")}>
              <label className={classNames(styles.requestInputLabel, "mb-1")}>
                Your email address
              </label>
              <CustomInput
                type="email"
                value={values.email}
                error={touched.email && errors.email ? errors.email : ""}
                onChange={handleChange("email")}
              />
            </div>
          </div>
          <label className={classNames(styles.requestInputLabel, "mb-1")}>
            Your story{" "}
          </label>
          <CustomRichTextEditor
            value={values.description}
            error={
              touched.description && errors.description
                ? errors.description
                : ""
            }
            onChange={handleChange("description")}
            placeholder="Write your story here..."
          />
          <CustomButton
            label="Submit"
            customBtnContainer={classNames("w-100 mb-2")}
            onClick={() => handleSubmit()}
            loading={loader}
          />
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;
