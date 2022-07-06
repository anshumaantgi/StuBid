export default class Notification {
    constructor (userId, message, cleared = false,createdAt) {
        this.userId = userId,
        this.message = message,
        this.cleared = cleared,
        this.createdAt = createdAt
    }

    toFirestore() {
        return {
            userId : this.userId,
            message  : this.message,
            cleared :  this.cleared, 
            createdAt : this.createdAt,
             };
    }
}