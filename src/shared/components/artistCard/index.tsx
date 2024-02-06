import classNames from "classnames";
import styles from "./style.module.scss";
import { Images } from "assets";
import { useNavigate } from "react-router";
import { routeConstant } from "shared/routes/routeConstant";

interface ArtistsCardProps {
  name: string;
  counter: number | any;
  id: number;
  defaultArt: any;
}

const ArtistCard = ({
  name,
  counter,
  id,
  defaultArt,
}: Partial<ArtistsCardProps>) => {
  const navigate = useNavigate();
  return (
    <div
      className={classNames(
        "d-flex flex-column align-items-center justify-content-center gap-2 mt-5",
        styles.artistsContainer
      )}
      onClick={() => {
        navigate(routeConstant?.profile.path.replace(":id", String(id)), {
          state: { activeTab: "arts" },
        });
      }}
    >
      <img
        src={defaultArt ? defaultArt : Images.Avatar}
        alt="artist-avatar"
        className={classNames(styles.artistsStyle)}
        role="button"
      />
      <div
        className={classNames(
          "d-flex flex-column align-items-start justify-content-center w-100"
        )}
        role="button"
      >
        <label className={classNames(styles.title)} role="button">
          {name}
        </label>
        <label className={classNames(styles.subTitle)} role="button">
          {counter} Art {counter > 1 ? "Works" : "Work"}
        </label>
      </div>
    </div>
  );
};

export default ArtistCard;
