import React from 'react';
import {Text, View, StyleSheet, AsyncStorage, TouchableOpacity} from 'react-native';
import DatePicker from 'react-native-datepicker';
import { ListItem, Input, Button, Icon } from 'react-native-elements';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import Food from './Food';
import moment from 'moment';
import addMeal from './API/meals/addMeal';
import updateMeal from './API/meals/updateMeal';
import getMealFoods from './API/meals/foods/getMealFoods';

export default class MealItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "Name",
            id: "",
            date: moment().format('h:mm a'),
            foods: []
        }
    }
    async getFoodList(mealId) {
        try {
            let token = await AsyncStorage.getItem('@CurrentToken');
            let foods = await getMealFoods(token, mealId);
            if (foods !== null) {
                this.setState({foods: foods.foods});
            }
        } catch(e) {
            console.log(e);
        }
    }
    setName(event) {
        this.setState({name: event.nativeEvent.text})
    }
    async submitFields() {
        let fields = { "name": this.state.name,"date": this.state.date}
        try {
            let token = await AsyncStorage.getItem('@CurrentToken');
            let response = this.state.id ? await updateMeal(fields, token, this.state.id) : await addMeal(fields, token);
            if (response !== null) {
                console.log(response.message);
            }
        } catch (e) {
            console.log(e);
        }
        this.props.navigation.navigate("Meal Log");
    }
    componentDidMount() {
        //initialize states with already existing values otherwise, set them to default values
        this.setState({name: this.props.navigation.getParam('name', "Name")});
        this.setState({date: this.props.navigation.getParam('date', moment().format("h:mm a"))})
        this.setState({id: this.props.navigation.getParam('id', undefined)});
        if (this.state.id) {
            this.getFoodList(this.state.id);
        }
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            if (this.state.id) {
                this.getFoodList(this.state.id);
            }
        });
    }
    componentWillUnmount() {
        this.focusListener.remove();
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
                { this.state.id ? 
                <View>
                    <View>
                    <ListItem 
                        title="Foods"
                        titleStyle={styles.titleStyle}
                        bottomDivider
                        rightTitle={
                            <TouchableOpacity
                                style={styles.addButton} 
                                onPress={() => this.props.navigation.navigate("Foods", {id: this.state.id})}>
                                <Icon color='white' type='font-awesome' size={20} name='plus'/>
                            </TouchableOpacity>
                        }
                        />
                    </View>
                    <View>
                        <FlatList
                        data={this.state.foods}
                        renderItem={({item}) => 
                            <Food name={item.name}
                                id={item.id}
                                calories={item.calories}
                                carbohydrates={item.carbohydrates}
                                protein={item.protein}
                                fat={item.fat} 
                            />
                        }
                        keyExtractor={(item, index) => `list-${item.name}-${index}`}
                        />
                    </View>
                </View>
                    :
                <View/>
                }
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
    },
    addButton: {
        padding: 1,
        height: 30,
        width: 30,
        borderRadius: 60,
        backgroundColor: 'indigo',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        top: 0,
        right: 10
    }
})