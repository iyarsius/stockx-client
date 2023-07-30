export default `query FetchStandardProduct($productId: String!, $currencyCode: CurrencyCode!, $countryCode: String!, $marketName: String) {
    product(id: $productId) {
        defaultSizeConversion {
            name
            type
        }
        lockBuying
        lockSelling
        variants {
            id
            hidden
            market(currencyCode: $currencyCode) {
                bidAskData(country: $countryCode, market: $marketName) {
                    highestBid
                    lowestAsk
                    numberOfAsks
                    numberOfBids
                }
            }
            sizeChart {
                    baseSize
                    baseType
                    displayOptions {
                        size
                        type
                    }
                }
            sortOrder
        }
        urlKey
    }
}`;