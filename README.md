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
- handle API errors
- preloader for graph
- finish Typescript
- code splitting
- create user loggin
- tests