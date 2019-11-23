import React from 'react';
import {Text, View, Picker, FlatList, StyleSheet, ScrollView, TouchableOpacity, PickerItem} from 'react-native';
import {ListItem, Button, Input} from 'react-native-elements';
import getFoodLibrary from './API/foods/getFoodLibrary';
import Food from './Food';
import Modal from './Modal';
import _ from 'lodash';
import pluralize from 'pluralize';

export default class AddFood extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            foodLib:[],
            showModal: false,
            modalContent: "",

        }
    }
    async getExistingFoods() {
        let _foodLib = await getFoodLibrary();
        this.setState({foodLib: _foodLib.foods});
    }
    prepareModal(item) {
        let content = <View style={{marginRight: 40, marginLeft: 40}}>
                        <Text style={styles.titleStyle}>How many servings did you have?</Text>
                        <Picker mode='dialog' selectedValue={1} style={{width: 100}}>
                            <Picker.Item label={1} value={1}/>
                            <Picker.Item label={2} value={2}/>
                            <Picker.Item label={3} value={3}/>
                            <Picker.Item label={4} value={4}/>
                            <Picker.Item label={5} value={5}/>
                            <Picker.Item label={6} value={6}/>
                            <Picker.Item label={7} value={7}/>
                            <Picker.Item label={8} value={8}/>
                            <Picker.Item label={9} value={9}/>
                            <Picker.Item label={10} value={10}/>
                            <Picker.Item label={11} value={11}/>
                        </Picker>
                        <Text onPress={() => this.hideModal()}>Submit</Text>
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
                <Modal width={300} height={500} content={this.state.modalContent} show={this.state.showModal} hide={() => this.hideModal()}/>
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