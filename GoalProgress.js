import React from 'react';
import {Animated,Text, View, StyleSheet, AsyncStorage, TouchableOpacity} from 'react-native';
import {Card} from 'react-native-elements';
import { ScrollView} from 'react-native-gesture-handler';
import ProgressChart from './ProgressChart';

export default class GoalProgress extends React.Component {
    render() {
        const data = [
            {
                value: 50,
                label: 'Mon',
            },
            {
                value: 10,
                label: 'Tue',
            },
            {
                value: 40,
                label: 'Wed',
            },
            {
                value: 95,
                label: 'Thu',
            },
            {
                value: 85,
                label: 'Fri',
            },
            {
                value: 85,
                label: 'Fri',
            },
            {
                value: 85,
                label: 'Fri',
            },
        ]
        return(
            <ScrollView>
                <Card>
                <ProgressChart data={data}/>
                </Card>
            </ScrollView>
        )
    }
}