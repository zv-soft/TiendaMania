import {v4 as uuid} from 'uuid'

export const fileNamer = (req: Express.Request, file: Express.Multer.File, collback: Function) =>{

  if(!file) return collback(new Error('File is Empty'), false)

  const fileExt = file.mimetype.split('/')[1]

  const fileName = `${uuid()}.${fileExt}`

  collback(null, fileName)
}