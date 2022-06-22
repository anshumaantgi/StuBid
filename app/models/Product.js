

export default class Product {

    constructor(name, ownerId, description, pictureUri) {
       this.name = name;
       this.ownerId = ownerId;
       this.auctionId = null;
       this.description = description;
       this.createdAt = "";
       this.updatedAt = "";
       this.category = null;
       this.minPrice = null;
       this.buyPrice = null;
       this.activeDays = null;
       this.pictureUri = pictureUri;
    }

    toFirestore() {
        return {  
            name : this.name,
            ownerId : this.ownerId,
            auctionId : this.auctionId,
            description : this.description,
            createdAt : this.createdAt,
            updatedAt : this.updatedAt,
            category : this.category,
            minPrice : this.minPrice,
            buyPrice : this.buyPrice,
            activeDays : this.activeDays,
            pictureUri : this.pictureUri
             };
    }

    setPriceAndCategory(minPrice, buyPrice, category, auctionId, activeDays, createdAt) {
        this.minPrice = minPrice;
        this.buyPrice = buyPrice;
        this.category = category;
        this.auctionId = auctionId;
        this.activeDays = activeDays;
        this.createdAt = createdAt;
        this.updatedAt = createdAt;
    }

    updateTime(updatedTime) {
        this.updatedAt = updatedTime;
    }

    toString() {
        return this.id + ', ' + this.name + ', ' + this.description;
    }
}
