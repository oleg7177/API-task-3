import { expect } from "chai";

export function checkStatusCode(response, statusCode: 200 | 201 | 204 | 400 | 401 | 403 | 404 | 409 | 500) {
    expect(response.statusCode, `Status Code should be ${statusCode}`).to.equal(statusCode);
}

export function checkResponseTime(response, maxResponseTime: number = 1000) {
    expect(response.timings.phases.total, `Response time should be less than ${maxResponseTime}ms`).to.be.lessThan(
        maxResponseTime
    );
}

export function checkRegisteredEmailValue(response) {
    expect(response.body.user.email, `User email should be equal to registered`).to.be.equal('kuzivoleg7177@gmail.com');

}

export function checkTokenExpirationTime(response, tokenExpiration : number = 7200) {
   
    expect(response.body.token.accessToken.expiresIn, `The token should expire in 7200`).to.be.equal(tokenExpiration) 

}

export function checkResponseBodyAuthorID(response, authorID : number = 0) {
   
    expect(response.body.author.id, `User id should be equal`).to.be.equal(authorID); 

}