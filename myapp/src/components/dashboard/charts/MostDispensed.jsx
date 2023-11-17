import React, { useState, useEffect } from "react";
import { Card, SingleSelect, SingleSelectOption } from "@dhis2/ui";

import ReactApexChart from "react-apexcharts";
import { getNumberOfCurrentMonth, getMonth } from "../../../utilities/dates";
import classes from "../../../App.module.css";

const MostDispensed = props => {
  const [selectedMonth, setSelectedMonth] = useState(
    getNumberOfCurrentMonth().toString()
  );
  const [seriesData, setSeriesData] = useState([
    { data: [], name: "Consumption" },
  ]);
  const [xAxisCategories, setXAxisCategories] = useState([]);

  const options = {
    chart: {
      type: "bar",
    },
    colors: ["#A9BE3B"],
    plotOptions: {
      bar: {
        borderRadius: 2,
        horizontal: true,
        barHeight: 24,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: xAxisCategories,
    },
  };

  const setChartData = month => {
    const commodities = props.stockDataPerMonth[month]
      .sort((a, b) => b.consumption - a.consumption)
      .slice(0, 5);

    const seriesData = {
      data: commodities.map(commodity => commodity.consumption),
    };
    setSeriesData([seriesData]);

    const xAxisCategories = commodities.map(
      commodity => commodity.commodityName
    );
    setXAxisCategories(xAxisCategories);
  };

  useEffect(() => {
    if (props.stockDataPerMonth) {
      setChartData(selectedMonth);
    }
  }, [props.stockDataPerMonth]);

  const handleSelectChange = value => {
    setSelectedMonth(value.selected);
    setChartData(value.selected);
  };

  return (
    <Card className={classes.chartCard}>
      <div className={classes.chartCardHeader}>
        <div className={classes.dashboardCardTitle}>{props.title}</div>
        <SingleSelect
          dense
          className={classes.monthSelect}
          onChange={handleSelectChange}
          selected={selectedMonth}
        >
          {Object.keys(props.stockDataPerMonth).map((month, i) => (
            <SingleSelectOption
              key={month}
              label={getMonth(i + 1)}
              value={month}
            />
          ))}
        </SingleSelect>
      </div>

      <ReactApexChart
        options={options}
        series={seriesData}
        type="bar"
        height={300}
      />
    </Card>
  );
};

export default MostDispensed;
