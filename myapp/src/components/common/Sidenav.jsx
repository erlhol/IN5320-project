import {
  Menu,
  MenuItem,
  IconHome16,
  IconLayoutRows16,
  IconReorder16,
} from "@dhis2/ui";
import React from "react";

const Sidenav = props => {
  return (
    <Menu>
      <MenuItem
        icon={<IconHome16></IconHome16>}
        label="Dashboard"
        active={props.activePage === "Dashboard"}
        onClick={() => props.activePageHandler("Dashboard")}
      />
      <MenuItem
        label="Stock Overview"
        icon={<IconLayoutRows16></IconLayoutRows16>}
        active={props.activePage === "StockOverview"}
        onClick={() => props.activePageHandler("StockOverview")}
      />
      <MenuItem
        label="Stock History"
        icon={<IconReorder16></IconReorder16>} // could not find the correct icon
        active={props.activePage === "StockHistory"}
        onClick={() => props.activePageHandler("StockHistory")}
      />
    </Menu>
  );
};

export default Sidenav;
