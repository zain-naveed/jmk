import { Icons } from "assets";
import classNames from "classnames";
import { useEffect, useState } from "react";
import CustomChart from "shared/components/customChart";
import Pagination from "shared/components/pagination";
import PaymentsTable from "shared/components/paymentsTable";
import StatsCardLoader from "shared/loader/statsCardLoader";
import {
  GetUserStatistics,
  GetUserSupporters,
} from "shared/services/userService";
import styles from "./style.module.scss";

const Payments = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [stats, setStats] = useState<any>({});
  const [supporters, setSupporters] = useState<[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const getStats = () => {
    setLoading(true);
    GetUserStatistics()
      .then(({ data: { data, message, status } }) => {
        if (status) {
          setStats(data);
        } else {
          console.log(message);
        }
      })
      .catch((err) => {
        console.log("Error", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const getSupporters = () => {
    setTableLoading(true);
    GetUserSupporters({ page: currentPage, pagination: 10 })
      .then(
        ({
          data: {
            data: { data, meta },
            message,
            status,
          },
        }) => {
          if (status) {
            setTotal(meta?.total);
            setSupporters(data);
          } else {
            console.log(message);
          }
        }
      )
      .catch((err) => {
        console.log("Error", err);
      })
      .finally(() => {
        setTableLoading(false);
      });
  };
  useEffect(() => {
    getStats();

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getSupporters();
    // eslint-disable-next-line
  }, [currentPage]);

  return (
    <div className={classNames("d-flex flex-column mt-3 gap-4")}>
      <div className={classNames("d-flex justify-content-between flex-wrap")}>
        {loading ? (
          <>
            <StatsCardLoader />
            <StatsCardLoader />
            <StatsCardLoader />
          </>
        ) : (
          <>
            {Object.keys(stats).map((item, inx) => {
              return <StatsCard item={stats[item]} key={inx} name={item} />;
            })}
          </>
        )}
      </div>
      <CustomChart name={"Earning Figures"} />
      <div className={classNames(styles.tableContainer, "d-flex flex-column")}>
        <div className={classNames("d-flex flex-column px-3 py-4")}>
          <label className={classNames(styles.tableHeader)}>
            Recent Supporters
          </label>
          <label className={classNames(styles.tableSubTitle)}>
            See people who supports your arts & stories
          </label>
        </div>
        <PaymentsTable supporters={supporters} loading={tableLoading} />
      </div>
      <div className={classNames(styles.seperator)} />
      <Pagination
        className={styles.paginationBar}
        currentPage={currentPage}
        totalCount={total}
        pageSize={10}
        onPageChange={(page: any) => setCurrentPage(page)}
      />
    </div>
  );
};
interface StatsCardProps {
  item: any;
  name: string;
}

const StatsCard = ({ item, name }: Partial<StatsCardProps>) => {
  return (
    <div className={classNames("d-flex p-3 mt-4", styles.statContainer)}>
      <div className={classNames("col-7 d-flex flex-column gap-3")}>
        <label className={classNames(styles.statstitle)}>
          {name !== "views" ? name : "Total Views"}
        </label>
        <label className={classNames(styles.statsAmount)}>
          {name === "earnings" ? "$ " : ""}
          {item?.total}
        </label>
        <div
          className={classNames(
            "d-flex align-items-center justify-content-start gap-2"
          )}
        >
          <div className={classNames("d-flex align-items-center gap-1")}>
            {item?.percentage?.percentage ? (
              item?.percentage?.isIncreased ? (
                <Icons.ArrowUp2 className={classNames(styles.arrowIcon)} />
              ) : (
                <Icons.ArrowDown2 className={classNames(styles.arrowIcon)} />
              )
            ) : null}

            <label
              className={classNames(
                styles.statsPercent,
                styles.statsPercentActive
              )}
            >
              {item?.percentage?.percentage}%
            </label>
          </div>

          <label className={classNames(styles.statsPercent, styles.lstTxt)}>
            vs last month
          </label>
        </div>
      </div>
      <div
        className={classNames(
          "col-5 d-flex align-items-end justify-content-end"
        )}
      >
        {item?.percentage?.isIncreased ? (
          <Icons.UpChart />
        ) : (
          <Icons.DownChart />
        )}
      </div>
    </div>
  );
};

export default Payments;
