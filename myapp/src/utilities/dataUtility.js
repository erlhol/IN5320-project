export const mergeCommodityAndValue = (
  dataValues,
  dataSetElements,
  transactionData
) => {
  const commodityData = {};
  dataValues?.forEach(dataValue => {
    const dataSetElement = dataSetElements?.find(
      element => element.dataElement?.id === dataValue.dataElement
    );

    if (dataSetElement) {
      const commodityName = dataSetElement.dataElement.name.split(" - ")[1];
      const categoryOptionCombo = dataValue.categoryOptionCombo;
      const value = parseInt(dataValue.value, 10);

      const key = `${commodityName}-${dataValue.period}`;

      if (!commodityData[key]) {
        commodityData[key] = {
          commodityName,
          endBalance: 0,
          consumption: 0,
          period: 0,
          lastDispensingDate: "",
          lastDispensingAmount: "",
        };
      }

      if (categoryOptionCombo === "J2Qf1jtZuj8") {
        commodityData[key].endBalance += value;
      } else if (categoryOptionCombo === "rQLFnNXXIL0") {
        commodityData[key].consumption += value;
      }

      commodityData[key].period = dataValue.period;
      commodityData[key].commodityId = dataValue.dataElement;

      // Get the lastDispencing data from transactionData
      if (transactionData) {
        const matchedTrans = transactionData?.find(
          trans =>
            trans.type === "Dispensing" &&
            trans.commodities.some(c => c.commodityId === dataValue.dataElement)
        );
        const matchedTransCommodity = matchedTrans?.commodities?.find(
          c => c.commodityId === dataValue.dataElement
        );

        if (matchedTransCommodity) {
          commodityData[key].lastDispensingDate = matchedTrans.date;
          commodityData[key].lastDispensingAmount =
            matchedTransCommodity?.amount.toString().slice(1);
        }
      }
    }
  });

  const commodityList = Object.values(commodityData);
  return commodityList;
};

export const mergeDataForDashboard = (dataValues, dataSetElements) => {
  const commodities = mergeCommodityAndValue(dataValues, dataSetElements, null);
  const groupedCommodities = commodities.reduce((result, commodity) => {
    const periodIndex = result.findIndex(
      group => group[0]?.period === commodity.period
    );
    if (periodIndex !== -1) result[periodIndex].push(commodity);
    else result.push([commodity]);
    return result;
  }, []);
  return groupedCommodities;
};

export const categorizeTransByDate = transactions => {
  const categorized = {};
  transactions.forEach(transaction => {
    const date = transaction.date;
    if (!categorized[date]) categorized[date] = [];
    categorized[date].push(transaction);
  });

  const dataArray = Object.entries(categorized);
  dataArray.sort((a, b) => new Date(b[0]) - new Date(a[0]));
  const sortedData = Object.fromEntries(dataArray);
  return sortedData;
};

export const getMostRecentTransactionsObject = (
  categorizedTrans,
  nrTranNeeded
) => {
  const mostRecentTransactionsObject = {};
  let nrTransactionsAdded = 0;

  for (const date in categorizedTrans) {
    const transactions = categorizedTrans[date];
    const sortedTransactions = transactions.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    sortedTransactions.forEach(trans => {
      if (!mostRecentTransactionsObject[date])
        mostRecentTransactionsObject[date] = [];
      if (nrTransactionsAdded < nrTranNeeded) {
        mostRecentTransactionsObject[date].push(trans);
        nrTransactionsAdded++;
      }
    });
    if (nrTransactionsAdded === nrTranNeeded) break;
  }

  return mostRecentTransactionsObject;
};

export const checkDateInFuture = dateString => {
  const date = new Date(dateString);
  const now = new Date();
  return date > now;
};
