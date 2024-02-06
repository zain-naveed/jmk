import { useNavigate } from "react-router";

import { Images } from "assets";
import classNames from "classnames";
import styles from "./style.module.scss";
import { routeConstant } from "shared/routes/routeConstant";

function ContributerCard({ item }: any) {
  const navigate = useNavigate();
  return (
    <div
      className={classNames(
        styles.userContainer,
        "d-flex flex-column align-items-center p-0"
      )}
      onClick={() => {
        navigate(routeConstant.profile.path.replace(":id", item?.id));
      }}
    >
      <img
        src={item?.profile_pic ? item?.full_profile_path : Images.Avatar}
        alt="user-pic"
        className={classNames(styles.userIcon)}
        role="button"
      />

      <label className={classNames(styles.title, "mt-2")} role="button">
        {item?.name}
      </label>
    </div>
  );
}

export default ContributerCard;
