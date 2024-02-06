import { EventEmitter } from "events";
import { ILoginData, IUser } from "./types/Client.js";
import { Utils } from "./classes/Utils.js";
import { randomUUID } from "crypto";
import { load } from "cheerio";
import { IJWT } from "./types/Request.js";
import { Request } from "./classes/Request.js";
import axios from "axios";
import { ListingsManager } from "./classes/ListingsManager.js";
import { MarketsManager } from "./classes/MarketsManager.js";

export class StockxScraper extends EventEmitter {
    request: Request;
    user: IUser;

    listings: ListingsManager;
    markets: MarketsManager

    constructor() {
        super();

        this.request = new Request();
        this.listings = new ListingsManager(this);
        this.markets = new MarketsManager(this)
    };

    private async _fetchUser() {
        const res = await this.request.get(`https://gateway.stockx.com/api/v1/users/me?meta=include`);

        this.user = {
            id: res.data.Customer.id,
            email: res.data.Customer.email,
            username: res.data.Customer.fullName,
            hasHyperwalletPayoutMethod: res.data.Customer.Merchant.hasHyperwalletPayoutMethod,
        };
    };

    private async _authorize(code_challenge: string, state: string) {
        const params = {
            'stockx-source': 'mobile',
            'stockx-url': 'https://stockx.com',
            'stockx-device-id': 'A7648A0A-834D-4DF4-89CE-F5558E6E1D5F',
            code_challenge: code_challenge,
            redirect_uri: 'com.Campless.Campless://accounts.stockx.com/ios/com.Campless.Campless/callback',
            'stockx-currency': 'EUR',
            audience: 'gateway.stockx.com',
            scope: 'openid offline_access',
            'stockx-user-agent': 'StockX/34011 CFNetwork/1331.0.7 Darwin/21.4.0',
            'stockx-language': 'fr-FR',
            'stockx-session-id': randomUUID(),
            prompt: 'login',
            ui_locales: 'fr',
            response_type: 'code',
            code_challenge_method: "S256",
            client_id: "qV3Xr6KCgnlRlhEoAJXVh0MKpryr1Fkb",
            state: state,
            'stockx-checkout': 'false',
            'stockx-default-tab': 'login',
            'stockx-is-gdpr': 'true',
            auth0Client: 'eyJuYW1lIjoiQXV0aDAuc3dpZnQiLCJlbnYiOnsic3dpZnQiOiI1LngiLCJpT1MiOiIxNS40In0sInZlcnNpb24iOiI1LjcuMzYifQ'
        };

        const res = await this.request.get("https://accounts.stockx.com/authorize", {
            params: params,
            headers: {

            }
        }).catch(e => e.response);

        const $ = load(res.data);
        const script = $('script:nth-child(10)').text();
        const hash = script.split('JSON.parse(decodeURIComponent(escape(window.atob(')[1].split('))')[0];
        let buff = Buffer.from(hash, 'base64');
        let text = buff.toString('utf-8');

        return JSON.parse(text);
    };

    async login(credentials: ILoginData) {
        const state = Utils.getState();
        const challenge = Utils.getChallenge();

        const data = await this._authorize(challenge.code_challenge, state);

        // px3 is needed to avoid blocking
        // this.request.setPx3("");

        const result = await this.request.post("https://accounts.stockx.com/usernamepassword/login", {
            client_id: "qV3Xr6KCgnlRlhEoAJXVh0MKpryr1Fkb",
            redirect_uri: "com.Campless.Campless://accounts.stockx.com/ios/com.Campless.Campless/callback",
            tenant: "stockx-prod",
            response_type: "code",
            scope: "openid offline_access",
            audience: "gateway.stockx.com",
            _csrf: data.internalOptions._csrf,
            state: data.internalOptions.state,
            username: credentials.username,
            password: credentials.password,
            connection: "production",
            _intstate: "deprecated"
        });

        let $ = load(result.data);
        const wresult = $("input[name='wresult']").attr('value');
        const wctx = $("input[name='wctx']").attr('value');

        const body = new URLSearchParams();

        body.append('wa', 'wsignin1.0');
        body.append('wresult', wresult);
        body.append('wctx', wctx);

        const callback = await this.request.post("https://accounts.stockx.com/login/callback", body, {
            maxRedirects: 0,
        }).catch(e => {
            // check if it's a redirect
            if (e.response.status === 302) {
                return e.response;
            }

            throw e;
        });

        const redirect = await this.request.get(`https://accounts.stockx.com${callback.headers.location}`, {
            maxRedirects: 0,
        }).catch(e => {
            // check if it's a redirect
            if (e.response.status === 302) {
                return e.response;
            }

            throw e;
        });

        $ = load(redirect.data);
        const href = $("a").attr('href');

        const code = href.split('code=')[1]?.split('&')[0];

        if (!code) throw new Error("Error while getting code");

        const token = await this.request.post('https://accounts.stockx.com/oauth/token', {
            "client_id": "qV3Xr6KCgnlRlhEoAJXVh0MKpryr1Fkb",
            "code": code,
            "redirect_uri": "com.Campless.Campless:\/\/accounts.stockx.com\/ios\/com.Campless.Campless\/callback",
            "grant_type": "authorization_code",
            "code_verifier": challenge.code_verifier,
        }).then(res => res.data) as IJWT;

        this.request.setToken(token);
        await this._fetchUser();
    }
}