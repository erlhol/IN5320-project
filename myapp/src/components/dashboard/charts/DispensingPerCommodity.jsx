import React, { useState, useEffect } from "react";
import { Card, MultiSelect, MultiSelectOption } from "@dhis2/ui";
import ReactApexChart from "react-apexcharts";
import classes from "../../../App.module.css";

const DispensingPerCommodity = props => {
  const [seriesData, setSeriesData] = useState([
    { data: [], name: "", id: "" },
  ]);
  const [commodities, setCommodities] = useState([]);
  const [selectedCommodities, setSelectedCommodities] = useState([]);

  const options = {
    chart: {
      type: "line",
    },
    colors: ["#43A047", "#2196F3", "#FFA902", "#009688", "#F44336", "#6E7A8A"],
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: "straight",
      width: 3,
    },
    markers: {
      size: 1,
    },
    xaxis: {
      categories: [
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
      ],
    },
  };

  const setChartData = commodities => {
    const filteredData = props.stockDataPerMonth.map(innerArray =>
      innerArray.filter(commodity =>
        commodities.includes(commodity.commodityId)
      )
    );

    const seriesData = [];

    filteredData.forEach(innerArray => {
      innerArray.forEach(commodity => {
        let commodityEntry = seriesData.find(
          entry => entry.id === commodity.commodityId
        );

        if (!commodityEntry) {
          commodityEntry = {
            name: commodity.commodityName,
            data: [],
            id: commodity.commodityId,
          };
          seriesData.push(commodityEntry);
        }

        commodityEntry.data.push(commodity.consumption);
      });
    });

    setSeriesData(seriesData);
  };

  useEffect(() => {
    if (props.stockDataPerMonth) {
      const commodityIdNameCombinations = props.stockDataPerMonth[0]
        .map(({ commodityId, commodityName }) => ({
          commodityId,
          commodityName,
        }))
        .sort((a, b) => a.commodityName.localeCompare(b.commodityName));

      setCommodities(commodityIdNameCombinations);
    }
  }, [props.stockDataPerMonth]);

  const handleSelectChange = value => {
    setSelectedCommodities(value.selected);
    setChartData(value.selected);
  };

  return (
    <Card className={classes.chartCard}>
      <div className={classes.chartCardHeader}>
        <div className={classes.dashboardCardTitle}>{props.title}</div>
        <MultiSelect
          dense
          clearable
          placeholder="Select one or more commodities"
          clearText="Clear"
          selected={selectedCommodities}
          onChange={handleSelectChange}
        >
          {commodities.map((commodity, i) => (
            <MultiSelectOption
              key={i}
              label={commodity.commodityName}
              value={commodity.commodityId}
            />
          ))}
        </MultiSelect>
      </div>
      <ReactApexChart
        options={options}
        series={seriesData}
        type="line"
        height={300}
      />
    </Card>
  );
};

export default DispensingPerCommodity;
