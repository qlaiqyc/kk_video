const { bajie,dsq } = require('../../utils/spider.js')



exports.main = async (event, context) => {
    //event为客户端上传的参数
	
	
	//let A = await bajie.getData();
	// result = await bajie.getData();
	
	  dsq.pub();
	
	
	  let db = uniCloud.database(),collection = db.collection('movies');
 
 
	  let {data,affectedDocs}=await collection.get();
	  
	 
	  let  c = await collection.where({
	    name: /当/
	  }).get();
	  
	  
	  
    return {len:data.length,affectedDocs,c};
}
