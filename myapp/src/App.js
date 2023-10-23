import React, { useState, useEffect } from 'react';
import { DataQuery, useDataQuery, useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import classes from './App.module.css'
import { stockRequest, stockUpdateRequest, transRequest, transUpdateRequest } from './requests';
import { mergeCommodityAndValue } from './utilities';
import Sidenav from './components/Sidenav';

const query = {
    me: {
        resource: 'me',
    },
}

const MyApp = () => {

    /* State for handling navigation */
    const [activePage, setActivePage] = useState("Dashboard");

    function activePageHandler(page) {
        setActivePage(page);
    }

    // 1. For Stock Display
    const [stockData, setStockData] = useState([])
    const { loading, error, data } = useDataQuery(stockRequest, { variables: {period: "202305"}})
    useEffect(() => {
        if ( data) 
            setStockData(mergeCommodityAndValue(data.dataValues?.dataValues, data.commodities?.dataSetElements))
    }, [data])

    // 2. For Stock Update
    const [updateStock] = useDataMutation(stockUpdateRequest);
    useEffect(() => {
      updateStock({
          dataElement: "W1XtQhP6BGd",
          categoryOptionCombo: "J2Qf1jtZuj8",  //endBalance
          value: "321",
      })
    }, [])
    
    // 3. For Transaction Display
    // QUESTION:  transaction plus&minus?
    //const { loadingT, errorT, transactionData } = useDataQuery(transRequest)
    const [transData, setTransData] = useState([{
        date: "2023-05-23",
        time:"14:20:00",
        commodityId: "d352wSd",
        commodityName: "Female Kondom",
        dispensedBy: "John",
        dispensedTo: "Jenny",
        amount: -23,
        balanceAfterTrans: 34
    }])

    // useEffect(() => {
    //     if (dataT) console.log("dataT",dataT);
    // }, [dataT])


    //4. For Transaction Update
    // const [updateTrans] = useDataMutation(transUpdateRequest);
    // useEffect(() => {
    //   updateTrans({ data: transData })
    // }, [])
    return (<Sidenav activePage={activePage} activePageHandler={activePageHandler}></Sidenav>)}

export default MyApp