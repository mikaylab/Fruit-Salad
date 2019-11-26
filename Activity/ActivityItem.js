import React from 'react';
import {Text, View, StyleSheet, AsyncStorage} from 'react-native';
import DatePicker from 'react-native-datepicker';
import { ListItem, Input, Button } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import moment from 'moment';
import addActivity from '../API/activity/addActivity';
import updateActivity from '../API/activity/updateActivity';

export default class NewActivity extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
        headerRight: () => (
            <Button title="Done" titleStyle={[styles.linkText, {right: 10}]} type="clear" onPress={navigation.getParam('submitFields')}/>
        ),
        headerLeft: () => (
            <Button title="Cancel" titleStyle={[styles.linkText, {left: 10}]} type="clear" onPress={() => navigation.goBack()}/>
        )
        }; 
    };
    constructor(props) {
        super(props);
        this.state = {
            name: "Name",
            date: moment().format('h:mm a'),
            duration: 0,
            calories: 0
        }
    }
    setName(event) {
        this.setState({name: event.nativeEvent.text})
    }
    setDuration(event) {
        this.setState({duration: event.nativeEvent.text});
    }
    setCalories(event) {
        this.setState({calories: event.nativeEvent.text});
    }
    async submitFields() {
        let fields = { "name": this.state.name, "duration": this.state.duration, "date": this.state.date, "calories": this.state.calories}

        try {
            let id = this.props.navigation.getParam('id', undefined);
            let token = await AsyncStorage.getItem('@CurrentToken');
            let response = id ? await updateActivity(fields, token, id) : await addActivity(fields, token);
            if (response !== null) {
                console.log(response.message);
            }
        } catch (e) {
            console.log(e);
        }
        this.props.navigation.state.params.updateLog();
        this.props.navigation.navigate("Activity Log");
    }
    componentDidMount() {
        //initialize states with already existing values otherwise, set them to default values
        this.setState({name: this.props.navigation.getParam('name', "Name")});
        this.setState({date: this.props.navigation.getParam('date', moment().format("h:mm a"))});
        this.setState({duration: this.props.navigation.getParam('duration', 0)});
        this.setState({calories: this.props.navigation.getParam('calories', 0)});
        this.props.navigation.setParams({submitFields: () => this.submitFields()})
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
                    <ListItem
                    bottomDivider
                    leftElement={
                        <Input
                        containerStyle={{width: 200}}
                        placeholder={JSON.stringify(this.state.duration)}
                        maxLength={100}
                        returnKeyType='done'
                        keyboardType="number-pad"
                        label="Duration"
                        labelStyle={styles.titleStyle}
                        inputStyle={styles.textInputStyle}
                        onChange={this.setDuration.bind(this)}
                        />
                    }
                    rightElement={<Text style={styles.textStyle}>minute(s)</Text>} />
                </View>
                <View>
                    <ListItem
                    bottomDivider
                    leftElement={
                    <Input
                        containerStyle={{width: 200}}
                        placeholder={JSON.stringify(this.state.calories)}
                        maxLength={100}
                        returnKeyType='done'
                        label="Calories"
                        keyboardType='number-pad'
                        labelStyle={styles.titleStyle}
                        inputStyle={styles.textInputStyle}
                        onChange={this.setCalories.bind(this)}
                    />
                    }
                    rightElement={<Text style={styles.textStyle}>cal(s)</Text>} />
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
    linkText: {
        color: '#46a2c7',
        fontSize: 20,
        fontWeight: '500'
    }
})