import { getDoc, addDoc,doc, collection, updateDoc, setDoc } from "firebase/firestore";
import { NumberDictionary } from "unique-names-generator";
import { db } from "../config/config";
import moment from "moment-timezone";
import Bid from "../models/Bid";

export default class BidCreateView {
    /**
     * Class Handles the Creation of Bid
     * Functionalities:
     *  1. Create a Bid instance in the Database
     *  2. Check if product is still ongoing 
     *  3. Check if Bid is more than Current Price 
     *  4. Check if the last bidder was current user , if yes then do not allow bid
     *  5. Add Succesful bid ot the Auction 
     *  6. Add Succesful Bid to the user
     * 
     */

     constructor(auth) {
        this.auth = auth;
    }
    
    async createBid(enteredbuyerId, enteredauctionId, enteredbidPrice, enteredbidderanonname, entereddocId, allBiddersId) {
        
            console.log(enteredbidPrice)    
            let docRef = doc(collection(db, "bids"))
            let newBids = new Bid(docRef.id, enteredbuyerId, enteredauctionId, enteredbidPrice, enteredbidderanonname, moment().tz('Singapore').format('DD/MM/YYYY, HH:mm:ss'))
           
            //Creating a bid instance
            console.log(newBids.toFirestore())

            await setDoc(docRef, newBids.toFirestore())
            .then (
                (success) => {
                    // Update Auction Current Price

                    return updateDoc(doc(db, 'auctions', entereddocId) , { 
                        currPrice: enteredbidPrice,
                        leadBuyerId: enteredbuyerId,
                        allBiddersId: allBiddersId,
                        updatedAt: moment().tz('Singapore').format('DD/MM/YYYY, HH:mm:ss'),


                    })

                }

            )
            .catch ( (err) => { throw new Error(err.message)})

        
    }

}