// let input = ctx.update.message.text
//         input = input.replace('/add','')
//         input = input.trim()
//         input = input.toLowerCase()

//     const browser = await puppeteer.launch({
//         args: [
//             '--no-sandbox',
//             '--disable-setuid-sandbox',
//           ],
//         headless: true
//     })
    
//     const page = await browser.newPage()

//     await page.goto(input ,{waitUntil: 'networkidle2'})

//     const html = await page.$$eval('body>div', (div)=>div.map((text)=>text.textContent))

//     const data = html.toString()









// userLink.find({link : input}).then((data)=>{
//     if (data.length > 0) {
//         ctx.reply("The link already exists")
//     } else {
        

//         async function checkLink(url){
//             const browser = await puppeteer.launch({
//                 args: [
//                     '--no-sandbox',
//                     '--disable-setuid-sandbox',
//                   ],
//                 headless: true
//             })
            
//             const page = await browser.newPage()
        
//             await page.goto(url ,{waitUntil: 'networkidle2'})
        
//             const html = await page.$$eval('body>div', (div)=>div.map((text)=>text.textContent))
        
//             const data = html.toString()

//             return data
//         }



//         checkLink(input).then((data)=>{

//             const userData = data


//             adminLink.find().then((data)=>{

//                 let links = []

//                 data.map((post)=>{
//                     links.push(post.link)
//                 })

//                 const result = links.filter((pattern)=>{
//                     return new RegExp(pattern,'gi').test(userData)
//                 })

//                 if(result){
                    
//                     userModel.find({userId : ctx.from.id}).then((user)=>{

//                         if (user.length > 0) {
//                             const user_mail = user[0].email
//                             sendMail(user_mail,ctx)
//                         } else {
//                             ctx.reply('Please join first')
//                         }
//                     }).catch((e)=>console.log(e))

                    



//                 }else{
//                     ctx.reply("This is an invalid link")
//                 }
                
//             }).catch((e)=>console.log(e))
            

//         }).catch((e)=>console.log(e))


//     }

// }).catch((e)=>console.log(e))










