var {
	DOMParser
} = require('xmldom');
const schedule = require('node-schedule');
const util = require('./common.js');
// const superagent = require('superagent');

let pageData = {
	dsq: {
		async run(cron, fun) {

			schedule.scheduleJob(cron, fun)

		},
		async baijie() {
			let i = 0,
				$t = this;

			$t.run("*/2 * * * * ?", () => {
				pageData.bajie.inseart({
					uuid: "--" + i,
					name: "text"+i
				});
				i++;
			})
			
			// setInterval(()=>{
			// 		pageData.bajie.inseart({
			// 			uuid: "--" + Math.random()*100,
			// 			name: "text"
			// 		});
			// 		i++;
			// },2*1000)
		},
		async pub() {
			this.baijie();
		},
	},

	bajie: {
		url: "http://www.zuidazy5.com",
		async inseart(obj) {
			//先查询有没有  再insert 进数据库
			let db = uniCloud.database(),
				collection = db.collection('movies'),
				result = {};

			try {
				let {
					updated
				} = await collection.where({
					uuid: obj.uuid
				}).update(obj);
				if (updated == 0) {
					result = await collection.add(obj);
				}
			} catch (e) {

			}
			return result

		},
		async getData() {
			let baseU = this.url,
				$ba = this;
			util.init();

			let execuFun = {
				async page(url) {


					let result = await uniCloud.httpclient.request(url, {
							method: 'get',
							dataType: 'text'
						}),
						$t = this;
					let doc = new DOMParser().parseFromString(result.data, 'text/html').documentElement;
					let e = doc.getElementsByTagName("a");
					let urls = [];
					for (let i = 0, len = e.length; i < len; i++) {
						let curr = e[i];
						if (curr.parentNode.getAttribute("class").indexOf("xing_vb4") > -1) {
							//过滤福利篇
							if (curr.parentNode.parentNode.textContent.indexOf("福利片") == -1) {

								let path = baseU + curr.getAttribute("href");

								urls.push(path);
								// await new Promise((resolve, reject) => {setTimeout(()=>{resolve()},2*1000) });
							}
						}
					}

					let rs = [];
					for (let i = 0, len = urls.length; i < len; i++) {
						let k = await $t.detail(urls[i]);
						rs.push(k)
					}
					return rs;
				},
				async detail(url) {


					// uniCloud.logger.log(url+"============");

					let result = await uniCloud.httpclient.request(url, {
							method: 'get',
							dataType: 'text'
						}),
						$t = this,
						obj = {},
						plays = {};

					let doc = new DOMParser().parseFromString(result.data, 'text/html').documentElement;



					//循环div 获取基本信息

					try {
						util.note2list(doc.getElementsByTagName("div")).forEach(curr => {
							let className = curr.getAttribute("class");
							if (className.indexOf("vodImg") > -1) {
								obj.pic = curr.getElementsByTagName("img")[0].getAttribute("src");
							} else if (className.indexOf("vodh") > -1) {
								obj.name = curr.getElementsByTagName("h2")[0].textContent;
								obj.definition = curr.getElementsByTagName("span")[0].textContent;
								obj.rate = curr.getElementsByTagName("label")[0].textContent;
							} else if (className.indexOf("vodinfobox") > -1) {
								util.note2list(curr.getElementsByTagName("li")).forEach((co, index) => {
									switch (index) {

										case 0:
											obj.alias = co.textContent.split("：")[1];
											break;
										case 1:
											obj.director = co.textContent.split("：")[1];
											break;
										case 2:
											obj.start = co.textContent.split("：")[1];
											break;
										case 3:
											obj.type = co.textContent.split("：")[1];
											break;
										case 4:
											obj.address = co.textContent.split("：")[1];
											break;
										case 6:
											obj.year = co.textContent.split("：")[1];
											break;

									}
								})
							} else if (className.indexOf("vodplayinfo") > -1) {
								if (curr.parentNode.getAttribute("class").indexOf("playBox") > -1) obj.introduce = obj.introduce ? obj.introduce :
									curr.firstChild.data;
							}
						})

					} catch (e) {
						uniCloud.logger.error(e, 1)
					}

					//获取播放链接
					let $p, $p2, $down, suf;



					try {
						$p = doc.parentNode.getElementById("play_1"), $p2 = doc.parentNode.getElementById("play_2"), $down = doc.parentNode
							.getElementById("down_1"), suf = $p.getElementsByTagName("span")[0].textContent.toLowerCase();
						if (suf.indexOf("m3u8") == -1) $p = $p2;
						util.note2list($p.getElementsByTagName("li")).forEach((curr) => {
							let ls = curr.textContent.split("$"),
								index = ls[0];
							if (!String.HasText(plays[index])) plays[index] = [];

							plays[index].push(ls[1]);
						})

					} catch (e) {
						uniCloud.logger.error(e)
					}


					try {
						if (String.HasText($down)) util.note2list($down.getElementsByTagName("li")).forEach((curr) => {
							let ls = curr.textContent.split("$"),
								index = ls[0];
							if (!String.HasText(plays[index])) plays[index] = [];
							plays[index].push(ls[1]);
						})
					} catch (e) {
						uniCloud.logger.error(e)
						uniCloud.logger.error(url)
					}


					//移除空格
					Object.keys(obj).forEach(curr => {
						let v = obj[curr];
						if (typeof v == "string") {
							obj[curr] = v.trim();
						}
					})







					//保存到数据库
					obj.formd = 1;

					uniCloud.logger.error(obj)


					try {

						let keys = Object.keys(plays),
							isOne = obj.definition && obj.definition.indexOf("集") < 0;

						if (keys.length == 1 && isOne) {
							//电影类

							obj.models = 1;
							obj.uuid = util.md5(obj.name + obj.type + obj.year + obj.model);
							for (let i = 0, len = keys.length; i < len; i++) {
								const purls = plays[keys[i]];
								obj.play_url_1 = "";
								obj.play_url_2 = "";
								obj.play_url_3 = ""
								purls.forEach((curr, s) => {
									if (s < 3) obj["play_url_" + (s + 1)] = curr;
								});
							}
							//保存


							await $ba.inseart(obj);;


						} else {
							obj.models = 2;
							obj.vid = util.md5(obj.name + obj.type + obj.year + obj.model + "abc");
							obj.uuid = util.md5(obj.name + obj.type + obj.year + obj.model);


							await $ba.inseart(obj);


							for (let i = 0, len = keys.length; i < len; i++) {
								const purls = plays[keys[i]];
								obj.index = keys[i];
								obj.play_url_1 = "";
								obj.play_url_2 = "";
								obj.play_url_3 = ""
								purls.forEach((curr, s) => {
									if (s < 3) obj["play_url_" + (s + 1)] = curr;
								});

								obj.models = 3;
								obj.uuid = util.md5(obj.name + obj.type + obj.year + obj.model + obj.index);

								let sobj = Object.assign({}, obj);
								sobj.alias = "", sobj.name = "", sobj.start = "", sobj.director = "", sobj.year = "", sobj.address = "",
									sobj.type = "", sobj.introduce = "";

								await $ba.inseart(sobj);;
							}

						}

					} catch (e) {

					}


				},
				async all() {
					await this.page(baseU);
					// for(let i = 1;i<5;i++){

					//  await new Promise(resolve => { setTimeout(()=>{resolve()},3*1000) });
					//  await this.page(baseU+"/?m=vod-index-pg-"+(i+1)+".html");
					// }
				},
			};

			await execuFun.all();

			return {
				a: 1
			};





			// return execuFun.detail("http://www.zuidazy5.com/?m=vod-detail-id-78983.html");;

		}

	},
	ziyuan: {

	}
};
// pageData.bajie.getData();
module.exports = pageData;
