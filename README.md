# About the application

- Group number 21

App developed for the DHIS2 platform using the DHIS2 Demo Instance

## Run the app

To run the app, you will need to run

```
cd myapp && yarn install
```

And then run

```
yarn start
```

## Functionality

The app aid store managers in Whotopia to manage stocks.
It supports the following:

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

### utilities

- `dataUtility.js`
- `dates.js`
- `requests.js`
- `search.js` - functions for the searching logic in the app

## Contributors

- yingqiaz
- henryco
- finjamas
- erlinhol
