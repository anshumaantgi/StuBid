export default class Notification {
    constructor (userId, message, cleared, createdAt , docId) {
        this.userId = userId,
        this.message = message,
        this.cleared = cleared,
        this.createdAt = createdAt,
        this.auctionDocId = docId,
        this.index = userId.concat(docId)
    }

    toFirestore() {
        return {
            userId : this.userId,
            message  : this.message,
            cleared :  this.cleared, 
            createdAt : this.createdAt,
            auctionDocId : this.auctionDocId,
            index : this.index
             };
    }
}