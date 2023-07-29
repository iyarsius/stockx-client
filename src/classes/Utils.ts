import { createHash, randomBytes } from "crypto";

export class Utils {
    static encodeBase64Url(input) {
        return Buffer.from(input, 'utf8').toString('base64url');
    };

    static decodeBase64Url(input) {
        return Buffer.from(input, 'base64')
    };

    static getState(bytes = 32) {
        return this.encodeBase64Url(randomBytes(bytes));
    };

    static getChallenge(bytes = 32) {
        const code_verifier = this.encodeBase64Url(randomBytes(bytes));
        const code_challenge = this.encodeBase64Url(createHash('sha256').update(code_verifier).digest());

        return {
            code_verifier,
            code_challenge
        };
    }
}