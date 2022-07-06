
export default class Auction {

    constructor(auctionId,currPrice ,ong, createdAt,anomName, product) {
       this.auctionId = auctionId,
       this.anomName = anomName;
       this.currPrice = currPrice;
       this.ongoing = ong;
       this.product = product;
       this.leadBuyer = null;
       this.createdAt = createdAt;
       this.updatedAt = createdAt;
    }

    toFirestore() {
        return {
            auctionId: this.auctionId,
            anomName: this.anomName,
            product: this.product,
            currPrice: this.currPrice,
            ongoing: this.ongoing,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            leadBuyer: this.leadBuyer
             };
    }

    
    updateTime(updatedTime) {
        this.updatedAt = updatedTime;
    }

    toString() {
        return this.id + ', ' + this.name + ', ' + this.description;
    }
}