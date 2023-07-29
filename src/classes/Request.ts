import axios, { Axios, AxiosRequestConfig } from 'axios';
import { IJWT } from '../types/Request.js';

const userAgents = [
    'StockX/34011 CFNetwork/1331.0.7 Darwin/21.4.0'
];

export class Request extends Axios {
    token?: IJWT;
    userAgent: string = userAgents[Math.floor(Math.random() * userAgents.length)];
    px3?: string;

    constructor(public config?: AxiosRequestConfig) {
        super({
            transformRequest: axios.defaults.transformRequest,
            transformResponse: axios.defaults.transformResponse,
            ...config,
        });

        this.interceptors.request.use(async (config) => {
            if (this.token) {
                config.headers.setAuthorization(`${this.token.token_type} ${this.token.access_token}`);
            };

            config.headers.setAccept('text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8');
            config.headers.setUserAgent(this.userAgent);
            config.headers.set('x-api-key', '99WtRZK6pS1Fqt8hXBfWq8BYQjErmwipa3a0hYxX');

            if (config.url === "https://gateway.stockx.com/api/graphql") {
                config.headers.set("apollographql-client-name", "stockx-ios-prod");
                config.headers.set("apollographql-client-version", "5.7.39")
            }

            const cookie = {
                // _pxhd: "vDu/H/aUBGAtAKTmdTOMIlW6-miBttX3jbuynFkYi0dZ3oTfPLvBbP0BvFMmZWieYw9QWHpaXsZU1RcH99LYbw==:YET2mFpod2lcr4/Ge65QhM9D7sZsEB3/W7ADPhLBkqpw7387QYXx4rTH0m3HafU/yBDiln/FBHjjgO8jML1xyjJpZQktLhRfpSkMMfvcSFo="
                auth0_compat: "s%3Av1.gadzZXNzaW9ugqZoYW5kbGXEQLkNHmUYh2mtwv0tadjfyegj6zoAkX69xmWKntQTVyXhpx7elAU5lSrMk5JBAtccPZdPGsx7Bqcwvnekt5qiNAymY29va2llg6dleHBpcmVz1__Iv5oAZKs_aK5vcmlnaW5hbE1heEFnZc4PcxQAqHNhbWVTaXRlpG5vbmU.TAkfVchEDf1tE2ZzmO4UfVN25MbypOe%2B2%2BRBOy6baZo",
            };

            if (this.px3) cookie['_px3'] = this.px3;
            const cookieStr = Object.entries(cookie).map(([key, value]) => `${key}=${value}`).join('; ');

            config.headers.set("cookie", cookieStr);
            return config;
        });
    };

    setToken(token: IJWT) {
        this.token = token;
    };

    setPx3(px3: string) {
        this.px3 = px3;
    };
}