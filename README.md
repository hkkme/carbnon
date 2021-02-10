# carbnon

### install
yarn install

### commands
yarn dev \
yarn build \
yarn lint \
yarn test

### .env
##### (carboninterface API KEY here)
```sh
REACT_APP_CARBON_EMISSION_API_URL=https://www.carboninterface.com/api/v1/estimates
REACT_APP_CARBON_EMISSION_API_KEY=XXXXXXXXXX
REACT_APP_ELECTRICITY_UNIT=mwh
REACT_APP_MOCK_INPUT=false
REACT_APP_MOCK_EMISSION_API=false
```

### todos
- finish Typescript (lint warnigs, tidy types.d.ts)
- handle API errors
- write tests
- review linter rules
- use babel-plugin-root-import
- graph fully responsive and resizable, media queries, etc.
- energy saving theme (dark) and off switch with CTA: "Save energy now!"
- regex for input vals: 4. > 4.0, 4.000 to 4.0
- round input vals to 5 digits
- missing weekdays not red when location is missing
- use html-react-parser for texts
- pdf download button for input-data and graph
- add button to show graph as histogram and not curved
- code splitting
- create user signup/login to save input-data and graph (e.g. on firebase)
- SEO