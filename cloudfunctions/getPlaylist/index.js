// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db=cloud.database()

const playlistCollection = db.collection('playlist')

const rp=require('request-promise')

const URL='http://musicapi.xiecheng.live/personalized'

const MAX_LIMIT=100
// 云函数入口函数
exports.main = async (event, context) => {
  //const list = await playlistCollection.get()
  //获取总条数
  const countResult=await playlistCollection.count()
  const total=countResult.total
  //得到获取批次 向上取整
  const batchTimes=Math.ceil(total/MAX_LIMIT)

  const tasks=[]
  for(let i=0;i<batchTimes;i++){
    let promise= playlistCollection.skip(i*MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }

  let list={
    data:[]
  }
  if(tasks.length>0){
    list=(await Promise.all(tasks)).reduce((acc,cur)=>{
      return{
        data:acc.data.concat(cur.data)
      }
    })
  }
  const playlist= await rp(URL).then((res)=>{
      return JSON.parse(res).result
  })
  const newData=[]
  for(let i=0,len1=playlist.length;i<len1;i++){
    let flag=true
    for(let j=0,len2=list.data.length;j<len2;j++){
      if(playlist[i].id===list.data[j].id){
        flag=false
        break
      }
    }
    if(flag){
      newData.push(playlist[i])
    }
  }
  for (let i = 0, len = newData.length;i<len;i++){
    await playlistCollection.add({
      data:{
        ...newData[i],
        createTime:db.serverDate(),
      }
    }).then((res)=>{
      console.log('插入成功')
    }).catch(console.error)
  }
  return newData.length
}