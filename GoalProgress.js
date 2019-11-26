import React from 'react';
import {Text, View, StyleSheet, AsyncStorage, TouchableOpacity} from 'react-native';
import {Card} from 'react-native-elements';
import { ScrollView} from 'react-native-gesture-handler';
import ProgressChart from './ProgressChart';

export default class GoalProgress extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            meals: [],
            activities: [],
            dailyActivityGoal: 0.0,
            dailyCaloriesGoal: 0.0,
            dailyCarbohydratesGoal: 0.0,
            dailyFatGoal: 0.0,
            dailyProteinGoal: 0.0
        }
    }
    async getMealList() {
        try {
            let token = await AsyncStorage.getItem('@CurrentToken');
            let mealList = await getMeals(token);
            if (mealList !== null) {
                mealList.meals = mealList.meals.filter(dataFilter);
                this.setState({meals: mealList.meals.reverse()});
            }
        } catch (e) {
            console.log(e);
        }
    }
    async getActivityList() {
        try {
            let token = await AsyncStorage.getItem('@CurrentToken');
            let activityList = await this.getActivity(token);
            if (activityList !== null) {
                activityList.activities = activityList.activities.filter(dataFilter);
                this.setState({activities: activityList.activities.reverse()});
            }
        } catch (e) {
            console.log(e);
        }
    }
    componentDidMount() {
        this.getMealList()
        this.getActivityList()
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
        });
    }
    componentWillUnmount() {
        this.focusListener.remove();
    }
    render() {
        return(
            <ScrollView>
                <Card title="Calories">
                <ProgressChart data={data}/>
                </Card>
            </ScrollView>
        )
    }
}