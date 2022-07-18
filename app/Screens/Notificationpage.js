import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import {View, Dimensions,Text, TouchableOpacity, Image, StyleSheet, useWindowDimensions, FlatList, RefreshControl } from 'react-native';
import colors from '../config/colors.js';
import { auth, db } from '../config/config.js';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import DropShadow from "react-native-drop-shadow";


const Notificationpage = ({navigation}) => {

    //notifications
    const [isLoading, setIsLoading] = useState(false);
    const [notifications, setNotifications] = useState({});
    const [products, setProducts] = useState({});
    const [notifDocIds, setNotifDocIds] = useState({});
    const {width, height} = Dimensions.get('window');

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getNotifications();
        });
       return unsubscribe;
    }, [navigation]);

    
    const getAuction = async (docId) => {
        console.log(docId)
        const productRef = doc(db, 'auctions' , docId);
        const docSnap = await getDoc(productRef);
        return docSnap.data()
    }
    const onRefresh = () => {
        setTimeout(() => {
            getNotifications();
          }, 1000);
    }
    
    const leftActions = (index) => {
        return (
        <View style = {styles.leftAction}>
            <TouchableOpacity onPress = { () => {
                deleteNotif(index)
            }
            } >
            <Text style = {styles.actionText} >Clear</Text>
            </TouchableOpacity>
        </View>
        )
    };

    const getHours = (createdAt) => {
        const createdAtMoment = moment(createdAt , 'DD/MM/YYYY, HH:mm:ss')
        const currMoment = moment(moment().tz('Singapore').format('DD/MM/YYYY, HH:mm:ss'), 'DD/MM/YYYY, HH:mm:ss')
        var hoursDiff = moment.duration(currMoment.diff(createdAtMoment)).asHours();
        console.log(hoursDiff)
        if (hoursDiff < 1) {
            return Math.floor(hoursDiff*60) + " mins ago"
        }
        else {
            return Math.floor(hoursDiff) + " hours ago"
        }
    }
    const deleteNotif = async (id) => {
        
       await deleteDoc(doc(db ,'notifications', notifDocIds[id]))
       .then( succ => {
            delete products[id];

            setNotifications(notifications.filter(item => item.index !== id))
       })
       .catch( err => alert(err.message))
    }
    const getNotifications = async () => {
    // Firestore setup
    const notifRef = collection(db, 'notifications');
    let searchQry =  query(notifRef, where('userId', '==', auth.currentUser.uid), orderBy("createdAt"));
    let documentSnapshots = await getDocs(searchQry);
    let notif = []
    let prods = {}
    let docId = {}
    for (let i = 0; i < documentSnapshots.docs.length; i++) {
        notif.push(documentSnapshots.docs[i].data());
        docId[documentSnapshots.docs[i].data().index] = documentSnapshots.docs[i].id
        let product = await getAuction(documentSnapshots.docs[i].data().auctionDocId)
        prods[documentSnapshots.docs[i].data().index] = product;
       // console.log(newProducts);
    }
    setNotifDocIds(docId)
    setProducts(prods)
    setNotifications(notif.reverse());

    }
    return (
        <FlatList
          style={styles.root}
          data = {notifications}

          ItemSeparatorComponent={() => {
            return (
              <View style={styles.separator}/>
            )
          }}
          onEndReachedThreshold={0.1}
          refreshControl = {
            <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh} />
        }
          keyExtractor={(item)=>{
            return item.index
          }}
          renderItem={(item) => {
            const notification = item.item;
            const auctionObject = products[notification.index]
            const hoursBefore = getHours(notification.createdAt)
            let mainContentStyle = styles.mainContent;
  
            return(
            
              <View style={styles.container}>
                <View style={styles.content}>
                <TouchableOpacity onPress= { () => {
                if (auctionObject.leadBuyerId == auth.currentUser.uid || auctionObject.product.ownerId == auth.currentUser.uid) {
                navigation.navigate("ExchangeContact" ,{auctionId: auctionObject.auctionId});
                } else {
                    console.log("Not Elegible")
                }
              }
                }>
                <DropShadow style={styles.shadowProp}>
                <Swipeable renderRightActions={ () => leftActions(notification.index)}>
                  <View style={mainContentStyle}>
                    <View >
                      <Text style={styles.name}>{auctionObject.product.name} by {auctionObject.anomName} </Text>
                      <Text style={styles.text}>{notification.message}</Text>
                    </View>
                    <Text style={styles.timeAgo}>
                      {hoursBefore}
                    </Text>
                  </View>
                  </ Swipeable>
                  </DropShadow>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}/>
      );
}

const styles = StyleSheet.create({
    root: {
      backgroundColor: "#FFFFFF"
    },
    container: {
      padding: 16,
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: "#FFFFFF",
      alignItems: 'flex-start'
    },
    avatar: {
      width:50,
      height:50,
      borderRadius:25,
    },
    text: {
      color: '#fff',
      marginBottom: 5,
      flexDirection: 'row',
      flexWrap:'wrap',
      
    },
    content: {
      flex: 1,
      marginLeft: 16,
      marginRight: 0,
    },
    mainContent: {
      marginRight: 10,
      backgroundColor: '#744100',
      padding: 20,
      borderRadius: 30,
    },
    img: {
      height: 50,
      width: 50,
      margin: 0
    },
    attachment: {
      position: 'absolute',
      right: 0,
      height: 50,
      width: 50
    },
    separator: {
      height: 1,
      backgroundColor: "#CCCCCC"
    },
    timeAgo:{
      fontSize:12,
      color:"#696969"
    },
    name:{
      color:"#fff",
      fontSize:16,
      fontWeight: 'bold',
    },
    leftAction: {
        backgroundColor: "#F47174",
        justifyContent: 'center',
        borderRadius: 30,
    },
    actionText: {
        color: '#fff',
        fontWeight: '600',
        padding: 20, 
    },
    shadowProp: {
        shadowColor: '#171717',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.4,
        shadowRadius: 2,
      }
  }); 

export default Notificationpage;