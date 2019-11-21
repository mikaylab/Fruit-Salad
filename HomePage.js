import React from 'react';
import { View } from 'react-native';
import {Text, Button} from 'react-native-elements';

class HomePage extends React.Component {
    static navigationOptions = {
        title: 'Home'
    };
    render() {
        return(
        <View style={{flex: 1, alignItems: 'center', backgroundColor: "#cb6ce6"}}>
            <View>
            <Text style={{flex: 0.3, marginTop: 50, fontWeight:"bold", color: 'white'}} h1>Welcome!</Text>
            </View>
            <View style={{flex:0.5}}>
            <Button type='outline' buttonStyle={{backgroundColor: 'white', borderColor: 'purple', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 10}} titleStyle={{color: 'black', fontSize: 20}} title='Login' onPress={() => {this.props.navigation.navigate('Login')}}/>
            <Text style={{marginTop: 20, marginBottom: 20, alignSelf:'center', fontWeight:'700', fontSize: 15, color: 'white'}}>Or</Text>
            <Button buttonStyle={{backgroundColor: 'purple', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 10}} titleStyle={{color: 'white', fontSize: 20}} title='Create a New Account' onPress={() => {this.props.navigation.navigate('SignUp')}} />
            </View>
        </View>
        );
    }
}
export default HomePage;