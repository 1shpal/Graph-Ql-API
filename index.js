const {ApolloServer } = require('apollo-server')
const {gql} = require('apollo-server')
const mongoose = require('mongoose')

const Post = require('./models/Post')
const {MONGODB} = require('./config')
const typeDefs = require('./grphql/typeDefs')
const resolvers = require('./grphql/resolvers')


const servar = new ApolloServer({
    typeDefs,
    resolvers
})
mongoose.connect(MONGODB , {useNewUrlParser:true}).then(()=>{
    return servar.listen({port  : 3000})
}).then(res=>{
    console.log(`Servar is running at ${res.url}`);
    
})


