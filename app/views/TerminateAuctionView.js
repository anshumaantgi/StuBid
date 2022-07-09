import { getDoc, addDoc,doc, collection, updateDoc, where, query, getDocs } from "firebase/firestore";
import { NumberDictionary } from "unique-names-generator";
import Notification from "../models/Notification";
import { db } from "../config/config";

export default class TerminateAuctionView {
    contructor(auctionId) {
        this.auctionId = auctionId;
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
        console.log(notif.toFirestore())
        return await await addDoc(collection(db,'notifications'), notif.toFirestore())
    }

    async manageNotifications(isExpired, isBiddedOn , auctionObject, bidders) {
        this.setMessages()
        if ((!isExpired) && (isBiddedOn)) {
            // send to Sender
            await this.createNotification(auctionObject.product.ownerId, this.sellerSoldMessage)

            //send to successful Buyer
            await this.createNotification(auctionObject.leadBuyer, this.buyerSuccessfulMessage)

            // send to All other Bidders
            for (bidder in bidders) {
                if (bidder != auctionObject.leadBuyer) {
                await this.createNotification(bidder, this.buyerNotSuccessfulMessage)
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
            await this.createNotification(auctionObject.leadBuyer, this.buyerSuccessfulMessage)

            // send to All other Bidders
            for (bidder in bidders) {
                if (bidder != auctionObject.leadBuyer) {
                await this.createNotification(bidder, this.buyerNotSuccessfulMessage)
                }
            }
        
        }
        return await updateDoc(doc(db ,'auctions' , this.auctionId ) , { 
            ongoing :false
        })
    }
    async getBidders (auctionObject) {
        const bidRef = collection(db, 'bids');
        const documentSnapshots = await getDocs(query(bidRef, where("auctionId" , "==" ,auctionObject.auctionId)));
        let bidders = []
        for (documemt in documentSnapshots.docs) {
            bidders.push(document.data().bidderId)
        }
        return bidders
    }
    async closeListing(aId) {
        // Check why the listing has closed
        this.auctionId = aId
        auctionObject = await getDoc(doc(db ,'auctions' ,this.auctionId ))
        auctionObject = auctionObject.data()
        console.log(auctionObject)
        var isExpired = false;
        var isBiddedOn = false;
        var bidders = []
        if (auctionObject.activeDays == 0) {
            isExpired = true;
        }
        if (auctionObject.leadBuyer != null) {
            isBiddedOn = true;
            bidders = await this.getBidders(auctionObject);
        }

        await this.manageNotifications(isExpired, isBiddedOn,auctionObject, bidders)
        .then ( succ => console.log(succ))
        .catch ((err) => { throw new Error(err.message)})
    }
}