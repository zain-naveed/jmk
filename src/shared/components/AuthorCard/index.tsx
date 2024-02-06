import classNames from "classnames";
import UserCard from "../userCard";
import styles from "./style.module.scss";
import { Icons } from "assets";
import CustomButton from "../customButton";
import DonationModal from "shared/modal/donation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSignInReducer } from "shared/redux/reducers/sigInSlice";
import { allForms } from "shared/modal/auth/constants";

interface AuthorCardProps {
  name: string;
  avatar: any;
  bio: string;
  id: number;
  social_links: any[];
}

const AuthorCard = ({
  name,
  avatar,
  bio,
  id,
  social_links,
}: Partial<AuthorCardProps>) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.root);
  const [showDonationModal, setShowDonationModal] = useState<boolean>(false);
  const handleShowDonationnModal = () => {
    if (user?.token) {
      setShowDonationModal(true);
    } else {
      dispatch(
        setSignInReducer({ showModal: true, activeModal: allForms.signin.name })
      );
    }
  };

  const handleCloseDonationModal = () => {
    setShowDonationModal(false);
  };

  return (
    <div
      className={classNames(
        "d-flex flex-column align-items-center justify-content-center px-4 py-4",
        styles.container
      )}
    >
      <div
        className={classNames(
          "d-flex align-items-center justify-content-between w-100 mb-3"
        )}
      >
        <UserCard name={name} isStyle3 avatar={avatar} id={id} />
        {social_links && social_links?.length > 0 ? (
          <div className={classNames("d-flex gap-2")}>
            {social_links.map((item, inx) => {
              return item?.social_type === "Twitter" ? (
                <Icons.TwitterWhite
                  className={classNames(styles.socialIcon)}
                  onClick={() => {
                    let url = item?.social_link.match(/^http[s]?:\/\//)
                      ? item?.social_link
                      : "https://" + item?.social_link;
                    window.open(url, "_blank");
                  }}
                  role="button"
                  key={inx}
                />
              ) : item?.social_type === "Facebook" ? (
                <Icons.FacebookGrey
                  className={classNames(styles.socialIcon)}
                  onClick={() => {
                    let url = item?.social_link.match(/^http[s]?:\/\//)
                      ? item?.social_link
                      : "https://" + item?.social_link;
                    window.open(url, "_blank");
                  }}
                  role="button"
                  key={inx}
                />
              ) : item?.social_type === "Instagram" ? (
                <Icons.Instagram
                  className={classNames(styles.socialIcon)}
                  onClick={() => {
                    let url = item?.social_link.match(/^http[s]?:\/\//)
                      ? item?.social_link
                      : "https://" + item?.social_link;
                    window.open(url, "_blank");
                  }}
                  role="button"
                  key={inx}
                />
              ) : item?.social_type === "Linkedin" ? (
                <Icons.LinkedinColor
                  className={classNames(styles.socialIcon)}
                  onClick={() => {
                    let url = item?.social_link.match(/^http[s]?:\/\//)
                      ? item?.social_link
                      : "https://" + item?.social_link;
                    window.open(url, "_blank");
                  }}
                  role="button"
                  key={inx}
                />
              ) : null;
            })}
          </div>
        ) : null}
      </div>

      {bio ? (
        <div
          className={classNames(
            "d-flex align-items-center justify-content-start w-100"
          )}
        >
          <label className={classNames(styles.descLabel, "mb-3")}>{bio}</label>
        </div>
      ) : null}

      {user?.user?.id !== id ? (
        <CustomButton
          label="Buy Me Coffee"
          Icon={Icons.Coffee}
          customBtnContainer={classNames("w-100", styles.btnFont)}
          customIconStyle={classNames("me-2")}
          onClick={handleShowDonationnModal}
          isBlackIcon
        />
      ) : null}

      <DonationModal
        otherUser={{ id: id }}
        show={showDonationModal}
        handleClose={handleCloseDonationModal}
      />
    </div>
  );
};

export default AuthorCard;
