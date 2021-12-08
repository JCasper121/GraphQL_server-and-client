const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt,
} = require('graphql');

module.exports.FrameworkCategoryType = new GraphQLObjectType({
    name: "FrameworkCategory",
    description: "A category of frameworks",
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        imageUrl: { type: new GraphQLNonNull(GraphQLString) },
        frameworks: {
            type: new GraphQLList(FrameworkType),
            resolve: (category) => {
                return frameworks.filter(fw => fw.categoryId == category.id);
            }
        }
    })
})

module.exports.FrameworkType = new GraphQLObjectType({
    name: "Framework", 
    description: "Represents a web framework",
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        languageId: { type: new GraphQLNonNull(GraphQLInt) },
        categoryId: { type: new GraphQLNonNull(GraphQLInt) },
        imageUrl: { type: new GraphQLNonNull(GraphQLString) },
        language: { 
            type: LanguageType,
            resolve: (framework) => {
                return data.languages.find(language => language.id == framework.languageId)
            }
        }
    })
});

module.exports.LanguageType = new GraphQLObjectType({
    name: "Language",
    description: "Represents a Language",
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        imageUrl: { type: new GraphQLNonNull(GraphQLString) },
        frameworks: { 
            type: new GraphQLList(FrameworkType),
            resolve: (language) => {
                return data.webFrameworks.filter(framework => framework.languageId == language.id)
            }
        }
    })
});