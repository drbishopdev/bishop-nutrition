import React, { Component } from 'react'
import { StyleSheet, Text, View, FlatList, ScrollView } from 'react-native'
import SegmentedControlTab from "react-native-segmented-control-tab";
import * as firebase from "firebase/app"
import "firebase/firestore"
import 'firebase/auth'



export default class ProgressScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            weightEntry: [],
            data: [],
            timeStamp: [],
            startingWeight: [],
            selectedIndex: 0,
            time: [],
            measurements: []
        }
    }

    async componentDidMount() {
        await this.list()
        await this.time()
        await this.startingWeight()
        await this.getTime()
        await this.getValues()

    }

    handleIndexChange = async (index) => {
        this.setState({ selectedIndex: index })

    }

    getTime = async () => {
       
        let uid = await firebase.auth().currentUser.uid
        await firebase.firestore().collection("userData").doc(uid).collection("bodyTracking").orderBy("timeStamp", "desc").limit(5).get().then((querySnapshot) => {
            let time = []
            querySnapshot.forEach((doc) => {
                let D = new Date(doc.data().timeStamp)
                const Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                const datee = D.getDate()
                const month = Months[D.getMonth()]
                const year = D.getFullYear()

                let obj = {
                    time: `${month} ${datee}, ${year}`
                }
                time.push(obj)
                
                this.setState({ time })
            })

        })
       



    }

    getValues = async () => {

        let uid = await firebase.auth().currentUser.uid
        await firebase.firestore().collection("userData").doc(uid).collection("bodyTracking").limit(5).get().then((querySnapshot) => {

            let measurements = []
            querySnapshot.forEach((doc) => {

                let d = new Date(doc.data().timeStamp)
                const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                const date = d.getDate()
                const Month = months[d.getMonth()]
                const Year = d.getFullYear()
                let obj = {

                    date: `${Month} ${date}, ${Year}`,
                    timeStamp: doc.data().timeStamp,
                    chest: doc.data().chestEntry,
                    waist: doc.data().waistEntry,
                    hips: doc.data().hipsEntry
                }
                measurements.push(obj)



                this.setState({ measurements })
            })
        })


    }


    list = async () => {

        let uid = await firebase.auth().currentUser.uid


        await firebase.firestore().collection("userData").doc(uid).collection("bodyTracking").orderBy("weightEntry", "desc").limit(17).get().then((doc) => {

            let weightEntry = []
            doc.forEach((doc) => {
                let d = new Date(doc.data().timeStamp)
                const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                const date = d.getDate()
                const Month = months[d.getMonth()]
                const Year = d.getFullYear()
                let obj = {
                    date: `${Month} ${date}, ${Year}`,
                    timeStamp: doc.data().timeStamp,
                    weightEntry: doc.data().weightEntry
                }
                weightEntry.push(obj)

                this.setState({ weightEntry })
            })


        })


    }

    startingWeight = async () => {

        let uid = await firebase.auth().currentUser.uid

        let sw = await firebase.firestore().collection("userData").doc(uid).get().then((doc) => {
            return doc.data().startingWeight
        })
        this.setState({ startingWeight: sw })

    }

    time = async () => {

        let uid = await firebase.auth().currentUser.uid

        await firebase.firestore().collection("userData").doc(uid).collection("bodyTracking").orderBy("timeStamp", "asc").limit(17).get().then((querySnapshot) => {


            let timeStamp = []

            querySnapshot.forEach((doc) => {

                let d = new Date(doc.data().timeStamp)
                const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                const date = d.getDate()
                const Month = months[d.getMonth()]
                const Year = d.getFullYear()
                let obj = {
                    timeStamp: `${Month} ${date}, ${Year}`
                }

                timeStamp.push(obj)
                this.setState({ timeStamp })
            })
        })

    }
    _renderWeightContent = () => {
        this.state.weightEntry.sort(function (a, b) { return b.timeStamp - a.timeStamp })
        return (
            this.state.weightEntry.map((item, key) => (
                <View key={key}>
                    <Text style={weight.date}>{item.date}</Text>
                    <View style={weight.container}>
                    <View style={weight.progressContainer}>
                            <Text style={weight.progressText}>Progress </Text>
                            <Text style={weight.progressDifference}>-{this.state.startingWeight - item.weightEntry}lbs</Text>
                        </View>
                        <Text style={weight.weight}>{item.weightEntry} </Text>                        
                    </View>
                </View>
            ))
        )
    }
   
    _renderMeasuermentsContent = () => {
        this.state.measurements.sort(function (a, b) { return b.timeStamp - a.timeStamp })
        return (
            this.state.measurements.map((item, key) => (
                <View key={key}>
                    <Text style={measurement.date}>{item.date}</Text> 

                    <View style={measurement.container}>

                        <View style={measurement.entryContainer}>
                            <Text style={measurement.content}>Chest: </Text>
                            <Text style={measurement.content}>{item.chest}</Text>
                        </View>
                            
                        <View style={measurement.entryContainer}>
                            <Text style={measurement.content}>Waist: </Text>
                            <Text style={measurement.content}>{item.waist}</Text>
                        </View>
                            
                        <View style={measurement.entryContainer}>
                                <Text style={measurement.content}>Hips: </Text>
                                <Text style={measurement.content}>{item.hips}</Text>
                        </View>
                            
                    </View>
                </View>
            ))
        )

    }
    render() {
        //this is how to use the segmented tabs, anything you want to display on the weight screen goes in the if (this.state.selectedIndex == 0) { return,
        //anything you want on the progress bar goes in the  else if (this.state.selectedIndex == 1) {

        if (this.state.selectedIndex == 0) {
            return (
                //this is where you build the weight screen
                <ScrollView>
                    <View style={styles.container}  >

                        <SegmentedControlTab
                            values={["Weight", "Measurement"]}
                            selectedIndex={this.state.selectedIndex}
                            onTabPress={this.handleIndexChange}

                            allowFontScaling={false}
                            tabsContainerStyle={segmented.tabsContainerStyle}
                            tabStyle={segmented.tabStyle}
                            firstTabStyle={segmented.firstTabStyle}
                            lastTabStyle={segmented.lastTabStyle}
                            tabTextStyle={segmented.tabTextStyle}
                            activeTabStyle={segmented.activeTabStyle}
                            activeTabTextStyle={segmented.activeTabTextStyle}
                        />
                        {this._renderWeightContent()}
                    </View>
                </ScrollView>
            )

        }
        else if (this.state.selectedIndex == 1) {
            return (
                <ScrollView>
                    <View style={styles.container}  >

                        <SegmentedControlTab
                            values={["Weight", "Measurement"]}
                            selectedIndex={this.state.selectedIndex}
                            onTabPress={this.handleIndexChange}

                            allowFontScaling={false}
                            tabsContainerStyle={segmented.tabsContainerStyle}
                            tabStyle={segmented.tabStyle}
                            firstTabStyle={segmented.firstTabStyle}
                            lastTabStyle={segmented.lastTabStyle}
                            tabTextStyle={segmented.tabTextStyle}
                            activeTabStyle={segmented.activeTabStyle}
                            activeTabTextStyle={segmented.activeTabTextStyle}
                        />
                        {this._renderMeasuermentsContent()}
                   </View>
                </ScrollView>

            )
        }
        else {
            return (
                <View>
                    <Text>Error</Text>
                </View>
            )
        }
    }


}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000000',
        paddingLeft: 16,
        paddingRight: 16
    },
})

const weight =StyleSheet.create({
    container:{
        flexDirection:'row',
        alignItems:'center',
        marginBottom: 8
    },
    date:{
        color:'#DDDEDE',
        fontSize: 20,
        marginTop:8
    },
    weight:{
        fontSize:22,
        color:'#347EFB',
    },

    progressContainer:{
        flexDirection:'row',
        flex:1,
    },
    progressText:{
        color:'#DDDEDE',
        opacity: 0.6
    },
    progressDifference:{
        color:'#347EFB'
    }

})

const measurement =StyleSheet.create({
    container:{
        flexDirection:'row',
        marginBottom: 8,
        flex:1,
        justifyContent:'space-between',
        alignItems: 'center'
    },
    entryContainer:{
        flexDirection:'row',
        marginBottom:8,
    },
    date:{
        color:'#DDDEDE',
        fontSize: 20,
        marginTop:8,
        marginBottom:8
    },
    content:{
        color:'#347EFB',
        fontSize:16
    },
})


//Segmented controls DONE******
const segmented = StyleSheet.create({
    tabsContainerStyle: {
        width: 250,
        alignSelf: 'center',
        marginTop: 16,
        marginBottom: 16,
    },
    tabStyle: {
        borderColor: '#636366',
        backgroundColor: '#1C1C1E'
    },
    tabTextStyle: {
        color: '#DDDEDE'
    },
    activeTabStyle: {
        backgroundColor: '#636366',
    },
    activeTabTextStyle: {
        color: '#DDDEDE'
    }
})
