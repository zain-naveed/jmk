import { Images } from "assets";
import classNames from "classnames";
import LinesEllipsis from "react-lines-ellipsis";
import SkeletonLoader from "shared/loader/skeletonLoader";
import NoContentCard from "../noContentCard";
import styles from "./style.module.scss";
import { useState } from "react";
interface Props {
  supporters: any[];
  loading: boolean;
}
function PaymentsTable({ supporters, loading }: Props) {
  return (
    <div className="table-responsive">
      <table className="table mb-0" style={{ minWidth: "550px" }}>
        <thead>
          <tr style={{ height: "44px" }}>
            <th className="ps-3" style={{ maxWidth: "25%" }}>
              Supporters Name
            </th>
            <th style={{ maxWidth: "20%" }}>Amount</th>
            <th style={{ maxWidth: "25%" }}>Status</th>
            <th className="pe-3" style={{ maxWidth: "30%" }}>
              Message
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <>
              {Array.from(Array(10).keys()).map((item, inx: number) => {
                return (
                  <tr key={inx}>
                    <td
                      className={classNames(styles.td, "ps-3")}
                      style={{ maxWidth: "25%" }}
                    >
                      <SkeletonLoader
                        iconStyle={classNames(styles.labelLoader)}
                      />
                    </td>
                    <td
                      className={classNames(styles.td)}
                      style={{ maxWidth: "20%" }}
                    >
                      <SkeletonLoader
                        iconStyle={classNames(styles.labelLoader)}
                      />
                    </td>
                    <td
                      className={classNames(styles.td)}
                      style={{ maxWidth: "25%" }}
                    >
                      <SkeletonLoader
                        iconStyle={classNames(styles.labelLoader)}
                      />
                    </td>
                    <td
                      className={classNames(styles.td, "pe-3")}
                      style={{ maxWidth: "30%" }}
                    >
                      <SkeletonLoader
                        iconStyle={classNames(styles.labelLoader)}
                      />
                    </td>
                  </tr>
                );
              })}
            </>
          ) : (
            <>
              {supporters?.length > 0 ? (
                <>
                  {supporters.map((item, inx: number) => {
                    return <TableRow item={item} key={inx} />;
                  })}
                </>
              ) : null}
            </>
          )}
        </tbody>
      </table>
      {supporters?.length === 0 ? (
        <div className={classNames(styles.noContentTopContainer)}>
          <NoContentCard label1="No Supporters found" Icon={Images.NoData} />
        </div>
      ) : null}
    </div>
  );
}

const TableRow = ({ item }: any) => {
  const [truncated, setTruncated] = useState<boolean>(true);
  return (
    <tr>
      <td className={classNames(styles.td, "ps-3")} style={{ maxWidth: "25%" }}>
        {item?.supporter_name}
      </td>
      <td className={classNames(styles.td)} style={{ maxWidth: "20%" }}>
        $ {item?.amount_received}
      </td>
      <td className={classNames(styles.td)} style={{ maxWidth: "25%" }}>
        {item?.status}
      </td>
      <td className={classNames(styles.td, "pe-3")} style={{ maxWidth: "30%" }}>
        {truncated ? (
          <LinesEllipsis
            text={item?.comment ? item?.comment : ""}
            maxLine="1"
            ellipsis={
              <>
                ...{" "}
                <button
                  onClick={() => setTruncated(!truncated)}
                  className={classNames(styles.moreBtn)}
                >
                  Read More
                </button>
              </>
            }
          />
        ) : (
          <div>
            {item?.comment}{" "}
            <button
              onClick={() => setTruncated(!truncated)}
              className={classNames(styles.moreBtn)}
            >
              Less
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

export default PaymentsTable;
