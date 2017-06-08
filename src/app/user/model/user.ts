export class User {
    userId: number;
    name: string;
    gander: string;
    email: string;
    mobile: number;
    country: string;
    qualification: string;
    photo: string;

    constructor(userId, name, gander, email, mobile, country, qualification, photo) {
        this.userId = userId;
        this.name = name;
        this.gander = gander;
        this.email = email;
        this.mobile = mobile;
        this.country = country;
        this.qualification = qualification;
        this.photo = photo;
    }
}