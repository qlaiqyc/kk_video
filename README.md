# 想以前搞得 加我微信哦 （微信号：a123bb49）

# 我们的目的只是为了学习哈
# 初衷（KK视频） 
 - 由于自己喜欢看电视  但是 有舍不得钱买vip  (穷) 
 - 顺便练习一下 uniApp 项目 看看又火起来的 Hbuild 怎么样
## 服务端 使用的是Egg + Mysql  
- 没有做redis 缓存 主要原因是因为服务器不行 ，所以使用全局变量 进行全局缓存
- 定时 爬取 资源数据相关网站 将视频数据 然后插入数据库
- 定时 爬取 腾讯视频网站 做推荐页面数据 相关的

## 前端（uni-app） 
- 采用uni-app 的原因呢是因为 当初想做 全端应用
- 包括 ，推荐（首页 ，电影，电视剧 ，动漫，综艺），所有类别列表页面（电影，电视剧 ，动漫，综艺） ，搜索页面 ，我的 页面，视频详情页面（播放页）

* 通过登陆用户选择 不同的清晰度 在服务端进行 中间拦截来查询不同的表



# 遇到的问题
顶部高度自适应,

h5 与小程序 的接口请求方式   ，播放回退处理

#  项目基本架构
由于是基于vue 的项目  而且本项目比较简单 其结构 
 
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200220180245519.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2I3NDEwODUyOTYz,size_16,color_FFFFFF,t_70)




# 先看图
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200220174909527.jpg#pic_center)
# 具体 demo 

![具体看](https://img-blog.csdnimg.cn/20200307100640114.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2I3NDEwODUyOTYz,size_16,color_FFFFFF,t_70)


 
 


