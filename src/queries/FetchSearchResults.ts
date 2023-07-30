export default `query FetchSearchResults($filtersVersion: Int, $query: String, $page: BrowsePageInput, $sort: BrowseSortInput, $staticRanking: Boolean) {
      browse(
        experiments: {staticRanking: {enabled: $staticRanking}}
        filtersVersion: $filtersVersion
        query: $query
        sort: $sort
        page: $page
      ) {
        __typename
        categories {
          __typename
          id
          count
    }
    results {
          __typename
          edges {
            __typename
            node {
              __typename
              ... on Product {
                id
                styleId
                brand
                listingType
                primaryTitle
                secondaryTitle
                media {
                  __typename
                  smallImageUrl
            }
          }
          ... on Variant {
                id
                product {
                  __typename
                  id
                  styleId
                  listingType
                  primaryTitle
                  secondaryTitle
                  media {
                    __typename
                    smallImageUrl
              }
            }
          }
        }
        objectId
      }
      pageInfo {
            __typename
            limit
            page
            queryId
            queryIndex
            total
      }
    }
  }
}`
