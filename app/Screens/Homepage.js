import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, FlatList, ActivityIndicator, RefreshControl} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import colors from '../config/colors.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { collection, query, orderBy, startAfter, limit, getDocs, getFirestore, startAt, endAt, where} from "firebase/firestore"; 
import { auth,db } from '../config/config.js';
import { async } from '@firebase/util';
import {FilterContext} from './MainContainer.js';


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

const Homepage = ({route, navigation}) => {

    let onEndReachedCalledDuringMomentum = false;
    //check filter storage
    const filterchecker = React.useContext(FilterContext);
    var uniSelected = [];
    var catSelected = [];
    var priceSelected = [];

    if (filterchecker) {
        uniSelected = filterchecker.uniSelectedarray;
        catSelected = filterchecker.catSelectedarray;
        priceSelected = filterchecker.priceSelectedarray;
    }

    console.log(uniSelected, 'HI');
    console.log(catSelected, 'HIasd');
    console.log(priceSelected, 'HI');
    // initialise state 
    var defaultfirst = null;
    var defaultlast = null;
    var filterunifirst = null;
    var filterunilast = null;
    var filtercatfirst = null;
    var filtercatlast = null;
    var filterpricefirst = null;
    var filterpricelast = null;

    //initialise state hook
    const [isLoading, setIsLoading] = useState(false);
    const [isMoreLoading, setIsMoreLoading] = useState(false);
    const [lastDoc, setLastDoc] = useState(null); //contain last document of snapshot, will be used to get more product data
    const [products, setProducts] = useState([]);

    //Search Bar
    const [search, setSearch] = useState('');

    // Firestore setup
    const db = getFirestore();
    const productsRef = collection(db, 'auctions');

    //Retrieval by search field
    const searchnamefirst = query(productsRef, orderBy("product.name"), where('product.name', '>=', search), where('product.name', '<=', search + '\uf8ff'), limit(3));
    const searchnamelast = query(productsRef, orderBy("product.name"), where('product.name', '>=', search), where('product.name', '<=', search + '\uf8ff'), startAfter(lastDoc), limit(3));

    // //Retrieval by Filter uni
    if (filterchecker && uniSelected.length) {
    filterunifirst = query(productsRef,  orderBy("product.originUni"), where('product.originUni', 'in', uniSelected), limit(3));
    filterunilast = query(productsRef,  orderBy("product.originUni"), where('product.originUni', 'in', uniSelected), startAfter(lastDoc), limit(3));
    }
    //Retrieval by Filter categories
    else if (filterchecker && catSelected.length) {
    filtercatfirst = query(productsRef,  orderBy("product.category"), where('product.category', 'in', catSelected), limit(3));
    filtercatlast = query(productsRef,  orderBy("product.category"), where('product.category', 'in', catSelected), startAfter(lastDoc), limit(3));
    }
    //Retrieval by Filter price range
    else if (filterchecker && !(priceSelected[0] == 0 && priceSelected[1] == 500000)) {
    filterpricefirst = query(productsRef, orderBy("currPrice"), where('currPrice', '>=', priceSelected[0]), where('currPrice', '<=', priceSelected[1]), limit(3));
    filterpricelast = query(productsRef, orderBy("currPrice"), where('currPrice', '>=', priceSelected[0]), where('currPrice', '<=', priceSelected[1]), startAfter(lastDoc), limit(3));
    }
    else {
    //Retrieval by Default 
    defaultfirst = query(productsRef, orderBy("auctionId", "desc"), limit(3));
    defaultlast = query(productsRef, orderBy("auctionId", "desc"), startAfter(lastDoc), limit(3));
    }

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        setIsLoading(true);
    // Query the first page of docs

    if (!search == '') {
        var first = searchnamefirst;
    }
    
    else {
        var first = defaultfirst;
    }
    
    const documentSnapshots = await getDocs(first);

    // Get the last visible document
    const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
    //console.log("last", lastVisible);

        if (!documentSnapshots.empty) {
            let newProducts = [];

            setLastDoc(lastVisible);

            for (let i = 0; i < documentSnapshots.docs.length; i++) {
                newProducts.push(documentSnapshots.docs[i].data());
               // console.log(newProducts);
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
        
    if (!search == '') {
        var next = searchnamelast;
    }
    else {
        var next = defaultlast;
    }  
        
    const documentSnapshots = await getDocs(next);

        if (!documentSnapshots.empty) {
            let newProducts = products;
             // Get the last visible document
            const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
            setLastDoc(lastVisible);

            for (let i = 0; i < documentSnapshots.docs.length; i++) {
                newProducts.push(documentSnapshots.docs[i].data());
                //console.log(newProducts);
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

    const renderList = ({anomName, currPrice, product, createdAt, isNew}) => {
        return (
            <View style = {styles.list}>
                <Image source = {null} style = {styles.listImage} />
                <View style = {styles.listingContainer}>
                    <View style = {styles.container}>
                        <Text style= {styles.name}>{product.name}</Text>
                    </View>
                </View>
                <View style = {styles.descriptionContainer}>
                    <Text style = {styles.description}>Description:</Text>
                    <Text style = {styles.descriptiontext}>{product.description}</Text>
                </View>
                <View style = {{flexDirection: 'row',  alignItems: 'center', justifyContent: 'space-between'}}>
                    <View>
                        <View style = {styles.currentpriceContainer}>
                            <Text style = {styles.dollarsign}>$</Text>
                            <Text style = {styles.currentprice}>{currPrice}</Text>
                            <Ionicons style={styles.lockIcon} name={'caret-up-circle-outline'} size={27} color={colors.red} />
                        </View>
                        <View style = {styles.selleranonymouscontainer}>
                            <Text style = {styles.selleranonymous}>{anomName}</Text>
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
                            {product.activeDays} Days
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
            <View style = {styles.searchandfilter}>
            <TextInput style = {styles.searchinput}
                 placeholder='Search for Products' 
                 placeholderTextColor={colors.white}
                 value = {search}  
                 onChangeText={(value) => setSearch(value)}
                 />
            <TouchableOpacity style = {styles.customsearchBtnBG}
             onPress={() =>
              {
                if (search == '') {
                    alert("Search Field is empty!");
                } else {
                    onRefresh();
                }
                }}>
                <Text style ={styles.customsearchBtnText}>Search</Text>
            </TouchableOpacity>
            <TouchableOpacity style = {styles.customfilterBtnBG}
             onPress={() =>
              {
                navigation.navigate("Filter");
              }
                }>
            <Ionicons style={styles.filterIcon} name={'filter-outline'} size={24} color={colors.white} />
            </TouchableOpacity>
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
                renderItem={({item}) => renderList(item)} />
            </View>
        </View>
        
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    header: {
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
      },

    logo: {
        width: 250,
        height: 250,
        marginTop: -30,
    },

    searchandfilter : {
        flexDirection: 'row',
        marginTop: -70,
        alignItems: 'center',
        justifyContent: 'center',
    },

    searchinput: {
        backgroundColor: colors.darkbrown,
        width: '60%',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 20,
  
        color: colors.white,
        
    },

    customsearchBtnText: {
        fontSize: 14,
        fontFamily: 'Montserrat-Black',
        color: colors.white,
        textAlign: "center",
    },

    customsearchBtnBG: {
        width: '20%',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 20,
        backgroundColor: colors.activeday,
    },


    customfilterBtnBG: {
        width: '10%',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 16,
        backgroundColor: colors.gold,
    },

    title: {
        fontSize: 20,
        color: colors.darkbrown,
        fontFamily: "Montserrat-Black",
        marginTop: 20
    
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