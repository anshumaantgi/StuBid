export default class Notification {
    constructor (notificationId, userId, message, cleared, createdAt , docId) {
        this.notificationId = notificationId,
        this.userId = userId,
        this.message = message,
        this.cleared = cleared,
        this.createdAt = createdAt,
        this.auctionDocId = docId
    }

    toFirestore() {
        return {
            notificationId : this.notificationId,
            userId : this.userId,
            message  : this.message,
            cleared :  this.cleared, 
            createdAt : this.createdAt,
            auctionDocId : this.auctionDocId
             };
    }
}