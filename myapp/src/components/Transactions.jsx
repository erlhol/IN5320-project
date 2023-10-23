import { Button } from '@dhis2/ui'
import React from "react";
import Search from '../utilities/Search';
import Dropdown from '../utilities/Dropdown';
const Transactions = () => {
    return(<>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ display: 'inline', margin: 0 }}>Transactions</h1>
                <div style={{ display: 'flex', gap: '10px'}}>
                    <Button name="Secondary button" onClick={() => console.log("test")} secondary value="default" style={{ height: '100%'}}>
                    Add Stock
                    </Button>
                    <Button name="Primary button" onClick={() => console.log("test")} primary value="default" style={{ height: '100%' }}>
                    New Dispensing
                    </Button>
                    
                </div>
            </div>
            <p></p>
            <div style={{display: 'flex', gap: '10px'}}>
            <Search placeholder='Search commodity' width={'320px'}></Search>
            <Dropdown placeholder='Period'></Dropdown>
            <Dropdown placeholder='All transactions'></Dropdown>
            <Dropdown placeholder='Recipient'></Dropdown>
            </div>
            
        </>)
 }

export default Transactions