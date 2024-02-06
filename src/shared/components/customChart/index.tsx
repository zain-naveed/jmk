import { Icons } from "assets";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import YearPicker from "shared/dropsDowns/yearPicker";
import { GetGraphData } from "shared/services/userService";
import { CustomChartProps, chartLabels, chartOptions } from "./constants";
import styles from "./style.module.scss";
import SkeletonLoader from "shared/loader/skeletonLoader";

const CustomChart = ({ name }: CustomChartProps) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  const [activeDate, setActiveDate] = useState<
    Partial<{ name: string; value: string }>
  >({
    name: String(new Date().getFullYear()),
    value: `${new Date().getFullYear()}-01-01`,
  });
  const [chartData, setChartData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openSelection, setOpenSelection] = useState<boolean>(false);
  const getGraphData = () => {
    GetGraphData(activeDate?.value)
      .then(({ data: { data, message, status } }) => {
        if (status) {
          if (data) {
            let temp: any = [];
            data?.forEach((item: any) => {
              temp.push(item?.total_earnings);
            });
            setChartData(temp);
          }
        } else {
          console.log("Error", message);
        }
      })
      .catch((err) => {
        console.log("Error", err.response.message.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    setLoading(true);
    getGraphData();
    // eslint-disable-next-line
  }, [activeDate?.value]);
  return (
    <div
      className={classNames(
        styles.chartContainer,
        "py-4 px-3 d-flex flex-column gap-3"
      )}
    >
      <div
        className={classNames(
          "d-flex w-100 justify-content-between align-items-center"
        )}
      >
        <label className={classNames(styles.chartTitle, "")}>{name}</label>
        <div
          className={classNames(
            "d-flex align-items-center justify-content-center gap-2 position-relative"
          )}
          role={!openSelection ? "button" : "none"}
          onClick={() => {
            if (!loading) setOpenSelection(!openSelection);
          }}
        >
          <label className={classNames(styles.dateLabel)} role="button">
            {activeDate?.name}
          </label>
          <Icons.ChevDown />
          <YearPicker
            setActiveDate={setActiveDate}
            openSelection={openSelection}
            setOpenSelection={setOpenSelection}
          />
        </div>
      </div>
      {loading ? (
        <>
          <SkeletonLoader iconStyle={classNames("w-100", styles.loaderStyle)} />
        </>
      ) : (
        <Line
          options={chartOptions}
          data={{
            labels: chartLabels,
            datasets: [
              {
                label: "Price",
                data: chartData,
                borderColor: "#50934B",
                backgroundColor: "white",
                borderWidth: 2,
                // pointRadius: 0,
                tension: 0.4,
              },
            ],
          }}
        />
      )}
    </div>
  );
};

export default CustomChart;
