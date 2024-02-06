import classNames from "classnames";
import { useEffect, useState } from "react";
import CustomTab from "shared/components/customTabs";
import EditProfileForm from "shared/forms/editProfile";
import { SocialTabs, SocialTabsEnums, Tabs, TabsEnums } from "./constants";
import styles from "./style.module.scss";
import EditSocialLink from "shared/forms/editSocialLink";
import EditPasswordForm from "shared/forms/editPassword";
import { useSelector } from "react-redux";
import NavWrapper from "shared/components/navWrapper";
import Footer from "shared/components/footer";

const EditProfile = () => {
  const {
    user: { user },
  } = useSelector((state: any) => state.root);
  const [activeTab, setActiveTab] = useState<string>(Tabs[0]);
  const [globalTabs, setGloablTabs] = useState<any>(
    user?.social_login_id ? SocialTabsEnums : TabsEnums
  );
  const handleActiveTab = (val: string) => {
    setActiveTab(val);
  };
  useEffect(() => {
    if (user?.social_login_id) {
      setGloablTabs(SocialTabsEnums);
    } else {
      setGloablTabs(TabsEnums);
    }
    // eslint-disable-next-line
  }, []);
  return (
    <div className={classNames(styles.topMainContainer)}>
      <NavWrapper />
      <div className={classNames(styles.customContainer)}>
        <div
          className={classNames(
            "d-flex w-100 align-items-start justify-content-between pt-5 pb-4 px-3 px-sm-0"
          )}
        >
          <div
            className={classNames(
              "d-flex flex-column align-items-start jusify-content-between"
            )}
          >
            <label className={classNames(styles.title)}>My Profile</label>
            <label className={classNames(styles.subTitle)}>
              Update your personal details here.
            </label>
          </div>
        </div>
        <div className={classNames("px-3 px-sm-0")}>
          <CustomTab
            tabs={user?.social_login_id ? SocialTabs : Tabs}
            activeTab={activeTab}
            handleActiveTab={handleActiveTab}
          />
          <div
            className={classNames(
              "d-flex align-items-center justify-content-center"
            )}
          >
            {globalTabs.profile === activeTab ? (
              <EditProfileForm />
            ) : globalTabs.links === activeTab ? (
              <EditSocialLink />
            ) : (
              globalTabs.password === activeTab && <EditPasswordForm />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditProfile;
