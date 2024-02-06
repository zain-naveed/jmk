import classNames from "classnames";
import styles from "./style.module.scss";
import { Images } from "assets";
import { useNavigate } from "react-router";
import { routeConstant } from "shared/routes/routeConstant";

interface WritersCardProps {
  name: string;
  counter: number | any;
  id: number;
  avatar: any;
}

const WritersCard = ({
  name,
  counter,
  id,
  avatar,
}: Partial<WritersCardProps>) => {
  const navigate = useNavigate();
  return (
    <div
      className={classNames(
        "col-xl-2 col-lg-3 col-md-4 col-sm-6 col-6 d-flex flex-column align-items-center justify-content-center gap-2 mt-5"
      )}
      onClick={() => {
        navigate(routeConstant?.profile.path.replace(":id", String(id)), {
          state: { activeTab: "stories" },
        });
      }}
    >
      <img
        src={avatar ? avatar : Images.Avatar}
        alt="artist-avatar"
        className={classNames(styles.avatarStyle)}
        role="button"
      />
      <div
        className={classNames(
          "d-flex flex-column align-items-center justify-content-center"
        )}
        role="button"
      >
        <label className={classNames(styles.title)} role="button">
          {name}
        </label>
        <label className={classNames(styles.subTitle)} role="button">
          {counter} {counter > 1 ? "Stories" : "Story"}
        </label>
      </div>
    </div>
  );
};

export default WritersCard;
