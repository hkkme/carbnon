import React, { useState, useRef } from 'react';
// import * as PropTypes from 'prop-types'

// utils
import _ from 'lodash';

// router

import { Link } from 'react-router-dom';

// store
import { useDispatch, useSelector } from 'react-redux';
import { setIsAbout } from '../store/reducer/user';
import { setShowGraph, setMakeCalc, updateConsumptionWeekStore } from '../store/reducer/input';

// material ui
import {
    Breadcrumbs,
    Button,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Typography,
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from '../utils/theme';

// helper
import validator from '../utils/validator';

// json
import weekJson from '../../json/week';
import regionsJson from '../../json/regions';
import countriesJson from '../../json/countries';
import notifications from '../../json/notifications';
import texts from '../../json/texts';

const Input = (): JSX.Element => {

    // config

    const eUnit = process.env.REACT_APP_ELECTRICITY_UNIT || 'mwh';

    // dispatch

    const dispatch = useDispatch();

    // consumption week

    const consumptionWeekFromStore = useSelector((state: IInput) => state.input.consumptionWeek);
    const [consumptionWeek, updateConsumptionWeek] = useState<IConsumptionWeek>(consumptionWeekFromStore);

    const [day, setDay] = useState('mon');
    const [notification, makeNotification] = useState<{ text: string, type: string }>({
        text: '',
        type: '',
    });

    const consumptionInput = useRef<any>(null);

    const newInput = (e: any): void => {

        dispatch(setMakeCalc(false));

        // reset notification
        makeNotification({
            text: '',
            type: '',
        });

        const inputId = e.currentTarget.getAttribute('input-id') || e.target.id; // review this
        let newConsumptionWeek = { ...consumptionWeek };

        if (inputId === 'country' || inputId === 'region') {
            newConsumptionWeek = { ...consumptionWeek, ...{ [inputId]: e.target.value } };

            if (inputId === 'country') {
                newConsumptionWeek.region = '';
                updateRegionData(e.target.value);
            }

            setCalcClicked(false);

        } else if (inputId === 'day') {

            setDay(e.target.name);
            consumptionInput.current.focus();

        } else if (inputId === 'consumption') {

            const consumptionVal = e.target.value.replace(/,/g, '.');
            
            if (consumptionVal === '') {

                // removes day object from days if day is ''
                const newDays = { ...newConsumptionWeek.days };
                delete newDays[day];

                newConsumptionWeek = {
                    ...consumptionWeek,
                    ...{ days: newDays },
                };

            } else if (validator.isPositiveDecimal(consumptionVal)) {

                newConsumptionWeek = _.cloneDeep(consumptionWeek);

                newConsumptionWeek.days[day] = {
                    eUnit,
                    eVal: consumptionVal,
                    gCarb: '',
                };

            } else {
                makeNotification(notifications['POSDEC']); // if not a positve decimal
            }

        }

        updateConsumptionWeek(newConsumptionWeek); // could be without local state, but is faster
        dispatch(updateConsumptionWeekStore(newConsumptionWeek));

    };

    // region data

    const [regionData, setRegionData] = useState<IregionData>({
        label: 'Region',
        disabled: true,
        regions: {},
    });

    const updateRegionData = (country: string) => {

        const rLabels: IrLabels = {
            CA: 'Provinces',
            US: 'States',
        };

        setRegionData({
            label: rLabels[country],
            disabled: false,
            regions: regionsJson[country],
        });

    };

    // if location data comes from store, set label for region

    if (regionData.label === 'Region' && consumptionWeek.country !== '' && consumptionWeek.region !== '') {
        updateRegionData(consumptionWeek.country);
    }

    // click calc

    const [calcClicked, setCalcClicked] = useState(false);

    const clickCalc = () => {

        setCalcClicked(true);

        const consumptionWeekReady = Object.keys(consumptionWeek.days).length === 7 ? true : false;

        if (consumptionWeek.country === '' || consumptionWeek.region === '') {
            makeNotification(notifications['LOCATN']); // location
        } else if (consumptionWeekReady){
            
            makeNotification(notifications['WEEKOK']); // week is ok

            dispatch(setShowGraph(true));
            dispatch(setMakeCalc(true));

        } else {
            makeNotification(notifications['ALLDAY']); // if not all days set
        }

    };

    return (
        <div className='input'>
            <MuiThemeProvider theme={theme}>
                <Grid container spacing={3}>
                    <Grid item xs={12} className='input-top'>
                        <Breadcrumbs aria-label='breadcrumb' separator={<NavigateNextIcon fontSize='small' />}>
                            <Link
                                onClick={() => { dispatch(setShowGraph(false)); dispatch(setIsAbout(true)); }}
                                to='/'
                                className='breadcrumb-link'
                            >
                                About
                            </Link>
                            <div className='breadcrumb-div'>MWh</div>
                            {
                                useSelector((state: IInput) => state.input.showGraph) ? <div className='breadcrumb'>CO<sub>2</sub></div> : null
                            }
                        </Breadcrumbs>
                    </Grid>
                    <Grid item xs={12} className='input-top'>
                        {texts['ENTMWH'].text}
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container justify='flex-start' spacing={3}>
                            <Grid item>
                                <FormControl variant='outlined' error={calcClicked && consumptionWeek.country === ''}>
                                    <InputLabel id='input-country-label'>Country</InputLabel>
                                    <Select
                                        id='input-country'
                                        label='Country'
                                        labelId='input-country'
                                        onChange={newInput}
                                        style={{ width: '250px'}}
                                        value={consumptionWeek.country}
                                    >
                                        {Object.keys(countriesJson).map((c: string, i: number) => (
                                            <MenuItem
                                                input-id='country'
                                                key={i}
                                                value={c}
                                            >
                                                {countriesJson[c]}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <FormControl
                                    variant='outlined'
                                    disabled={regionData.disabled}
                                    error={calcClicked && !regionData.disabled && consumptionWeek.region === ''}
                                >
                                    <InputLabel id='demo-simple-select-outlined-label'>{regionData.label}</InputLabel>
                                    <Select
                                        id='demo-simple-select-outlined'
                                        label={regionData.label}
                                        labelId='demo-simple-select-outlined-label'
                                        onChange={newInput}
                                        style={{ width: '250px'}}
                                        value={consumptionWeek.region}
                                    >
                                        {Object.keys(regionData.regions).map((r: string, i: number) => (
                                            <MenuItem
                                                input-id='region'
                                                key={i}
                                                value={r}
                                            >
                                                {regionData.regions[r]}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container justify='flex-start' spacing={0}>
                            <RadioGroup
                                row
                                aria-label='week'
                                name='week'
                                value={day}
                                onChange={newInput}
                            >
                                {Object.keys(weekJson).map((day: string,i: number) => {

                                    const dayShort = weekJson[day].substring(0, 3);
                                    const color = consumptionWeek.days[day] === undefined && calcClicked ? 'secondary' : 'primary';

                                    return <FormControlLabel
                                        control={<Radio
                                            color='primary'
                                            id='day'
                                            name={day}
                                        />}
                                        color='primary'
                                        key={i}
                                        label={<Typography color={color}>{dayShort}</Typography>}
                                        labelPlacement='bottom'
                                        value={day}
                                    />;
                          
                                })}
                            </RadioGroup>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container justify='flex-start' spacing={3}>
                            <Grid item>
                                <TextField
                                    id='consumption'
                                    inputRef={consumptionInput}
                                    label='MWh'
                                    onChange={newInput}
                                    style={{ width: '250px'}}
                                    value={consumptionWeek.days[day] && consumptionWeek.days[day].eVal || ''}
                                    variant='outlined'
                                />
                            </Grid>
                            <Grid item>
                                <div className={`notification ${notification.type}`}>{notification.text}</div>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container justify='flex-start' spacing={3}>
                            <Grid item>
                                <Button
                                    color='primary'
                                    onClick={clickCalc}
                                    variant='contained'
                                >
                                    {texts['CALCBT'].text}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </MuiThemeProvider>
        </div>
    );
};

export default Input;