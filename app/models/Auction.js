
export default class Auction {

    constructor(auctionId, auctionDocId, currPrice ,ong, createdAt,anomName, product, endingAt) {
       this.leadBuyerId = null;
       this.allBiddersId = null;
       this.auctionId = auctionId,
       this.auctionDocId = auctionDocId,
       this.anomName = anomName;
       this.currPrice = currPrice;
       this.ongoing = ong;
       this.product = product;
       this.createdAt = createdAt;
       this.updatedAt = createdAt;
       this.endingAt = endingAt;
    }

    toFirestore() {
        return {
            leadBuyerId: this.leadBuyerId,
            allBiddersId: this.allBiddersId,
            auctionId: this.auctionId,
            auctionDocId: this.auctionDocId,
            anomName: this.anomName,
            product: this.product,
            currPrice: this.currPrice,
            ongoing: this.ongoing,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            endingAt: this.endingAt,
             };
    }

    
    updateTime(updatedTime) {
        this.updatedAt = updatedTime;
    }

    toString() {
        return this.id + ', ' + this.name + ', ' + this.description;
    }
}