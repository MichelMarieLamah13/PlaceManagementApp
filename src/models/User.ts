export class User{
    compte:string;
    login:string;
    motDePass:string;
    constructor(compte?:string, login?:string, motDePass?:string){
        this.compte = compte;
        this.login=login;
        this.motDePass=motDePass;
    }
}