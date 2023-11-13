import ReactApexChart from "react-apexcharts";
import { getMonthAbbrivation } from "../../utilities/dates";
const ConsumptionHistoryChart = props => {
  const chartOptions = {
    chart: {
      id: props.commodity.commodityName,
    },
    xaxis: {
      categories: getMonthAbbrivation(),
    },
    markers: {
      size: 4,
    },
  };

  // TODO: replace the mock data with real values
  const chartSeries = [
    {
      name: "Monthly Consumption",
      data: [100, 250, 100, 10, 290, 225, 225, 75, 90, 280, 260, 250],
    },
  ];

  return (
    <ReactApexChart
      options={chartOptions}
      series={chartSeries}
      type="line"
      height={"200"}
      width={"750"}
    />
  );
};
export default ConsumptionHistoryChart;
