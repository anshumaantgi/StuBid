
export default class Auction {

    constructor(auctionId,currPrice ,ong, createdAt,anomName, product,endingIn) {
       this.leadBuyerId = null;
       this.allBiddersId = null;
       this.auctionId = auctionId,
       this.anomName = anomName;
       this.currPrice = currPrice;
       this.ongoing = ong;
       this.product = product;
       this.leadBuyer = null;
       this.createdAt = createdAt;
       this.updatedAt = createdAt;
       this.endingIn = endingIn;
    }

    toFirestore() {
        return {
            leadBuyerId: this.leadBuyerId,
            allBiddersId: this.allBiddersId,
            auctionId: this.auctionId,
            anomName: this.anomName,
            product: this.product,
            currPrice: this.currPrice,
            ongoing: this.ongoing,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            leadBuyer: this.leadBuyer,
            endingIn : this.endingIn
             };
    }

    
    updateTime(updatedTime) {
        this.updatedAt = updatedTime;
    }

    toString() {
        return this.id + ', ' + this.name + ', ' + this.description;
    }
}