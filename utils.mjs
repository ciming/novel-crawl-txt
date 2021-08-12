import path from 'path'
import fs from 'fs'

const __dirname = process.cwd()
/**
 * 创建文件夹
 *
 * @param {any} to
 */
 export const createFile = function (filePath) {
  //文件写入
  const to = path.join(__dirname, filePath)
 
  const sep = path.sep
  const folders = path.dirname(to).split(sep)
  const file = path.basename(to)
  let p = ''
  while (folders.length) {
    p += folders.shift() + sep
    if (!fs.existsSync(p)) {
      fs.mkdirSync(p)
    }
  }
  const filep = path.join(p, file)
  if(!fs.existsSync(filep)) {
    fs.createWriteStream(filep)
  }
  
}

export const writeContent = function(file, content) {
  fs.appendFileSync(
    path.join(__dirname, file),
    content,
    function (err) {
      if (err) reject(err)
      
    },
  )
}

/**
 *
 * 去除所有空格
 * @param {any} str
 * @param {any} is_global
 * @returns
 */
 export const contentTrim = function (str, is_global = false) {
  var result
  result = str.replace(/<br>/g, '\n')
  if (is_global.toLowerCase() == "g")
  {
      result = result.replace(/\s/g, "");
  }
  return result
}
