import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import moment from 'moment-timezone';
import React, { useState, useEffect } from 'react';
import {View, Dimensions,Text, TouchableOpacity, Image, StyleSheet, useWindowDimensions, FlatList, RefreshControl, ActivityIndicatorBase } from 'react-native';
import colors from '../config/colors.js';
import { auth, db } from '../config/config.js';
import Swipeable from 'react-native-gesture-handler/Swipeable';


const Notificationpage = ({navigation}) => {

    //notifications
    const [isLoading, setIsLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);
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
    
    const leftActions = (id) => {
        return (
        <View style = {styles.leftAction}>
            <TouchableOpacity onPress = { () => {
                deleteNotif(id)
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

            setNotifications(notifications.filter(item => item.notificationId !== id))
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
        docId[documentSnapshots.docs[i].data().notificationId] = documentSnapshots.docs[i].id
        let product = await getAuction(documentSnapshots.docs[i].data().auctionDocId)
        prods[documentSnapshots.docs[i].data().notificationId] = product;
       // console.log(newProducts);
    }
    setNotifDocIds(docId)
    setProducts(prods)
    setNotifications(notif.reverse());
    console.log(notif)

    }

    const alertemptylist = () => {
      return (
          <View>
              <Text style = {styles.alertnotice}>There are currently no notifications received.</Text>
          </View>
      )
    }

    return (
        <FlatList
          style={styles.root}
          data = {notifications}
          ListEmptyComponent={alertemptylist}

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
            // return item.index -> can't use index because key need to be unique and may have multiple index. Will result in key error 
            return item.notificationId
          }}
          renderItem={(item) => {
            const notification = item.item;
            const auctionObject = products[notification.notificationId]
            const hoursBefore = getHours(notification.createdAt)
            let mainContentStyle = styles.mainContent;
  
            return(
            
              <View style={styles.container}>
                <View style={styles.content}>
                <TouchableOpacity onPress= { () => {
                if (auctionObject) {
                  // if product is not ongoing (either buyer buyout or seller accept bid)
                  if ((auctionObject.leadBuyerId == auth.currentUser.uid || auctionObject.product.ownerId == auth.currentUser.uid) && !auctionObject.ongoing) {
                    navigation.navigate("ExchangeContact" ,{auctionId: auctionObject.auctionId});
                  }
                  // if product is ongoing and I am the owner
                  else if (auctionObject.ongoing && auctionObject.product.ownerId == auth.currentUser.uid) {
                    navigation.navigate("SellerBid" ,{auctionId: auctionObject.auctionId});
                  } 
                  // if product is ongoing and I am a bidder
                  else if (auctionObject.ongoing && auctionObject.leadBuyerId == auth.currentUser.uid)
                  {
                    navigation.navigate("BuyerBid" ,{auctionId: auctionObject.auctionId});
                  }
                  else {
                      console.log("Not Applicable.")
                  }
                }
              }
                }>
                <Swipeable renderRightActions={ () => leftActions(notification.notificationId)}>
                  <View style={mainContentStyle}>
                    <View >
                      <Text style={styles.name}>{auctionObject ? auctionObject.product.name : 'Item is deleted'} by {auctionObject ? 'Anonymous User' : 'Seller'} </Text>
                      <Text style={styles.text}>{notification.message}</Text>
                    </View>
                    <Text style={styles.timeAgo}>
                      {hoursBefore}
                    </Text>
                  </View>
                  </ Swipeable>
                 
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}/>
      );
}

const styles = StyleSheet.create({
    root: {
      backgroundColor: colors.white,
    },
    container: {
      width: '90%',
      padding: 5,
      flexDirection: 'row',
      borderColor: colors.white,
      alignSelf: 'center',
    },
    avatar: {
      width:50,
      height:50,
      borderRadius:25,
    },
    text: {
      color: colors.white,
      marginVertical: 5,
      flexDirection: 'row',
      flexWrap:'wrap',
      
    },
    content: {
      flex: 1,
    },
    mainContent: {
      backgroundColor: colors.brown,
      padding: 20,
      borderRadius: 30,
    },
    img: {
      height: 50,
      width: 50,
    },
    attachment: {
      position: 'absolute',
      right: 0,
      height: 50,
      width: 50
    },
    separator: {
      backgroundColor: "#CCCCCC"
    },

    timeAgo:{
      fontSize:12,
      color: colors.gold,
    },
    
    name:{
      color: colors.white,
      fontSize:16,
      fontWeight: 'bold',
    },
    leftAction: {
        backgroundColor: colors.red,
        justifyContent: 'center',
        borderRadius: 30,
        marginLeft: 10,
    },
    actionText: {
        color: colors.white,
        fontWeight: '600',
        padding: 20, 
    },
    shadowProp: {
        shadowColor: '#171717',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.4,
        shadowRadius: 2,
      },

      alertnotice :{
        color: colors.red,
        fontFamily: 'Montserrat-Black',
        textAlign: 'center',
        marginTop: 20,
     },
  }); 

export default Notificationpage;