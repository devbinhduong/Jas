import { categoryQueries, brandQueries } from "./queries/categoryQueries";
async function getCategory(context, param) {
    try {
        const query = () => {
            switch (param) {
                case 'hasImage':
                    return categoryQueries.getCategoryTree({ image: true });
                default:
                    return categoryQueries.getCategoryTree();
            }
        }
        const response = await fetch("/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${context.token}`,
            },
            body: JSON.stringify({
                query: query(),
            }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error get cate (${error})`);
        throw error;
    }
}
async function getBrand(context) {
    try {
        const response = await fetch("/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${context.token}`,
            },
            body: JSON.stringify({
                query: brandQueries.getBrand(),
            }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error get brand (${error})`);
    }
}

export { getCategory, getBrand };
