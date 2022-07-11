import { collection, doc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
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
        const qry = query(productsRef,  orderBy("createdAt"), where('ongoing', '==', true));

        const documentSnapshots = await getDocs(qry);

        return documentSnapshots
    }
    async decrementActiveDays() {
        docSnaps = await this.getProducts()
        for (let i = 0; i < docSnaps.docs.length; i++) {
            const auction = docSnaps.docs[i].data()
            // Decreasing Active days by 1
            createdAtMoment = moment(auction.createdAt , 'DD/MM/YYYY, HH:mm:ss')
            currMoment = moment(moment().tz('Singapore').format('DD/MM/YYYY, HH:mm:ss'), 'DD/MM/YYYY, HH:mm:ss')
            console.log(currMoment)
            console.log(createdAtMoment)
            var daysLeft = Math.floor(auction.product.activeDays - moment.duration(currMoment.diff(createdAtMoment)).asDays());

            await updateDoc(doc(db ,'auctions' , docSnaps.docs[i].id ) , { 
                endingIn: daysLeft,
                updatedAt: moment().tz('Singapore').format('DD/MM/YYYY, HH:mm:ss')
            })
            if ((daysLeft) <= 0) {
                // Terminate Auction lisitng as it already expired
                // Document Snaphot has a property Id that retriver the docId
                await new TerminateAuctionView().closeListing(docSnaps.docs[i].id)
            }
        }

    }
    
}