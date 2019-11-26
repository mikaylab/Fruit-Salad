import React from 'react';
import {Animated, Text, View, AsyncStorage, StyleSheet, TouchableOpacity, FlatList, ScrollView} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Meal from './Meal';
import { Icon, ListItem, Tooltip } from 'react-native-elements';
import getMeals from './API/meals/getMeals';
import deleteMeal from './API/meals/deleteMeal';
import dataFilter from './dayFilter';

class MealLog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            meals: []
        }
    }
    async getMealList() {
        try {
            let token = await AsyncStorage.getItem('@CurrentToken');
            let mealList = await getMeals(token);
            if (mealList !== null) {
                mealList.meals = mealList.meals.filter(dataFilter);
                this.setState({meals: mealList.meals});
            }
        } catch (e) {
            console.log(e);
        }
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
    async removeMeal(item) {
        try {
            let id = item.id;
            let token = await AsyncStorage.getItem('@CurrentToken');
            let response = await deleteMeal(token, id);
            if (response !== null) {
                console.log(response.message);
            }
            this.getMealList();
        } catch (e) {
            console.log(e);
        }
    }
    async modifyMeal(item) {
        let params = {
            id: item.id,
            name: item.name || undefined,
            date: item.date || undefined
        };
        this.props.navigation.navigate("MealItem", params);
    }
    addMeal() {
        this.props.navigation.navigate("MealItem");
    }
    componentDidMount() {
        this.getMealList();
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.getMealList();
        });
    }
    componentWillUnmount() {
        this.focusListener.remove();
    }
    render() {
        return (
            <ScrollView>
                <ListItem bottomDivider title="Add new meal" titleStyle={{fontWeight: 'bold'}}
                subtitle={<Tooltip height={100} width={200} backgroundColor="lavender" popover={<Text>Swipe left on an item to delete it. Swipe right to edit an item or add foods to a meal.</Text>}>
                    <Text>Want to edit or delete an item?</Text>
                </Tooltip>}
                rightElement={
                    <TouchableOpacity
                        style={styles.addButton} 
                        onPress={() => this.addMeal()}>
                        <Icon color='white' type='font-awesome' size={30} name='plus'/>
                    </TouchableOpacity>}
                />
                <FlatList
                    data={this.state.meals.reverse()}
                    renderItem={({item}) => 
                    <Swipeable
                    renderLeftActions={(dragX) => <this.LeftActions item={item} dragX={dragX} onPress={this.removeMeal.bind(this)}/>}
                    renderRightActions={(dragX) => <this.RightActions item={item} dragX={dragX} onPress={this.modifyMeal.bind(this)}/>}>
                        <Meal date={item.date} id={item.id} name={item.name}/>
                    </Swipeable>}
                    keyExtractor={(item, index) => `list-${item.id}-${index}`}
                />
            </ScrollView>
    );
    }
}
export default MealLog;
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
    addButton: {
        padding: 1,
        height: 50,
        width: 50,
        borderRadius: 100,
        backgroundColor: '#7637ad',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        right: 10
    }
})