export default {
	ranks:{
		  conditions:{
		    "1":{
		      keys:"动作片,喜剧片,爱情片,科幻片,恐怖片,剧情片,战争片,纪录片".split(","),
		      years:[{name:"2020",value: "2020"},{name:"2019",value: "2019"}, {name:"2018",value: "2018"}, {name:"2017",value: "2017"}, {name:"2016",value: "2016"}, {name:"2015",value: "2015"}, {name:"2014",value: "2014"}, {name:"2013",value: "2013"}, {name:"2012",value: "2012"}, {name:"2011",value: "2011"}, {name:"00年代 ",value: "2000,2010"}, {name:"90年代 ",value: "1990,1999 "}, {name:"80年代 ",value: "1980,1989 "}, {name:"更早 ",value: "0,1989 " }],
		      address:[{name:"美国",value:"美国" },{name:"大陆",value:"大陆" },{name:"香港",value:"香港" },{name:"韩国",value:"韩国" },{name:"日本",value:"日本" },{name:"法国",value:"法国" },{name:"英国",value:"英国" },{name:"德国",value:"德国" },{name:"台湾",value:"台湾" },{name:"泰国",value:"泰国" },{name:"印度",value:"印度" }]
		    },
		    "2":{
		      keys:"国产,香港,台湾,韩国,日本剧,欧美剧,海外剧,纪录片".split(","),
		      years:[{name:"2020",value: "2020"},{name:"2019",value: "2019"}, {name:"2018",value: "2018"}, {name:"2017",value: "2017"}, {name:"2016",value: "2016"}, {name:"2015",value: "2015"}, {name:"2014",value: "2014"}, {name:"2013",value: "2013"}, {name:"2012",value: "2012"}, {name:"2011",value: "2011"}, {name:"00年代 ",value: "2000,2010"}, {name:"90年代 ",value: "1990,1999 "}, {name:"80年代 ",value: "1980,1989 "}, {name:"更早 ",value: "0,1989 " }],
		      address:[{name:"台湾",value:"台湾"}, {name:"日本",value:"日本"}, {name:"日韩",value:"日韩"}, {name:"韩国",value:"韩国"}, {name:"香港",value:"香港"}, {name:"泰国",value:"泰国"}, {name:"美国",value:"美国"}, {name:"欧美",value:"欧美"}, {name:"土耳其",value:"土耳其"}, {name:"英国",value:"英国,英國"}, {name:"澳大利亚",value:"澳大利亚"}, {name:"西班牙",value:"西班牙"}, {name:"墨西哥",value:"墨西哥"}, {name:"加拿大",value:"加拿大"}, {name:"德国",value:"德国"}, {name:"法国",value:"法国"}, {name:"意大利",value:"意大利"}, {name:"丹麦",value:"丹麦"}, {name:"加拿大",value:"加拿大"}, {name:"土耳其",value:"土耳其"}, {name:"俄罗斯",value:"俄罗斯"}, {name:"比利时",value:"比利时"}, {name:"印度",value:"印度"}, {name:"瑞典",value:"瑞典"}, {name:"巴西",value:"巴西"}, {name:"冰岛",value:"冰岛"}, {name:"中国大陆",value:"国内,大陆"}, {name:"海外",value:"海外"}]
		    },
		    "3":{
		      keys:[],
		      years:[{name:"2020",value: "2020"},{name:"2019",value: "2019"}, {name:"2018",value: "2018"}, {name:"2017",value: "2017"}, {name:"2016",value: "2016"}, {name:"2015",value: "2015"}, {name:"2014",value: "2014"}, {name:"2013",value: "2013"}, {name:"2012",value: "2012"}, {name:"2011",value: "2011"}, {name:"00年代 ",value: "00年代 "}, {name:"90年代 ",value: "90年代 "}, {name:"80年代 ",value: "80年代 "}, {name:"更早 ",value: "更早 " }],
		      address:[{name:"大陆",value:"大陆"},{name:"韩国",value:"韩国"},{name:"香港",value:"香港"},{name:"日本",value:"日本"},{name:"泰国",value:"泰国"} ,{name:"美国",value:"美国"},{name:"台湾",value:"台湾"},{name:"中国",value:"中国,大陆"}]
		    },
		
		    "4":{
		      keys:[],
		      years:[{name:"2020",value: "2020"},{name:"2019",value: "2019"}, {name:"2018",value: "2018"}, {name:"2017",value: "2017"}, {name:"2016",value: "2016"}, {name:"2015",value: "2015"}, {name:"2014",value: "2014"}, {name:"2013",value: "2013"}, {name:"2012",value: "2012"}, {name:"2011",value: "2011"}, {name:"00年代 ",value: "00年代 "}, {name:"90年代 ",value: "90年代 "}, {name:"80年代 ",value: "80年代 "}, {name:"更早 ",value: "更早 " }],
		      address:[{name:"大陆",value:"大陆"},{name:"日本",value:"日本" },{name:"欧美",value:"欧美" },{name:"国产",value:"国产" },{name:"其他",value:"其他" }]
		    }
		  }
	},
	webs:{
		"4":"https://m.v.qq.com/index.html",
		"3":"https://youku.com",
		"2":"https://m.mgtv.com/channel/home",
		"1":"https://m.iqiyi.com/",
		
	},
	start: {
		tabs: [{
			pic: "/static/img/way/way-1.png",
			name: "爱奇艺",
			path: "/public/films/web?type=1"
		}, {
			pic:"/static/img/way/way-2.png",
			name: "芒果视频",
			path: "/public/films/web?type=2"
		}, {
			pic: "/static/img/way/way-3.png",
			name: "优酷视频",
			path: "/public/films/web?type=3"
		}, {
			pic: "/static/img/way/way-4.png",
			name: "腾讯视频",
			path: "/public/films/web?type=4"
		}, 
		// {
		// 	pic: "/static/img/tab/tab-all.png",
		// 	name: "所有",
		// 	"path": "/public/goods/all"
		// },
		],
		swiper: {
			list: [{
				pic: "/static/self/bg-1.jpg"
			}, {
				pic: "/static/self/bg-2.jpg"
			}, ],
			current: 0
		},
	},

 	event:{
	   ranks:"movies_rank",
	   login_show:"login_show",
	   login_hide:"login_hide",
	   tips_show:"tips_show"
	   
	}
}
