import Vue from 'vue'
export default {
	init() {
		String.HasText = function(str) {
			try {

				if (typeof(str) === 'undefined') return false;
				if (str == null) return false;
				if (str == 'null') return false;
				if (str == 'undefined') return false;

				if (typeof(str) === 'string') {
					str = str.replace(/(^\s*)|(\s*$)/g, '');
				}
				if (str === '') return false;

			} catch (e) {
				return false;
			}
			return true;
		};

		String.prototype.sqlTirm = function(str) {

			str = str.replace("'", '').replace('&#39;', '').replace('--', '')
				.replace('&', '')
				.replace('/*', '')
				.replace(';', '')
				.replace('%', '');


			return str;
		};

		Date.prototype.Format = function(fmt) {
			const o = {
				'M+': this.getMonth() + 1, // 月份
				'd+': this.getDate(), // 日
				'h+': this.getHours(), // 小时
				'm+': this.getMinutes(), // 分
				's+': this.getSeconds(), // 秒
				'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
				S: this.getMilliseconds(), // 毫秒
			};
			if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
			for (const k in o) {
				if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' +
					o[k]).substr(('' + o[k]).length)));
			}
			return fmt;
		};

	},
	async getToken() {
		
		let {start} = Vue.prototype.$store.state;
		if(start && start.user && start.user.token){
			
			return start.user.token;
		}else{
			let result=  uni.getStorageSync('user_info');
			
			return result && result.token ?result.token:"";
				
		}
	},

	jump: {
		pub(data) {
			let {
				type,
				url
			} = data, parm = {
				url: "/pages" + url
			};
			if (type == "navigateBack") {
				parm = {
					delta: url
				}
			}

			uni[type](parm);

		},
		navigateTo(url) {
			this.pub({
				type: "navigateTo",
				url: url
			});
		},
		redirectTo(url) {
			this.pub({
				type: "redirectTo",
				url: url
			});
		},
		reLaunch(url) {
			this.pub({
				type: "reLaunch",
				url: url
			});
		},
		navigateBack(num) {
			this.pub({
				type: "navigateBack",
				url: num
			});
		},
		switchTab(url) {
			this.pub({
				type: "switchTab",
				url: url
			});
		},


	},
	async promise(back) {

		return new Promise((resolve, reject) => {
			(async () => {
				await back();
				resolve();
			})();
		}).then(function(r) {
			console.log('Done: ' + r);


		}).catch(function(reason) {
			console.log('Failed: ' + reason);
		});
	},
	setTitle(title, color, loading) {
		console.log("--1")
		if (title) uni.setNavigationBarTitle({
			title
		});
		if (color && Object.keys(color).length > 0) uni.setNavigationBarColor(color);
		if (loading && Object.keys(loading).length > 0) uni.showNavigationBarLoading({});
	},
	event: {
		on(eventName, fun) {
			uni.$on(eventName, fun)
		},
		emit(eventName, data) {
			uni.$emit(eventName, data)
		},
		off(eventName, fun) {
			uni.$off(eventName, fun)
		},
	},
	time: {
		delay(time, fun) {
			setTimeout(fun, time);
		}
	},
	//播放历史仅仅是前端记录 不处理了
	history:{
		key:"paly_history",
		clear() {
			uni.removeStorageSync(this.key);
			this.update();
		},
		update() {
			let words = uni.getStorageSync(this.key), web = []
			String.HasText(words) ? words = JSON.parse(words) : words = {};
			let list = Object.values(words).sort((a,b)=>{
			return b.rank -a.rank; 
			});
			
			list = list.filter((curr,index)=>{
				return index <10;
			})
			
		
			let map = {};
			list.forEach(curr => {
				map[curr.uuid]= curr
			})
			uni.setStorageSync(this.key, JSON.stringify(map))
		},
		add(curr) {
			 console.log('---123')
			let words = uni.getStorageSync(this.key), web = []
			String.HasText(words) ? words = JSON.parse(words) : words = {};
			let num = 0;
			
			Object.values(words).forEach((curr,index)=>{
				num = Math.max(curr.rank,num);
			})
			curr.rank = num +1;
			words[curr.uuid] = curr;
			uni.setStorageSync(this.key, JSON.stringify(words))
			this.update();
		},
		getAll(){
			
			let words = uni.getStorageSync(this.key), web = [];
			
			String.HasText(words) ? words = JSON.parse(words) : words = {};
			 
			 
			 console.log()
			 let list = Object.values(words);
			 list = list.sort((a,b)=>{
			 	return b.rank -a.rank; 
			 });
			 
			 
			return list;
			
		}
		
	}

}
