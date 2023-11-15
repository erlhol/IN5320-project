import {
  Menu,
  MenuItem,
  IconHome16,
  IconLayoutRows16,
  IconReorder16,
} from "@dhis2/ui";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidenav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleClick = value => {
    navigate(value);
  };

  return (
    <Menu>
      <MenuItem
        icon={<IconHome16></IconHome16>}
        label="Dashboard"
        active={location.pathname === "/dashboard"}
        onClick={() => handleClick("/dashboard")}
      />
      <MenuItem
        label="Stock Overview"
        icon={<IconLayoutRows16></IconLayoutRows16>}
        active={location.pathname === "/stock-overview"}
        onClick={() => handleClick("/stock-overview")}
      />
      <MenuItem
        label="Stock History"
        icon={<IconReorder16></IconReorder16>} // could not find the correct icon
        active={location.pathname === "/stock-history"}
        onClick={() => handleClick("/stock-history")}
      />
    </Menu>
  );
};

export default Sidenav;
