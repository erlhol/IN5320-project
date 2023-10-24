import { Button } from '@dhis2/ui'
import React from "react";
import { useState } from 'react'
import Search from '../utilities/Search';
import Dropdown from '../utilities/Dropdown';
import TransactionsForDay from './TransactionsForDay'
import Stepper from '../utilities/Stepper'
const Transactions = () => {

    const [currentModal,setCurrentModal] = useState('')

    const handleOnModalChange = (value) => {
        setCurrentModal(value)
      };


    /* TODO: replace with actual transaction data */
    const transaction_by_day = {date: 'October 13, 2023', 
                                transactions: 
                                [{commodity_name: 'Zink', time: '8:30pm', sender: 'George Slater', reciever: 'Ralph Hans', amount: '-163', new_stock: '243' },
                                {commodity_name: 'Ibuprofen', time: '9:30pm', sender: 'George Slater', reciever: 'Ralph Hans', amount: '-50', new_stock: '200' }
                            ]}

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
            <TransactionsForDay date={transaction_by_day.date} transactions={transaction_by_day.transactions}></TransactionsForDay>
            <TransactionsForDay date={transaction_by_day.date} transactions={transaction_by_day.transactions}></TransactionsForDay>

            {currentModal === 'add_stock' && <Stepper title={'Add stock'} onClose={handleOnModalChange} ></Stepper>}
            {currentModal === 'new_dispensing' && <Stepper title={'New dispensing'} onClose={handleOnModalChange} ></Stepper>}
        </>)
 }

export default Transactions