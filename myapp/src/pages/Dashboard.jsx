import React from "react";
import Header from "../components/common/Header";
import React, { useState, useEffect } from "react";
import { useDataQuery, useDataMutation } from "@dhis2/app-runtime";
import { transRequest, transUpdateRequest } from "./utilities/requests";

const Dashboard = () => {
  const { loading, error, data, refetch } = useDataQuery(transRequest);
  useEffect(() => {
    console.log("data: ");
  }, []);

  /* Dashboard is currently empty */
  return <Header title="Dashboard" />;
};

export default Dashboard;
