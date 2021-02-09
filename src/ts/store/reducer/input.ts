import { createSlice } from '@reduxjs/toolkit';
import mockConsumptionWeek from '../../../json/mocks/mock.consumptionWeekInput';

let initialState = {
    showGraph: false,
    makeCalc: false,
    consumptionWeek: {
        country: '',
        region: '',
        days: {},
    },
};

// ########## MOCK ##########
// remove later

if (process.env.REACT_APP_MOCK_INPUT === 'true') {
    initialState = mockConsumptionWeek;
}

// ########## END MOCK ##########

export const input = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setShowGraph: (state, action) => {
            state.showGraph = action.payload;
        },
        setMakeCalc: (state, action) => {
            state.makeCalc = action.payload;
        },
        updateConsumptionWeekStore: (state, action) => {
            state.consumptionWeek = action.payload;
        },
    },
});

export const {
    setShowGraph,
    setMakeCalc,
    updateConsumptionWeekStore,
} = input.actions;

export default input.reducer;