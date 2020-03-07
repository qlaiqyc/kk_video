import Vue from 'vue'

const memory = {
	goods: "goods", //商品信息（增删改查：获取所有商品信息-获取单个商品信息-添加商品信息-修改商品信息，）
	goodsType: "goodsType" //商品 类别 （增删改查）
};

const req = (name, data, success, fail, complete) => {
	// const cloud = Vue.prototype.$cloud;

	// console.log(Vue.prototype)

	// cloud.callFunction({
	// 	name: name,
	// 	data: data,
	// 	success(res) {
	// 		success(res)
	// 	},
	// 	fail(res) {
	// 		if (fail) fail(res);
	// 	},
	// 	complete(res) {
	// 		if (complete) complete(res);
	// 	}
	// });

}

export default {
	//初始化
	init() {
		return uniCloud.init({
			provider: 'aliyun',
			spaceId: 'e8491cf4-160a-40d1-a5ff-840a35db42ce',
			clientSecret: 'F70jEWKVP609L+XLrGaTrw=='
		});
	},
	goods: {
		//获取所有商品信息
		getAll(data,success) {
			req(memory.goods,{type:"getAll",data},success)
		},
		//获取单个商品信息
		getByID(data,success) {
			req(memory.goods,{type:"getByID",data},success)
		},
		//修改商品信息
		update(data,success) {
			req(memory.goods,{type:"update",data},success)
		},
		//删除商品信息
		del(data,success) {
			req(memory.goods,{type:"del",data},success)

		}
	}



}
