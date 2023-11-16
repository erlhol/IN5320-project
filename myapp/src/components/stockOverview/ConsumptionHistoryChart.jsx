import ReactApexChart from "react-apexcharts";
import { getMonthAbbrivation } from "../../utilities/dates";
const ConsumptionHistoryChart = props => {
  console.log(props);
  const chosenCommodityId = props.commodity.commodityId;
  const chosenCommodityData = props.monthlyStockData
    .map(innerArray =>
      innerArray.filter(
        commodity => chosenCommodityId === commodity.commodityId
      )
    )
    .map(arr => arr[0].consumption);

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

  const chartSeries = [
    {
      name: "Monthly Consumption",
      data: chosenCommodityData,
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
