import { Icons, Images } from "assets";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import TipLaoder from "shared/loader/tipLoader";
import { GetWritingTips } from "shared/services/generalService";
import styles from "./style.module.scss";
import NoContentCard from "../noContentCard";
import { routeConstant } from "shared/routes/routeConstant";

const FeedWritingTipsCard = () => {
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

  return tips.length > 0 ? (
    <div
      className={classNames(
        " d-flex flex-column align-items-center justify-content-start gap-3 position-relative py-5"
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
                  style={{ cursor: "pointer" }}
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
            <NoContentCard
              Icon={Images.NoData}
              label1="No Tips found"
              customIconContianer={classNames(styles.notContent)}
              customLabel1Style={classNames(styles.noContentLabel)}
              customContainer={classNames(
                "gap-1 d-flex align-items-center justify-content-center flex-column"
              )}
            />
          )}
        </>
      )}
      <div className={classNames(styles.btmBorder)} />
    </div>
  ) : null;
};

export default FeedWritingTipsCard;
