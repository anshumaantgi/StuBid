import { collection, doc, getDoc, orderBy, query, updateDoc, where } from "firebase/firestore";
import moment from "moment";
import { db } from "../config/config";
import TerminateAuctionView from "./TerminateAuctionView";

export default class MidnightChangesView {
    /**
     * This class will run everydya at midnigth , it's function would be
     * 1. Decrementing Active days
     * 2. If a product has reached 0 active days , closing the product listing
     *  */ 

    async getProducts() {
        const productsRef = collection(db, 'auctions');
        // Only get ongoing products
        const qry = query(productsRef,  orderBy("createdAt"), where('product.ongoing', '==', true));

        const documentSnapshots = await getDocs(qry);

        return documentSnapshots
    }
    async decrementActiveDays() {
        docSnaps = await this.getProducts()
        for (let i = 0; i < docSnaps.docs.length; i++) {
            const auction = docSnaps.docs[i].data()
            // Decreasing Active days by 1
            await updateDoc(doc(db ,'auctions' , auction.auctionId ) , { 
                activeDays: auction.product.activeDays - 1,
                updatedAt: moment().tz('Singapore').format('DD/MM/YYYY, HH:mm:ss')
            })
            if ((auction.product.activeDays-1) <= 0) {
                // Terminate Auction lisitng as it already expired
                // Document Snaphot has a property Id that retriver the docId
                await new TerminateAuctionView().closeListing(docSnaps.docs[i].id)
            }
        }

    }
    
}