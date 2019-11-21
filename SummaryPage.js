import React from 'react';
import {View, Text, StyleSheet, AsyncStorage} from 'react-native';
import {Card, ListItem} from 'react-native-elements';
import GoalProgressBar from './GoalProgressBar';
import { ScrollView } from 'react-native-gesture-handler';
import getActivity from './API/getActivity';
import getMeals from './API/getMeals';
import moment from "moment";
import _ from 'lodash';
import getUserProfile from './API/getUserInfo';

class SummaryPage extends React.Component {
    constructor(props) {
        super(props);
        this.getMeals = getMeals;
        this.getActivity = getActivity;
        this.day = moment().format('dddd')
        this.date = moment().format("MMMM Do YYYY");
        this.state = {
            meals: [ {name: "Breakfast", date: moment().add(-3, 'hours')}, {name: "Midday Snack", date: moment().add(-39, "minutes")}].reverse(),
            activities: [],
            dailyActivityGoal: 0.0,
            dailyCaloriesGoal: 0.0,
            dailyCarbohydratesGoal: 0.0,
            dailyFatGoal: 0.0,
            dailyProteinGoal: 0.0
        }
    }
    totalActivity() {
        let totalActivity = 0.0;
        let activities = this.state.activities;
        activities.forEach((e) => {
            totalActivity += e.duration;
        });
        return totalActivity;
    }
    calcActivityProgress() {
        return this.state.dailyActivityGoal ? Math.fround(this.totalActivity() / this.state.dailyActivityGoal) : 0;
    }
    displayMeals() {
        const list = this.state.meals;
        if (list.length != 0)
         return list.map((e, i) => (
            <ListItem key={i} title={e.name} titleStyle={styles.listTitle} bottomDivider
            rightTitle={<Text>{moment(e.date).startOf('hour').fromNow()}</Text>}
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
    // async getMealList() {
    //     try {
    //         let token = await AsyncStorage.getItem('@CurrentToken');
    //         let mealList = await getMeals(token);
    //         if (mealList !== null) {
    //             this.setState({meals: mealList.meals});
    //         }
    //     } catch (e) {
    //         console.log(e);
    //     }
    // }
    async getActivityList() {
        try {
            let token = await AsyncStorage.getItem('@CurrentToken');
            let activityList = await this.getActivity(token);
            if (activityList !== null) {
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
    componentDidMount() {
        this.getActivityList();
        this.getDailyGoals();
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.getActivityList();
            this.getDailyGoals();
        });
        
    }
    componentWillUnmount() {
        this.focusListener.remove();
    }
    render() {
        return (<ScrollView style={{flex:1}}>
                <View style={{flex:0.1}}>
                    <Text style={{marginTop: 10, fontSize: 25, fontWeight: '700', color: 'black', alignSelf: 'center', alignContent:'center'}}>{this.day}</Text>
                    <Text style={{fontSize: 20, fontWeight: '700', color: 'gray', alignSelf: 'center', alignContent:'center'}}>{this.date}</Text>
                </View>
                <View style={{flex: 1}}>
                    <Card containerStyle={styles.cardStyle} title="My Goal Progress" titleStyle={{textAlign: 'left'}}>
                        <View style={styles.goalView}>
                            <GoalProgressBar progress={this.calcActivityProgress()} color='#EB21D4'/>
                            <View style={{marginTop: 10}}>
                                <Text style={styles.goalTitle}> Total Activity: <Text> {this.totalActivity()} / {this.state.dailyActivityGoal} min(s)</Text></Text>
                            </View>
                        </View>
                        <View style={styles.goalView}>
                            <GoalProgressBar progress={0.5} color="#872ADE"/>
                            <View style={{marginTop: 10}}>
                                <Text style={styles.goalTitle}> Total Calories: <Text>760 / 2000</Text></Text>
                            </View>
                        </View>
                        <View style={styles.goalView}>
                            <GoalProgressBar progress={0.6} color="#C822F5"/>
                            <View style={{marginTop: 10}}>
                                <Text style={styles.goalTitle}> Total Carbohydrates: <Text>500 / 700</Text></Text>
                            </View>
                        </View>
                        <View style={styles.goalView}>
                            <GoalProgressBar progress={0.2} color="#5622F5"/>
                            <View style={{marginTop: 10}}>
                                <Text style={styles.goalTitle}> Total Fat: <Text>300 / 700</Text></Text>
                            </View>
                        </View>
                        <View style={styles.goalView}>
                            <GoalProgressBar progress={0.1} color="#1758FA"/>
                            <View style={{marginTop: 10}}>
                                <Text style={styles.goalTitle}> Total Protein: <Text>9 / 133</Text></Text>
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