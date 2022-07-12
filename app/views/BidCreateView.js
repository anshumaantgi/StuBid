import { getDoc, addDoc,doc, collection, updateDoc } from "firebase/firestore";
import { NumberDictionary } from "unique-names-generator";
import { db } from "../config/config";
import moment from "moment-timezone";

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
    
    async createBid(bid, docId, allBiddersId) {
        // Auction Information is pulled
        currAuction = await getDoc(doc(db ,'auctions' ,docId))
        //Get All Bids on Auction
        allBids = currAuction.bids // This is an array
        // Get Current Price
        currPrice = currAuction.currPrice

        if (bid.bidPrice <= currPrice) {
            throw new Error('Bid Price Needs to be more than current price. ')
        } else if (currAuction.ongoing === false) {
            throw new Error('Current Auction has expired.')
        }else {
            // Making a succesful Bid
            
            //Creating a bid instance
            console.log(bid.toFirestore())
            await addDoc(collection(db,'bids'), bid.toFirestore())
            .then (
                (success) => {
                    // Update Auction Current Price

                    return updateDoc(doc(db, 'auctions', docId) , { 
                        currPrice: bid.bidPrice,
                        leadBuyerId: bid.bidderId,
                        allBiddersId: allBiddersId,
                        updatedAt: moment().tz('Singapore').format('DD/MM/YYYY, HH:mm:ss'),


                    })

                }

            )
            .catch ( (err) => { throw new Error(err.message)})

        }
    }

}