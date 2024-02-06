import { Icons } from "assets";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import TipLaoder from "shared/loader/tipLoader";
import { GetWritingTips } from "shared/services/generalService";
import styles from "./style.module.scss";
import { routeConstant } from "shared/routes/routeConstant";

const WriterTipsCard = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [tips, setTips] = useState<[]>([]);
  const getTips = () => {
    setLoading(true);
    GetWritingTips()
      .then(({ data: { data, message, status } }) => {
        if (status) {
          setTips(data);
        } else {
          console.log("Error", message);
        }
      })
      .catch((err) => {
        console.log("Error", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getTips();
  }, [id]);
  return (
    <div
      className={classNames(
        styles.container,
        " d-flex flex-column align-items-center justify-content-start gap-3"
      )}
    >
      <label className={classNames(styles.title)}>Writing Tips & Ideas</label>
      {loading ? (
        <>
          <TipLaoder />
          <TipLaoder />
          <TipLaoder />
        </>
      ) : (
        <>
          {tips?.length > 0 ? (
            tips?.map((item: any, inx) => {
              return (
                <div
                  className={classNames(
                    "d-flex w-100 align-self-start align-items-start gap-3"
                  )}
                  key={inx}
                  onClick={() =>
                    navigate(routeConstant.writingTips.path, {
                      state: { tip: item },
                    })
                  }
                >
                  <Icons.LightOn className={classNames(styles.iconStyle)} />
                  <label
                    className={classNames(styles.subTitle, styles.ellipsesText)}
                  >
                    {item?.description}
                  </label>
                </div>
              );
            })
          ) : (
            <div
              className={classNames("d-flex align-items-center flex-column")}
            >
              <img
                src={Icons.NoContent}
                className={classNames(styles.notContent)}
                alt="not-content"
              />
              <label className={classNames(styles.noContentLabel)}>
                No Tips found
              </label>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WriterTipsCard;
