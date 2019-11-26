import React from 'react';
import {Text, View, StyleSheet, AsyncStorage, TouchableOpacity} from 'react-native';
import {Card} from 'react-native-elements';
import { ScrollView} from 'react-native-gesture-handler';
import ProgressChart from './ProgressChart';
import getMeals from './API/meals/getMeals';
import getMealFoods from './API/meals/foods/getMealFoods';
import getActivity from './API/activity/getActivity';
import sevenDayFilter from './sevenDayFilter';
import moment from 'moment';

export default class GoalProgress extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            meals: [],
            activities: [],
            days: [],
            dailyActivityGoal: 0.0,
            dailyCaloriesGoal: 0.0,
            dailyCarbohydratesGoal: 0.0,
            dailyFatGoal: 0.0,
            dailyProteinGoal: 0.0
        }
    }
    totalAmount(list, item) {
        let value = "";
        switch (item) {
            case "activity": value = "duration"; break;
            case "calories": value = "calories"; break;
            case "carbohydrates": value = "carbohydrates"; break;
            case "fat": value = "fat"; break;
            case "protein": value = "protein"; break;
            default: console.log(`item not recognized: ${item}`); break;
        }
        let total = 0.0;
        list.forEach(e => {
            total += e[value];
        });
        return Math.round(total);
    }
    async getFoodList(mealId) {
        try {
            let token = await AsyncStorage.getItem('@CurrentToken');
            let foods = await getMealFoods(token, mealId);
            if (foods !== null) {
                return foods.foods;
            }
        } catch(e) {
            console.log(e);
        }
    }
    async getAllFoods() {
        let foods = [];
        let _food = new Array();
        for (const meal of this.state.meals) {
            _food = await this.getFoodList(meal.id);
            _food.forEach((e) => {
                foods.push(e);
            });
        }
        this.setState({foods: foods});
    }
    async getMealList() {
        try {
            let token = await AsyncStorage.getItem('@CurrentToken');
            let mealList = await getMeals(token);
            if (mealList !== null) {
                mealList.meals = mealList.meals.filter(sevenDayFilter);
                this.setState({meals: mealList.meals.reverse()});
            }
        } catch (e) {
            console.log(e);
        }
    }
    async getActivityList() {
        try {
            let token = await AsyncStorage.getItem('@CurrentToken');
            let activityList = await getActivity(token);
            if (activityList !== null) {
                activityList.activities = activityList.activities.filter(sevenDayFilter);
                this.setState({activities: activityList.activities.reverse()});
            }
        } catch (e) {
            console.log(e);
        }
    }
    organizeData() {
        let days = [];
        for (let i=0; i < 7; i++) {
            let day = {"name": moment().subtract(i, 'days').format("ddd"), "date": moment().subtract(i, 'days'), "meals": [], "activities": []};
            days.push(day);
            day.meals = this.state.meals.filter(e => {
                return moment(e.date).isSame(day.date, 'day');
            });
            days.activities = this.state.activities.filter(e => {
                return moment(e.date).isSame(day.date, 'day');
            })
        }
        console.log(days);
    }
    componentDidMount() {
        this.getMealList();
        this.getActivityList();
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.getMealList();
            this.getActivityList();
        });
    }
    componentWillUnmount() {
        this.focusListener.remove();
    }
    render() {
        const data = [
            {
                value: 50,
                label: 'One',
            },
            {
                value: 10,
                label: 'Two',
            },
            {
                value: 40,
                label: 'Three',
            },
            {
                value: 95,
                label: 'Four',
            },
            {
                value: 85,
                label: 'Five',
            },
        ]
        this.organizeData();
        return(
            <ScrollView>
                <Card title="Calories">
                <ProgressChart data={data}/>
                </Card>
            </ScrollView>
        )
    }
}