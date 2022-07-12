import { getDoc, addDoc,doc, collection, updateDoc, where, query, getDocs } from "firebase/firestore";
import { NumberDictionary } from "unique-names-generator";
import Notification from "../models/Notification";
import { db } from "../config/config";
import moment from "moment";

export default class TerminateAuctionView {
    contructor() {
        this.auctionId = null;
        console.log(auctionId)
        this.sellerSoldMessage = null
        this.sellerNotSoldMessage = null
        this.sellerProductListingClosedMessage = null
        this.buyerNotSuccessfulMessage = null
        this.buyerSuccessfulMessage = null
    }

    setMessages() {
        this.sellerSoldMessage = "Congratualtions ! Your Product is succesully sold! ,  click here to check buyer details ! "+ 
        " or check the product listing on your profile page.";
        this.sellerNotSoldMessage = "We're sorry we could not help you , your prodcut listing is successfully closed.";
        this.sellerProductListingClosedMessage = "Your product listing is closed , and so auotmatically the Maximum Bidder is succesful .So, click here to check buyer details ! "+ 
        " or check the product listing on your profile page.";
        this.buyerNotSuccessfulMessage = "Sorry to inform you but the product lisitng is closed , you've been outbidded.";
        this.buyerSuccessfulMessage = "Congratulations ! You have successfully outbid Everyone , product is yours . Click here to check seller details " +
        " Or navigate to the product card on your profile page.";
    }
    async createNotification(userId, message) {
        var notif = new Notification(userId, message, false, new Date().toLocaleString())
        return await await addDoc(collection(db,'notifications'), notif.toFirestore())
    }

    async manageNotifications(isExpired, isBiddedOn , auctionObject, bidders) {
        this.setMessages()
        if ((!isExpired) && (isBiddedOn)) {
            // send to Sender
            await this.createNotification(auctionObject.product.ownerId, this.sellerSoldMessage)

            //send to successful Buyer
            await this.createNotification(auctionObject.leadBuyerId, this.buyerSuccessfulMessage)

            // send to All other Bidders
            var seen = {}
            for (bidder in bidders) {
                if (bidders[bidder] !== auctionObject.leadBuyerId) {
                
                    if (bidders[bidder]  in seen) {
                        continue;
                    } else {
                    await this.createNotification(bidders[bidder], this.buyerNotSuccessfulMessage)
                    seen[bidders[bidder]] = 1;
                    }
                }
            }
        }
        else if (isExpired && !isBiddedOn) {
            // send to Sender
            await this.createNotification(auctionObject.product.ownerId, this.sellerNotSoldMessage)

        } else {
            // send to Sender
            await this.createNotification(auctionObject.product.ownerId, this.sellerProductListingClosedMessage)

            //send to successful Buyer
            await this.createNotification(auctionObject.leadBuyerId, this.buyerSuccessfulMessage)

            var seen = {}
            for (bidder in bidders) {
                if (bidders[bidder] !== auctionObject.leadBuyerId) {
                
                    if (bidders[bidder]  in seen) {
                        continue;
                    } else {
                    await this.createNotification(bidders[bidder], this.buyerNotSuccessfulMessage)
                    seen[bidders[bidder]] = 1;
                    }
                }
            }
        
        }
        return await updateDoc(doc(db ,'auctions' , this.auctionId ) , { 
            ongoing :false,
            updatedAt: moment().tz('Singapore').format('DD/MM/YYYY, HH:mm:ss')
        })
    }
    async getBidders (auctionObject) {       
        return auctionObject.allBiddersId
    }
    async closeListing(docId) {
        // Check why the listing has closed
        this.auctionId = docId
        auctionObject = await getDoc(doc(db ,'auctions' ,this.auctionId ))
        auctionObject = auctionObject.data()
        var isExpired = false;
        var isBiddedOn = false;
        var bidders = []
        if (auctionObject.activeDays == 0) {
            isExpired = true;
        }
        if (auctionObject.leadBuyerId != null) {
            isBiddedOn = true;
            bidders = await this.getBidders(auctionObject);
        }
        console.log(bidders)
        await this.manageNotifications(isExpired, isBiddedOn,auctionObject, bidders)
        .then ( succ => console.log(succ))
        .catch ((err) => { throw new Error(err.message)})
    }
}