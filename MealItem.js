import React from 'react';
import {Animated,Text, View, StyleSheet, AsyncStorage, TouchableOpacity} from 'react-native';
import DatePicker from 'react-native-datepicker';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { ListItem, Input, Button, Icon, Tooltip } from 'react-native-elements';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import Food from './Food';
import moment from 'moment';
import addMeal from './API/meals/addMeal';
import updateMeal from './API/meals/updateMeal';
import getMealFoods from './API/meals/foods/getMealFoods';
import deleteFood from './API/meals/foods/deleteFood';

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
    async removeFood(item) {
        try {
            let foodId = item.id;
            let token = await AsyncStorage.getItem('@CurrentToken');
            let response = await deleteFood(token, this.state.id, foodId);
            if (response !== null) {
                console.log(response.message);
            }
            this.getFoodList(this.state.id);
        } catch (e) {
            console.log(e);
        }
    }
    async modifyFood(item) {
        let params = {
            id: item.id,
            name: item.name,
            calories: item.calories,
            carbohydrates: item.carbohydrates,
            protein: item.protein,
            fat: item.fat
        };
        this.props.navigation.navigate("AddFoodItem", params);
    }
    LeftActions({item, dragX, onPress}) {
        const scale = dragX.interpolate({
            inputRange: [40, 100],
            outputRange: [1,1],
            extrapolate: 'clamp' //locks the text to the output value
        })
        return (
            <TouchableOpacity onPress={() => onPress(item)}>
                <View style={styles.leftAction}>
                    <Animated.Text style={[styles.actionText, {transform: [{scale}]}] }>Delete</Animated.Text>
                </View>
            </TouchableOpacity>
        )
    }
    RightActions({item, dragX, onPress}) {
        const scale = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [1,1],
            extrapolate: 'clamp' //locks the text to the output value
        })
        return (
            <TouchableOpacity onPress={() => onPress(item)}>
                <View style={styles.rightAction}>
                    <Animated.Text style={[styles.actionText, {transform: [{scale}]}] }>Edit</Animated.Text>
                </View>
            </TouchableOpacity>
        )
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
                        subtitle={<Tooltip height={100} width={200} backgroundColor="lavender" popover={<Text>Swipe left on an item to delete it. Swipe right to edit an item.</Text>}>
                            <Text>Want to edit or delete an item?</Text>
                            </Tooltip>
                        }
                        />
                    </View>
                    <View>
                        <FlatList
                        data={this.state.foods}
                        renderItem={({item}) => 
                        <Swipeable
                            renderLeftActions={(dragX) => <this.LeftActions item={item} dragX={dragX} onPress={this.removeFood.bind(this)}/>}
                            renderRightActions={(dragX) => <this.RightActions item={item} dragX={dragX} onPress={this.modifyFood.bind(this)}/>}>
                               <Food name={item.name}
                                id={item.id}
                                calories={item.calories}
                                carbohydrates={item.carbohydrates}
                                protein={item.protein}
                                fat={item.fat} 
                                />
                        </Swipeable>
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
    leftAction: {
        backgroundColor: 'indigo',
        justifyContent: 'center',
        flex: 1
    },
    rightAction: {
        backgroundColor: 'mediumpurple',
        justifyContent: 'center',
        flex: 1,
        alignItems: 'flex-end'
    },
    actionText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
        padding: 20
    },
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