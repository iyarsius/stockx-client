export default `query FetchCurrentAsks($query: String, $state: AsksGeneralState, $currencyCode: CurrencyCode, $first: Int, $after: String, $sort: AsksSortInput, $order: AscDescOrderInput, $country: String!, $market: String) {
      viewer {
        __typename
        asks(
          query: $query
          state: $state
          currencyCode: $currencyCode
          first: $first
          after: $after
          sort: $sort
          order: $order
        ) {
          __typename
          edges {
            __typename
            node {
              __typename
              id
              amount
              currentCurrency
              expires
              created
              updated
              state
              inventoryType
              productVariant {
                __typename
                id
                product {
                  __typename
                  id
                  brand
                  styleId
                  listingType
                  primaryCategory
                  productCategory
                  primaryTitle
                  secondaryTitle
                  minimumBid
                  media {
                    __typename
                    thumbUrl
              }
            }
            market(currencyCode: $currencyCode) {
                  __typename
                  bidAskData(country: $country, market: $market) {
                    __typename
                    lowestAsk
                    highestBid
              }
            }
            traits {
                  __typename
                  size
                  sizeDescriptor
            }
            sizeChart {
              baseSize
              baseType
              displayOptions {
                  size
                  type
              }
          }
          }
        }
      }
      pageInfo {
            __typename
            totalCount
            endCursor
            hasNextPage
            hasPreviousPage
      }
    }
  }
}`