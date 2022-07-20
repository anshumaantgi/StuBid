import { getDoc, addDoc,doc, collection, updateDoc, where, query, getDocs } from "firebase/firestore";
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
        var notif = new Notification(userId, message, false, moment().tz('Singapore').format('DD/MM/YYYY, HH:mm:ss'), this.auctionId)
        return await addDoc(collection(db,'notifications'), notif.toFirestore()).then (
            (success) => {
                // Update Notification to firestore
            }

        )
        .catch ( (err) => { throw new Error(err.message)})
    }

}