import { Icons, Images } from "assets";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import TipLaoder from "shared/loader/tipLoader";
import { GetAnnoucements } from "shared/services/generalService";
import styles from "./style.module.scss";
import NoContentCard from "../noContentCard";

const AnnoucementsCard = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [tips, setTips] = useState<[]>([]);
  const getAnnoucements = () => {
    setLoading(true);
    GetAnnoucements()
      .then(
        ({
          data: {
            data: { announcements },
            message,
            status,
          },
        }) => {
          if (status) {
            setTips(announcements);
          } else {
            console.log("Error", message);
          }
        },
      )
      .catch((err) => {
        console.log("Error", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getAnnoucements();
  }, [id]);
  return tips?.length > 0 ? (
    <div className={classNames(" d-flex flex-column align-items-center justify-content-start gap-3 position-relative py-5")}>
      <label className={classNames(styles.title)}>Announcements</label>
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
                <div className={classNames("d-flex w-100 align-self-start align-items-start gap-3")} key={inx}>
                  <Icons.Annoucement2 className={classNames(styles.iconStyle)} />
                  <label className={classNames(styles.subTitle)}>{item?.description}</label>
                </div>
              );
            })
          ) : (
            <NoContentCard Icon={Images.NoData} label1="No Annoucements yet!" customIconContianer={classNames(styles.notContent)} customLabel1Style={classNames(styles.noContentLabel)} customContainer={classNames("gap-1 d-flex align-items-center justify-content-center flex-column")} />
          )}
        </>
      )}
    </div>
  ) : null;
};

export default AnnoucementsCard;
