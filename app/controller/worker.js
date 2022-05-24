'use strict';
//worker代表仅员工访问的路由  controller必须写在app/controller这个路径下 
const Controller = require('egg').Controller;
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const mkdirp = require('mkdirp'); //生成路径的库
const { v1: uuidv1 } = require('uuid');; //用uuid保存图片名 npmuuid库查看该文档

class WokerController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }

  async list() {
    const { ctx } = this;
    ctx.body = '<h1>jspang blog list</h1>';
  }
  //get @params 1.userid  根据用户id查询workerbasedata
  //====================================================================
  async getworkerbasedata() { //根据员工登陆表id查询workerbasedata  
    const { ctx } = this;
	    //获取用户端传递的参数
    let userid  = ctx.query.userid;//ctx.query获取get方法 url中“？”后面的数据
    console.log('getworkerbasedata接口的参数 userid等于'+userid)
    let queryResultById= await this.app.mysql.query(
      'select * from workerbasedata where userid=?',[userid]
  )
    ctx.body=queryResultById  //用ctx.body返回查询的结果
  }
//==========================================================================

//post 1.username 2.password
//==============================================================================
async login(){  //登录接口   
    console.log("test") //之前控制台一直无法输出  是因为你使用了npm start命令  npm run dev命令才是开发环境调试
    const { ctx,app } = this;  
	    //获取用户端传递的参数
    console.log(ctx.request.body) //body格式前端参数传输的格式比较特殊
    //验证data数据，判断是否登录成功  post方法用ctx.request.body获取
    const data=ctx.request.body
    
    let queryResultById= await this.app.mysql.query(
      'select id,name,roleid,isfirstlogin from user where username=? and password=?',[data.username,data.password]
    )
    
    if(queryResultById.length!=0){ //根据id当查询到数据时,返回生成的token和用户信息
        //成功则生成Token
		    //生成Token
      	const token = app.jwt.sign({ //使用egg-jwt的库来生成token
        	userID: queryResultById.id,	//需要存储的Token数据  用户id
          roleID: queryResultById.roleid 
        }, app.config.jwt.secret);
        
        ctx.body={
          token:token,
          userinfo:queryResultById
        }
    }else{ //当没有查询到数据时 
        ctx.body={
          info:"未查询到相关用户信息",
          userinfo:queryResultById
        }
    }
  }
  //==============================================================================
  async testtoken(){
    const{ ctx } = this
    console.log(ctx.state)
    ctx.body="token验证成功"
  }

  //post 1.file类型的file 2.userid
  //==============================================================================
  async uploadAvatar () { //上传头像 post方法 fomdata 传图片和一个userid的参数
    const { ctx, config } = this;
    try {
      // 0、获取fomdata传的文件和另一个参数
      let file = ctx.request.files[0];
      let userid = ctx.request.body.userid;
      console.log('获取文件', file);
      // ctx.request.files[0] 表示获取第一个文件，若前端上传多个文件则可以遍历这个数组对象
      let fileData = fs.readFileSync(file.filepath);
      // 1、获取当前日期
      let day = moment(new Date()).format('YYYYMMDD');
      console.log('1、获取当前日期', day);
      // 2、创建图片保存的路径
      let dir = path.join(config.uploadAvatarDir, day);
      console.log('2、创建图片保存的路径', dir);
      // 3、创建目录
      await mkdirp(dir);
      // 4、生成路径返回
      let temp_uuid = uuidv1(); // uuid
      let file_name = day + "_" + temp_uuid + path.extname(file.filename); // 图片文件名称
      let tempDir = path.join(dir, file_name); // 返回图片保存的路径
      console.log('返回图片保存的路径', tempDir);
      // 5、写入文件夹
      fs.writeFileSync(tempDir, fileData);
      let uploadAvatarsqlresults= await this.app.mysql.query(
        'update workerbasedata set image=? where userid =?',[file_name,userid]
      )
      console.log('sqlresult',uploadAvatarsqlresults)
      ctx.body = {
        status: 200,
        desc: '上传成功',
        data: file_name,
      }
      
    } catch(error) {
      ctx.body = {
        status: 500,
        desc: '上传失败',
        data: null
      }
    } finally {
      // 6、清除临时文件
      ctx.cleanupRequestFiles();
    }
  }
//=======================================================================================

//get @params 1.picname
//========================================================================================
  async getAvatar () { //获得头像方法 get传一个数据库里image那个字段
    const { ctx, config } = this;
    try {
      // 0、获取图片名称 这里的图片名称其实是数据库表中image那个字段
      let picname = ctx.query.picname;
      console.log('0、获取图片名称', picname);
      // 1、判断
      if(!picname) {
        ctx.body = {
          status: 400,
          desc: 'picname 参数必传',
          data: null
        }
        return;
      }
      // 拼接图片保存的路径
      let dir = path.join(config.uploadAvatarDir, [picname.split("_")[0], picname].join("/"));
      console.log('1、拼接图片保存的路径', dir);
      // 前缀
      let prefix = "data:" + path.extname(picname).slice(1) + ";base64,"
      // 读取文件 转成 base64
      let base64 = fs.readFileSync(dir, 'base64');
      console.log(prefix);
      ctx.body = {
        status: 200,
        desc: '获取成功',
        data: prefix + base64
      };
    } catch(error) {
      ctx.body = {
        status: 500,
        desc: '获取失败',
        data: null
      };
    }
  }
  //==============================================================================
  
  //更新前端table1组件基本信息
  //===========================================================
  async updateworkerbasedatabyuserid(){ //传过来的userid可能不存在 所以有存在这条数据和不存在这条数据两种情况
    const { ctx} = this;
    try{
      let data = ctx.request.body

      let name = data.name
      let sex = data.sex
      let area = data.area
      let marriage = data.marriage
      let educational = data.educational
      let shihao=data.shihao
      let canjiagongzuoshijian=data.canjiagongzuoshijian
      let idcard=data.idcard
      let userid = data.userid

      let results1 = await this.app.mysql.query( //库中是否有对应userid相关数据 有则更新 没有则新增
        'select * from workerbasedata where userid=?',[userid] 
      )
      if (results1.length ==0){
        let results2 = await this.app.mysql.insert(
          "workerbasedata",{name:name,sex:sex,area:area,marriage:marriage,educational:educational,shihao:shihao,canjiagongzuoshijian:canjiagongzuoshijian,idcard:idcard,userid:userid}
        )
        ctx.body = {
          status: 200,
          desc: '数据库中无员工信息，新增一条数据',
          data: results2
        }; 
      }else if(results1.length >0){
        let results3 = await this.app.mysql.query(
          'update workerbasedata set name = ?,sex = ?,area=?,marriage=?,educational=?,shihao=?,canjiagongzuoshijian=?,idcard=? where userid = ?',
          [name,sex,area,marriage,educational,shihao,canjiagongzuoshijian,idcard,userid]);
        
          ctx.body = {
          status: 200,
          desc: '数据库中有对应userid数据，则更新数据',
          data: results3
        }; 
      }
    }catch(error){
      ctx.body = {
        status: 500,
        desc: '数据更新失败',
        data: null
      };
    } 
  }
}

module.exports = WokerController;
