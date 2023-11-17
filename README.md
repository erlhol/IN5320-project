# About the application

- Group number 21

App developed for the DHIS2 platform using the DHIS2 Demo Instance. For UI we follow DHIS2's design system: https://ui.dhis2.nu

## Run the app

To run the app for the first time you will run this command to install all packages requried. We use yarn for package management.

```
cd myapp && yarn install
```

And then run this command to start the application

```
yarn start
```

## Functionality

The app aid store managers in Whotopia to manage stocks.
It supports the following requirements:

- Store managers can register when a commodity is dispensed (fundamental requirement)
- The store manager can update the stock balance when he recieves a replenishment (additional requirement 1)
- The store manager is offered statistics on a dashboard so he can provide the Ministry of Health with statistics (additional requirement 8)
- Multiple commodities can be dispensed at the same time in a bulk operation (additional requirment 9)

## Structure

The code is modular and properly structured into different directories.

`App.js` is the entrypoint for the app. Here we use a Router to have persistent navigation (so the user will be on the same page if the page is refreshed)

### pages

We have divided the functionality into three different components (corresponding to three pages) located in the `pages` directory.
These are:

- `Dashboard.jsx`
- `StockHistory.jsx`
- `StockOverview.jsx`

### components

Conatins further subdirectories with the components corresponding to `pages` and the `common` directory that includes components that are used by several pages.

### utilities

- `dataUtility.js` - defines aggregation and logic on the raw data retrieved from `requests.js`
- `dates.js` - defines helper functions to handle dates
- `requests.js` - defines common requests to the DHIS2 API
- `search.js` - functions for the searching logic in the app

### Additional packages

In addition to the DHIS2 UI package, we use a couple of additional packages.

- `Apexcharts`: We use apexcharts to provide the statistics, as DHIS2 didnt have a package for this.
- `React day picker`: We use this to be able to set a date range, as this was not possible in DHIS2

## Contributors

- yingqiaz
- henryco
- finjamas
- erlinhol
