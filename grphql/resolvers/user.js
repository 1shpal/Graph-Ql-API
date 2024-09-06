const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const {validateRegisterInput , validateLoginInput} = require('../../util/validators')
const {SECRET_KEY} = require('../../config')
const User = require('../../models/User')
const { UserInputError } = require('apollo-server')



/*

mutation{
   register(registerInput:{
    username:"user"
    email:"user@gmail"
    password:"123456"
    confirmPassword:"123456"
   }){
    id
    email
    token
    username
    createdAt
   }
}
*/ 
function genrateToken(user){
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
 }, SECRET_KEY , {expiresIn:'1h'})
}
module.exports = {
    Mutation: {

        async login(_,{username, password}){
         const {errors , valid} = validateLoginInput(username
            , password
         )
         if(!valid){
            throw new UserInputError("Errors" , {errors})
        }
        const user = await User.findOne({username})
        if(!user){
            errors.general = "User not found"
            throw new UserInputError('User not found',{errors})

        }

          const match = await bcrypt.compare(password , user.password)

          if(!match){
            errors.general = "Wrong password"
            throw new UserInputError('Wrong password', {errors})
          }
const token = genrateToken(user)
return {
    ...user._doc,
    id: user._id,
    token
}
        },

        async register(_, {registerInput:{username , email , password , confirmPassword}}){


            const user = await User.findOne({username})
            if(user){
                throw new UserInputError('Username is already taken',{
                    errors:{
                        username:'Username is already taken'
                    }
                })

            }

            const {valid , errors} = validateRegisterInput(username , email , password , confirmPassword)

            if(!valid){
                throw new UserInputError("Errors" , {errors})
            }
            password = await bcrypt.hash(password , 12)

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            })
            const res = await newUser.save()
            const token = genrateToken(res)

            return {
                ...res._doc,
                id: res._id,
                token
            }
    }



}
}