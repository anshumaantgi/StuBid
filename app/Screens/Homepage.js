import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, FlatList, ActivityIndicator, RefreshControl} from 'react-native';
import colors from '../config/colors.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { collection, query, orderBy, startAfter, limit, getDocs, getFirestore} from "firebase/firestore"; 

import { auth,db } from '../config/config.js';
import { async } from '@firebase/util';
import { Inter_500Medium } from '@expo-google-fonts/inter';


// const productitem = [

//     {
//         id : 1,
//         name: 'dog',
//         photo: require('../assets/StuBid-Logo-Original-ver.png'),
//         description: 'dogddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss',
//         anonymous_owner: 'anonymous_tiger',
//         current_price: 100,
//         active_days: 3,
//         date_published: "23/6/2022",
//         isNew: true,
//     },

//     {
//         id : 2,
//         name: 'cat',
//         photo: require('../assets/StuBid-Logo-Original-ver.png'),
//         description: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
//         anonymous_owner: 'anonymous_cat',
//         current_price: 120,
//         active_days: 7,
//         date_published: "23/1/2022",
//         isNew: true,
//     },

//     {
//         id : 3,
//         name: 'cow',
//         photo: require('../assets/StuBid-Logo-Original-ver.png'),
//         description: 'quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam',
//         anonymous_owner: 'anonymous_cow',
//         current_price: 222,
//         active_days: 1,
//         date_published: "23/1/2022",
//         isNew: true,
//     },

//     {
//         id : 4,
//         name: 'goat',
//         photo: require('../assets/StuBid-Logo-Original-ver.png'),
//         description: 'goat photo',
//         anonymous_owner: 'anonymous_goat',
//         current_price: 444,
//         active_days: 10,
//         date_published: "23/1/2022",
//         isNew: false,
//     },

//     {
//         id : 5,
//         name: 'dragon',
//         photo: require('../assets/StuBid-Logo-Original-ver.png'),
//         description: 'dragon photo',
//         anonymous_owner: 'anonymous_dragon',
//         current_price: 999,
//         active_days: 5,
//         date_published: "23/1/2022",
//         isNew: false,
//     },

//     {
//         id : 6,
//         name: 'bacon',
//         photo: require('../assets/StuBid-Logo-Original-ver.png'),
//         description: 'bacon photo',
//         anonymous_owner: 'anonymous_bacon',
//         current_price: 77,
//         active_days: 7,
//         date_published: "23/1/2022",
//         isNew: false,
//     },
// ];

const Homepage = ({navigation}) => {

    let onEndReachedCalledDuringMomentum = false;

    const [isLoading, setIsLoading] = useState(false);
    const [isMoreLoading, setIsMoreLoading] = useState(false);
    const [lastDoc, setLastDoc] = useState(null); //contain last document of snapshot, will be used to get more product data
    const [products, setProducts] = useState([]);
    const [url,setUrl] = useState();
     const db = getFirestore();
     const productsRef = collection(db, 'auctions');
    

    useEffect(() => {
        getProducts();
    }, []);

    
    const getProducts = async () => {
        setIsLoading(true);

        // Query the first page of docs
    const first = query(productsRef, orderBy("auctionId"), limit(3));
    const documentSnapshots = await getDocs(first);

    // Get the last visible document
    const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
   // console.log("last", lastVisible);

        if (!documentSnapshots.empty) {
            let newProducts = [];

            setLastDoc(lastVisible);
            
            for (let i = 0; i < documentSnapshots.docs.length; i++) {
                // Check is the prduct is sold by current user
                // Each Auction collection will have array Bids
                // For each prduct , it will retrieve the the bids anf check if bid owner is current user 
                newProducts.push(documentSnapshots.docs[i].data());
        }
            setProducts(newProducts);
        } else {
            setLastDoc(null);
        }

        setIsLoading(false);
    }

    const getMore = async () => {
        if (lastDoc) {
            setIsMoreLoading(true);
        
        setTimeout(async () => {
        // Construct a new query starting at this document,
        // get the next 25 cities.
        const next = query(collection(db, "products"), orderBy("auctionId"), startAfter(lastDoc), limit(3));
        const documentSnapshots = await getDocs(next);

        if (!documentSnapshots.empty) {
            let newProducts = products;
             // Get the last visible document , Bidder , Seller or Viewer
            const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
            setLastDoc(lastVisible);

            for (let i = 0; i < documentSnapshots.docs.length; i++) {
                newProducts.push(documentSnapshots.docs[i].data());
                
                // Is it Ongoing 
                // Check is the prduct is sold by current user
                // Each Auction collection will have array Bid
            }
            setProducts(newProducts);
            if (documentSnapshots.docs.length < 3) {
                setLastDoc(null);
            }
        } else {
            setLastDoc(null);
        }
        setIsMoreLoading(false);
    }, 1000);

}
    onEndReachedCalledDuringMomentum = true;

    }

    const renderList = ({name, photo, description, anonymous_owner, current_price, activeDays, createdAt, isNew}) => {
        return (
            <View style = {styles.list}>
                <Image source = {{uri:photo}} 
                style = {styles.listImage} />
                <View style = {styles.listingContainer}>
                    <View style = {styles.container}>
                        <Text style= {styles.name}>{name}</Text>
                    </View>
                </View>
                <View style = {styles.descriptionContainer}>
                    <Text style = {styles.description}>Description:</Text>
                    <Text style = {styles.descriptiontext}>{description}</Text>
                </View>
                <View style = {{flexDirection: 'row',  alignItems: 'center', justifyContent: 'space-between'}}>
                    <View>
                        <View style = {styles.currentpriceContainer}>
                            <Text style = {styles.dollarsign}>$</Text>
                            <Text style = {styles.currentprice}>{current_price}</Text>
                            <Ionicons style={styles.lockIcon} name={'caret-up-circle-outline'} size={27} color={colors.red} />
                        </View>
                        <View style = {styles.selleranonymouscontainer}>
                            <Text style = {styles.selleranonymous}>{anonymous_owner}</Text>
                        </View>
                        <View style = {styles.date_publishedcontainer}>
                            <Text style = {styles.date_published}>{createdAt}</Text>
                        </View>
                    </View>
                    <View style = {styles.activedaycontainer}>
                        <Text style = {styles.activeday}>
                            Bid Ending in:
                        </Text>
                        <Text style = {styles.activedaytext}>
                            {activeDays} Days
                        </Text>
                    </View>
                    <View style = {styles.bidcontainer}>
                        <TouchableOpacity style = {styles.customBtnBG} onPress={() => {
                            alert("Place a Bid")
                            }}>
                            <Text style ={styles.customBtnText}>Place a Bid</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    const renderFooter = () => {
        if (!isMoreLoading) return true;
        return (
            <ActivityIndicator size = "large" color = "#4D330C" style={{ marginBottom: 10 }}/>
        )
    }

    const onRefresh = () => {
        setTimeout(() => {
            getProducts();
          }, 1000);
    }

    return (
        <View style={styles.container}>
            <View style = {styles.header}>
              <Image style = {styles.logo} source = {require('../assets/StuBid-Logo-Original-ver.png')} resizeMode = "contain" /> 
            </View>
            <View style={styles.container}>
            <Text style = {styles.title}>   Recent Aunction</Text>
            <FlatList 
                contentContainerStyle={{ paddingBottom: 70 }}
                ListFooterComponent={renderFooter}
                refreshControl = {
                    <RefreshControl
                    refreshing={isLoading}
                    onRefresh={onRefresh} />
                }
                initialNumToRender = {3}
                onEndReachedThreshold={0.1}
                onMomentumScrollBegin = {() => {onEndReachedCalledDuringMomentum = false}}
                onEndReached = {() => {
                    if (!onEndReachedCalledDuringMomentum && !isMoreLoading) {
                        getMore();
                    }
                }}
                data={products}
                keyExtractor={item =>  item.auctionId.toString()}
                renderItem={({item}) => {
                    const render = { name: item.product.name
                        , photo: item.product.pictureUri, 
                        description: item.product.description, 
                        anonymous_owner: item.anomName, 
                        current_price: item.currPrice, 
                        activeDays:item.product.activeDays, 
                        createdAt: item.createdAt}
                    return renderList(render);
                }} />

            </View>
        </View>
        
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    header: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
      },

    logo: {
        width: 250,
        height: 250,
        marginTop: -30,
    },

    title: {
        fontSize: 20,
        color: colors.darkbrown,
        fontFamily: "Montserrat-Black",
        marginTop: -30,
    },

    list: {
        width: '100%',
        flexDirection: 'column',
        paddingHorizontal: 10,
        marginBottom: 20,
        borderWidth: 0.2,
        borderColor: colors.darkbrown,
        borderRadius: 15,
    },

    listImage: {
        width: '100%',
        height: 300,
    },

    listingContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },

    name: {
        fontWeight: 'bold',
        fontSize: 25,
        color: colors.darkbrown,
    },

    descriptionContainer: {
        color: colors.darkbrown,
        alignItems: 'top',
        height: 55,
        borderWidth: 0.2,
        borderStyle: 'dashed',
    },

    description: {
        fontSize: 12,
        color: colors.darkbrown,
    },

    descriptiontext: {
        fontSize: 12,
        color: colors.textinput,
    },

    currentpriceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    currentprice: {
        color: colors.orange,
        fontWeight: 'bold',
        fontSize: 25,
    },

    dollarsign: {
        color: colors.orange,
        fontWeight: 'bold',
        fontSize: 25,
    },

    selleranonymouscontainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    selleranonymous : {
        color: colors.darkbrown,
        fontSize: 15,
    },

    date_published : {
        color: colors.darkbrown,
        fontSize: 15,
    },

    customBtnText: {
        fontSize: 12,
        fontFamily: 'Montserrat-Black',
        color: colors.white,
        textAlign: "center",
    },

    customBtnBG: {
        backgroundColor: colors.black,
        padding: 15,
        borderRadius: 50,
    },

    bidcontainer: {
        alignItems: 'center',
        justifyCOntent: 'space-between',
    },

    activedaycontainer: {
        backgroundColor: colors.activeday,
        padding: 5,
        borderRadius: 5,
    },

    activeday: {
        fontWeight: 'bold',
        color: colors.white,
        textAlign: 'center',
    },

    activedaytext: {
        fontWeight: 'bold',
        color: colors.white,
        textAlign: 'center',
    },
})

export default Homepage;