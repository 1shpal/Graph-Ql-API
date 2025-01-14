const { gql } = require("apollo-server");

module.exports = gql`
type Post{
    id:ID!
    body:String!
    username: String!
}
input RegisterInput{
    username:String!
    password:String!
    confirmPassword:String!
    email:String!
}

type User{
    id:ID!
    email:String!
    token:String!
    username:String!
    createdAt:String!
}
    type Query{
        getPost:[Post]
    }  

    type Mutation{
        register(registerInput: RegisterInput): User!
        login(username: String!, password: String!): User!
    }    
`