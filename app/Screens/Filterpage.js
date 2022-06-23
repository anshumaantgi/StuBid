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
  
//Store selectedoptions in array
    var uniSelectedarray = [];
    var catSelectedarray = [];
    var priceSelectedarray = [];

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
  const [multiSliderValue, setMultiSliderValue] = useState([0, 500000]);
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
                 uniSelectedarray = [];
                } catch (err) {
                  alert(err.message);
                }
                }}>
                    <Text style ={styles.customclearBtnText}>Clear</Text>
                </TouchableOpacity>
             </View>
             <CheckBox
                onPress={() => setNus(!nus)}
                title="National University of Singapore (NUS)"
                isChecked={nus}
              />
              <CheckBox
                onPress={() => setNtu(!ntu)}
                title="Nanyang Technological University (NTU)"
                isChecked={ntu}
              />
              <CheckBox
                onPress={() => setSmu(!smu)}
                title="Singapore Management University (SMU)"
                isChecked={smu}
              />
              <CheckBox
                onPress={() => setSit(!sit)}
                title="Singapore Institute of Technology (SIT)"
                isChecked={sit}
              />
              <CheckBox
                onPress={() => setSutd(!sutd)}
                title="Singapore University of Technology & Design (SUTD)"
                isChecked={sutd}
              />
              <CheckBox
                onPress={() => setSuss(!suss)}
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
                    catSelectedarray = [];
                } catch (err) {
                  alert(err.message);
                }
                }}>
                    <Text style ={styles.customclearBtnText}>Clear</Text>
                </TouchableOpacity>
             </View>
             <CheckBox
                onPress={() => setCA(!CA)}
                title="Clothing & Accessories"
                isChecked={CA}
              />
              <CheckBox
                onPress={() => setELE(!ELE)}
                title="Electronics"
                isChecked={ELE}
              />
              <CheckBox
                onPress={() => setENT(!ENT)}
                title="Entertainment"
                isChecked={ENT}
              />
              <CheckBox
                onPress={() => setHB(!HB)}
                title="Hobbies"
                isChecked={HB}
              />
              <CheckBox
                onPress={() => setHG(!HG)}
                title="Home & Garden"
                isChecked={HG}
              />
              <CheckBox
                onPress={() => setHR(!HR)}
                title="Housing (Rental)"
                isChecked={HR}
              />
              <CheckBox
                onPress={() => setVEH(!VEH)}
                title="Vehicles"
                isChecked={VEH}
              />
              <CheckBox
                onPress={() => setOTH(!OTH)}
                title="Others"
                isChecked={OTH}
              />
             <View style = {styles.header}>
             <Text style={styles.title}>Price</Text>
             <TouchableOpacity style = {styles.customclearBtnBG} onPress={() => {
                try  {
                    setMultiSliderValue([0, 500000]);
                    priceSelectedarray = [];

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
                min={0}
                max={10000}
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

                if (nus) {
                    uniSelectedarray.push('NUS');
                } 
                if (ntu) {
                    uniSelectedarray.push('NTU');
                }
                if (smu) {
                    uniSelectedarray.push('SMU');
                }
                if (sit) {
                    uniSelectedarray.push('SIT');
                }
                if (sutd) {
                    uniSelectedarray.push('SUTD');
                }
                if (suss) {
                    uniSelectedarray.push('SUSS');
                }
                if (CA) {
                    catSelectedarray.push('CA');
                }
                if (ELE) {
                    catSelectedarray.push('ELE');
                }
                if (ENT) {
                    catSelectedarray.push('ENT');
                }
                if (HB) {
                    catSelectedarray.push('HB');
                }
                if (HG) {
                    catSelectedarray.push('HG');
                }
                if (HR) {
                    catSelectedarray.push('HR');
                }
                if (VEH) {
                    catSelectedarray.push('VEH');
                }
                if (OTH) {
                    catSelectedarray.push('OTH');
                }
                priceSelectedarray.push(multiSliderValue[0]);
                priceSelectedarray.push(multiSliderValue[1]);

                console.log(uniSelectedarray);
                console.log(catSelectedarray);
                console.log(priceSelectedarray);
             
                navigation.replace( "MainContainer", {uniSelectedarray, catSelectedarray, priceSelectedarray});

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