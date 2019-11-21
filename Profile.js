import React from 'react';
import {View, AsyncStorage, StyleSheet} from 'react-native';
import updateUserInfo from './API/updateUserInfo';
import { Divider, Button, ListItem, Input } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import deleteUser from './API/deleteUser';
import getUserProfile from './API/getUserInfo';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.updateUserInfo = updateUserInfo;
        this.state = {
            firstName: "",
            lastName: "",
            dailyActivityGoal: 0.0,
            dailyCaloriesGoal: 0.0,
            dailyCarbohydratesGoal: 0.0,
            dailyFatGoal: 0.0,
            dailyProteinGoal: 0.0,
            showModal: false
        }
    }
    static navigationOptions = {
        title: 'Profile'
    };
    async getUserInfo() {
        let data;
        try {
            data = await AsyncStorage.multiGet(['@CurrentUsername', '@CurrentToken'])
            if (data !== null) {
                return data;
            }
            console.log("No data stored");
        } catch(e) {
            console.log("Error occured getting user data");
        }
    }
    async getProfile() {
        let data = await this.getUserInfo();
        response = await getUserProfile(data[1][1], data[0][1]);
        if (response !== null) {
            this.setState({firstName: response.firstName || ""});
            this.setState({lastName: response.lastName || ""});
            this.setState({dailyActivityGoal: response.goalDailyActivity|| 0.0});
            this.setState({dailyCaloriesGoal : response.goalDailyCalories || 0.0});
            this.setState({dailyCarbohydratesGoal: response.goalDailyCarbohydrates || 0.0});
            this.setState({dailyFatGoal: response.goalDailyFat || 0.0});
            this.setState({dailyProteinGoal: response.goalDailyProtein || 0.0});
        }
    }
    async updateProfile() {
        const profile = {
            "firstName": this.state.firstName,
            "lastName": this.state.lastName,
            "goalDailyCalories": this.state.dailyCaloriesGoal,
            "goalDailyProtein" : this.state.dailyProteinGoal,
            "goalDailyCarbohydrates" : this.state.dailyCarbohydratesGoal,
            "goalDailyFat": this.state.dailyFatGoal,
            "goalDailyActivity": this.state.dailyActivityGoal
        };
        const userData = await this.getUserInfo(); //[ ['@CurrentUsername', 'username'], ['@CurrentToken', 'token'] ]
        await this.updateUserInfo(profile, userData[1][1], userData[0][1]);
    }
    // You gotta make individual functions for each.
    async updateFirstName(event) {
        this.setState({firstName: event.nativeEvent.text});
    }
    async updateLastName(event) {
        this.setState({lastName: event.nativeEvent.text});
    }
    async updateDailyActivityGoal(event) {
        this.setState({dailyActivityGoal: event.nativeEvent.text});
    }
    async updateDailyCaloriesGoal(event) {
        this.setState({dailyCaloriesGoal: event.nativeEvent.text});
    }
    async updateDailyCarbsGoal(event) {
        this.setState({dailyCarbohydratesGoal: event.nativeEvent.text});
    }
    async updateDailyFatGoal(event) {
        this.setState({dailyFatGoal: event.nativeEvent.text});
    }
    async updateDailyProteinGoal(event) {
        this.setState({dailyProteinGoal: event.nativeEvent.text});
    }
    showModal() {
        this.setState({showModal: true});
    }
    hideModal() {
        this.setState({showModal: false});
    }
    async delete() {
        const userData = await this.getUserInfo(); //[ ['@CurrentUsername', 'username'], ['@CurrentToken', 'token'] ]
        await deleteUser(userData[1][1], userData[0][1]);
        this.props.navigation.state.params.goHome();
    }
    async signOut() {
       try {
           await AsyncStorage.multiRemove(['@CurrentUsername', '@CurrentToken']);
       } catch(e) {
           console.log(e);
       }
        this.props.navigation.state.params.goHome();
    }
    componentDidMount() {
        this.getProfile();
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.getProfile();
        });   
    }
    componentWillUnmount() {
        this.focusListener.remove();
    }
    render() {
        return(
            <View>
                <ScrollView>
                <ListItem bottomDivider title="Personal Information" titleStyle={{fontWeight: 'bold'}}/>
                <ListItem bottomDivider title="First Name" rightTitle={<Input returnKeyType='done' onChange={this.updateFirstName.bind(this)} placeholder={this.state.firstName}/>} />
                <ListItem bottomDivider title="Last Name" rightTitle={<Input returnKeyType='done' onChange={this.updateLastName.bind(this)} placeholder={this.state.lastName}/>} />
                <ListItem title="Daily Goals" titleStyle={{fontWeight: 'bold'}}/>
                <Divider style={{backgroundColor: 'black'}}/>
                <ListItem bottomDivider title="Activity" rightTitle={<Input returnKeyType='done' keyboardType='decimal-pad' onChange={this.updateDailyActivityGoal.bind(this)} placeholder={JSON.stringify(this.state.dailyActivityGoal)}/>}/>
                <ListItem bottomDivider title="Calories" rightTitle={<Input returnKeyType='done' keyboardType='decimal-pad' onChange={this.updateDailyCaloriesGoal.bind(this)} placeholder={JSON.stringify(this.state.dailyCaloriesGoal)}/>}/>
                <ListItem bottomDivider title="Carbohydrates" rightTitle={<Input returnKeyType='done' keyboardType='decimal-pad' onChange={this.updateDailyCarbsGoal.bind(this)} placeholder={JSON.stringify(this.state.dailyCarbohydratesGoal)}/>}/>
                <ListItem bottomDivider title="Fats" rightTitle={<Input returnKeyType='done' keyboardType='decimal-pad' onChange={this.updateDailyFatGoal.bind(this)} placeholder={JSON.stringify(this.state.dailyFatGoal)} />}/>
                <ListItem bottomDivider title="Proteins" rightTitle={<Input returnKeyType='done' keyboardType='decimal-pad'onChange={this.updateDailyProteinGoal.bind(this)} placeholder={JSON.stringify(this.state.dailyProteinGoal)}/>}/>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <View style={styles.buttonStyle}>
                    <Button containerStyle={{backgroundColor: 'mediumpurple' }} titleStyle={{color: 'white'}} type="clear" title="Submit Updated Fields" onPress={() => this.updateProfile()}></Button>
                    </View>
                    <View style={styles.buttonStyle}>
                    <Button containerStyle={{backgroundColor: 'plum'}} titleStyle={{color: 'white'}} type='clear' title="Delete Account" onPress={() => this.delete()}></Button>
                    </View>
                    <View style={styles.buttonStyle}>
                        <Button containerStyle={{backgroundColor: 'indigo'}} titleStyle={{color: 'white'}} type="clear" title="Sign Out" onPress={() => this.signOut()}/>
                    </View>
                </View>
                </ScrollView>
            </View>
        )  
    }
}
export default Profile;
const styles = StyleSheet.create({
    buttonStyle: {
        paddingTop: 10,
        borderRadius: 10,
        width: 150,
        top: 10
    }
})