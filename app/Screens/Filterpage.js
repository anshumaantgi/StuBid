import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Dimensions} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../config/colors.js';
import CheckBox from '../config/CheckBox.js';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { ScrollView } from 'react-native-gesture-handler';


const Filterpage = ({navigation}) => {

  //width of screen
  const windowWidth = Dimensions.get('window').width;

  // Set startfilterprice and endfilterprice
  var startfilterprice = 0;
  var endfilterprice = 50000;

  // store filter values
  var unifilter = '';
  var catfilter = '';
  var pricefilterarray = [];

  // initize the state hook

  //Universities
  const [nus, setNus] = useState(false);
  const [ntu, setNtu] = useState(false);
  const [smu, setSmu] = useState(false);
  const [sit, setSit] = useState(false);
  const [sutd, setSutd] = useState(false);
  const [suss, setSuss] = useState(false);

  //Categories
  const [CA, setCA] = useState(false);
  const [ELE, setELE] = useState(false);
  const [ENT, setENT] = useState(false);
  const [HB, setHB] = useState(false);
  const [HG, setHG] = useState(false);
  const [HR, setHR] = useState(false);
  const [VEH, setVEH] = useState(false);
  const [OTH, setOTH] = useState(false);

  //Price range
  const [multiSliderValue, setMultiSliderValue] = useState([startfilterprice, endfilterprice]);
  const multiSliderValuesChange = (values) => setMultiSliderValue(values);
  

    return (
        <ScrollView>
        <View style={styles.container}>
             <View style = {styles.header}>
                <Text style={styles.title}>Universities</Text>
                <TouchableOpacity style = {styles.customclearBtnBG} onPress={() => {
                try  {
                 setNus(false);
                 setNtu(false);
                 setSmu(false);
                 setSit(false);
                 setSutd(false);
                 setSuss(false);
                } catch (err) {
                  alert(err.message);
                }
                }}>
                    <Text style ={styles.customclearBtnText}>Clear</Text>
                </TouchableOpacity>
             </View>
             <CheckBox
                onPress={() =>
                  { 
                  setNus(true)
                  setNtu(false)
                  setSmu(false)
                  setSit(false)
                  setSutd(false)
                  setSuss(false)
                  }
                }
                title="National University of Singapore (NUS)"
                isChecked={nus}
              />
              <CheckBox
                onPress={() =>
                   {
                    setNus(false)
                    setNtu(true)
                    setSmu(false)
                    setSit(false)
                    setSutd(false)
                    setSuss(false)
                   }}
                title="Nanyang Technological University (NTU)"
                isChecked={ntu}
              />
              <CheckBox
                onPress={() => 
                {
                  setNus(false)
                  setNtu(false)
                  setSmu(true)
                  setSit(false)
                  setSutd(false)
                  setSuss(false)
                }
              }
                title="Singapore Management University (SMU)"
                isChecked={smu}
              />
              <CheckBox
                onPress={() => 
                {
                  setNus(false)
                  setNtu(false)
                  setSmu(false)
                  setSit(true)
                  setSutd(false)
                  setSuss(false)
                }
              }
                title="Singapore Institute of Technology (SIT)"
                isChecked={sit}
              />
              <CheckBox
                onPress={() =>
                {
                  setNus(false)
                  setNtu(false)
                  setSmu(false)
                  setSit(false)
                  setSutd(true)
                  setSuss(false)
                }
              }
                title="Singapore University of Technology & Design (SUTD)"
                isChecked={sutd}
              />
              <CheckBox
                onPress={() => 
                {
                  setNus(false)
                  setNtu(false)
                  setSmu(false)
                  setSit(false)
                  setSutd(false)
                  setSuss(true)
                }
              }
                title="Singapore University of Social Sciences (SUSS)"
                isChecked={suss}
              />
             <View style = {styles.header}>
             <Text style={styles.title}>Categories</Text>
             <TouchableOpacity style = {styles.customclearBtnBG} onPress={() => {
                try  {
                    setCA(false);
                    setELE(false);
                    setENT(false);
                    setHB(false);
                    setHG(false);
                    setHR(false);
                    setVEH(false);
                    setOTH(false);
                } catch (err) {
                  alert(err.message);
                }
                }}>
                    <Text style ={styles.customclearBtnText}>Clear</Text>
                </TouchableOpacity>
             </View>
             <CheckBox
                onPress={() =>
                {
                    setCA(true)
                    setELE(false)
                    setENT(false)
                    setHB(false)
                    setHG(false)
                    setHR(false)
                    setVEH(false)
                    setOTH(false)
                }
              }
                title="Clothing & Accessories"
                isChecked={CA}
              />
              <CheckBox
                onPress={() => 
                {
                    setCA(false)
                    setELE(true)
                    setENT(false)
                    setHB(false)
                    setHG(false)
                    setHR(false)
                    setVEH(false)
                    setOTH(false)
                }
              }
                title="Electronics"
                isChecked={ELE}
              />
              <CheckBox
                onPress={() => 
                {
                    setCA(false)
                    setELE(false)
                    setENT(true)
                    setHB(false)
                    setHG(false)
                    setHR(false)
                    setVEH(false)
                    setOTH(false)
                }
              }
                title="Entertainment"
                isChecked={ENT}
              />
              <CheckBox
                onPress={() => {
                    setCA(false)
                    setELE(false)
                    setENT(false)
                    setHB(true)
                    setHG(false)
                    setHR(false)
                    setVEH(false)
                    setOTH(false)
                }
              }
                title="Hobbies"
                isChecked={HB}
              />
              <CheckBox
                onPress={() => 
                {
                    setCA(false)
                    setELE(false)
                    setENT(false)
                    setHB(false)
                    setHG(true)
                    setHR(false)
                    setVEH(false)
                    setOTH(false)
                }
              }
                title="Home & Garden"
                isChecked={HG}
              />
              <CheckBox
                onPress={() =>
                {
                    setCA(false)
                    setELE(false)
                    setENT(false)
                    setHB(false)
                    setHG(false)
                    setHR(true)
                    setVEH(false)
                    setOTH(false)
                } 
              }
                title="Housing (Rental)"
                isChecked={HR}
              />
              <CheckBox
                onPress={() => 
                {
                    setCA(false)
                    setELE(false)
                    setENT(false)
                    setHB(false)
                    setHG(false)
                    setHR(false)
                    setVEH(true)
                    setOTH(false)
                }
              }
                title="Vehicles"
                isChecked={VEH}
              />
              <CheckBox
                onPress={() => 
                {
                    setCA(false)
                    setELE(false)
                    setENT(false)
                    setHB(false)
                    setHG(false)
                    setHR(false)
                    setVEH(false)
                    setOTH(true)
                }
              }
                title="Others"
                isChecked={OTH}
              />
             <View style = {styles.header}>
             <Text style={styles.title}>Price</Text>
             <TouchableOpacity style = {styles.customclearBtnBG} onPress={() => {
                try  {
                    setMultiSliderValue([startfilterprice, endfilterprice]);

                } catch (err) {
                  alert(err.message);
                }
                }}>
                    <Text style ={styles.customclearBtnText}>Reset</Text>
                </TouchableOpacity>
             </View>
            <Text style={styles.Pricetext}>Price Range:</Text>
            <Text style={styles.Pricerange}>${multiSliderValue[0]} - ${multiSliderValue[1]} </Text>
             <View style={styles.slider}>
             <MultiSlider
                values={[multiSliderValue[0], multiSliderValue[1]]}
                sliderLength={windowWidth - 80}
                onValuesChange={multiSliderValuesChange}
                min={startfilterprice}
                max={endfilterprice}
                step={1}
                trackStyle={{
                    height: 10,
                    backgroundColor: colors.gold,
                  }}
                  selectedStyle={{
                    backgroundColor: colors.darkbrown,
                  }}
                  unselectedStyle={{
                    backgroundColor: colors.gold,
                  }}
                  
                />
        
            </View>
            <Text style = {styles.text}>*Clear/Reset All fields and apply changes to revert back to default settings.</Text>
             <TouchableOpacity style = {styles.customBtnBG} onPress={() => {
                try  {
               
                // console.log(nus);
                // console.log(ntu);
                // console.log(smu);
                // console.log(sit);
                // console.log(sutd);
                // console.log(suss);
                // console.log(CA);
                // console.log(ELE);
                // console.log(ENT);
                // console.log(HB);
                // console.log(HG);
                // console.log(HR);
                // console.log(VEH);
                // console.log(OTH);
                // console.log(multiSliderValue[0]);
                // console.log(multiSliderValue[1]);
              
              //check uni
              if (nus) {
                unifilter = 'NUS';
              } 
              else if (ntu) {
                unifilter = 'NTU';
              }
              else if (smu) {
                unifilter = 'SMU';
              }
              else if (sit) {
                unifilter = 'SIT';
              }
              else if (sutd) {
                unifilter = 'SUTD';
              }
              else if (suss) {
                unifilter = 'SUSS';
              }

              //check category
              if (CA) {
                catfilter = 'CA';
              }
              else if (ELE) {
                catfilter = 'ELE';
              }
              else if (ENT) {
                catfilter = 'ENT';
              }
              else if (HB) {
                catfilter = 'HB';
              }
              else if (HG) {
                catfilter = 'HG';
              }
              else if (HR) {
                catfilter = 'HR';
              }
              else if (VEH) {
                catfilter = 'VEH';
              }
              else if (OTH) {
                catfilter = 'OTH';
              }

              pricefilterarray.push(multiSliderValue[0]);
              pricefilterarray.push(multiSliderValue[1]);

              // console.log(unifilter);
              // console.log(catfilter);
              // console.log(pricefilterarray);
             
              navigation.replace( "MainContainer", {unifilter, catfilter, pricefilterarray});

                } catch (err) {
                  alert(err.message);
                }
                
                }}>
                <Text style ={styles.customBtnText}>Apply Changes</Text>
            </TouchableOpacity>
        </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
      },

    header : {
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent: 'space-between',
    },
      
    title: {
      marginLeft: '5%',
      color: colors.darkbrown,
      textAlign: "left",
      fontFamily: "Montserrat-Black",
      fontSize: 16,
      marginVertical: 15,
    },

    text: {
      color: colors.darkbrown,
      fontSize: 10,
      width: '80%',
      alignSelf: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    },

    Pricetext: {
        marginLeft: '5%',
        color: colors.gold,
        textAlign: "left",
        fontFamily: "Montserrat-Black",
        fontSize: 14,
        marginVertical: 10,
    },

    Pricerange: {
        marginLeft: '5%',
        color: colors.darkbrown,
        textAlign: "left",
        fontFamily: "Montserrat-Black",
        fontSize: 14,
        marginVertical: 10,
    },

    customclearBtnText: {
        fontSize: 16,
        fontFamily: 'Montserrat-Black',
        color: colors.red,
        textAlign: "center",
    },

    customclearBtnBG: {
        marginRight: '5%',
        //width: '20%',
    },

    customBtnText: {
        fontSize: 24,
        fontFamily: 'Montserrat-Black',
        color: colors.white,
      },
  
      customBtnBG: {
        width: '80%',
        marginVertical: '5%',
        backgroundColor: colors.darkbrown,
        paddingVertical: 15,
        borderRadius: 5,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
      },

      slider: {
        marginLeft: 10,
        marginRight: 10,
        marginLeft: '7%',
      
      }

})

export default Filterpage;