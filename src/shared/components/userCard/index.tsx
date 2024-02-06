import { Images } from "assets";
import classNames from "classnames";
import styles from "./style.module.scss";
import { useNavigate } from "react-router";
import { routeConstant } from "shared/routes/routeConstant";

interface UserCardProps {
  name: string;
  avatar: any;
  isStyle2: boolean;
  isStyle3: boolean;
  id: any;
}

const UserCard = ({
  name,
  avatar,
  isStyle2,
  isStyle3,
  id,
}: Partial<UserCardProps>) => {
  const navigate = useNavigate();
  return (
    <div
      className={classNames("d-flex align-items-center justify-content-center")}
      role="button"
      onClick={() => {
        navigate(routeConstant.profile.path.replace(":id", id));
      }}
    >
      <img
        src={avatar ? avatar : Images.Avatar}
        className={classNames(styles.avatarStyle)}
        alt="avatar"
      />
      <label
        className={classNames(
          isStyle2 ? styles.nameLabel2 : styles.nameLabel,
          isStyle3 && styles.nameLabel3,
          "ms-2"
        )}
      >
        {name}
      </label>
    </div>
  );
};

export default UserCard;
