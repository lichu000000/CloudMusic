// 云函数入口文件
const cloud = require('wx-server-sdk')

const TcbRouter = require('tcb-router')

const rp=require('request-promise')

const BASE_URL='http://musicapi.xiecheng.live'
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
 const app=new TcbRouter({event})

 app.router('playlist',async(ctx,next)=>{
   ctx.body = await cloud.database().collection('playlist')
     .skip(event.start)
     .limit(event.count)
     .orderBy('createTime', 'desc')
     .get()
     .then((res) => {
       return res
     })
 })

 app.router('musiclist',async(ctx,next)=>{
   ctx.body=await rp(BASE_URL+'/playlist/detail?id='+parseInt(event.playlistId))
   .then((res)=>{
     return JSON.parse(res)
   })
 })

 app.router('musicUrl',async(ctx,next)=>{
  ctx.body= await rp(BASE_URL+`/song/url?id=${event.musicId}`).then((res)=>{
     return res
   })
 })
return app.serve()
}
