const puppeteer = require("puppeteer-core");
// const StealthPlugin = require('puppeteer-extra-plugin-stealth')
// puppeteer.use(StealthPlugin())
const {getCanvasData,gotoTargetPosition,saveFullBg,getElAttrs,mouseup,mousedown} = require("./mycaptcha");
const fs = require('fs').promises;
const child_process = require('child_process');
const request = require("request");
//const { createCanvas, loadImage,Image } = require('canvas');
const sendMail = require("./mail");

const picBG = './assets/fullBg.png'
const picBlock =  './assets/block.png'
let timeout = function (delay) {
	
	
     return new Promise((resolve, reject) => {   
           setTimeout(() => {   
                  try {
                      resolve(1)
                  } catch (e) {
                      reject(0)
                   }
           }, delay);
     })
 }

const Daka = async () => {	
		const browser = await puppeteer.launch({
			slowMo: 100,    //放慢速度
			headless: false, //开启可视化
			devtools: true,
			defaultViewport: {width: 1920, height: 1080},
			executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe", //Chrome路径, 可以右键Chrome->属性->目标
			ignoreHTTPSErrors: false, //忽略 https 报错
			//args: ['--window-size=1,1']  //
		});
	  
		const page = await browser.newPage(); // 打开一个页面, page就是后序将要操作的  
		page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36")
		//删除 webdriver属性
		// await page.evaluateOnNewDocument(() => {
		// 	const newProto = navigator.__proto__;
		// 	delete newProto.webdriver;
		// 	navigator.__proto__ = newProto;
		//   });
		
		// 打开拦截请求
		// await page.setRequestInterception(true);
		// // 请求拦截器
		// // 这里的作用是在所有js执行前都插入我们的js代码抹掉puppeteer的特征
		
		// page.on("request", async(req, res2) => {
		// 	// 非js脚本返回
		// 	// 如果html中有inline的script检测html中也要改，一般没有
		// 	if (req.resourceType() !== "script") {
		// 		req.continue()
		// 		return
		// 	}
		// 	// 获取url
			
		// 		const url = req.url()
		// 		await new Promise((resolve, reject) => {
		// 		// 使用request/axios等请求库获取js文件
		// 		request.get(url, (err, _res) => {
		// 		   // 删掉navigator.webdriver
		// 		   // 这里不排除有其它特征检测，每个网站需要定制化修改
		// 			if (err){					
		// 				resolve()
		// 			}
		// 			if (_res){
		// 				//&& delete Navigator.prototype.webdriver
		// 				let newRes = "navigator.webdriver && delete Navigator.prototype.webdriver;" + _res.body
		// 				// 返回删掉了webdriver的js
		// 				req.respond({
		// 					body: newRes
		// 				})
		// 				resolve()
		// 			}
					
		// 		})
		// 	})		
		// 	//.catch(error => console.log("request error is ",error))

		// })
	  
	  try {
		await page.goto("http://eportal.uestc.edu.cn", { waitUntil: "domcontentloaded" }); //页面跳转, 第二个参数为可选options, 这里表示等待页面结构加载完成, 无需等待img等资源
		console.log("登录页加载成功!"); //控制台输出一下进度
		// 登陆
		/* await page.screenshot({
		  path: './files/eportal.png',  //图片保存路径
		  type: 'png',
		  fullPage: false //边滚动边截图
		  // clip: {x: 0, y: 0, width: 1920, height: 800}
	  	}); */

		let loginbtn = await page.$("#ampHasNoLogin");
		
		await Promise.all([
			loginbtn.hover(2000),
			loginbtn.focus(),		
			//clickBtnAsAHuman(page,loginbtn)
			loginbtn.click(),
			page.waitForNavigation()  
		]);		
		//await page.goto("https://idas.uestc.edu.cn/authserver/login?service=http%3A%2F%2Feportal.uestc.edu.cn%2Flogin%3Fservice%3Dhttp%3A%2F%2Feportal.uestc.edu.cn%2Fnew%2Findex.html",{waitUntil:"domcontentloaded"});
		//await timeout(50);
		const username = await page.$("#username");
		await username.type('201822010814',{delay:100});
		
		const passwd =  await page.$("#password");
		await passwd.type("qkf19951115",{delay:100})
		await page.waitForTimeout(30000)
		let submitbtn = await page.$("#casLoginForm > p:nth-child(4) > button");
		submitbtn.hover(100);
		submitbtn.focus();
		submitbtn.click();		
		//验证码破解
		// 验证码图片（带缺口)
		await page.waitForTimeout(3000);
		//test captcha
		
		var needCaptacha =await  page.evaluate(()=> {
			//调试
			return new Promise((resolve, reject) => {
				if (document.querySelector('#img1') != null) resolve("Yes")
				else resolve("No")
			})
			 
		});
		await needCaptacha;
		if(needCaptacha=="Yes"){
			console.log("请完成验证码拼图");	
			await saveFullBg(page,'#img1',picBG)
			await saveFullBg(page,'#img2',picBlock)
			console.log("拼图图片保存完成")
			
			
			const distance =await getCaptchaOffset(picBG,picBlock);
			console.log("滑块offset= " + distance);	
			// 滑块
			const {sliderAttrs, barAttrs} = await getElAttrs(page)
			await mousedown(page, sliderAttrs)    
			await gotoTargetPosition(page, distance,sliderAttrs,barAttrs)			
			await mouseup(page)
		}else{
			console.log("不需要验证码")
		}
		
		// 等待验证结果
		await page.waitForTimeout(3000);
		//进入系统		
		
		//点击按钮后，等待新tab对象
		// 研究生健康
		await clickBtnAsAHuman(page,'widget-app-item:nth-child(1) > div > div')
		const target = await browser.waitForTarget(t => t.url().includes('http://eportal.uestc.edu.cn/jkdkapp/sys/lwReportEpidemicStu'));	
		const newPage = await target.page();	
		// 新增打卡
		await clickBtnAsAHuman(newPage,"body > main > article > section > div.bh-mb-16 > div");
		//保存
		await newPage.evaluate(()=>{	
			console.log(document.querySelector('#save'))
			document.querySelector('#save').click()
		});
		//确认		注入JS
		await newPage.evaluate(()=> {
			//调试
			console.log(document.querySelector('.bh-color-primary-5'))
			document.querySelector('.bh-color-primary-5').click()
		});
		
		await newPage.waitForTimeout(2000)
		//const savebtn =await newPage.waitForSelector("#save")
		//await savebtn.click()
		console.log(Date()," 打卡成功  ")	
		await browser.close();
		return "success"
		
	  }catch (err) {
		console.log("签到过程出错了!" , err);
		await browser.close();		
		//throw err;
	  } 
  
};
async  function clickBtnAsAHuman(page,selector){
		const newbtn = await page.waitForSelector(selector);
		//在点击按钮之前，事先定义一个 Promise，用于返回新 tab 的 Page 对象	
		// 轨迹模拟
		const newbtn_box = await newbtn.boundingBox();
		const destx1 = newbtn_box.x + newbtn_box.width/2
		const desty1 = newbtn_box.y+ newbtn_box.height/2
		
		//3 step 		
		await page.mouse.move(destx1,desty1,{steps:20});
		await newbtn.focus();
		await newbtn.click();	
		await page.waitForTimeout(2000)
}
async  function getCaptchaOffset(imgpath1,imgpath2) {
	return new Promise((resolve, reject) => {
		
		var workerProcess = child_process.exec('python ./captcha.py'+" "+ imgpath1+" "+ imgpath2, function (error, stdout, stderr) {
        if (error) {
            console.log(error.stack);
            console.log('Error code: '+error.code);
            console.log('Signal received: '+error.signal);
        }
		if (stderr){
			console.log('stderr: ' + stderr);
		}
			console.log('stdout: ' + stdout);			      			
			resolve(stdout*278/590)
		});		
		workerProcess.on('exit', function (code) {
			console.log('子进程已退出，退出码 '+code);
		});
		
		
	})	
	
}
const main = async () => {
	var ret = await Daka()
	while (ret != "success"){
		console.log("Another Try again")
		ret = await Daka()
	}
	sendMail(`Success Check in at ${new Date().toLocaleString()}`);
	process.exit()
}
module.exports = Daka
main()
//main()