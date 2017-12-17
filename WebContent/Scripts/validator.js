/*****************************************************************************
函数名称：fucCheckObjAndNull
函数功能：检查两个对象中的值不同时为空
参数	：strObj1 对象的ID
参数	：strObj2  对象的ID
返回    ：消息提示框  true/false
作者    ：

修改人  ：

修改日  ：

******************************************************************************/
function fucCheckObjAndNull(strObj1, strObj2)
{
    var obj1 = document.all[strObj1];
    var strTmp1 = "";
    if (obj1 != null)
    { strTmp1 = obj1.value; }

    var obj2 = document.all[strObj2];
    var strTmp2 = "";
    if (obj2 != null)
    { strTmp2 = obj2.value; }

    //检查不同时为空
    return fucCheckAndNull(strTmp1, strTmp2);
}
/*****************************************************************************
函数名称：clearBr
函数功能：去换行

*****************************************************************************/
function ClearBr(key) {
key = key.replace(/<\/?.+?>/g, "");
key = key.replace(/[\r\n]/g, "");
return key;
} 

/*****************************************************************************
函数名称：fucCheckAndNull
函数功能：检查不同时为空
参数	：strTemp1 要检查的字符串
参数	：strTemp2  要检查的字符串
返回    ：true/false
作者    ：

修改人  ：

修改日  ：

******************************************************************************/
function fucCheckAndNull(strTemp1, strTemp2)
{
    strTemp1 = strTemp1.replace(/^(\s)*|(\s)*$/g, ""); //去掉字符串两边的空格
    strTemp2 = strTemp2.replace(/^(\s)*|(\s)*$/g, ""); //去掉字符串两边的空格
    if ((strTemp1.length < 1) && (strTemp2.length < 1))
    { return false; }
    else
    { return true; }
}

/*****************************************************************************
函数名称：fucCheckNull
函数功能：检查是否为空
参数	：strTemp  要检查的字符串
参数	：strAlertMsg 要显示的提示信息
返回    ：true/false
作者    ：
修改人  ：
修改日  ：

******************************************************************************/
function fucCheckNull(strTemp)
{
    strTemp = strTemp.replace(/^(\s)*|(\s)*$/g, ""); //去掉字符串两边的空格
    if (strTemp.length < 1)
    { return false; }
    else
    { return true; }
}

/*****************************************************************************
函数名称：fucCheckLength
函数功能：判断字符串的长度是否已经超出制定的范围
参数	：strTemp,要检查的字符串
参数	：iStrMax,字符串约束的最大长度
返回    ：true/false
作者    ：
修改人  ：
修改日  ：

******************************************************************************/
function fucCheckLength_Unicode(strTemp, iStrMax)
{
    var i, sum;
    var sum = 0;
    strTemp = strTemp.replace(/^(\s)*|(\s)*$/g, ""); //去掉字符串两边的空格
    sum = strTemp.length;

    if (sum > iStrMax)
    {//超出了约束的最大字符长度

        return false;
    }
    else
    { return true; }

}
function CheckLength(strTemp, iStrMax) {
    var i, sum;
    sum = 0;
   
    for (i = 0; i < strTemp.length; i++) {
        //如果是标准字符，占一个字符长度

        if ((strTemp.charCodeAt(i) >= 0) && (strTemp.charCodeAt(i) <= 255))
            sum = sum + 1;
        else  //如果是非标准字符（汉字），占两个字符长度
            sum = sum + 2;
    }

    if (sum > iStrMax) {//超出了约束的最大字符长度

        return false;
    }
    else
    { return true; }
}
function fucCheckLength(strTemp, iStrMax)
{
    var i, sum;
    sum = 0;
    strTemp = strTemp.replace(/^(\s)*|(\s)*$/g, ""); //去掉字符串两边的空格
    for (i = 0; i < strTemp.length; i++)
    {
        //如果是标准字符，占一个字符长度

        if ((strTemp.charCodeAt(i) >= 0) && (strTemp.charCodeAt(i) <= 255))
            sum = sum + 1;
        else  //如果是非标准字符（汉字），占两个字符长度
            sum = sum + 2;
    }

    if (sum > iStrMax)
    {//超出了约束的最大字符长度

        return false;
    }
    else
    { return true; }

}

/*****************************************************************************
函数名称：fucCheckDateFormat
函数功能：验证输入日期的格式是否正确,如2003-09-01 或 空
参数	：strDate,要检查的日期字符串
返回    ：true/false
作者    ：
修改人  ：
修改日  ：

******************************************************************************/
function fucCheckDateFormat(strDate)
{
    //验证规则：长日期格式，不足用0补齐，如2003-09-01
    var newPar = /^\d{4}\-\d{2}\-\d{2}$/
    if (strDate.length > 0 && newPar.test(strDate) == false)
    { return false; }
    else
    { return true; }
}

/*****************************************************************************
函数名称：fucCheckNumber
函数功能：验证输入的字符是否只是数字或空
参数	：strNumber,要检查的字符串
返回    ：true/false
作者    ：崔昆
修改人  ：
修改日  ：

******************************************************************************/
function fucCheckNumber(strNumber)
{
    //验证规则：输入的字符串只能为数字
    var newPar = /^[0-9]*$/;
    if (strNumber.length == 0 || newPar.test(strNumber) == false)
    {
        return false;
    }
    else
    {
        return true;
    }
}
/*****************************************************************************
函数名称：fucCheckUnsignedFloat
函数功能：验证输入的字符是否正浮点数或空
参数	：strTemp,要检查的字符串
返回    ：true/false
作者    ：崔昆
修改人  ：
修改日  ：

****************************************************************************/
function fucCheckUnsignedFloat(strTemp)
{
    //验证规则：输入的字符串不为空且为正数
    var newPar = /^([0-9]+[\.]?[0-9]+|\d+)$/   ;
    if (strTemp.length = 0 || newPar.test(strTemp) == false)
    {
        return false;
    }
    else
    {
        return true;
    }
}
/*****************************************************************************
函数名称：fucCheckTimeFormat
函数功能：验证输入日期的格式是否正确,如 hh:ss 或 空
参数	：strTime,要检查的日期字符串
返回    ： true/false
作者    ：
修改人  ：
修改日  ：

******************************************************************************/
function fucCheckTimeFormat(strTime)
{
    //验证规则：时间格式(只到分) hh:mm
    var newPar = /^([0,1][0-9])|[2][0-3]:[0-5][0-9]$/
    if (strTime.length > 0 && newPar.test(strTime) == false)
    { return false; }
    else
    { return true; }
}

/*****************************************************************************
函数名称：fucCheckDateOrder
函数功能：验证开始日期必须在结束日期之后(比较的日期格式：2003-09-01)
参数	：strDate,开始日期字符串
参数	：strEDate,结束日期字符串
返回    ：true/false
作者    ：
修改人  ：
修改日  ：

******************************************************************************/
function fucCheckDateTimeOrder(strSDate, strEDate, strMsg)
{
    strSDate = strSDate.replace(/\-/, "\/");
    strEDate = strEDate.replace(/\-/, "\/");
    if (strMsg == "" || strMsg == null)
    {
        strMsg = "您输入的开始时间在结束时间之后！";
    }
    //比较时间
    if (new Date(strSDate).getTime() >= new Date(strEDate).getTime())
    { return false; }
    else
    { return true; }
}

/*****************************************************************************
函数名称：fucCheckDateOrder
函数功能：验证开始日期必须在结束日期之后(比较的日期格式：2003-09-01)
参数	：strDate,开始日期字符串
参数	：strEDate,结束日期字符串

返回    ：消息提示框  true/false
日期	：2003-10-21
作者    ：

修改人  ：

修改日  ：

******************************************************************************/
function fucCheckDateOrder(strSDate, strEDate)
{
    strSDate = strSDate.replace(/\-/, "\/");
    strEDate = strEDate.replace(/\-/, "\/");

    //比较时间
    if (new Date(strSDate).getTime() > new Date(strEDate).getTime())
    { return false; }
    else
    { return true; }
}

/*****************************************************************************
函数名称：fucCheckDateRange
函数功能：验证开始日期和结束日期之差不可大于指定范围(比较的日期格式：2003-09-01,范围单位：天)
参数	：strDate,开始日期字符串
参数	：strEDate,结束日期字符串

返回    ：消息提示框  true/false
日期	：2003-10-21
作者    ：

修改人  ：

修改日  ：

******************************************************************************/
function fucCheckDateRange(strSDate, strEDate, range)
{
    strSDate = strSDate.replace(/\-/, "\/");
    strEDate = strEDate.replace(/\-/, "\/");

    var sDate = new Date(strSDate);
    var eDate = new Date(strEDate);
    var expDate = GetExpectedDay(strEDate, range);
    var span = (sDate - expDate) / 86400000 + 1;
    var flag = (span >= 0);
    //alert(flag);
    return flag;
}

function GetExpectedDay(strDate, range)
{
    date = new Date(strDate);

    day = date.getDate();
    month = date.getMonth() - range;
    year = date.getFullYear();

    if (month < 0)
    {
        var sub = Math.ceil(range / 12 + 0.5);
        month += 12 * sub;
        year -= sub;
    }

    var expDate = new Date();
    expDate.setFullYear(year, month, day);
    //alert(expDate);
    return expDate;
}

/*****************************************************************************
函数名称：fucIsInteger
函数功能：检查是否为 空 或 整数
参数	：strInteger,要验证的数值

返回    ：消息提示框  true/false
日期	：2003-10-21
作者    ：

修改人  ：

修改日  ：

******************************************************************************/
function fucIsInteger(strInteger)
{
    //验证规则：整数

    var newPar = /^(-|\+)?\d+$/
    if (strInteger.length > 0)
    {
        if (newPar.test(strInteger) == false)
        { return false; }
        else if (strInteger < -2147483648 || strInteger > 2147483647)
        {
            alert("输入的整数已超出范围!(-2147483648~2147483647)");
            return false;
        }
        else
        { return true; }
    }
    else
    { return true; }
}

/*****************************************************************************
函数名称：fucIsFloat
函数功能：检查是否为 空 或 有效数值（实数）

参数	：strFloat,要验证的数值

返回    ：消息提示框  true/false
日期	：2003-10-21
作者    ：

修改人  ：

修改日  ：

******************************************************************************/
function fucIsFloat(strFloat)
{
    //验证规则：实数

    var newPar = /^(-|\+)?\d*.?\d+$/
    if (strFloat.length > 0 && newPar.test(strFloat) == false)
    { return false; }
    else
    { return true; }
}

/*****************************************************************************
函数名称：fucIsCustomNum
函数功能：检查是否为 空 或 有效指定的数值格式

参数	：strCode,正负符号(+、-或者为空)
参数	：strFloatCout,小数位数
参数	：strNum,要验证的数值

参数	：strAlertMsg, 出错时要显示的提示信息

返回    ：消息提示框  true/false
日期	：2004-01-20
作者    ：

修改人  ：

修改日  ：

******************************************************************************/
function fucIsCustomNum(strCode, strFloatCout, strNum)
{
    //验证规则：

    if (strCode == "+")
    {
        strCode = "\\+{0,1}";
    }
    var strTmp = "^" + strCode + "\\d+((.\\d{1," + strFloatCout + "})|\\d*)?$";
    newPar = new RegExp(strTmp)
    if (strNum.length > 0 && newPar.test(strNum) == false)
    { return false; }
    else
    { return true; }
}

/*****************************************************************************
函数名称：fucIsUnsignedInteger
函数功能：检查是否为 空 或 正整数

参数	：strInteger,要验证的数值

返回    ：消息提示框  true/false
日期	：2003-10-21
作者    ：

修改人  ：

修改日  ：

******************************************************************************/
function fucIsUnsignedInteger(strInteger)
{
    //验证规则：正整数
    var newPar = /^\d*[123456789]\d*$/
    if (strInteger.length > 0)
    {
        if (newPar.test(strInteger) == false)
        { return false; }
        else if (strInteger < 1 || strInteger > 2147483647)
        {
            alert("输入的整数已超出范围！(1~2147483647)");
            return false;
        }
        else
        { return true; }
    }
    else
    { return true; }
}

/*****************************************************************************
函数名称：fucIsNoUnsignedInteger
函数功能：检查是否为 空 或 非负整数
参数	：strInteger,要验证的数值

返回    ：消息提示框  true/false
日期	：2003-10-21
作者    ：

修改人  ：

修改日  ：

******************************************************************************/
function fucIsNoUnsignedInteger(strInteger)
{
    //验证规则：非负整数

    var newPar = /^\d+$/
    if (strInteger.length > 0)
    {
        if (newPar.test(strInteger) == false)
        { return false; }
        else if (strInteger < 0 || strInteger > 2147483647)
        {
            alert("输入的整数已超出范围！(0~2147483647)");
            return false;
        }
        else
        { return true; }
    }
    else
    { return true; }
}


/*****************************************************************************
函数名称：fucCheckMail
函数功能：检查是否为Email Address
参数	：strAddress,要检查的字符串地址
返回    ：消息提示框  true/false
日期	：2003-10-21
作者    ：

修改人  ：

修改日  ：

******************************************************************************/
function fucCheckMail(strAddress)
{
    strAddress = strAddress.replace(/^(\s)*|(\s)*$/g, ""); //去掉字符串两边的空格

    //匹配规则：

    //只允许以字母开头，用a-z,A-Z,0-9以及下划线组成的email名

    //email后面的域名只允许字母或下划线开头,至少一个.,以字母或下划线结束

    var newPar = /^[a-zA-Z](\w*)@\w+\.(\w|.)*\w+$/
    if (strAddress.length > 0 && newPar.test(strAddress) == false)
    { return false; }
    else
    { return true; }
}



/*****************************************************************************
函数名称：getNowDate
函数功能：检查是否为空

返回    ：当前日期:yyyy-mm-dd
日期	：2003-10-17
作者    ：

修改人  ：

修改日  ：

******************************************************************************/
function getNowDate()
{
    var today = new Date();
    year = today.getUTCFullYear();
    month = today.getUTCMonth() + 1;
    day = today.getUTCDate();
    if (month <= 9) month = "0" + month;
    if (day <= 9) day = "0" + day;
    var clocktext = year + "-" + month + "-" + day;
    return clocktext;
}


/*****************************************************************************
函数名称：getNowTime
函数功能：获取当前时间 
返回    ：当前日期:yyyy-mm-dd hh:mm:ss
日期  ：2010-07-28
作者    ：

修改人  ：

修改日  ：

******************************************************************************/
function getNowTime()
{
    var today = new Date(); 				//获取当前的日期实例

    var year = today.getUTCFullYear(); 	//年

    var month = today.getUTCMonth() + 1; 	//月

    var day = today.getUTCDate(); 		//日

    var hour = today.getHours(); 			//时

    var minute = today.getMinutes(); 		//分

    var second = today.getSeconds(); 		//秒

    if (month <= 9) month = "0" + month;
    if (day <= 9) day = "0" + day;
    if (hour <= 9) hour = "0" + hour;
    if (minute <= 9) minute = "0" + minute;
    if (second <= 9) second = "0" + second;
    var clocktext = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    return clocktext;
}
/*****************************************************************************
函数名称：fucTrim
函数功能：去前后空格

返回    ：当前日期:yyyy-mm-dd hh:mm:ss
日期    ：2005-08-30
作者    ：

修改人  ：

修改日  ：
******************************************************************************/
function fucTrim(vStr) {
    var re = /^\s*(.+?)\s*$/;
    var vVal = vStr.replace(/^\s+|\s+$/g, "");
    return vVal;
}
/*****************************************************************************
函数名称：fucCheckPwd
函数功能：检查密码

返回    ：当前日期:yyyy-mm-dd hh:mm:ss
日期    ：2005-08-30
作者    ：

修改人  ：

修改日  ：

******************************************************************************/
function fucCheckPwd(objNew)
{
    objNew = objNew.replace(/^(\s)*|(\s)*$/g, "");

    var blnFlag = true;
    //判断重复号码的情况

    for (var i = 0; i < objNew.length - 1; i++)
    {
        if (objNew.substring(i, i + 1) == objNew.substring(i + 1, i + 2))
        {
            blnFlag = false;
            continue;
        }
        else
        {
            blnFlag = true;
            break;
        }
    }
    //判断顺序号码情况
    if (blnFlag)
    {
        var objStrings = "0123456789876543210abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (objStrings.indexOf(objNew) != -1)
        {
            blnFlag = false;
        }
    }

    return blnFlag;
}

 