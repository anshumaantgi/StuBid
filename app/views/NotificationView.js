import { getDoc, addDoc,doc, collection, updateDoc, where, setDoc, getDocs } from "firebase/firestore";
import { NumberDictionary } from "unique-names-generator";
import Notification from "../models/Notification";
import { db } from "../config/config";
import moment from "moment-timezone";

export default class NotificationView {
    contructor() {
        this.auctionId = null;
    }

    async createNotification(userId, message, auctionDocId) {

       
        this.auctionId = auctionDocId; 
        let docRef = doc(collection(db, "notifications"))
        var notif = new Notification(docRef.id, userId, message, false, moment().tz('Singapore').format('DD/MM/YYYY, HH:mm:ss'), this.auctionId)
        return await setDoc(docRef, notif.toFirestore()).then (
            (success) => {
                // Update Notification to firestore
            }

        )
        .catch ( (err) => { throw new Error(err.message)})
    }

}