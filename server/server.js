const express = require('express');
const data = require('./data');
//const models = require('./models');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const cors = require('cors')
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt,
} = require('graphql');
const app = express();

const FrameworkCategoryType = new GraphQLObjectType({
    name: "FrameworkCategory",
    description: "A category of frameworks",
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        imageUrl: { type: new GraphQLNonNull(GraphQLString) },
        frameworks: {
            type: new GraphQLList(FrameworkType),
            resolve: (category) => {
                console.log("Category: ", category.fra);
                return data.frameworks.filter(fw => fw.categoryId == category.id);
            }
        }
    })
})

const FrameworkType = new GraphQLObjectType({
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

const LanguageType = new GraphQLObjectType({
    name: "Language",
    description: "Represents a Language",
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        imageUrl: { type: new GraphQLNonNull(GraphQLString) },
        frameworks: { 
            type: new GraphQLList(FrameworkType),
            resolve: (language) => {
                return data.frameworks.filter(framework => framework.languageId == language.id)
            }
        }
    })
});

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root query',
    fields: () => ({
        frameworks: {
            type: new GraphQLList(FrameworkType),
            description: "List of all Frameworks", 
            resolve: () => data.frameworks
        },
        languages: { 
            type: new GraphQLList(LanguageType),
            description: "List of all Languages",
            resolve: () => data.languages 
        },
        categories: { 
            type: new GraphQLList(FrameworkCategoryType),
            description: "List of framework categories",
            resolve: () => data.frameworkCategories
        },
        language: {
            type: LanguageType,
            description: "A single language",
            args: { 
                id: { type: new GraphQLNonNull(GraphQLInt) } 
            },
            resolve: (parent, args) => data.languages.find(lang => lang.id == args.id)
        },
        framework: { 
            type: FrameworkType,
            description: "A single framework",
            args: { 
                id: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => data.frameworks.find(fw => fw.id == args.id)
        },
        category: { 
            type: FrameworkCategoryType,
            description: "A single framework category",
            args: { 
                id: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => data.frameworkCategories.find(fc => fc.id == args.id)
        }
    })
});

const RootMutationType = new GraphQLObjectType({
    name: "Mutation",
    description: "Root mutation",
    fields: () => ({
        addLanguage: {
            type: LanguageType,
            description: "Add a language",
            args: { 
                name: { type: new GraphQLNonNull(GraphQLString) },
                imageUrl: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => {
                const language = {id: data.languages.length + 1, name: args.name, imageUrl: args.imageUrl};
                data.languages.push(language);
                return language;
            }
        },
        addFramework: { 
            type: FrameworkType,
            description: "Add a framework",
            args: { 
                name: { type: new GraphQLNonNull(GraphQLString) },
                languageId: { type: new GraphQLNonNull(GraphQLInt) },
                imageUrl: { type: new GraphQLNonNull(GraphQLString) },
                categoryId: { type: new GraphQLNonNull(GraphQLInt) }
                      
            },
            resolve: (parent, args) => {
                const framework = {id: data.frameworks.length + 1,
                                   name: args.name,
                                   languageId: args.languageId,
                                   imageUrl: args.imageUrl,
                                    categoryId: args.categoryId};
                data.frameworks.push(framework);
                return framework;
            }
        },
        addCategory: {
            type: FrameworkCategoryType,
            description: "Add a framework category",
            args: { 
                name: { type: new GraphQLNonNull(GraphQLString) },
                imageUrl: { type: new GraphQLNonNull(GraphQLString) }

            },
            resolve: (parent, args) => {
                console.log("Args: ", args);
                const category = {id: data.frameworkCategories.length + 1,
                                    name: args.name,
                                    imageUrl: args.imageUrl}
                data.frameworkCategories.push(category);
                return category;
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
});

app.use(cors())
app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}));

app.listen(5000, () => console.log("Server is running"));