export const mergeCommodityAndValue = (dataValues, dataSetElements) => {
  const commodityData = {};
  // console.log("dataValues", dataValues);
  // console.log("dataSetElements", dataSetElements);

  // Process dataValues and accumulate values based on categoryOptionCombo
  dataValues?.forEach(dataValue => {
    const dataSetElement = dataSetElements?.find(element => element.dataElement?.id === dataValue.dataElement);
    if (dataSetElement) {
      const commodityName = dataSetElement.dataElement.name.slice(14);
      const categoryOptionCombo = dataValue.categoryOptionCombo;
      const value = parseInt(dataValue.value, 10);

      if (!commodityData[commodityName]) {
        commodityData[commodityName] = {
          commodityName,
          endBalance: 0,
          consumption: 0,
          period: 0
        };
      }

      if (categoryOptionCombo === "J2Qf1jtZuj8") {
        commodityData[commodityName].endBalance += value;
      } else if (categoryOptionCombo === "rQLFnNXXIL0") {
        commodityData[commodityName].consumption += value;
      }
      commodityData[commodityName].period = dataValue.period
    }
  });

  const commodityList = Object.values(commodityData);
  console.log("commodityList in line33 in utilities.js: " ,commodityList);
  return commodityList
}
