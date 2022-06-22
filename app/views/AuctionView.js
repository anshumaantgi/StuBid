import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../config/config";

export default class AuctionView {
    constructor(auth,db, product) {
        this.auth = auth;
        this.db = db;
        this.product = product;
    }

    async createProduct(minPrice, buyPrice, category, auctionId, activeDays, createdAt) {
        this.product.setPriceAndCategory(minPrice, buyPrice, category, auctionId, activeDays, createdAt);
        setDoc(doc(collection(db, "products")), this.product.toFirestore())
        .then((success) => null)
        .catch((err) => {throw new Error(err.message)});
    }
}