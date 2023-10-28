import { Button, CircularLoader } from '@dhis2/ui'
import React from "react";
import { useState, useEffect } from 'react'
import Search from '../utilities/Search';
import Dropdown from '../utilities/Dropdown';
import TransactionsForDay from '../components/stockHistory/TransactionsForDay'
import Stepper from '../utilities/Stepper'
import { DataQuery, useDataQuery, useDataMutation } from '@dhis2/app-runtime'
import { stockRequest, stockUpdateRequest, transRequest, transUpdateRequest } from '../requests';
import { getTransByName, getTransByPeriod, categorizeTransByDate } from '../utilities';

const Transactions = (props) => {

    const [currentModal, setCurrentModal] = useState('')
    const [selectedPeriod, setSelectedPeriod] = useState({ start: new Date("2023-05-21"), end: new Date("2023-05-23") })
    const [selectedCommodity, setSelectedCommodity] = useState(null)
    const [visibleTrans, setVisibleTrans] = useState(()=>categorizeTransByDate(props.transactionData) )

    useEffect(() => {
        const filteredByPeriod = getTransByPeriod(visibleTrans, selectedPeriod.start, selectedPeriod.end);
        const filteredByName = getTransByName(filteredByPeriod, selectedCommodity);
        // console.log("visibleTrans: ", visibleTrans);
        // console.log("filteredByPeriod: ", filteredByPeriod);
        // console.log("filteredByName: ", filteredByName);
        setVisibleTrans(filteredByName);
    }, [selectedPeriod, selectedCommodity]);


    const handleOnModalChange = (value) => {
        setCurrentModal(value)
      };

    return(<>
            {/* Navigation buttons to add stock or new dispensing */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ display: 'inline', margin: 0 }}>Transactions</h1>
                <div style={{ display: 'flex', gap: '10px'}}>
                    <Button name="Secondary button" onClick={() => handleOnModalChange('add_stock')} secondary value="add_stock" style={{ height: '100%'}}>
                    Add Stock
                    </Button>
                    <Button name="Primary button" onClick={() => handleOnModalChange('new_dispensing')} primary value="new_dispensing" style={{ height: '100%' }}>
                    New Dispensing
                    </Button>
                    
                </div>
            </div>
            <p></p>
            {/* The different search and filter options */}
            <div style={{display: 'flex', gap: '10px'}}>
            <Search placeholder='Search commodity' width={'320px'}></Search>
            <Dropdown placeholder='Period'></Dropdown>
            <Dropdown placeholder='All transactions'></Dropdown>
            <Dropdown placeholder='Recipient'></Dropdown>
            </div>

            {/* Multiple transactions can be listed here: */}
            {/* <TransactionsForDay date={transaction_by_day.date} transactions={transaction_by_day.transactions}></TransactionsForDay>
            <TransactionsForDay date={transaction_by_day.date} transactions={transaction_by_day.transactions}></TransactionsForDay> */}
            {Object.keys(visibleTrans).map(date => (
                <TransactionsForDay date={date} transactions={visibleTrans[date]}></TransactionsForDay>))}
        
            {currentModal === 'add_stock' && <Stepper title={'Add stock'} onClose={handleOnModalChange} ></Stepper>}
            {currentModal === 'new_dispensing' && <Stepper title={'New dispensing'} onClose={handleOnModalChange} ></Stepper>}
    </>)
    
 }

export default Transactions
