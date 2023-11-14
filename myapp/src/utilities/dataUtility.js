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
        const matchedTrans = transactionData?.find(trans =>
          trans.commodities.some(c => c.commodityId === dataValue.dataElement)
        );
        const matchedTransCommodity = matchedTrans?.commodities?.find(
          c => c.commodityId === dataValue.dataElement
        );

        if (matchedTransCommodity) {
          commodityData[key].lastDispensingDate = matchedTrans.date;
          commodityData[key].lastDispensingAmount =
            matchedTransCommodity?.amount;
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

export const getTransByPeriod = (transactions, startDate, endDate) => {
  const filteredTrans = {};
  for (const date in transactions) {
    const dateFormatted = new Date(date);
    if (dateFormatted >= startDate && dateFormatted <= endDate)
      filteredTrans[date] = transactions[date];
  }
  return filteredTrans;
};

export const getTransByCommodityName = (transactions, commodityNameQuery) => {
  if (!commodityNameQuery) return transactions;
  const filteredTrans = {};
  for (const date in transactions) {
    const transactionsForDate = transactions[date];

    const matchedTrans = transactionsForDate.filter(transaction =>
      transaction.commodities.some(commodity =>
        commodity.commodityName
          .toLowerCase()
          .includes(commodityNameQuery.toLowerCase())
      )
    );

    if (matchedTrans.length !== 0) {
      if (!filteredTrans[date]) filteredTrans[date] = matchedTrans;
      else filteredTrans[date] = filteredTrans[date].concat(matchedTrans);
    }
  }
  return filteredTrans;
};

export const categorizeTransByDate = transactions => {
  const categorized = {};
  transactions.forEach(transaction => {
    const date = transaction.date;
    if (!categorized[date]) categorized[date] = [];
    categorized[date].push(transaction);
  });
  return categorized;
};

export const getTransByRecipient = (transactions, recipient) => {
  if (!recipient) return transactions;
  const filteredTrans = {};
  for (const date in transactions) {
    const matchedTrans = transactions[date].filter(
      transaction => transaction.dispensedTo === recipient
    );
    if (matchedTrans.length !== 0) filteredTrans[date] = matchedTrans;
  }
  return filteredTrans;
};

export const getDateAndTime = dateTime => {
  const month = (dateTime.getMonth() + 1).toString();
  const day = dateTime.getDate().toString();
  const year = dateTime.getFullYear().toString();

  const date = `${month}/${day}/${year}`; // Format: "11/7/2023"
  const time = dateTime.toLocaleTimeString();
  return { date, time };
};

export const getCommoditiesLowInStock = (
  stockDataPerMonth,
  currentStockData
) => {
  const sumEndBalances = {};

  stockDataPerMonth.forEach(periodData => {
    periodData.forEach(commodity => {
      const { commodityId, endBalance } = commodity;
      sumEndBalances[commodityId] = sumEndBalances[commodityId] || 0;
      sumEndBalances[commodityId] += endBalance;
    });
  });

  const lowInStockCommodities = currentStockData.filter(commodity => {
    const average = Math.round(
      sumEndBalances[commodity.commodityId] / stockDataPerMonth.length
    );
    const threshold = 0.2 * average;
    return commodity.endBalance < threshold;
  });

  return lowInStockCommodities.sort((a, b) =>
    a.commodityName.localeCompare(b.commodityName)
  );
};
