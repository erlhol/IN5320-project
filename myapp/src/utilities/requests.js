// Global variables:

import { getCurrentMonth } from "./dates";

const orgUnit = "OZ1olxsTyNa"; // id for our organization
const lifeSavingComDataSet = "ULowA8V3ucd"; // id for life saving commodities

// 1. For Stock Display
export const stockRequest = {
  // Read all commodities in live saving commodities dataset
  // https://data.research.dhis2.org/in5320/api/dataSets/ULowA8V3ucd.json?fields=name,id,dataSetElements[dataElement[name,id,categoryCombo[name,id,[name,id]]]categoryOptionCombos
  commodities: {
    resource: `/dataSets/${lifeSavingComDataSet}`,
    params: {
      fields:
        "name,id,dataSetElements[dataElement[name,id,created,categoryCombo[name,id]]]",
    },
  },

  // Read values of a period for all commodities in live saving commodities dataset
  // https://data.research.dhis2.org/in5320/api/dataValueSets.json?dataSet=ULowA8V3ucd&period=202310&orgUnit=ZpE2POxvl9P
  dataValues: {
    resource: "/dataValueSets",
    params: ({ period }) => ({
      period,
      orgUnit: orgUnit,
      dataSet: lifeSavingComDataSet,
    }),
  },
  me: {
    resource: "me",
  },
};

export const getCurrentAccount = {
  me: {
    resource: "me",
  },
};

// 2. For Transaction Display
export const transRequest = {
  transactionHistory: {
    resource: "/dataStore/IN5320-G21/transactions",
  },
};

// 3. For Stock Update
export const stockUpdateRequest = {
  resource: "dataValueSets",
  dataSet: lifeSavingComDataSet,
  type: "create",
  data: ({ dataElement, value, categoryOptionCombo }) => ({
    orgUnit: orgUnit,
    period: getCurrentMonth(),
    dataValues: [
      {
        dataElement,
        categoryOptionCombo,
        value,
      },
    ],
  }),
};

// 4. For Transaction Update
export const transUpdateRequest = {
  resource: "dataStore/IN5320-G21/transactions",
  type: "update",
  data: transactions => transactions,
};
