import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { getMonthAbbrivation } from "../../../utilities/dates";
import { CircularLoader } from "@dhis2/ui";

const ConsumptionHistoryChart = props => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const chosenCommodityId = props.commodity.commodityId;
    const chosenCommodityData = props.monthlyStockData
      .map(innerArray =>
        innerArray.filter(
          commodity => chosenCommodityId === commodity.commodityId
        )
      )
      .map(arr => arr[0].consumption);

    setChartData({
      chartOptions: {
        chart: {
          id: props.commodity.commodityName,
        },
        colors: ["#A9BE3B"],
        dataLabels: {
          enabled: true,
        },
        xaxis: {
          categories: getMonthAbbrivation(),
        },
        stroke: {
          curve: "straight",
          width: 3,
        },
        markers: {
          size: 1,
        },
      },
      chartSeries: [
        {
          name: "Consumption",
          data: chosenCommodityData,
        },
      ],
    });
  }, [props]);

  if (chartData) {
    return (
      <ReactApexChart
        options={chartData.chartOptions}
        series={chartData.chartSeries}
        type="line"
        height={200}
      />
    );
  }
  return <CircularLoader />;
};
export default ConsumptionHistoryChart;
