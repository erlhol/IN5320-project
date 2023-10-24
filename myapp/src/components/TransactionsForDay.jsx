import { Menu, IconArrowRight24, IconMore24  } from '@dhis2/ui'
import React from "react";
const TransactionsForDay = (props) => {
    /* Displays the transactions for a chosen day.
    The data is passed in through props */
    return(<>
            <h2>{props.date}</h2>
            {props.transactions.map((transaction, i) =>
                <Menu key={i}>
                    {/* TODO: fix the space-between to be equal - not taking text lenght into account */}
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p>{transaction.commodity_name}</p>
                        <p>{transaction.time}</p>
                        <p>{transaction.sender}</p>
                        <IconArrowRight24></IconArrowRight24>
                        <p>{transaction.recipient}</p>
                        <div>
                            <p>{transaction.amount}</p>
                            <p>Updated stock: {transaction.new_stock}</p>
                        </div>
                        <IconMore24></IconMore24>
                    </div>     
                </Menu>
            )}
        </>)
 }

export default TransactionsForDay