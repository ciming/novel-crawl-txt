import puppeteer from 'puppeteer'
import {createFile, writeContent} from './utils.mjs'

class Books{
  /**
   * 
   * @param bookName 小说名字
   * @param firstPage 第一章链接 
   */
  constructor(bookName, firstPage) {
    this.browser = null
    this.page = null
    this.bookName = bookName
    this.url = firstPage
    this.title = ''
    this.content = ''
    this.isNextChapter = true
    this.init()
  }
  async init() {
    createFile(`/book/${this.bookName}.txt`) 
    this.browser = await puppeteer.launch();
    this.page = await this.browser.newPage();
    this.getContent()
  }
  /**
   * 
   * @returns 获取页面信息
   */
  async getContent() {
    try {
      await this.page.goto(this.url);
      this.title = await this.page.$eval('#nr_title', el => el.innerText)
      this.content = await this.page.$eval('#nr1',  el => {
        const p = el.querySelector('p')
        p && el.removeChild(p)
        return el.innerText
      })
      this.writeFile()
      this.jumpNext()
    } catch (error) {
      
      console.log(error);
      console.log(this.url);
      this.browser.close()
      process.exit(1)
     
    }
  }
  writeFile($) {
    if(this.isNextChapter) {
      console.log(`写入《${this.title}》`)
      writeContent(`book/${this.bookName}.txt`, this.title + '\n\n')
    }
    writeContent(`book/${this.bookName}.txt`, this.content)
  }
  /**
   * 跳到下一页抓取
   */
  async jumpNext() {
    let url = await this.page.$eval('.next_chapter .jump-chapter-links',  el => el.getAttribute('href'))
    if(url.startsWith('http')) {
      console.log('结束')
    } else {
      this.url = `https://m.sbooktxt.com${url}`
      this.isNextChapter = await this.page.$eval('.next_chapter .jump-chapter-links',  el => el.innerText === '下一章')
      this.getContent()
    }
  }

}

let url = 'https://m.sbooktxt.com/wapbook/24720_165947.html' //小说第一页网址
let bookName = '亏成首富重游戏开始' //小说名称
new Books(bookName, url)