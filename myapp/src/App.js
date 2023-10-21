import React, { useState, useEffect } from 'react';
import { DataQuery, useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import classes from './App.module.css'
import { stockRequest, transRequest } from './requests';
import { mergeCommodityAndValue } from './utilities';

const query = {
    me: {
        resource: 'me',
    },
}


const MyApp = () => {


    // 1. For Stock Page
    const { loading, error, data } = useDataQuery(stockRequest, {
        variables: {
            orgUnit: "ZpE2POxvl9P",
            period: "202305",
        }
    })

    const [commodityAndValueData, setCommodityAndValueData] = useState([])

    useEffect(() => {
        if ( data) 
           setCommodityAndValueData(mergeCommodityAndValue(data.dataValues?.dataValues, data.commodities?.dataSetElements))
    }, [data])


    // 2. For Transaction Page


    return (
    <div className={classes.container}>
        <DataQuery query={query}>
            {({ error, loading, data }) => {
                if (error) return <span>ERROR</span>
                if (loading) return <span>...</span>
                return (
                    <>
                        <h1>
                            {i18n.t('Hello {{name}}', { name: data.me.name })}
                        </h1>
                        <h3>{i18n.t('Welcome to DHIS2!')}</h3>
                    </>
                )
            }}
        </DataQuery>
    </div>
)}

export default MyApp
