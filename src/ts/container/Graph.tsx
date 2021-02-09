import React, { useState, useEffect, useRef } from 'react';

// utils
import _ from 'lodash';

// store
import { useDispatch, useSelector } from 'react-redux';
import { setMakeCalc, updateConsumptionWeekStore } from '../store/reducer/input';

// helper
import ApiService from '../utils/apiService';

// Json
import regionsJson from '../../json/regions';
// import weekJson from '../../json/week';
import mockConsumptionWeek from '../../json/mocks/mock.consumptionWeekGraph';

// graph
import * as d3 from 'd3';

const Graph = (): JSX.Element => {

    // dispatch

    const dispatch = useDispatch();

    // get carb data from carbon interface

    const makeCalc = useSelector((state: IInput) => state.input.makeCalc);
    // avoid re-render on consumptionWeek change
    const consumptionWeek = useSelector((state: any) => (makeCalc && state.input.consumptionWeek));
    // console.log('render graph');

    useEffect(() => {

        if (!makeCalc) {
            return;
        }

        setMakeCalc(false);

        let cloneConsumptionWeek: IConsumptionWeek = _.cloneDeep(consumptionWeek);

        if (process.env.REACT_APP_MOCK_EMISSION_API === 'true') {

            // ########## MOCK ##########
            // remove later

            cloneConsumptionWeek = mockConsumptionWeek;

            dispatch(updateConsumptionWeekStore(cloneConsumptionWeek));
            setGCarbReady(true);

            // ########## END MOCK ##########

        } else {

            const apiKey = process.env.REACT_APP_CARBON_EMISSION_API_KEY;
            const url = process.env.REACT_APP_CARBON_EMISSION_API_URL;
    
            const headers = {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            };

            let count = Object.keys(consumptionWeek.days).length;

            Object.keys(consumptionWeek.days).map((day: string) => {

                const type = 'electricity';
                const country = consumptionWeek.country.toLocaleLowerCase();
                const state = consumptionWeek.region.toLocaleLowerCase();
                const electricityUnit = process.env.REACT_APP_ELECTRICITY_UNIT;
                const electrictyValue = consumptionWeek.days[day].eVal;
        
                const data = {
                    type,
                    electricity_unit: electricityUnit,
                    electricity_value: electrictyValue,
                    country,
                    state,
                };

                ApiService.requestPOST(url, data, headers)
                    .then((res: IresRequestPOST): void => {

                        if (!res) {
                            // handle error
                        }

                        cloneConsumptionWeek.days[day]['gCarb'] = res.data.data.attributes.carbon_g;

                        if (count === 1) {
                            dispatch(updateConsumptionWeekStore(cloneConsumptionWeek));
                            setGCarbReady(true);
                        }
                        count--;

                    })
                    .catch((err: IresRequestPOST) => {
                        // handel err
                        console.log(err);
                    });

            });

        }

    }, [makeCalc]);

    const ref = useRef<SVGSVGElement>(null);

    // draw graph

    const [gCarbReady, setGCarbReady] = useState(false);

    useEffect(() => {

        if (!gCarbReady) {
            return;
        }

        setGCarbReady(false);

        // graph data

        let carbonData: { day: number, value: number }[] = [];
        let total = 0;

        Object.keys(consumptionWeek.days).map((day, i) => {

            carbonData = [...carbonData, {
                day: i+1,
                value: Number(consumptionWeek.days[day].gCarb),
            }];

            total = total + Number(consumptionWeek.days[day].gCarb);
        });

        const average = Math.round(total/7);

        const maxVal = carbonData.reduce((prev, current) => {
            return (prev.value > current.value) ? prev : current;
        }).value;

        const width = 800;
        const height = 400;

        // TBD: get from json
        const week = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
        // console.log(weekJson);

        // svg

        const svg = d3.select(ref.current);

        d3.select(ref.current).selectAll('*')
            .remove();

        svg
            .attr('width', width)
            .attr('height', height)
            .style('background-color', 'white')
            .append('g');

        function drawGraph(carbonData: any) {

            // x axis
            const x = d3.scaleLinear()
                .domain([1, 7])
                .range([70, width-70]);

            svg.append('g')
                .attr('transform', `translate(0,${350})`)
                .call(d3.axisBottom(x)
                    .ticks(7)
                    .tickFormat((d: any) => { return `${week[d-1]}`; })
                );
                
            // label top
            svg.append('text')
                .attr('text-anchor', 'middle')
                .attr('class', 'graph-text')
                .attr('x', width/2)
                .attr('y', 16)
                .text(`Carbon emission in grams, ${regionsJson[consumptionWeek.country][consumptionWeek.region]}/${consumptionWeek.country}, 
                average/day: ${average}, total/week: ${total} `);

            // label bottom
            svg.append('text')
                .attr('text-anchor', 'middle')
                .attr('class', 'graph-text')
                .attr('x', width/2)
                .attr('y', height - 9)
                .text(() => (carbonData.map((d: { [ key: string]: number }) => (` ${week[d.day-1]}: ${d.value}`))));

            // y axis
            const y = d3.scaleLinear()
                .domain( [0, maxVal])
                .range([ height-50, 50 ]);

            svg.append('g')
                .call(d3.axisLeft(y).ticks(9))
                .attr('transform','translate(70,0)');
            
            // line
            svg.append('path')
                .datum(carbonData)
                .attr('fill', 'none')
                .attr('stroke', '#096e50')
                .attr('stroke-width', 2.5)
                .attr('d', d3.line<{day: number, value: number}>()
                    .curve(d3.curveCardinal) // make it curvy
                    .x(d => { return x(d.day); })
                    .y(d => { return y(d.value); })
                );
        }
            
        drawGraph(carbonData);

    }, [gCarbReady]);

    return (
        <div className='graph'>
            <svg
                ref={ref}
            />
        </div>
    );

};

export default Graph;