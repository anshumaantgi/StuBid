import { collection, deleteDoc, addDoc, setDoc, Timestamp, doc} from "firebase/firestore";
import { db } from "../config/config";
import Auction from "../models/Auction";
import {uploadBytes, ref, getDownloadURL,deleteObject, getStorage} from 'firebase/storage';
import moment from "moment-timezone";

export default class AuctionView {
    constructor(auth,db, product) {
        this.auth = auth;
        this.db = db;
        this.product = product;
    }

    async uploadImage (uri , pictureName) {
        // Uploading Image to Storage and then retiriving the Downlaod link
        const response = await fetch(uri);
        const blob = await response.blob();
        const storage = getStorage();
        var storageRef = ref(storage , pictureName);
        await uploadBytes(storageRef, blob)
        return await getDownloadURL(storageRef);
        
    }

    async createProduct(minPrice, buyPrice, category, activeDays,anomName, endbiddate) {

        const storage = getStorage();
        const docRef = doc(collection(db, "auctions"))
        // Adding Product Feilds
        this.product.setPriceAndCategory(minPrice, buyPrice, category, docRef.id, activeDays, moment().tz('Singapore').format('DD/MM/YYYY, HH:mm:ss'));
      
        try {
        const url =  await this.uploadImage(this.product.pictureUri, "products-image/" + docRef.id + '.png');
        
        // Adding th Download link to Product class
        this.product.pictureUri = url;
        
        console.log(docRef.id, minPrice, true, moment().tz('Singapore').format('DD/MM/YYYY, HH:mm:ss'),anomName, this.product.toFirestore(), endbiddate)
        let newAuction = new Auction(docRef.id, minPrice, true, moment().tz('Singapore').format('DD/MM/YYYY, HH:mm:ss'),anomName, this.product.toFirestore(), endbiddate);
        await setDoc(docRef, newAuction.toFirestore());
        console.log('GOOOD')

    } catch (e) {
        // Deleted the product , assocaited with the auction if Auction not sotred in database
        const deleteRef = ref(storage, "products-image/" + docRef.id + '.png');
        await deleteObject(deleteRef);
        // Error thrown to be show to the user
        throw new Error(e.message);
    }
    }
}