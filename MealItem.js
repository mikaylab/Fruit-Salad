import React from 'react';
import {Text, View, StyleSheet, AsyncStorage} from 'react-native';
import DatePicker from 'react-native-datepicker';
import { ListItem, Input, Button } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import moment from 'moment';
import addMeal from './API/meals/addMeal';
import updateMeal from './API/meals/updateMeal';

export default class MealItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "Name",
            date: moment().format('h:mm a'),
            foods: []
        }
    }
    setName(event) {
        this.setState({name: event.nativeEvent.text})
    }
    // setFoods(event) {
    //     let _foods = this.state.foods;
    //     _foods.push()
    //     this.setState
    // }
    async submitFields() {
        let fields = { "name": this.state.name,"date": this.state.date}

        try {
            let id = this.props.navigation.getParam('id', undefined);
            let token = await AsyncStorage.getItem('@CurrentToken');
            let response = id ? await updateMeal(fields, token, id) : await addMeal(fields, token);
            if (response !== null) {
                console.log(response.message);
            }
        } catch (e) {
            console.log(e);
        }
        this.props.navigation.state.params.updateLog();
        this.props.navigation.navigate("Meal Log");
    }
    componentDidMount() {
        //initialize states with already existing values otherwise, set them to default values
        this.setState({name: this.props.navigation.getParam('name', "Name")});
        this.setState({date: this.props.navigation.getParam('date', moment().format("h:mm a"))});
        this.setState({foods: this.props.navigation.getParam('foods', [])});
    }
    render() {
        return(<ScrollView>
             <View style={{marginTop: 10}}>
                 <ListItem
                 bottomDivider
                 leftElement={
                    <Input
                        placeholder={this.state.name}
                        maxLength={100}
                        returnKeyType='done'
                        label="Name"
                        labelStyle={styles.titleStyle}
                        inputStyle={styles.textInputStyle}
                        onChange={this.setName.bind(this)}
                        />
                    }
                    />
                </View>
                <View>
                    {/* For foods */}
                </View>
                <View>
                <ListItem 
                        title="Timestamp"
                        titleStyle={styles.titleStyle}
                        bottomDivider
                        subtitle={
                            <DatePicker
                            style={styles.dateStyle}
                            date={this.state.date}
                            mode="time"
                            placeholder="Select Time"
                            format="h:mm a"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                                dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                                },
                                dateInput: {
                                marginLeft: 36
                                }
                            }}
                            onDateChange={(date) => {this.setState({date: date})}}/>
                        }
                    />
                </View>
                <View style={{justifyContent: 'center', alignItems:'center'}}>
                    <View style={styles.buttonStyle}>
                        <Button containerStyle={{backgroundColor: 'rebeccapurple'}} title="Submit" titleStyle={{color: 'white'}} type='clear' onPress={() => {this.submitFields()}}/>
                    </View>
                    <View style={styles.buttonStyle}>
                        <Button title="Cancel" titleStyle={{color: 'white'}} containerStyle={{backgroundColor: 'orchid'}} type='clear' onPress={() => this.props.navigation.goBack()}/>
                    </View>
                </View>
        </ScrollView>)
    }
}
const styles = StyleSheet.create({
    dateStyle: {
        width: 300,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInputStyle: {
        fontSize: 20,
        backgroundColor: "whitesmoke",
        borderRadius: 10,
        marginTop: 10,
        borderBottomColor: 'transparent'
    },
    titleStyle: {
        fontSize: 20,
        fontWeight: '500',
        color: 'black'
    },
    textStyle: {
        fontSize: 15
    },
    buttonStyle: {
        paddingTop: 10,
        borderRadius: 10,
        width: 100,
        top: 10
    }
})