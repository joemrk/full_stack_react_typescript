import { UsernamePasswordInput } from './../resolvers/UsernamePasswordInput';


export const validateRegister = (options : UsernamePasswordInput) =>{
  if (options.username.length <= 2) {
    return [{
      field: 'username',
      message: 'username must be greater that 2'
    }]
  }
  if (!options.email.includes('@')) {
    return [{
      field: 'email',
      message: 'invalid email'
    }]
  }
  if (options.password.length <= 2) {
    return [{
      field: 'password',
      message: 'password must be greater that 3'
    }]
  }


  return null
}