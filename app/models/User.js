
export default class User{

    constructor(name, email, originUni, createdAt) {
        this.name = name;
        this.email = email;
        this.originUni = originUni;
        this.createdAt = createdAt;
        this.updatedAt = createdAt; 
        this.id = null;
    }

    ToFirestore() {
        return { id: this.id,  
            name: this.name,
            email: this.email,
            originUni: this.originUni,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
             };
    }

    setId (id) {
        this.id = id;
    }
    updateTime(updatedTime) {
        this.updatedAt = updatedTime;
    }
    toString() {
        return this.id + ', ' + this.name + ', ' + this.email;
    }
}
