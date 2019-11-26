import React from 'react'
import { View } from 'react-native'
import {Text} from 'react-native-svg';
import { BarChart, Grid, YAxis } from 'react-native-svg-charts'
import * as scale from 'd3-scale'

export default class ProgressChart extends React.Component {
    render() {
        const data = this.props.data;
        const CUT_OFF = 50
        const Labels = ({  x, y, bandwidth, data }) => (
            data.map((value, index) => (
                <Text
                    key={ index }
                    x={ value.value > CUT_OFF ? x(0) + 10 : x(value.value) + 10 }
                    y={ y(index) + (bandwidth / 2) }
                    fontSize={ 11 }
                    fill={ value.value > CUT_OFF ? 'white' : 'black' }
                    alignmentBaseline={ 'middle' }
                >
                    {value.value}
                </Text>
            ))
        )
        return (
            <View style={{ flexDirection: 'row', height: 200, paddingVertical: 16 }}>
                <YAxis
                    data={data}
                    style={{flex: 0.1}}
                    yAccessor={({ index }) => index}
                    scale={scale.scaleBand}
                    contentInset={{top: 10, bottom: 10 }}
                    spacing={0.2}
                    formatLabel={(_, index) => data[ index ].label}
                />
                <BarChart
                    style={{ flex: 1, marginLeft: 8 }}
                    data={data}
                    horizontal={true}
                    yAccessor={({ item }) => item.value}
                    svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
                    contentInset={{ top: 10, bottom: 10 }}
                    spacing={0.2}
                    gridMin={0}
                >
                    <Grid direction={Grid.Direction.VERTICAL}/>
                    <Labels/>
                </BarChart>
            </View>
        )
    }
}