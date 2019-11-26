import React from 'react';
import {Text, View, StyleSheet, AsyncStorage, TouchableOpacity} from 'react-native';
import {Card} from 'react-native-elements';
import { ScrollView} from 'react-native-gesture-handler';
import ProgressChart from './ProgressChart';
import getMeals from './API/meals/getMeals';
import getMealFoods from './API/meals/foods/getMealFoods';
import getActivity from './API/activity/getActivity';
import sevenDayFilter from './sevenDayFilter';
import getUserProfile from './API/user/getUserInfo';
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
        const _list = Array.from(list);
        switch (item) {
            case "activity": value = "duration"; break;
            case "calories": value = "calories"; break;
            case "carbohydrates": value = "carbohydrates"; break;
            case "fat": value = "fat"; break;
            case "protein": value = "protein"; break;
            default: console.log(`item not recognized: ${item}`); break;
        }
        let total = 0.0;
       _list.map(e => {
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
    async getAllFoods(meals) {
        let foods = [];
        let _food = new Array();
        for (const meal of meals) {
            _food = await this.getFoodList(meal.id);
            _food.forEach((e) => {
                foods.push(e);
            });
        }
        return foods;
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
    async organizeData() {
        let days = [];
        for (let i=0; i < 7; i++) {
            let day = {"name": moment().subtract(i, 'days').format("ddd"), "date": moment().subtract(i, 'days'), "meals": [], "activities": []};
            days.push(day);
            day.meals = this.state.meals.filter(e => {
                return moment(e.date).isSame(day.date, 'day');
            });

            day.foods = await this.getAllFoods(day.meals);
            day.totalCalories = this.totalAmount(day.foods, "calories");
            day.totalCarbohydrates = this.totalAmount(day.foods, "carbohydrates");
            day.totalProtein = this.totalAmount(day.foods, "protein");
            day.totalFat = this.totalAmount(day.foods, "fat");

            day.activities = this.state.activities.filter(e => {
                return moment(e.date).isSame(day.date, 'day');
            })
            day.totalActivity = this.totalAmount(day.activities, "activity")
        }
        this.setState({days: days});
    }
    async getDailyGoals() {
        let data;
        try {
            data = await AsyncStorage.multiGet(['@CurrentUsername', '@CurrentToken'])
            if (data !== null) {
                response = await getUserProfile(data[1][1], data[0][1]);
                if (response !== null) {
                    this.setState({dailyActivityGoal: response.goalDailyActivity|| 0.0});
                    this.setState({dailyCaloriesGoal : response.goalDailyCalories || 0.0});
                    this.setState({dailyCarbohydratesGoal: response.goalDailyCarbohydrates || 0.0});
                    this.setState({dailyFatGoal: response.goalDailyFat || 0.0});
                    this.setState({dailyProteinGoal: response.goalDailyProtein || 0.0});
                }
            }
        } catch(e) {
            console.log("Error occured getting user data");
        }
    }
   async setUpPage() {
        await this.getMealList();
        await this.getActivityList();
        await this.getDailyGoals();
        await this.organizeData();
    }
    componentDidMount() {
        this.setUpPage();
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.setUpPage();
        });
    }
    componentWillUnmount() {
        this.focusListener.remove();
    }
    render() {
        return(
            <ScrollView>
                <Card title="Calories">
                {/* <ProgressChart data={data}/> */}
                </Card>
            </ScrollView>
        )
    }
}