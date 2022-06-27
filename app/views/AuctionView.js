import { collection, deleteDoc, addDoc, setDoc, Timestamp, doc} from "firebase/firestore";
import { db } from "../config/config";
import Auction from "../models/Auction";
import {uploadBytes, ref, getDownloadURL,deleteObject, getStorage} from 'firebase/storage';

export default class AuctionView {
    constructor(auth,db, product) {
        this.auth = auth;
        this.db = db;
        this.product = product;
    }

    async uploadImage (uri , pictureName) {
        const response = await fetch(uri);
        const blob = await response.blob();
        const storage = getStorage();
        var storageRef = ref(storage , pictureName);
        await uploadBytes(storageRef, blob)
        return await getDownloadURL(storageRef);
        
    }

    async createProduct(minPrice, buyPrice, category, auctionId, activeDays,anomName) {
        //console.log(anomName)
        this.product.setPriceAndCategory(minPrice, buyPrice, category, auctionId, activeDays, new Date().toLocaleString());
        const storage = getStorage();
        try {
        const url =  await this.uploadImage(this.product.pictureUri, "products-image/" + auctionId + '.png');
        
        this.product.pictureUri = url;
        

        

        newAuction = new Auction(auctionId,minPrice, true, new Date().toLocaleString(),anomName, this.product.toFirestore());
        await addDoc(collection(db, "auctions") , newAuction.toFirestore());
    } catch (e) {
        const deleteRef = ref(storage, "products-image/" + auctionId + '.png');
        await deleteObject(deleteRef);
        throw new Error(e.message);
    }
    }
}