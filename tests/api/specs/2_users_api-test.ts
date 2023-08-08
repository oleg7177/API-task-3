import { expect } from "chai";
import { UsersController } from "../lib/controllers/users.controller";
import { AuthController } from "../lib/controllers/auth.controller";
import {checkStatusCode, checkResponseTime, checkRegisteredEmailValue, checkTokenExpirationTime, checkResponseBodyAuthorID} from "../../helpers/functionsForChecking.helper";
const users = new UsersController();
const auth = new AuthController();
const schemas = require('./data/schemas_testData.json');
const chai = require('chai');
chai.use(require('chai-json-schema'));

describe(`Users controller`, () => {

    let accessToken : string;
    let userId : number;
    let baseEmail: string = global.appConfig.users.Oleg.email;
    let baseEmailpassword: string = global.appConfig.users.Oleg.password;


    before(`Login and get the token`, async () => {
        let response = await auth.login(baseEmail, baseEmailpassword);
        checkStatusCode(response,200);
        accessToken = response.body.token.accessToken.token;
        userId = response.body.id;
        
    });

    afterEach(function () {
        //console.log(accessToken)
        //console.log(userId)
    });

    

    it(`New user account registered`, async () => {
        let response = await auth.registration(0,"myavatar",baseEmail,"oleg7177",baseEmailpassword);

        // console.log("All Users:");
        // console.log(response.body);
        checkStatusCode(response,201);
        checkResponseTime(response,1000);
        checkRegisteredEmailValue(response)
        

    });

    it(`Get all users`, async () => {
        let response = await users.getAllUsers();

        checkStatusCode(response,200);
        checkResponseTime(response,1000); 
        
    });

    it(`Authorization`, async () => {
       let response = await auth.login(baseEmail,baseEmailpassword);

       checkStatusCode(response,200);
       checkResponseTime(response,1000);
       checkTokenExpirationTime(response,7200)
       
    });

    it(`Get current authorized user`, async () => {
       let response = await users.getUserFromToken(accessToken);
       checkStatusCode(response,200); 
       checkResponseTime(response,1000);

    });

    it(`Update user info`, async () => {
        let response = await users.updateUserInfo(1745,"myavatar","kuzivoleg7177@@@gmail.com","oleg7177@@@",accessToken)
        checkStatusCode(response,204);
        checkResponseTime(response,1000); 
    });


    it(`Get user info from ID`, async () => {
        let response = await users.getUserInfoFromID();
        checkStatusCode(response,200);
        checkResponseTime(response,1000); 
    });

    it(`Delete user by ID`, async () => {
        let response = await users.deleteUserByID(accessToken,"1748")
        checkStatusCode(response,204);
        checkResponseTime(response,1000); 
        checkResponseBodyAuthorID(response,1748)

    });

    it(`Comment a post`, async () => {
        let response = await users.commentPost(accessToken,1744,41,"stringstringstring")
        checkStatusCode(response,200);
        checkResponseTime(response,1000);
        checkResponseBodyAuthorID(response,1744)

    });

    it(`Get all posts`, async () => {
        let response = await users.getAllPosts()
        checkStatusCode(response,200);
        checkResponseTime(response,1000); 
    });

    it(`Create new post`, async () => {
        let response = await users.createNewPost(accessToken,28,"string","string")
        checkStatusCode(response,200);
        checkResponseTime(response,1000); 
    });

    it(`Add like reaction to post`, async () => {
        let response = await users.addLikeReactionPost(accessToken,41,true,28)
        checkStatusCode(response,200);
        checkResponseTime(response,1000);
    });

    it(`Should return 404 error when getting user info with invalid id`, async () => {
        

        let response = await users.getUserInfoFromInvalidID();
        checkStatusCode(response,404);
        checkResponseTime(response,1000);  
    });

    it(`Should return 400 error when getting user details with invalid id type`, async () => {
        

        let response = await users.getUserInfoFromInvalidIDType()
        checkStatusCode(response,400);
        checkResponseTime(response,1000);  
    });
 
    it(`Should return 404 error when updating user info with wrong id`, async () => {
        let response = await users.updateUserInfo(17451745,"myavatar","kuzivoleg7177@@@gmail.com","oleg7177@@@",accessToken)
        checkStatusCode(response,404);
        checkResponseTime(response,1000);
    });

    describe('Use test data set for login', () => {
        let invalidDataSet = [
            { email: baseEmail, password: '' },
            { email: baseEmail, password: '      ' },
            { email: baseEmail, password: 'password111 ' },
            { email: baseEmail, password: 'password11111' },
            { email: baseEmail, password: 'admin' },
            { email: baseEmail, password: baseEmail },
        ];
    
        invalidDataSet.forEach((credentials) => {
            it(`should not login using invalid credentials : '${credentials.email}' + '${credentials.password}'`, async () => {
                let response = await auth.login(credentials.email, credentials.password);
    
                checkStatusCode(response, 401); 
                checkResponseTime(response, 1000);
            });
        });
    });
   
});
