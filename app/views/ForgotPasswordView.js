import { sendPasswordResetEmail } from "firebase/auth";

export default class ForgotPasswordView {
    constructor(auth) {
        this.auth = auth;
    }

    async resetPassword(email) {
        await sendPasswordResetEmail(this.auth,email,null)
        .then( (user) => {
            console.log(email);
          })
        .catch((err) => {
            console.log(err);
            throw new Error(err.message);});
    }

}