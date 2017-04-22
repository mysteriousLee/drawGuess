# 后端说明

## 功能概述
1. 接受创建请求，生成token，返回客户端
2. 接受用户的数据，通过websocket广播转发，并在本地存储
3. 房间id、密码、


## 接口
1. /token/create 向服务器申请创建一个演示间，获取一个token，然后马上建立ws连接
	* method:GET
	* 传入: 
		* {
			id: String,房间id,
			password: String,房间密码,若无密码则为空字符串
		}
	* 返回: token：一个16位随机字符串，每4个字母用一个-分割，因此字符串长度一共为16+3
2. /token/destroy/:token 销毁演示间
	* method:GET
	* token:要销毁的token。仅有“发送绘制事件”权限的用户发送的该请求才会被处理
3. /websocket/connect/:token 客户端通过ajax请求将token传到服务器请求建立ws连接，相当于加入演示间
	* method: GET
	* 返回: 
		* {
			state: "success" || "failed",
			token: token || ""
		}
	* 客户端请求成功后执行回掉函数建立ws连接, url:http://host:post/' + token
4. /websocket/getRooms
	* method: GET
	* 返回: 
		* [{
			id: string,房间名
			token: string,令牌
		},***]

	

## 结构说明
* api
	* websocket.js
	* token.js
* storage 数据存储
* app.js
* api_router.js
* dispatch.js

