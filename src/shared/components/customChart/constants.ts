interface CustomChartProps {
  name: string;
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
      display: false,
    },
    title: {
      display: false,
      text: "",
    },

    tooltip: {
      displayColors: false,
      backgroundColor: "white",
      padding: 14,
      footerFont: {
        weight: "normal",
      },
      footerColor: "#696974",
      titleFont: {
        padding: 20,
        size: 15,
        weight: "bold",
      },
      bodyFont: {
        padding: 20,
        size: 15,
        weight: "bold",
      },
      callbacks: {
        title: () => {
          return "";
        },
        labelTextColor: (context: any) => {
          return "black";
        },
        label: (context: any) => {
          return "$ " + context.formattedValue;
        },
        footer: (context: any) => {
          return context[0].label;
        },
      },
    },
  },
  scales: {
    x: {
      ticks: {
        display: true,
      },
    },
    y: {
      ticks: {
        display: true,
      },
      grid: {
        display: false,
      },
    },
  },
};
const chartLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export { chartLabels, chartOptions };
export type { CustomChartProps };
