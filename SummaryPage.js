import React from 'react';
import {View, Text, StyleSheet, AsyncStorage} from 'react-native';
import {Card, ListItem} from 'react-native-elements';
import GoalProgressBar from './GoalProgressBar';
import { ScrollView } from 'react-native-gesture-handler';
import getActivity from './API/activity/getActivity';
import getMeals from './API/meals/getMeals';
import moment from "moment";
import _ from 'lodash';
import getUserProfile from './API/user/getUserInfo';
import getMealFoods from './API/meals/foods/getMealFoods';
import dataFilter from './dayFilter';
import round from './round';

class SummaryPage extends React.Component {
    constructor(props) {
        super(props);
        this.getMeals = getMeals;
        this.getActivity = getActivity;
        this.today = moment();
        this.state = {
            meals: [],
            activities: [],
            foods: [],
            dailyActivityGoal: 0.0,
            dailyCaloriesGoal: 0.0,
            dailyCarbohydratesGoal: 0.0,
            dailyFatGoal: 0.0,
            dailyProteinGoal: 0.0
        }
    }
    calculateProgress(list,item, goal) {
        return goal ? Math.fround(this.totalAmount(list, item)) / goal : 0;
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
        return round(total, 2);
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
    displayMeals() {
        const list = this.state.meals;
        if (list.length != 0)
         return list.map((e, i) => (
            <ListItem key={i} title={e.name} titleStyle={styles.listTitle} bottomDivider
            rightTitle={<Text>{moment(e.date).fromNow()}</Text>}
            rightSubtitle={moment(e.date).format("h:mm a")} rightTitleStyle={styles.listTitle}/>));
        else return <Text style={{alignContent: 'center', color: '#5622F5'}}>No meals have been logged yet</Text>
    }
    displayActivity() {
        const list = this.state.activities.reverse();
        if (list.length != 0)
         return list.map((e, i) => (
            <ListItem key={i} title={e.name} titleStyle={styles.listTitle} bottomDivider
            rightTitle={<Text>{e.duration} min(s)</Text>}
            rightSubtitle={moment(e.date).format("h:mm a")} rightTitleStyle={styles.listTitle}/>));
        else return <Text style={{alignContent: 'center', color: '#5622F5'}}>No activity has been logged yet.</Text>
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
        await this.getActivityList();
        await this.getDailyGoals();
        await this.getMealList();
        await this.getAllFoods();
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
        // Could I add a load screen here?
        return (<ScrollView style={{flex:1}}>
                <View style={{flex:0.1}}>
                    <Text style={{marginTop: 10, fontSize: 25, fontWeight: '700', color: 'black', alignSelf: 'center', alignContent:'center'}}>{this.today.format('dddd')}</Text>
                    <Text style={{fontSize: 20, fontWeight: '700', color: 'gray', alignSelf: 'center', alignContent:'center'}}>{this.today.format("MMMM Do YYYY")}</Text>
                </View>
                <View style={{flex: 1}}>
                    <Card containerStyle={styles.cardStyle} title="My Goal Progress" titleStyle={{textAlign: 'left'}}>
                        <View style={styles.goalView}>
                            <GoalProgressBar progress={this.calculateProgress(this.state.activities, "activity", this.state.dailyActivityGoal)}color='#EB21D4'/>
                            <View style={{marginTop: 10}}>
                                <Text style={styles.goalTitle}> Total Activity: <Text> {this.totalAmount(this.state.activities, "activity")} / {this.state.dailyActivityGoal} min(s)</Text></Text>
                            </View>
                        </View>
                        <View style={styles.goalView}>
                            <GoalProgressBar progress={this.calculateProgress(this.state.foods, "calories", this.state.dailyCaloriesGoal)} color="#872ADE"/>
                            <View style={{marginTop: 10}}>
                                <Text style={styles.goalTitle}> Total Calories: <Text>{this.totalAmount(this.state.foods, "calories")} / {this.state.dailyCaloriesGoal}</Text></Text>
                            </View>
                        </View>
                        <View style={styles.goalView}>
                            <GoalProgressBar  progress={this.calculateProgress(this.state.foods, "carbohydrates", this.state.dailyCarbohydratesGoal)} color="#C822F5"/>
                            <View style={{marginTop: 10}}>
                                <Text style={styles.goalTitle}> Total Carbohydrates: <Text>{this.totalAmount(this.state.foods, "carbohydrates")} / {this.state.dailyCarbohydratesGoal}</Text></Text>
                            </View>
                        </View>
                        <View style={styles.goalView}>
                            <GoalProgressBar progress={this.calculateProgress(this.state.foods, "fat", this.state.dailyFatGoal)} color="#5622F5"/>
                            <View style={{marginTop: 10}}>
                                <Text style={styles.goalTitle}> Total Fat: <Text>{this.totalAmount(this.state.foods, "fat")} / {this.state.dailyFatGoal}</Text></Text>
                            </View>
                        </View>
                        <View style={styles.goalView}>
                            <GoalProgressBar progress={this.calculateProgress(this.state.foods, "protein", this.state.dailyProteinGoal)} color="#1758FA"/>
                            <View style={{marginTop: 10}}>
                                <Text style={styles.goalTitle}> Total Protein: <Text>{this.totalAmount(this.state.foods, "protein")} / {this.state.dailyProteinGoal}</Text></Text>
                            </View>
                        </View>
                    </Card>
                    <Card containerStyle={styles.cardStyle} title="My Meals" titleStyle={{textAlign: 'left'}}>
                        {this.displayMeals()}
                    </Card>
                    <Card containerStyle={styles.cardStyle} title="My Activity" titleStyle={{textAlign: 'left'}}>
                         {this.displayActivity()}
                    </Card>
                </View>
        </ScrollView>);
    }
}
const styles = StyleSheet.create({
    goalTitle: {
        textAlign: 'left',
        fontSize: 15,
        fontWeight: '500'
    },
    goalView: {
        marginBottom: 20
    },
    listTitle: {
        fontSize: 15,
        fontWeight: '500'
    },
    cardStyle: {
        shadowColor: "purple"
    }
});
export default SummaryPage;