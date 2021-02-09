import { configureStore } from '@reduxjs/toolkit';
import user from './reducer/user';
import input from './reducer/input';

export default configureStore({
    reducer: {
        user,
        input,
    },
});