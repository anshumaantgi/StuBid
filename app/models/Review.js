export default class Review {

    constructor(auctionId, senderId, receiverId, rating, comment, itemName, pictureUri, createdTime) {
       this.auctionId = auctionId;
       this.senderId = senderId;
       this.receiverId = receiverId;
       this.rating = rating;
       this.comment = comment;
       this.itemName = itemName;
       this.pictureUri = pictureUri;
       this.createdAt = createdTime;
       this.updatedAt = createdTime;

    }

    toFirestore() {
        return {
            auctionId : this.auctionId,
            senderId : this.senderId,
            receiverId : this.receiverId,
            rating : this.rating,
            comment: this.comment,
            itemName: this.itemName,
            pictureUri: this.pictureUri,
            createdAt : this.createdAt,
            updatedAt : this.updatedAt,
             };
    }

    toString() {
        return this.id + ', ' + this.senderId + ', ' + this.rating;
    }
}