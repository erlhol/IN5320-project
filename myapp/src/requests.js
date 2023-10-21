export const stockRequest = {
    // Read all commodities in live saving commodities dataset
    // https://data.research.dhis2.org/in5320/api/dataSets/ULowA8V3ucd.json?fields=name,id,dataSetElements[dataElement[name,id,categoryCombo[name,id,[name,id]]]categoryOptionCombos
    commodities: {
        resource: "/dataSets/ULowA8V3ucd",
        params: {
            fields: "name,id,dataSetElements[dataElement[name,id,created,categoryCombo[name,id]]]",
        }
    },
        
    // Read values of a period for all commodities in live saving commodities dataset
    // https://data.research.dhis2.org/in5320/api/dataValueSets.json?dataSet=ULowA8V3ucd&period=202310&orgUnit=ZpE2POxvl9P
    dataValues: {
        resource: "/dataValueSets",
        params: ({  period }) => ({
            period,
            orgUnit: "ZpE2POxvl9P",
            dataSet: "ULowA8V3ucd"
        })
    }
}

export const stockUpdateRequest = {
    resource: "dataValueSets",
    dataSet: "ULowA8V3ucd",
    type: "create",
    data: ({ dataElement, value, categoryOptionCombo }) => ({
        orgUnit: "ZpE2POxvl9P",
        period: "202310",
        dataValues: [
            {
                dataElement,
                categoryOptionCombo,
                value,
            }
        ]
    })
}


export const transRequest = {
    transactionHistory: {
        resource: "/dataStore/IN5320-G21/transactions"
    },
}

export const transUpdateRequest = {
    resource: "dataStore/IN5320-G21/transactions",
    type: "update",
    data: (transactions) => transactions
}


// export function fetchHospitalData() {
//     return {
//         dataValueSets: {
//             resource: "/dataValueSets",
//             params: ({ orgUnit, period }) => ({
//                 orgUnit: orgUnit,
//                 period: period,
//                 dataSet: "ULowA8V3ucd"
//             })
//         },

//         dataSets: {
//             resource: "/dataSets",
//             params: {
//                 dataSetId: "ULowA8V3ucd",
//                 fields: "name,id,dataSetElements[dataElement[name,id,created,categoryCombo[name,id]]]",
//                 filter: "name:eq:Life-Saving Commodities"
//             }
//         },
//         restockHistory: {
//             resource: "/dataStore/IN5320-G19/restockHistory"
//         },
//         dispensingHistory: {
//             resource:"/dataStore/IN5320-G19/transactions"            
//         }  
//      }
// }


// // The data query to find the health facilities nearby 
// export function fetchNeighbors() {
//     return {
//         orgUnits: {
//             resource: "/organisationUnits/aWQTfvgPA5v",
//             params: {
//               fields: "children[displayName,id]"
//             }
//           }
//     }
// }

// // The data query to deposit a transaction
// export function deposit() {
//     return {
//         resource:"dataValueSets",
//         dataSet: "ULowA8V3ucd",
//         type: "create",
//         data: ({dataElement, value, categoryOptionCombo}) => ( {
//             orgUnit: "MnfykVk3zin",
//             period: "202110",
//             dataValues: [
//                 {
//                 dataElement: dataElement,
//                 categoryOptionCombo: categoryOptionCombo,
//                 value: value,
//                 },
//             ],
//         }),
//     }
//  }

// // The data query to update the transaction log stored in dataStore
//  export function storeDeposit() {
//     return {
        
//         resource:"dataStore/IN5320-G19/transactions",
//         type: "update",
//         data: (transactions) => transactions
//     }
 
// }

// // The data query to update the restock history stored in dataStore
//  export function storeRestock() {
//     return {
//         resource:"dataStore/IN5320-G19/restockHistory",
//         type: "update",
//         data: (transactions) => transactions
//     }
//  }
