export default class Bid {

    constructor(bidId, bidderId, auctionId, bidPrice, bidderanonname , createdTime) {
       this.bidId = bidId;
       this.bidderId = bidderId;
       this.auctionId = auctionId;
       this.bidPrice = bidPrice;
       this.bidderAnomname = bidderanonname;
       this.createdAt = createdTime;
       this.updatedAt = createdTime;

    }

    toFirestore() {
        return {
            bidId : this.bidId,
            bidderId : this.bidderId,
            auctionId  : this.auctionId,
            bidPrice :  this.bidPrice, 
            bidderAnomname : this.bidderAnomname,
            createdAt : this.createdAt,
            updatedAt : this.updatedAt,
             };
    }

    toString() {
        return this.id + ', ' + this.bidderId + ', ' + this.bidderAnomname;
    }
}