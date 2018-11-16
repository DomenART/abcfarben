import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import Page from './Page'

const mutationUpdateProfile = gql`
mutation updateProfile(
  $firstname: String!,
  $secondname: String,
  $city: String,
  $country: String,
  $subdivision: String,
  $sphere: String,
  $about: String,
  $email: String!,
  $email_public: Boolean,
  $phone: String,
  $phone_public: Boolean,
  $skype: String,
  $skype_public: Boolean
) {
  updateProfile(
    firstname: $firstname,
    secondname: $secondname,
    city: $city,
    country: $country,
    subdivision: $subdivision,
    sphere: $sphere,
    about: $about,
    email: $email,
    email_public: $email_public,
    phone: $phone,
    phone_public: $phone_public,
    skype: $skype,
    skype_public: $skype_public
  ) {
    id
    name
    firstname
    secondname
    city
    country
    subdivision
    sphere
    about
    email
    email_public
    phone
    phone_public
    skype
    skype_public
  }
}
`
const mutationChangeAvatar = gql`
mutation ChangeAvatar($avatar: Upload!) {
  changeAvatar(avatar: $avatar) {
    id
    avatar
  }
}
`
export default compose(
  graphql(mutationUpdateProfile, {name:'updateProfile'}),
  graphql(mutationChangeAvatar, {name:'changeAvatar'})
)(Page)