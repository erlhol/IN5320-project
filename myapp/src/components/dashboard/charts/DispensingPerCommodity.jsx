import React, { useState, useEffect } from "react";
import {
  Card,
  MultiSelect,
  MultiSelectOption,
  IconInfo24,
  colors,
} from "@dhis2/ui";
import ReactApexChart from "react-apexcharts";
import globalClasses from "../../../App.module.css";
import classes from "./DispensingsPerCommodity.module.css";

import { getMonthAbbrivation } from "../../../utilities/dates";

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
    colors: [
      "#A9BE3B",
      "#43A047",
      "#2196F3",
      "#FFA902",
      "#009688",
      "#F44336",
      "#6E7A8A",
    ],
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
      categories: getMonthAbbrivation(),
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
    <Card className={globalClasses.chartCard}>
      <div className={globalClasses.chartCardHeader}>
        <div className={globalClasses.dashboardCardTitle}>{props.title}</div>
        <MultiSelect
          dense
          clearable
          placeholder="Select commodities"
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
      {selectedCommodities.length ? (
        <ReactApexChart
          options={options}
          series={seriesData}
          type="line"
          height={300}
        />
      ) : (
        <div className={classes.dispensingsEmptyState}>
          <IconInfo24 color={colors.grey500} />
          <div className={classes.dispensingsEmptyStateText}>
            Select at least one commodity to see the monthly consumption over
            the year.
          </div>
        </div>
      )}
    </Card>
  );
};

export default DispensingPerCommodity;
