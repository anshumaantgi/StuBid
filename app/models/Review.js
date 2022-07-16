export default class Review {

    constructor(auctionId, senderId, receiverId, rating, comment, createdTime) {
       this.auctionId = auctionId;
       this.senderId = senderId;
       this.receiverId = receiverId;
       this.rating = rating;
       this.comment = comment;
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
            createdAt : this.createdAt,
            updatedAt : this.updatedAt,
             };
    }

    toString() {
        return this.id + ', ' + this.senderId + ', ' + this.rating;
    }
}