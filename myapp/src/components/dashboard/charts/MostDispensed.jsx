import React from "react";
import { Card } from "@dhis2/ui";
import ReactApexChart from "react-apexcharts";
import classes from "../../../App.module.css";

const MostDispensed = props => {
  const series = [
    {
      data: props.data.map(a => a.consumption),
    },
  ];

  const options = {
    chart: {
      type: "bar",
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
        barHeight: 20,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: props.data.map(a => a.commodityName),
    },
  };

  return (
    <Card className={classes.chartCard}>
      <div className={classes.dashboardCardTitle}>{props.title}</div>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={250}
      />
    </Card>
  );
};

export default MostDispensed;
