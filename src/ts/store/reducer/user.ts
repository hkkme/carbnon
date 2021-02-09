import { createSlice } from '@reduxjs/toolkit';

export const user = createSlice({
    name: 'user',
    initialState: {
        isSignUp: false,
        isAbout: true,
        userName: null,
        loggedIn: false,
    },
    reducers: {
        setIsSignUp: (state, action) => {
            state.isSignUp = action.payload;
        },
        setIsAbout: (state, action) => {
            state.isAbout = action.payload;
            state.userName = action.payload ? action.payload.userName : null;
        },
        setLoggedIn: (state, action) => {
            state.loggedIn = action.payload;
        },
    },
});

export const {
    setIsSignUp,
    setIsAbout,
    setLoggedIn,
} = user.actions;

export default user.reducer;