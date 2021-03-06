import User from "../models/User"
import {createUserWithEmailAndPassword, sendEmailVerification} from 'firebase/auth'
import { db } from "../config/config";
import { collection, doc,  setDoc, addDoc} from "firebase/firestore"; 
import moment from "moment-timezone";
import Review from "../models/Review";

export default class ReviewView {
    constructor(db, auth) {
        this.db  = db;
        this.auth = auth;
        this.review = null;
    }
    
    async createReview(auctionId, senderId, receiverId, rating, comment, itemName, pictureUri) {
        /**
         * Creates a User Review based on auction ID 
         * Every Auction ID will have 2 sets. (Sender and Receiver) x 2
         * 
         * @Params : auctionId, senderId, receiverId, rating, comment
         * @Return : None
         * @Throw : Firebase Errors
         */
        if (!rating) {
            throw new Error("Please provide a rating score!");
        }
        else if (!comment) {
            throw new Error("Please provide a comment/feedback for the user!");
        }
        else {

            let docRef = doc(collection(db, "reviews"))
            this.review = new Review(docRef.id, auctionId, senderId, receiverId, rating, comment, itemName, pictureUri, moment().tz('Singapore').format('DD/MM/YYYY, HH:mm:ss'));
           //Creating a bid instance
           console.log(this.review.toFirestore())
           await setDoc(docRef, this.review.toFirestore())
           .then (
               (success) => {
                  console.log('Send Review successfully')
               }

           )
           .catch ( (err) => { throw new Error(err.message)})
        }
    }

 }

