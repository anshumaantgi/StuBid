import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, FlatList,ActivityIndicator, RefreshControl} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import colors from '../config/colors.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { collection, query, orderBy, getDoc, getDocs, getFirestore, doc, where, onSnapshot, updateDoc} from "firebase/firestore"; 
import { Rating, AirbnbRating } from 'react-native-ratings';


   
const ViewReviews = ({route, navigation}) => {

    //Set up Modal (Pop-up screen) when accept bid button is pressed, etc
    const [isModalVisible, setModalVisible] = useState(false);
     //Accept bid option toggle
     const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

     //reviewerId from previous screen
     const reviewerId = route.params.reviewerId;
     const reviewerName = route.params.reviewerName;

    //initialise state hook
    const [reviewdetails, setReviewdetails] = useState('');
    const [allRatings, setAllRatings] = useState([]);

    // Firestore setup
    const db = getFirestore();
    const reviewRef = collection(db, 'reviews');


    // Retrieve review details from firestore via AuctionId (Purpose is to check if user have done review yet)
    const getreviews = async() => {

        const q = query(reviewRef, where("receiverId", "==", reviewerId), orderBy("createdAt", "desc"));
    
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            //get average rating
            var reviewinfo = [];
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                //console.log(doc.id, " => ", doc.data());
                reviewinfo.push(doc.data().rating);
              });
              console.log(reviewinfo, "TEST");
              setAllRatings(reviewinfo);
              reviewinfo = [];

              //For flatlist display on each individual review
                if (!querySnapshot.empty) {
                    let newReview = [];
        
                    for (let i = 0; i < querySnapshot.docs.length; i++) {
                        newReview.push(querySnapshot.docs[i].data());
                       // console.log(newReview);
                    }
        
                    setReviewdetails(newReview);
                } else {
                    setReviewdetails([]);
                    //alert('There are currently no bids for this product.');
                }
                });
        }

    //Execute and get products, etc
    useEffect(() => {
        getreviews();
        return () => {
            setReviewdetails(''); // Reset changes
          };
        
    }, []);


    //render list from all buyer biddings (fields from figma prototype in "Current Bids")
    const renderList = ({rating, comment, itemName, pictureUri, createdAt}) => {
          
        return (
        <View style = {styles.overallReviewContainer}>
            <View style = {styles.productinfocontainter}>
                <Image source = {{uri : pictureUri}} style = {styles.image}/>
                <View>
                    <View style = {styles.itemName}>
                        <Text style = {styles.text}>Name of item : </Text>
                        <Text style = {styles.text}>{itemName}</Text>
                    </View>
                    <View style = {styles.dateofreview}>
                        <Text style = {styles.text}>Date of Review : </Text>
                        <Text style = {styles.text}>{createdAt}</Text>
                    </View>
                    <View style = {styles.ratingscore}>
                        <Text style = {styles.text}>Rating : </Text>
                        <Rating
                            ratingCount={5}
                            imageSize={15}
                            startingValue = {rating}
                            readonly = {true}
                            tintColor = {colors.brown}
                        />
                        <Text style = {styles.text}> {'(' + rating + '/5)'} </Text>
                    </View>
                </View>
            </View>
            <Text style = {styles.textcomment}>Comments :</Text>
             <TextInput style = {styles.commentbox} editable={false} multiline = {true} placeholder='Comment' placeholderTextColor={colors.white} value = {comment}/>
             <Text style = {styles.text}> Reviewed by : Anonymous User</Text>
        </View>
             
        )
    }

    const alertemptylist = () => {
        return (
            <View>
                <Text style = {styles.alertnotice}>There are currently no reviews for this user.</Text>
            </View>
        )
    }

    const getAverageRating = (allRatings) => {
        if (allRatings.length) {
            const totalScore = allRatings.reduce((a, b) => a + b, 0);
            const totalRating = allRatings.length * 5;
            const avgRatingScore = (totalScore/totalRating) * 5 ;

            console.log(avgRatingScore, "Average Rating Score");
            
            return avgRatingScore.toFixed(1) // 1 dp;
        }
        else {
            return 0;
        }
    }

    const ItemDivider = () => {
        return (
          <View
            style={{
              width: "80%",
              margin: 5,
              backgroundColor: colors.darkbrown,
            }}
          />
        );
      }

    return (
            <FlatList
                ListHeaderComponent =
                {reviewdetails &&
                    <View style={styles.container}>
                          <Text style = {styles.reviewerName}>Reviewee : {reviewerName}</Text>
                        <Text style = {styles.title}>Average Rating :</Text>
                        <View style = {styles.avgRatingBox}>
                            <Rating
                                ratingCount={5}
                                imageSize={30}
                                startingValue = {allRatings.length ? getAverageRating(allRatings): 0}
                                readonly = {true}
                            />
                            <Text style = {styles.avgRatingtext}> {allRatings.length ? '(' + getAverageRating(allRatings) + '/5)' : '(NA)'} </Text>
                        </View>
                        <View style = {styles.numberofreviewscontainer}>
                            <Text style = {styles.numberofreviews}>Number of Reviews : {allRatings.length}</Text>
                        </View>
                    </View>
                }

                ListFooterComponent =
                {reviewdetails && 
                    <View style={styles.container}>
                       <Text style = {styles.endofreview}>End of Review</Text>
                    </View>
                }

                ListEmptyComponent={alertemptylist}
                style = {styles.reviewContainer}
                contentContainerStyle={{ paddingBottom: 70}}
                data={reviewdetails}
                ItemSeparatorComponent={ItemDivider}
                keyExtractor={item =>  item.reviewId.toString()}
                renderItem={({item}) => renderList(item)}  />
                
             
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 20,
    },

    header: {
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
      },

    title: {
        fontSize: 20,
        color: colors.darkbrown,
        fontFamily: "Montserrat-Black",
        textAlign: 'center',
        marginTop: 20,
    
    },

    reviewerName : {
        fontSize: 20,
        color: colors.red,
        fontFamily: "Montserrat-Black",
        textAlign: 'center',
    },

    productinfocontainter : {
        flexDirection: 'row',
    },
    
    dateofreview : {
        flexDirection: 'row',
    },

    itemName : {
        flexDirection: 'row',
    },

    image : {
        width: 50,
        height: 50,
        marginRight: 5,
    },

    ratingscore : {
        flexDirection: 'row',
    },

    numberofreviews : {
        fontSize: 20,
        color: colors.black,
        textAlign: 'center',
        marginTop: 20,
    },

    commentbox: {
        backgroundColor: colors.white,
        height: 80,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 20,
        marginVertical: 10,
        color: colors.darkbrown,
        textAlignVertical: 'top' ,
      },

    text : {
        fontSize: 12,
        fontFamily: 'Montserrat-Black',
        color: colors.white,
        marginBottom: 3,
    },

    avgRatingBox: {
        flexDirection : 'row',
        alignSelf: 'center',
        marginTop: 20,
    },

    avgRatingtext : {
        fontSize: 25,
        fontFamily: 'Montserrat-Black',
        
    },

    textcomment : {
        fontSize: 12,
        fontFamily: 'Montserrat-Black',
        color: colors.white,
        marginTop: 10,
    
    },

    textinput: {
        backgroundColor: colors.textinput,
        width: '80%',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 20,
        marginVertical: 10,
        color: colors.white,
        alignSelf: 'center',
      },

    overallReviewContainer : {
        alignSelf: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.brown,
        borderWidth: 0.2,
        width: '80%',
        padding: 20,
    },

    reviewContainer: {
        borderWidth: 0.2,
        borderColor: colors.darkbrown,
        borderRadius: 15,
    },

    alertnotice :{
        color: colors.red,
        fontFamily: 'Montserrat-Black',
        textAlign: 'center',
    },

    endofreview :{
        color: colors.red,
        fontFamily: 'Montserrat-Black',
        textAlign: 'center',
    }


})

export default ViewReviews