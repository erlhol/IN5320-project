import { Menu, MenuItem, IconHome16, IconLayoutRows16, IconReorder16 } from '@dhis2/ui'
import React from "react";

import Dashboard from './Dashboard';
import Inventory from './Inventory';
import Transactions from './Transactions';
const Sidenav = (props) => {
    return(
        <main
            style={{
                border: '1px solid grey',
                display: 'flex',
                height: '100%'
            }}
        >
            <aside
                style={{
                    flexGrow: 0,
                    height: '100%',
                    width: 200,
                    backgroundColor: 'rgb(33,41,52)'
                    
                }}
            >
                <Menu>
                    <MenuItem
                        style={{fontSize: '5px'}}
                        icon={<IconHome16></IconHome16>}
                        label="Dashboard"
                        active={props.activePage === "Dashboard"}
                        onClick={() => props.activePageHandler("Dashboard")}
                    />
                    <MenuItem
                        label="Inventory"
                        icon={<IconLayoutRows16></IconLayoutRows16>}
                        active={props.activePage === "Inventory"}
                        onClick={() => props.activePageHandler("Inventory")}
                    />
                    <MenuItem
                        label="Transactions"
                        icon={<IconReorder16></IconReorder16>} // could not find the correct icon
                        active={props.activePage === "Transactions"}
                        onClick={() => props.activePageHandler("Transactions")}
                    />
                </Menu>
            </aside>
            <section
                style={{
                    borderLeft: '1px solid grey',
                    flexGrow: 1,
                    padding: 20
                }}
            >
                {props.activePage === "Dashboard" && <Dashboard />}
                {props.activePage === "Inventory" && <Inventory />}
                {props.activePage === "Transactions" && <Transactions />}
            </section>
        </main>)
 }

export default Sidenav