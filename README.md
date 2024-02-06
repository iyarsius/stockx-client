# Stockx-Client

This module is an new version of "Stockx-scraper" but working on the mobile API of stockx. It's no longer updated but feel free to use it as template to make your working version.

# Login

This module can log into a stockx account using the following

```ts
import { StockxClient } from 'stockx-client';

const client = new StockxClient();

(async () => {
    await client.request.setPx3('px3 cookie here');

    await client.login({
        username: "YourUsername",
        password: "Password123!"
    });
})();
```

# Markets

You can fetch markets data using the following

```ts
// fetch model data such as name, brand, and colorway
const product = await client.markets.search(sku);

// fetch size data such as lowest ask, highest bid, and last sale
await product.fetch();
```

# Listings

You can fetch listings data using the following

```ts
// fetch the first 40 listings of the logged in user
// this will return an array of listings class
const listings = await client.listings.list()
```

You can also manage your listings using the following

```ts
const listing = listings[0];

// delete a listing
await listing.delete();

// update a listing
await listing.update({
    price: 1000
});

// create a listing
await client.listings.create({
    sku: "SKU",
    name: "Name", // this dont affect the listing since stockx uses the sku to identify the product
    brand: "Brand", // same as name
    size: "Size",
    price: 1000
});
```

# About the module

This module is no longer updated and is not guaranteed to work. It's a good template to make your own working version of a stockx client. But i can provide you some informations about why it's not working anymore.

When i created this module, the mobile API was pretty easy to trick, once you get an access token, the API was pretty much open to do whatever you want. Retreiving this token was a bit tricky (see the login function in index.ts) but i finally managed to do it. Importing a px3 cookie was the final trick to make it work. But some month later the module was not able anymore to login, so i guess stockx has changed their login flow or they just need more than a px3 cookie. I didn't have time to investigate more about it, so i just let it go. But the solution is probably in the login function.

Another option could be to use an existing access token, imported from your device using (MITM proxy for example). I dont tried it but it could work.

importing token should be something like this:

```ts
// do this instead of login
await client.request.setToken({
    access_token: "access token here",
    refresh_token: "refresh token here",
    id_token: "id token here",
    scope: "scope here",
    expires_in: 0000, // expiration time
    token_type: "type here (bearer)",
});
```
Feel free to submit a pull request if you make it work again, i will be happy to merge it. I dont uploaded it to npm cause it's not working but a working version could be uploaded.