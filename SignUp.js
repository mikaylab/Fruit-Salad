import React from 'react';
import {Text, View} from 'react-native';
import {Button, ListItem, Input} from 'react-native-elements';
import Modal from './Modal';
import createNewUser from './API/user/createNewUser';
import loginCurrentUser from './API/user/logCurrentUser';
import authUser from './API/user/authUser';
import {AsyncStorage} from 'react-native';

class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.createNewUser = createNewUser;
        this.loginCurrentUser = loginCurrentUser;
        this.authUser = authUser;
        this.state = {
            username: "",
            password: "",
            showModal: false,
            modalContent: ""
        }
    }
    async storeUser(username, token) {
        const userName = ['@CurrentUsername', username];
        const _token = ['@CurrentToken', token];
        try {
            await AsyncStorage.multiSet([userName, _token]);
        }catch(e) {
            this.handleErrors("Error saving user token");
        }
    }
    goHome() {
        this.props.navigation.navigate("Home");
    }
    async redirectToProfile(response, token) {
        let params = {
                firstName : response.firstName,
                lastName : response.lastName,
                dailyActivityGoal : response.goalDailyActivity,
                dailyCaloriesGoal : response.goalDailyCalories,
                dailyCarbohydratesGoal : response.goalDailyCarbohydrates,
                dailyFatGoal : response.goalDailyFatGoal,
                dailyProteinGoal : response.goalDailyProtein,
                goHome: this.goHome.bind(this)
        };
        await this.storeUser(response.username, token);
        this.props.navigation.navigate("App", params);
    }
    async handleErrors(message) {
        let messageContent = <Text style={{fontSize: 15, marginLeft: 20, marginRight: 20, marginTop: 90}}>{message}</Text>
        await this.setState({modalContent: messageContent});
        this.showModal();
    }
    async createUser() {
        let response = await this.createNewUser(this.state.username, this.state.password);
        if (response.message === "User created!") {
            let token = await this.loginCurrentUser(this.state.username, this.state.password);
            let nextStep;
            if (token.token) {
                nextStep = await this.authUser(this.state.username, this.state.password, token.token);
            }
            else { // no token field will exist if the request was not fufilled
                this.handleErrors("Automatic login failed. Please login in manually from the Home Page");
                return;
            }
            nextStep.message !== "Token is invalid!" ? this.redirectToProfile(nextStep, token.token) : this.handleErrors("Unable to register you at this time. Sorry for the inconvenience.");
        }
        else {
            this.handleErrors(response.message);
        }
    }
    handleUsernameInput(event) {
        this.setState({username: event.nativeEvent.text});
    }
    handlePasswordInput(event) {
        this.setState({password: event.nativeEvent.text});
    }
    showModal() {
        this.setState({showModal: true});
    }
    hideModal() {
        this.setState({showModal: false});
    }
    render() {
        return (
            <View style={{flex: 1}}>
                <Text style={{marginTop: 20, marginBottom: 20, alignSelf:'center', fontWeight:'700', fontSize: 20}}>Create a new account</Text>
                <ListItem title="Username" titleStyle={{fontWeight:'700', fontSize: 15}} rightTitle={<Input onChange={this.handleUsernameInput.bind(this)} placeholder="Username"/>}/>
                <ListItem title="Password" titleStyle={{fontWeight:'700', fontSize: 15 }} rightTitle={<Input onChange={this.handlePasswordInput.bind(this)} placeholder="Password"/>}/>
                <View style={{flex: 0.1}}>
                   <Text style={{fontWeight:'500', fontSize: 15, alignSelf: 'center', color: '#46a2c7'}} onPress={() => this.props.navigation.navigate("Login")}>Already have an account? Login here.</Text>
               </View>
                <Button buttonStyle={{width: 100, alignSelf: 'center', backgroundColor: 'purple', padding: 10, borderRadius: 10}} titleStyle={{color: 'white', fontSize: 20, fontWeight: '700'}} title='Sign Up' onPress={() => {this.createUser()}} />
                <Modal width={300} height={400} content={this.state.modalContent} show={this.state.showModal} hide={() => this.hideModal()}/>
            </View>
        )
    }
}
export default SignUp;