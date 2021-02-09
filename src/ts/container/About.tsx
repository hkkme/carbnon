import React  from 'react';

// store
import { useDispatch } from 'react-redux';
import { setIsAbout } from '../store/reducer/user';

// material ui
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import theme from '../utils/theme';

// json
import texts from '../../json/texts';

const About = (): JSX.Element => {

    const dispatch = useDispatch();

    return (
        <div className="about">
            <div className={texts['ABOUTH'].type}>{ texts['ABOUTH'].text }</div>
            <div className={texts['ABOUTX'].type}>{ texts['ABOUTX'].text }</div>
            <MuiThemeProvider theme={theme}>
                <Button
                    color="primary"
                    onClick={() => dispatch(setIsAbout(false))}
                    variant="contained"
                >{ texts['ABOUTB'].text }</Button>
            </MuiThemeProvider>
        </div>
    );
};

export default About;