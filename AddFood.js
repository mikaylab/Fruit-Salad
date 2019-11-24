import React from 'react';
import {Text, View, FlatList, StyleSheet, ScrollView, TouchableOpacity, PickerItem} from 'react-native';
import {ListItem, Button, Input} from 'react-native-elements';
import getFoodLibrary from './API/foods/getFoodLibrary';
import Food from './Food';
import Modal from './Modal';
import _ from 'lodash';
import pluralize from 'pluralize';

export default class AddFood extends React.Component {
    // Will use the Done to pass the food back to Meal Item!
    static navigationOptions = () => ({
        title: "Add Food",
        headerRight: <Text style={[styles.linkText, {right: 10}]} onPress={() => console.log("Done Pressed!")}>Done</Text>
    });
    constructor(props) {
        super(props);
        this.state = {
            foodLib:[],
            showModal: false,
            modalContent: "",
            servingSize: 1,
            addedFood: []
        }
    }
    addFood(item) {
        //Add item to the meal
        // We may not have the id, like if we clicked on the add button first. So we will have to pass the food back to MealItem.
        _foods = this.state.addedFood;
        item.calories *= servingSize;
        item.carbohydrates *= servingSize;
        item.protein *= servingSize;
        item.fat *= servingSize;
        this.setState({addedFood: _foods.push(item)});
    }
    async getExistingFoods() {
        let _foodLib = await getFoodLibrary();
        this.setState({foodLib: _foodLib.foods});
    }
    prepareModal(item) {
        let content = <View style={{marginTop: 80, alignItems:'center', justifyContent: 'center'}}>
                        <Text style={styles.titleStyle}>How many servings did you have?</Text>
                        <View>
                            <Input placeholder={`1 ${item.measure}`} containerStyle={{justifyContent:'center'}} inputContainerStyle={{width: 100}} onChangeText={(value) => {this.setState({servingSize: value })}}></Input>
                        </View>
                        <Text style={styles.linkText} onPress={() => {this.addFood(item); this.hideModal()}}>Submit</Text>
                    </View>
        this.setState({modalContent: content});
        this.showModal();
    }
    showModal() {
        this.setState({showModal: true});
    }
    hideModal() {
        this.setState({showModal: false});
    }
    componentDidMount() {
       this.getExistingFoods();
    }
    render() {
        return (
            <ScrollView>
                <TouchableOpacity onPress={() => this.props.navigation.navigate("AddFoodItem")}>
                    <ListItem topDivider bottomDivider title="Add new item..." titleStyle={styles.titleStyle}/>
                </TouchableOpacity>
                <FlatList
                    data={this.state.foodLib}
                    renderItem={({item}) => 
                        <Food 
                            id={item.id}
                            name={_.startCase(item.name)}
                            calories={item.calories}
                            protein={item.protein}
                            carbohydrates={item.carbohydrates}
                            fat={item.fat}
                            onPress={<Text style={styles.linkText} onPress={() => {this.prepareModal(item)}}>Add</Text>}
                        />
                    }
                    keyExtractor={(item, index) => `list-${item.name}-${index}`}
                />
                <Modal width={300} height={400} content={this.state.modalContent} show={this.state.showModal} hide={() => this.hideModal()}/>
            </ScrollView>
        );
    }
}
const numberList = [1,2,3,4,5,6,7,8,9,10];
const styles = StyleSheet.create({
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
    linkText: {
        color: '#46a2c7',
        fontSize: 20,
        fontWeight: '500'
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