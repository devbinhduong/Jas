const getCategoryFields = (includeImage = false) => `
  fragment CategoryFields on CategoryTreeItem {
    name
    path
    entityId
    ${includeImage ? `
    image {
     altText
      urlOriginal
    }` : ''}
  }
`;

// Queries
export const categoryQueries = {
  getCategoryTree: (params = {}) => {
    const fragment = getCategoryFields(params.image);
    return `
      query CategoryTree3LevelsDeep {
        site {
          categoryTree {
            ...CategoryFields
            children {
              ...CategoryFields
              children {
                ...CategoryFields
              }
            }
          }
        }
      }
      ${fragment}
    `;
  }
};

export const brandQueries = {
  getBrand: () => {
    return `
     query paginateProducts {
      site {
        brands(first: 50) {
          edges {
            node {
              entityId
              name
              path
            }
          }
        }
      }
    }
    `;
  }
};
