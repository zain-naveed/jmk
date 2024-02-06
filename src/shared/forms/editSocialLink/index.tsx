import { Icons } from "assets";
import classNames from "classnames";
import CustomButton from "shared/components/customButton";
import CustomInput from "shared/components/customInput";
import styles from "./style.module.scss";
import { useEffect, useState } from "react";
import { getProfileSocialLink, UpdateSocialLink, DeteleSocialLink } from "shared/services/userService";
import { toastMessage } from "shared/components/toast";

interface LinkValues {
  linkedin: string;
  facebook: string;
  twitter: string;
  instagram: string;
}

const EditSocialLink = () => {
  const [loader, setLoader] = useState<boolean>(false);
  const [emptyBool, setEmptyBool] = useState<boolean>(false);
  const [allLinks, setAllLink] = useState<string[]>([]);
  const [socialLinks, setSocialLinks] = useState<LinkValues>({
    linkedin: "",
    facebook: "",
    twitter: "",
    instagram: "",
  });
  const [apiLinks, setApiLinks] = useState<LinkValues>({
    linkedin: "",
    facebook: "",
    twitter: "",
    instagram: "",
  });

  useEffect(() => {
    const hasEmptyLink = Object.values(apiLinks).some((link) => link.trim() === "");
    setEmptyBool(hasEmptyLink);
  }, [apiLinks]);


  const handleSubmit = () => {
    const updatedLinks = Object.entries(socialLinks).reduce((acc: any, [key, value]) => {
      getSocialLinks();
      if (value.length) {
        if (value.includes(".com")) {
          acc.push({
            social_type: key.charAt(0).toUpperCase() + key.slice(1),
            url: value,
          });
        } else {
          toastMessage("error", key.charAt(0).toUpperCase() + key.slice(1) + " link is invalid");
        }
      }
      return acc;
    }, []);

    if (updatedLinks.length === 0) {
      toastMessage("error", "No social link added");
      return;
    }

    setLoader(true);

    UpdateSocialLink({ social_links: updatedLinks })
      .then(({ data: { data, message } }) => {
        toastMessage("success", message);
        data?.forEach((item: any) => {
          const key = item.social_type.toLowerCase();
          if (socialLinks.hasOwnProperty(key)) {
            setApiLinks((prevState) => ({
              ...prevState,
              [key]: item.social_link,
            }));
          }
        });
        setLoader(false);
      })
      .catch((err) => {
        console.log("ERR", err?.response?.data?.message);
        toastMessage("Error", err?.response?.data?.message);
        setLoader(false);
      });
  };

  const handleCancel = () => {
    setSocialLinks({
      linkedin: "",
      facebook: "",
      twitter: "",
      instagram: "",
    });
  };

  const getSocialLinks = () => {
    getProfileSocialLink()
      .then(({ data: { data } }) => {
        setAllLink(data);
        data?.forEach((item: any) => {
          const key = item.social_type.toLowerCase();
          if (socialLinks.hasOwnProperty(key)) {
            setApiLinks((prevState) => ({
              ...prevState,
              [key]: item.social_link,
            }));
          }
        });
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  useEffect(() => {
    getSocialLinks();
    // eslint-disable-next-line
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof LinkValues) => {
    const { value } = e.currentTarget;
    setSocialLinks((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleDelete = (e: any, key: any, value: any) => {
    e.stopPropagation();
    let temp: any = [...allLinks];
    let index = temp.findIndex((item: any) => item.social_link === value);

    if (index > -1) {
      DeteleSocialLink(temp[index]?.id)
        .then(({ data: { data, message } }) => {
          toastMessage("success", message);
          setApiLinks((prevState) => ({
            ...prevState,
            [key]: "",
          }));
          handleCancel();
        })
        .catch(() => {});
    }
  };

  return (
    <form
      className={classNames("d-flex col-12 col-sm-11 col-md-10 col-lg-8 col-xl-7 my-5 flex-column align-items-center justify-content-center  py-4 px-4", styles.topLevelContainer)}
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <label className={classNames(styles.titleLabel, "mb-3")}>My Social Links</label>
      {Object.values(apiLinks).some((value) => value.trim().length > 0) ? <label className={classNames(styles.boldTitle, "mt-2 mb-3")}>Linked Accounts</label> : ""}
      {Object.entries(apiLinks).map(([key, value], inx) => {
        if (value.length) {
          return (
            <div
              key={key}
              className={classNames(`d-flex align-items-center mb-3 justify-content-between w-100 py-3 px-3`, styles.linkContainer)}
              onClick={() => {
                let url = value.match(/^http[s]?:\/\//) ? value : "https://" + value;
                window.open(url, "_blank");
              }}
            >
              <div className={classNames("d-flex align-items-center gap-2")}>
                {key === "facebook" ? <Icons.FacebookColor className={classNames(styles.linkIcon)} /> : key === "linkedin" ? <Icons.LinkedinColor className={classNames(styles.linkIcon)} /> : key === "instagram" ? <Icons.InstagramColor className={classNames(styles.linkIcon)} /> : key === "twitter" ? <Icons.TwitterColor className={classNames(styles.linkIcon)} /> : ""}

                <label className={classNames(styles.linkLabel)}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
              </div>
              <Icons.Cross className={classNames(styles.crossIcon)} onClick={(e: any) => handleDelete(e, key, value)} />
            </div>
          );
        }
        return null;
      })}

      {emptyBool ? <label className={classNames(styles.boldTitle, "mt-2 mb-3")}>Link More Accounts</label> : null}

      {apiLinks.linkedin.length === 0 && (
        <div className={classNames("w-100 d-flex align-items-start flex-column gap-1")}>
          <label className={classNames(styles.inputLabel)}>Linkedin Link</label>
          <CustomInput type="text" Icon={Icons.Link} customIconStyle={classNames("me-1")} onChange={(e: any) => handleInputChange(e, "linkedin")} value={socialLinks.linkedin} />
        </div>
      )}
      {apiLinks.facebook.length === 0 && (
        <div className={classNames("w-100 d-flex align-items-start flex-column gap-1")}>
          <label className={classNames(styles.inputLabel)}>Facebook Link</label>
          <CustomInput type="text" Icon={Icons.Link} customIconStyle={classNames("me-1")} onChange={(e: any) => handleInputChange(e, "facebook")} value={socialLinks.facebook} />
        </div>
      )}
      {apiLinks.instagram.length === 0 && (
        <div className={classNames("w-100 d-flex align-items-start flex-column gap-1")}>
          <label className={classNames(styles.inputLabel)}>Instagram Link</label>
          <CustomInput type="text" Icon={Icons.Link} customIconStyle={classNames("me-1")} onChange={(e: any) => handleInputChange(e, "instagram")} value={socialLinks.instagram} />
        </div>
      )}
      {apiLinks.twitter.length === 0 && (
        <div className={classNames("w-100 d-flex align-items-start flex-column gap-1")}>
          <label className={classNames(styles.inputLabel)}>Twitter Link</label>
          <CustomInput type="text" Icon={Icons.Link} customIconStyle={classNames("me-1")} onChange={(e: any) => handleInputChange(e, "twitter")} value={socialLinks.twitter} />
        </div>
      )}

      <div className={classNames("d-flex align-items-center gap-3 align-self-end")}>
        <CustomButton label="Cancel" customBtnContainer={classNames(styles.cancelBtn)} onClick={() => handleCancel()} />
        <CustomButton label="Save Changes" customBtnContainer={classNames(styles.saveBtn)} loading={loader} onClick={() => handleSubmit()} />
      </div>
    </form>
  );
};

export default EditSocialLink;
