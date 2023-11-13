export const mergeCommodityAndValue = (
  dataValues,
  dataSetElements,
  transactionData
) => {
  const commodityData = {};
  console.log("dataValues: ", dataValues);
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
  console.log("commodityList in line33 in utilities.js: ", commodityList);
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

  console.log("groupedCommodities in dataUtility: ", groupedCommodities);
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

export const getTransByCommodityNameQuery = (
  transactions,
  commodityNameQuery
) => {
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
  console.log("filteredTrans in dataUtility: ", filteredTrans);
  return filteredTrans;
};

export const categorizeTransByDate = transactions => {
  const categorized = {};
  transactions.forEach(transaction => {
    const date = transaction.date;
    if (!categorized[date]) categorized[date] = [];
    categorized[date].push(transaction);
  });
  // const sortedCategorized = Object.fromEntries(
  //   Object.entries(categorized).sort(([a], [b]) => b.localeCompare(a))
  // );

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

  // return {
  //   "2023-05-23": [
  //     {
  //       "amount": -23,
  //       "balanceAfterTrans": 34,
  //       "commodityId": "W1XtQhP6BGd",
  //       "commodityName": "Resuscitation Equipment",
  //       "date": "2023-05-23",
  //       "dispensedBy": "John",
  //       "dispensedTo": "Jenny",
  //       "time": "14:20:00"
  //     }
  //   ],
  //   "2023-05-21": [
  // {
  //   "amount": 44,
  //   "balanceAfterTrans": 11,
  //   "commodityId": "o15CyZiTvxa",
  //   "commodityName": "Magnesium Sulfate",
  //   "date": "2023-05-21",
  //   "dispensedBy": "Some one",
  //   "dispensedTo": "Another one",
  //   "time": "13:22:00"
  // }
  //   ],
  //   "2023-08-13": [
  // {
  //   "amount": 32,
  //   "balanceAfterTrans": 12,
  //   "commodityId": "TCfIC3NDgQK",
  //   "commodityName": "Zinc",
  //   "date": "2023-08-13",
  //   "dispensedBy": "Who",
  //   "dispensedTo": "Whom",
  //   "time": "18:27:00"
  // }，
  //  {
  //    "clustered": true
  //    "commodityNames": "Zinc, Female Condom, Magnesium Sulfate";
  //    "date": "2023-08-13",
  //    "dispensedBy": "Who",
  //    "dispensedTo": "Whom",
  //    "details": []
  // }
  //   ]
  // };
};

export const getDateAndTime = dateTime => {
  const month = (dateTime.getMonth() + 1).toString();
  const day = dateTime.getDate().toString();
  const year = dateTime.getFullYear().toString();

  const date = `${month}/${day}/${year}`; // Format: "11/7/2023"
  const time = dateTime.toLocaleTimeString();
  return { date, time };
};
