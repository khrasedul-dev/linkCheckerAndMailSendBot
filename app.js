const puppeteer = require('puppeteer')
const { Telegraf , Composer , WizardScene , Stage , session} = require('micro-bot')
const mongoose = require('mongoose')
const adminLink = require('./model/adminLinkModel')
const userLink = require('./model/userLinkModel')
const userModel = require('./model/userModel')
const apiLinkModel = require('./model/apiCallBackLink')
const axios = require('axios')
const adminLinkModel = require('./model/adminLinkModel')






// const bot =  new Telegraf('5239471949:AAFtksTOfeAQcJCg1C6VOhsnL6k6-PKdF1U')
const bot = new Composer()

mongoose.connect('mongodb+srv://rasedul20:rasedul20@cluster0.2ob31.mongodb.net/telegramProject', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch((e) => {
    console.log(e)
}).then((d) => console.log('Database connected')).catch((e) => console.log(e))


bot.use(session())



bot.start((ctx)=>{
    userModel.find({userId: ctx.from.id}).then((user)=>{

        if (user.length > 0) {

            ctx.telegram.sendMessage(ctx.chat.id , `Hello ${ctx.from.first_name || 'Anonymous'} \nWelcome to ${ctx.botInfo.username} \n\nThank you for using the bot`,{
                reply_markup: {
                    keyboard: [
                        [{text: "💌 My Mail"},{text: "📧 Change Mail"}],
                        [{text: "📋 Rules"},{text: "🔰 Help"}],
                        [{text: "👤 About"}]
                    ],
                    resize_keyboard: true
                }
            })

        } else {

            ctx.telegram.sendMessage(ctx.chat.id , `Hello ${ctx.from.first_name || 'Anonymous'} \nWelcome to ${ctx.botInfo.username} \n\nPress on "Join" button`,{
                reply_markup: {
                    inline_keyboard: [
                        [{text: "Join" , callback_data: "join"}]
                    ]
                }
            })

        }
    })
})







//--------------------------------------------link checker-----------------------------------------

bot.command('check',async (ctx)=>{
    let input = ctx.update.message.text
        input = input.replace('/check','')
        input = input.trim()
        input = input.toLowerCase()
    
    userLink.find({link : input}).then((link)=>{

        if (link.length > 0) {
            ctx.reply("Link already exists").catch((e)=>console.log(e))
        } else {
            userLink.find({link : input}).then((data)=>{
                if (data.length > 0) {
                    ctx.reply("The link already exists")
                } else {
                    
            
                    async function checkLink(url){

                        ctx.reply('Please wait ...')

                            const browser = await puppeteer.launch({
                                args: [
                                    '--ignore-certificate-errors',
                                    '--no-sandbox',
                                    '--disable-setuid-sandbox',
                                    '--disable-accelerated-2d-canvas',
                                    '--disable-gpu'
                                  ],
                                headless: true
                            })
                            
                            const page = await browser.newPage()
                        
                            await page.goto(url ,{waitUntil: 'networkidle2'})
                        
                            const html = await page.$eval('*', (el)=>el.innerText)
                        
                            const data = html.toString()
    
                            await browser.close()
                
                            return data

                       

                        
                    }
            
            
            
                    checkLink(input).then((data)=>{
            
                        const userData = data

                        console.log("Web Page Data: \n\n"+userData)
            
            
                        adminLink.find().then((data)=>{
            
                            let links = []
            
                            data.map((post)=>{
                                links.push(post.link)
                            })
            
                            const result = links.filter((pattern)=>{
                                return new RegExp(pattern,'gi').test(userData)
                            })

                            console.log("Matching word list: \n\n"+result)
            
                            if(result.length > 0){
                                
                                userModel.find({userId : ctx.from.id}).then((user)=>{
            
                                    if (user.length > 0) {
                                        const user_mail = user[0].email

                                        apiLinkModel.find().then((data)=>{
                                            const link = data[0].link

                                            axios
                                                .get(link+user_mail)
                                                .then(res => {
                                                    const data = new userLink({
                                                        userId: ctx.from.id,
                                                        userName: ctx.from.username,
                                                        link: input
                                                    })
                                                    
                                                    data.save().then(()=>{
                                                        ctx.reply("Please check your mailbox")
                                                    }).catch((e)=>console.log(e))

                                                })
                                                .catch(err => ctx.reply("Something is wrong"))
                                        
                                        }).catch((e)=>console.log(e))
                                        
                                    } else {
                                        ctx.reply('Please join first')
                                    }
                                }).catch((e)=>console.log(e))
            
            
                            }else{
                                ctx.reply("This is an invalid link")
                            }
                            
                        }).catch((e)=>console.log(e))
                        
            
                    }).catch((e)=>console.log(e))
            
            
                }
            
            }).catch((e)=>console.log(e))
        }
    }).catch((e)=>console.log(e))

})







//---------------------------------------------add link0-------------------------------------

bot.command('addlink',ctx=>{
    let input = ctx.update.message.text
        input = input.replace('/addlink','')
        input = input.trim()
        input = input.toLowerCase()
    
    adminLink.find({link: input}).then((links)=>{
        if (links.length > 0) {
            ctx.reply('Links already exists')
        } else {
            
            const data = new adminLink({
                userId: ctx.from.id,
                userName: ctx.from.username,
                link: input
            })
            
            data.save().then(()=>ctx.reply('Link added succesfuly')).catch((e)=>console.log(e))
        }
    }).catch((e)=>console.log(e))
})



bot.command('deletelink',ctx=>{
    let input = ctx.update.message.text
        input = input.replace('/deletelink','')
        input = input.trim()
        input = input.toLowerCase()
    
    adminLink.find({link: input}).then((links)=>{
        if (links.length > 0) {
            
            adminLink.deleteOne({link : input}).then(()=>ctx.reply("Link sucessfully delete")).catch((e)=>console.log(e))

        } else {
            
            ctx.reply("The link does not exists")
            
            
        }
    }).catch((e)=>console.log(e))
})




bot.command('addapilink',ctx=>{

    let input = ctx.update.message.text
        input = input.replace('/addapilink','')
        input = input.trim()
        input = input.toLowerCase()

    apiLinkModel.find({}).then((data)=>{
        if (data.length > 0) {

            const id = data[0]._id

            const update = {
                link: input
            }

            apiLinkModel.updateOne({_id: id}, update).then(()=>ctx.reply('API Link Update succesfuly')).catch((e)=>console.log(e))

            
        } else {
            const data = new apiLinkModel({
                userId: ctx.from.id,
                userName: ctx.from.username,
                link: input
            })
            data.save().then(()=>ctx.reply('API Link added succesfuly')).catch((e)=>console.log(e))
        }
        
    }).catch((e)=>console.log(e))
})


// ------------------------------------------------User input-------------------------------------
const scene = new WizardScene('user_input',
    (ctx)=>{

        ctx.reply("Kindly enter your valid email")

        return ctx.wizard.next()
    },
    (ctx)=>{

        const input = ctx.update.message.text || 'test'

        const result = input.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/gi) || ''


        if (result.length > 0 ) {

            userModel.find({userId: ctx.from.id}).then((user)=>{

                if (user.length > 0) {

                    userModel.updateOne({userId: ctx.from.id },{email: input}).then(()=>{

                        ctx.telegram.sendMessage(ctx.chat.id , `Thank you for updating your email`).catch((e)=>console.log(e))

                    }).catch((e)=>console.log(e))

                    return ctx.scene.leave()
                    
                } else {
                    const data = new userModel({
                        userId: ctx.from.id,
                        userName: ctx.from.first_name,
                        email: input
                    })
            
                    data.save().then(()=>{
            
                        ctx.telegram.sendMessage(ctx.chat.id , `Hello ${ctx.from.first_name || 'Anonymous'} \nWelcome to ${ctx.botInfo.username} \n\nThank you for sharing your email with us`,{
                            reply_markup: {
                                keyboard: [
                                    [{text: "💌 My Mail"},{text: "📧 Change Mail"}],
                                    [{text: "📋 Rules"},{text: "🔰 Help"}],
                                    [{text: "👤 About"}]
                                ],
                                resize_keyboard: true
                            }
                        })
            
                    }).catch((e)=>console.log(e))
            
                    return ctx.scene.leave()
                }

            }).catch((e)=>console.log(e))
            
        }else{

            ctx.reply("Kindly enter your valid email").catch((e)=>console.log(e))
            return ctx.wizard.back()

        }

    }

)

const stage = new Stage([scene])

bot.use(stage.middleware())


bot.hears('👤 About',ctx=>{
    ctx.reply('About not complete yet')
})

bot.hears('🔰 Help',ctx=>{
    ctx.reply('Help not complete yet')
})

bot.hears('📋 Rules',ctx=>{
    ctx.reply('Rules not complete yet')
})

bot.hears('💌 My Mail',ctx=>{
    userModel.find({userId: ctx.from.id}).then((user)=>{
        if (user.length > 0) {
            ctx.reply(`${user[0].email}`)
        } else {
           ctx.reply('Please join first') 
        }
    }).catch((r)=>console.log(e))
})

bot.hears('📧 Change Mail',Stage.enter('user_input'))

bot.action('join',Stage.enter('user_input'))



// bot.launch().then(()=>console.log("Bot stared")).catch((e)=>console.log(e))
module.exports = bot

