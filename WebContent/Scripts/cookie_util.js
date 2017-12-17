
//添加cookie
function addCookie(objName,objValue,objHours){
	var str=objName+"="+escape(objValue); //escape() 函数可对字符串进行编码，这样就可以在所有的计算机上读取该字符串。
	if(objHours>0){   //设置cookie的值
		var date=new Date();
		var ms=objHours*3600*1000;
		date.setTime(date.getTime() + ms);
		 str += "; expires=" + date.toGMTString();
	}
	 document.cookie = str;
}

function getCookie(objName){//获取Cookie
	var arrStr=document.cookie.split(";");
	for(var i=0;i<arrStr.length;i++){
		 var temp = arrStr[i].split("=");
	        if(temp[0] == objName) return unescape(temp[1]);	
	}
}

