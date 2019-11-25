import React from 'react';
import {Animated,Text, View, StyleSheet, AsyncStorage, TouchableOpacity} from 'react-native';
import { ScrollView} from 'react-native-gesture-handler';
import ProgressChart from './ProgressChart';

export default class GoalProgress extends React.Component {
    render() {
        return(
            <ScrollView>
                <ProgressChart data={[50,40,90,-1,9,-50,3]}/>
            </ScrollView>
        )
    }
}