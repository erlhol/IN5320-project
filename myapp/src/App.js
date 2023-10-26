import React, { useState, useEffect } from 'react';
import { DataQuery, useDataQuery, useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import classes from './App.module.css'
import { stockRequest, stockUpdateRequest, transRequest, transUpdateRequest } from './requests';

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


    // 3. For Stock Update
//    const [updateStock] = useDataMutation(stockUpdateRequest);
//     useEffect(() => {
//       updateStock({
//           dataElement: "W1XtQhP6BGd",
//           categoryOptionCombo: "J2Qf1jtZuj8",  //endBalance
//           value: "321",
//       })
//     }, []) 


    //4. For Transaction Update
    // const [transData, setTransData] = useState([{
    //     date: "2023-05-23",
    //     time:"14:20:00",
    //     commodityId: "d352wSd",
    //     commodityName: "Female Kondom",
    //     dispensedBy: "John",
    //     dispensedTo: "Jenny",
    //     amount: -23,
    //     balanceAfterTrans: 34
    // },
    //     {
    //         date: "2023-05-21",
    //         time: "13:22:00",
    //         commodityId: "vdslkas",
    //         commodityName: "Chlorhexidine",
    //         dispensedBy: "Some one",
    //         dispensedTo: "Another one",
    //         amount: 44,
    //         balanceAfterTrans: 11
    //     },
    //     {
    //         date: "2023-08-13",
    //         time: "18:27:00",
    //         commodityId: "dkdisw",
    //         commodityName: "Antenatal Corticosteroids",
    //         dispensedBy: "Who",
    //         dispensedTo: "Whom",
    //         amount: 32,
    //         balanceAfterTrans: 12
    //     }]) 

    // const [updateTrans] = useDataMutation(transUpdateRequest);
    // useEffect(() => {
    //   updateTrans({ data: transData })
    // }, [])
    return (<Sidenav activePage={activePage} activePageHandler={activePageHandler}></Sidenav>)}

export default MyApp
