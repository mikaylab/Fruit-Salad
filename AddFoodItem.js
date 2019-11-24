import React from 'react';
import {Text, AsyncStorage, StyleSheet} from 'react-native';
import {ListItem, Input, Button} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';

export default class AddFoodItem extends React.Component {
    static navigationOptions = () => ({
        title: "Add New Food Item",
        headerRight: <Text style={[styles.linkText, {right: 10}]} onPress={() => this.submitFood()}>Done</Text>
    });
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            calories: 0.0,
            protein: 0.0,
            carbohydrates: 0.0,
            fat: 0.0
        }
    }
    setName(event) {
        this.setState({name: event.nativeEvent.text});
    }
    setCalories(event) {
        this.setState({calories: event.nativeEvent.text});
    }
    setProtein(event) {
        this.setState({protein: event.nativeEvent.text});
    }
    setCarbohydrates(event) {
        this.setState({carbohydrates: event.nativeEvent.text});
    }
    setFat(event) {
        this.setState({fat: event.nativeEvent.text});
    }
    submitFood() {
        let item = {
            name: this.state.name,
            calories: this.state.calories,
            carbohydrates: this.state.carbohydrates,
            protein: this.state.protein,
            fat: this.state.fat
        }
        this.props.navigation.state.params.addFood(item);
        this.props.navigation.goBack();
    }
    render() {
        return (
            <ScrollView>
                <ListItem
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
                <ListItem
                    leftElement={
                        <Input
                            placeholder={JSON.stringify(this.state.calories)}
                            maxLength={100}
                            returnKeyType='done'
                            label="Calories"
                            labelStyle={styles.titleStyle}
                            inputStyle={styles.textInputStyle}
                            onChange={this.setCalories.bind(this)}
                        />
                    }
                />
                <ListItem
                    leftElement={
                        <Input
                            placeholder={JSON.stringify(this.state.protein)}
                            maxLength={100}
                            returnKeyType='done'
                            label="Protein"
                            labelStyle={styles.titleStyle}
                            inputStyle={styles.textInputStyle}
                            onChange={this.setProtein.bind(this)}
                        />
                    }
                />
                <ListItem
                    leftElement={
                        <Input
                            placeholder={JSON.stringify(this.state.carbohydrates)}
                            maxLength={100}
                            returnKeyType='done'
                            label="Carbohydrates"
                            labelStyle={styles.titleStyle}
                            inputStyle={styles.textInputStyle}
                            onChange={this.setCarbohydrates.bind(this)}
                        />
                    }
                />
                <ListItem
                    leftElement={
                        <Input
                            placeholder={JSON.stringify(this.state.fat)}
                            maxLength={100}
                            returnKeyType='done'
                            label="Fat"
                            labelStyle={styles.titleStyle}
                            inputStyle={styles.textInputStyle}
                            onChange={this.setFat.bind(this)}
                        />
                    }
                />
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
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
    }
})