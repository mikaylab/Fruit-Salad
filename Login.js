import React from 'react';
import { Text, View} from 'react-native';
import Modal from './Modal';
import loginCurrentUser from './API/logCurrentUser';
import authUser from './API/authUser';
import { Button, ListItem, Input } from 'react-native-elements';
import {AsyncStorage} from 'react-native';

class Login extends React.Component {
    constructor(props) {
        super(props);
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

    showModal() {
        this.setState({showModal: true});
    }
    hideModal() {
        this.setState({showModal: false});
    }
    async handleErrors(message) {
        let messageContent = <Text style={{fontSize: 15, marginLeft: 20, marginRight: 20, marginTop: 90}}>{message}</Text>
        this.setState({modalContent: messageContent});
        this.showModal();
    }
    goHome() {
        this.props.navigation.navigate("Home");
    }
    async redirectToProfile(response, token) {
        let params = {
                firstName : response.firstName ? response.firstName : "None",
                lastName : response.lastName ? response.lastName : "None",
                dailyActivityGoal : response.goalDailyActivity ? response.goalDailyActivity : 0,
                dailyCaloriesGoal : response.goalDailyCalories ? response.goalDailyCalories : 0,
                dailyCarbohydratesGoal : response.goalDailyCarbohydrates ? response.goalDailyCarbohydrates : 0,
                dailyFatGoal : response.goalDailyFatGoal ? response.goalDailyFatGoal : 0,
                dailyProteinGoal : response.goalDailyProtein ? response.goalDailyProtein : 0,
                goHome: this.goHome.bind(this)
        };
        await this.storeUser(response.username, token);
        this.props.navigation.navigate("App", params);
    }
    async loginUser() {
        let token = await this.loginCurrentUser(this.state.username, this.state.password);
        
        let response;
        if (token.message === "Could not verify") {
            this.handleErrors("Username and/\or password not recognized. Check that you entered in the correct credentials.");
            return;
        }
        else {
            response = await this.authUser(this.state.username, this.state.password, token.token);
        }
        response.username ? this.redirectToProfile(response, token.token) : this.handleErrors("Error. Please login again. Check that you have entered the correct login credentials: Username and password at least 5 characters long.");
    }
    handleUsernameInput(event) {
        this.setState({username: event.nativeEvent.text});
    }
    handlePasswordInput(event) {
        this.setState({password: event.nativeEvent.text});
    }
    render() {
        return (
               <View style={{flex:1}}>
               <Text style={{marginTop: 20, marginBottom: 20, alignSelf:'center', fontWeight:'700', fontSize: 20}}>Login to your account</Text>
               <ListItem title="Username" titleStyle={{fontWeight:'700', fontSize: 15}} rightTitle={<Input onChange={this.handleUsernameInput.bind(this)} placeholder="Username"/>}/>
               <ListItem title="Password" titleStyle={{fontWeight:'700', fontSize: 15 }} rightTitle={<Input onChange={this.handlePasswordInput.bind(this)} placeholder="Password"/>}/>
               <View style={{flex: 0.1}}>
                   <Text style={{fontWeight:'500', fontSize: 15, alignSelf: 'center', color: '#46a2c7'}} onPress={() => this.props.navigation.navigate("SignUp")}>Don't have an account? Sign up here.</Text>
               </View>
               <View style={{flex:0.4}}>
               <Button buttonStyle={{alignSelf: 'center', width: 90, backgroundColor: 'purple', borderRadius: 10}} titleStyle={{color: 'white', fontSize: 20, fontWeight: '700'}} title='Login' onPress={() => {this.loginUser()}} />
               </View>
               <Modal width={300} height={400} content={this.state.modalContent} show={this.state.showModal} hide={() => this.hideModal()}/>
        </View>
        );
    }
}
export default Login;