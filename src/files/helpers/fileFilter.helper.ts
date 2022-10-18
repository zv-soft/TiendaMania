export const fileFilter = (req: Express.Request, file: Express.Multer.File, collback: Function) =>{

  if(!file) return collback(new Error('File is Empty'), false)

  const fileExt = file.mimetype.split('/')[1]
  const validExt = ['jpg', 'png', 'jpeg']

  if(!validExt.includes(fileExt))
    return collback(new Error('File is Empty'), false)

  collback(null, true)
}