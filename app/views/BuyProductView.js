import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../config/config.js'
import TerminateAuctionView from '../views/TerminateAuctionView.js'

export default class BuyProductView {
    async terminateProduct(buyerId, auctionId, buyPrice) {
        updateDoc(doc(db ,'auctions' , auctionId ) , { 
            leadBuyer : buyerId,
            currPrice : buyPrice
        })
        
        return await new TerminateAuctionView(auctionId).closeListing(auctionId)
    }
}