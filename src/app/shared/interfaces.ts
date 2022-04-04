export interface User {
  email: string,
  password: string
}

export interface Category {
  _id?: string
  imageSrc?: string
  name: string
  user?: string
}


