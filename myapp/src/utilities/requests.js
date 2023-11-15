import { getCurrentMonth } from "./dates";
// Global variables:
const orgUnit = "OZ1olxsTyNa"; // id for our organization
const lifeSavingComDataSet = "ULowA8V3ucd"; // id for life saving commodities
const consumption = "rQLFnNXXIL0";
const endBalance = "J2Qf1jtZuj8";

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
  data: ({ dataValues, period }) => ({
    orgUnit: orgUnit,
    period,
    dataValues,
  }),
};

// 4. For Transaction Update
export const transUpdateRequest = {
  resource: "dataStore/IN5320-G21/transactions",
  type: "update",
  data: transactions => transactions,
};

// 5. Get consumption data for a specific commodity in a specific period
export const consumptionRequest = {
  consumptionData: {
    resource: "/dataValue",
    params: ({ period, dataElement }) => ({
      orgUnit: orgUnit,
      period,
      dataElement,
      categoryOptionCombo: consumption,
    }),
  },
};
