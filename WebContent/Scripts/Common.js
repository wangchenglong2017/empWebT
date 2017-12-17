
var webapi = "http://localhost:5219/";
var ip = webapi;


//设置菜单中可操作的按钮
function Powder() {
    var menuId = GetQueryString("menuid");
    var login = GetCookie(cookie_userName);
    var appCode = GetCookie(cookie_AppCode);
    if (menuId != null && menuId != "" && login != null && login != "" && appCode != null && appCode != "") {
        //var ajaxData = { "userName": login, "appCode": appCode, "menu_id": menuId };
        //var ajaxUrl = webapi + "/api/Account/GetBottonCode";
        var ajaxData = "Action=GetBottonCode&userName=" + login + "&appCode=" + appCode + "&menuId=" + menuId;
        var ajaxUrl = "/UI/AjaxPage/Account.ashx";
        var msg = AjaxManagers(ajaxData, ajaxUrl);
        if (msg != "") {
            var data = (new Function("", "return " + msg))();
            //如果不是系统管理员
            if (data.isSupper != 1) {
                //判断按钮权限
                $('*[power]').each(function () {
                    var powderCode = $(this).attr("power");
                    var hasPowder = GetPower(powderCode, data.listButtonCode);
                    if (hasPowder == false) {
                        $(this).remove();
                    }
                })
            }
        }
    }
}

function GetPower(powderCode, data) {
    var isPass = false;
    for (var i = 0; i < data.length; i++) {
        if ($.trim(data[i]) == $.trim(powderCode)) {
            isPass = true;
            break;
        }
    }
    return isPass;
}


/*****************************************************************************
函数名称：接收参数
函数功能：JS接收参数值
参数	：name:参数名
返回    ：消息提示框  true/false
作者    ：jxj
修改人  ：
修改日  ：
******************************************************************************/
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

//Ajax POST方法
function AjaxManagers(data, url) {
    var msg = "";
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        dataType: "text",
        async: false,
        success: function (result) {
            msg = result;
        }
    });
    return msg;
}

/*****************************************************************************
函数名称：SetCookie
函数功能：写入Cookie
参数	：name:cookie名称   value:cookie值
返回    ：
作者    ：FJ
修改人  ：
修改日  ：
******************************************************************************/
function SetCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

/*****************************************************************************
函数名称：GetCookie
函数功能：读取Cookie
参数	：name:cookie名称  
返回    ：
作者    ：FJ
修改人  ：
修改日  ：
******************************************************************************/
function GetCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

    if (arr = document.cookie.match(reg))

        return unescape(arr[2]);
    else
        return null;
}


/*****************************************************************************
函数名称：DelCookie
函数功能：删除cookies 
参数	：name:cookie名称  
返回    ：
作者    ：FJ
修改人  ：
修改日  ：
******************************************************************************/
function DelCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = GetCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

/*************定义cookie的ID*************/
//用户名
var cookie_userName = "EmplyeeUserName";
//标识
var cookie_Flag = "EmplyeeUserFlag";
//应用ID
var cookie_AppCode = "AppCode";

/**************写入Cookie*********************/
///将用户名写入cookie
function SetCookieUserName(userName) {
    SetCookie(cookie_userName, userName);
}
//将用户标识写入cookie
function SetCookieUserFlag(flag) {
    SetCookie(cookie_Flag, flag);
}
//将应用ID写入cookie
function SetCookieAppCode(appCode) {
    SetCookie(cookie_AppCode, appCode);
}
/****************写入cookie结束**********************/

//删除userName的cookie
function del_userName() {
    DelCookie(cookie_userName);
}
//删除flag的cookie
function del_flag() {
    DelCookie(cookie_Flag);
}
//删除appCode的cookie
function del_appcode() {
    DelCookie(cookie_AppCode);
}

/****************获得cookie的值**************************/
//获得当前系统中cookie的值
//当前系统用户登录名
var em_userName = GetCookie(cookie_userName) == null ? "" : GetCookie(cookie_userName);
//当前系统标识
var em_flag = GetCookie(cookie_Flag) == null ? "" : GetCookie(cookie_Flag);
//当前系统应用编码
var em_appcode = GetCookie(cookie_AppCode) == null ? "" : GetCookie(cookie_AppCode);
/****************获得cookie的值结束**************************/

/****************Cookie操作结束*********************/

/*****************************************************************************
函数名称：限制特殊字符
函数功能：JS限制特殊字符
参数	：inputObj:textbox空件
返回    ：
作者    ：jxj
修改人  ：
修改日  ：
******************************************************************************/
function replaceSpecialSymbol(inputObj) {
    var str = $(inputObj).val();
    var s = "";
    if (str.length == 0) {
        return "";
    } else {
        s = str.replace(/&/g, "");
        //s = s.replace(/#/g, "");
        s = s.replace(/%/g, "");
        s = s.replace(/!/g, "");
        s = s.replace(/\^/g, "");
        s = s.replace(/\$/g, "");
        s = s.replace(/,/g, "");
        s = s.replace(/</g, "");
        s = s.replace(/>/g, "");
        s = s.replace(/ /g, "");
        s = s.replace(/\"/g, "");
        s = s.replace(/\"/g, "");
        s = s.replace(/\'/g, "");
        s = s.replace(/\n/g, "");
        s = s.replace(/\//g, "");
        s = s.replace(/\(/g, "");
        s = s.replace(/\)/g, "");
        s = s.replace(/\=/g, "");
    }
    if (str != s)
        $(inputObj).val(s);
    return s;
}

/*****************************************************************************
函数名称：限制特殊字符
函数功能：JS限制特殊字符
参数	：inputObj:textbox空件
返回    ：
作者    ：dbs
修改人  ：
修改日  ：
******************************************************************************/
function replaceSpecialSymbolU(inputObj) {
    var str = $(inputObj).val();
    var s = "";
    if (str.length == 0) {
        return "";
    } else {
        s = str.replace(/&/g, "");
        s = s.replace(/#/g, "");
        s = s.replace(/%/g, "");
        s = s.replace(/!/g, "");
        s = s.replace(/\^/g, "");
        s = s.replace(/\$/g, "");
        //s = s.replace(/,/g, "");
        s = s.replace(/</g, "");
        s = s.replace(/>/g, "");
        s = s.replace(/ /g, "");
        s = s.replace(/\"/g, "");
        s = s.replace(/\"/g, "");
        s = s.replace(/\'/g, "");
        s = s.replace(/\n/g, "");
        s = s.replace(/\//g, "");
        s = s.replace(/\(/g, "");
        s = s.replace(/\)/g, "");
        s = s.replace(/\=/g, "");
    }
    if (str != s)
        $(inputObj).val(s);
    return s;
}
/*****************************************************************************
函数名称：限制特殊字符
函数功能：JS限制特殊字符
参数	：inputObj:textbox空件
返回    ：
作者    ：jxj
修改人  ：
修改日  ：
******************************************************************************/
function replaceSpecialSymbolNot(inputObj) {
    var str = $(inputObj).val();
    var s = "";
    if (str.length == 0) {
        return "";
    } else {
        s = str.replace(/&/g, "");
        //s = s.replace(/#/g, "");
        s = s.replace(/%/g, "");
        s = s.replace(/!/g, "");
        s = s.replace(/\^/g, "");
        s = s.replace(/\$/g, "");
        s = s.replace(/,/g, "");
        s = s.replace(/</g, "");
        s = s.replace(/>/g, "");
        s = s.replace(/ /g, "");
        s = s.replace(/\"/g, "");
        s = s.replace(/\"/g, "");
        s = s.replace(/\'/g, "");
        s = s.replace(/\n/g, "");
        //s = s.replace(/\//g, "");
        s = s.replace(/\(/g, "");
        s = s.replace(/\)/g, "");
        s = s.replace(/\=/g, "");
    }
    if (str != s)
        $(inputObj).val(s);
    return s;
}

/*****************************************************************************
函数名称：限制特殊字符 含中文
函数功能：JS限制特殊字符
参数	：inputObj:textbox空件
返回    ：
作者    ：hhc
修改人  ：
修改日  ：
******************************************************************************/
function replaceSpecialSymbolContainChinese(inputObj) {
    var str = $(inputObj).val();
    var s = "";
    if (str.length == 0) {
        return "";
    } else {
        s = str.replace(/&/g, "");
        //s = s.replace(/#/g, "");
        s = s.replace(/%/g, "");
        s = s.replace(/!/g, "");
        s = s.replace(/\^/g, "");
        s = s.replace(/\$/g, "");
        s = s.replace(/,/g, "");
        s = s.replace(/</g, "");
        s = s.replace(/>/g, "");
        s = s.replace(/ /g, "");
        s = s.replace(/\"/g, "");
        s = s.replace(/\"/g, "");
        s = s.replace(/\'/g, "");
        s = s.replace(/\n/g, "");
        s = s.replace(/\//g, "");
        s = s.replace(/\(/g, "");
        s = s.replace(/\)/g, "");
        s = s.replace(/\=/g, "");
        s = s.replace(/[^\w\.\/]/ig, "");
    }
    if (str != s)
        $(inputObj).val(s);
    return s;
}


/*****************************************************************************
函数名称：限制为非负数值
函数功能：JS限制为非负数值
参数	：inputObj:textbox空件
返回    ：
作者    ：hhc
修改人  ：
修改日  ：
******************************************************************************/
function LimitPositiveNumber(inputObj) {
    var str = $(inputObj).val();
    var s = "";
    if (str.length == 0) {
        return "";
    } else {
        s = str.replace(/[^\d.]/g, "");
        //必须保证第一个为数字而不是.
        s = s.replace(/^\./g, "");
        //保证只有出现一个.而没有多个.
        s = s.replace(/\.{2,}/g, ".");
        //保证.只出现一次，而不能出现两次以上
        s = s.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");

        if (str != s)
            $(inputObj).val(s);
    }

    return s;
}

/*****************************************************************************
函数名称：限制为非负整数值
函数功能：JS限制为非负整数值
参数	：inputObj:textbox空件
返回    ：
作者    ：dbs
修改人  ：
修改日  ：
******************************************************************************/
function LimitPositiveUNumber(inputObj) {
    var str = $(inputObj).val();
    var s = "";
    if (str.length == 0) {
        return "";
    } else {
        s = str.replace(/[^\d]/g, "");
        ////必须保证第一个为数字而不是.
        //s = s.replace(/^\./g, "");
        ////保证只有出现一个.而没有多个.
        //s = s.replace(/\.{2,}/g, ".");
        ////保证.只出现一次，而不能出现两次以上
        //s = s.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");

        if (str != s)
            $(inputObj).val(s);
    }

    return s;
}

/*****************************************************************************
函数名称：限制可录入字符串长度
函数功能：JS限制可录入字符串长度
参数	：inputObj:textbox/textArea空件
返回    ：
作者    ：hhc
修改人  ：
修改日  ：
******************************************************************************/
function LimitStringLength(inputObj, length) {
    var str = $(inputObj).val();
    var s = ""
    if (str.length < length) {
        return;
    } else {
        s = str.substr(0, length);
    }
    $(inputObj).val(s);
    return s;
}

/*****************************************************************************
函数名称：格式化date日期 
函数功能：格式化格式化date日期日期 调用：ChangeDateFormat(data[i].arrDate)
参数	：tdate
返回    ：
作者    ：jxj
修改人  ：
修改日  ：
******************************************************************************/
function ChangeDateFormat(tdate) {
    if (tdate == "" || new Date(tdate) < new Date("2000/01/01"))
        return "";
    var date = new Date(tdate);
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

    return date.getFullYear() + "-" + month + "-" + currentDate

}
/*****************************************************************************
函数名称：格式化date日期 
函数功能：格式化格式化date日期日期 调用：ChangeDateFormat(data[i].arrDate)
参数	：tdate
返回    ：
作者    ：dbs
修改人  ：
修改日  ：
******************************************************************************/
function ChangeDateTimeFormat(tdate) {
    if (tdate == "" || tdate == null || new Date(tdate) < new Date("2000/01/01"))
        return "";
    var date = new Date(tdate);
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

    return date.getFullYear() + "-" + month + "-" + currentDate + " " + date.getHours()
        + ":"
        + minutes
        + ":"
        + seconds;

}
/*****************************************************************************
函数名称：兼容IE8格式化date日期 
函数功能：格式化格式化date日期日期 调用：parseISO8601(data[i].arrDate)
参数	：tdate
返回    ：
作者    ：jxj
修改人  ：
修改日  ：
******************************************************************************/
function parseISO8601(dateStringInRange) {
    var isoExp = /^\s*(\d{4})-(\d\d)-(\d\d)\s*$/,
       date = new Date(NaN), month,
       parts = isoExp.exec(dateStringInRange);

    if (parts) {
        month = +parts[2];
        date.setFullYear(parts[1], month - 1, parts[3]);
        if (month != date.getMonth() + 1) {
            date.setTime(NaN);
        }
    }
    return date;
}
/*****************************************************************************
函数名称：格式化json日期   
函数功能：格式化json日期 形如 2014-08-13
参数	：jsondate
返回    ：
作者    ：jxj
修改人  ：
修改日  ：
******************************************************************************/
function JsonDateFormat(jsondate) {
    jsondate = jsondate.replace("/Date(", "").replace(")/", "");
    if (jsondate == 0 || jsondate == "0") {
        return "";
    }
    if (jsondate.indexOf("+") > 0) {
        jsondate = jsondate.substring(0, jsondate.indexOf("+"));
    }
    else if (jsondate.indexOf("-") > 0) {
        jsondate = jsondate.substring(0, jsondate.indexOf("-"));
    }

    var date = new Date(parseInt(jsondate, 10));
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

    return date.getFullYear()
        + "-"
        + month
        + "-"
        + currentDate;
}


/*****************************************************************************
函数名称：格式化json日期
函数功能：格式化json日期  形如：2014-08-13 10：34
参数	：jsondate
返回    ：
作者    ：jxj
修改人  ：
修改日  ：
******************************************************************************/
function JsonDateTimeFormat(jsondate) {
    if (jsondate != null && jsondate != "") {
        jsondate = jsondate.replace("/Date(", "").replace(")/", "");

        if (jsondate.indexOf("+") > 0) {
            jsondate = jsondate.substring(0, jsondate.indexOf("+"));
        } else if (jsondate.indexOf("-") > 0) {
            jsondate = jsondate.substring(0, jsondate.indexOf("-"));
        }
        //alert(jsondate);  
        var date = new Date(parseInt(jsondate, 10));
        //alert(date.getHours());  
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        return date.getFullYear() + "-" + month + "-" + currentDate + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    }
    else {
        return "";
    }
}

///日期字符串转化为JSON日期
function DateTimeToJson(dt) {
    dt = dt.replace(new RegExp("-", "gm"), "/");
    var times = (new Date(dt)).getTime(); //得到毫秒数
    return "/Date(" + times + "+0800)/";
}


/*
*     ForDight(Dight,How):数值格式化函数，Dight要
*     格式化的   数字，How要保留的小数位数。
*/
function ForDight(Dight, How) {
    Dight = Math.round(Dight * Math.pow(10, How)) / Math.pow(10, How);

    var s_Dight = Dight.toString();
    var pos_decimal = s_Dight.indexOf('.');
    if (pos_decimal < 0) {
        pos_decimal = s_Dight.length;
        s_Dight += '.';
    }

    // 不足部分 补0
    while (s_Dight.length <= pos_decimal + How)
        s_Dight += '0';
    return s_Dight;
}
/*
<summary>
截取字符列表,传递对象,主要用于数据绑定时防止出现空值
</summary>
<param name="source">传递对象</param>
<param name="length">截取长度</param>
<param name="proFlag">属性标识，用于记录完整信息 默认为title</param>
<returns>返回</returns>
*/
function GetLeftSubString(source, length, proFlag) {
    //空
    if ($.trim(source) == "") return "";
    //返回结果
    var result = "";
    //显示长度
    var displayLength = parseInt(length);
    //字数
    var count = 0;
    // 属性标记
    if ("undefined" == typeof (proFlag) || "" == proFlag)
        proFlag = "title";
    //字符串大于指定的长充
    if (source.length > displayLength) {
        for (var i = 0; i < displayLength; i++) {
            var _char = source.charAt(i);

            //空字符串
            if (count >= displayLength) break;

            result += _char;
            count++;
        }
        //加上省略号
        if (result.length < source.length) {
            result += "...";
        }
        result = "<span " + proFlag + "='" + source + "' tooltip_hh=\"poshytip_hh\">" + result + "</span>"
    }
    else {
        result = source;
    }
    return result;

}
/*****************************************************************************
函数名称：IsTel
函数功能：对电话的正则验证
参数	：Obj:textbox空件
返回    ：
作者    ：zmm
修改人  ：
修改日  ：
******************************************************************************/
function IsTel(obj) {
    var str = obj;
    var reg = /^1\d{10}$|^(0\d{2,3}-?|\(0\d{2,3}\))?[1-9]\d{4,7}(-\d{1,8})?$/;
    //var reg = /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/;
    if (reg.test(str)) //
    {
        return true;
    }
    else {
        return false;
    }
}

/*****************************************************************************
函数名称：IsNum
函数功能：判断字符串是否为数字
参数	：Obj:字符串内容
返回    ：
作者    ：zmm
修改人  ：
修改日  ：
******************************************************************************/
function IsNum(obj) {
    var str = obj;
    var reg = /^[0-9]+.?[0-9]*$/;
    if (reg.test(str)) {
        return true;
    }
    else {
        return false;
    }
}


/*****************************************************************************
函数名称：IsInterger
函数功能：对大于0的整数正则验证
参数	：Obj:textbox空件
返回    ：
作者    ：zmm
修改人  ：
修改日  ：
******************************************************************************/
function IsInterger(obj) {
    var str = obj;
    var reg = /^[0-9]*[1-9][0-9]*$/;
    if (reg.test(str)) {
        return true;
    }
    else {
        return false;
    }
}

/*****************************************************************************
函数名称：IsLetterOrNum
函数功能：判断是否是字母和数字
参数	：Obj:textbox空件
返回    ：
作者    ：zmm
修改人  ：
修改日  ：
******************************************************************************/
function IsLetterOrNum(obj) {
    var str = obj;
    var reg = /^[A-Za-z0-9]+$/;
    if (reg.test(str)) {
        return true;
    }
    else {
        return false;
    }
}


/*****************************************************************************
函数名称：IsLetterOrNum
函数功能：判断是否是字母
参数	：Obj:textbox空件
返回    ：
作者    ：zmm
修改人  ：
修改日  ：
******************************************************************************/
function IsLetter(obj) {
    var str = obj;
    var reg = /^[A-Za-z]+$/;
    if (reg.test(str)) {
        return true;
    }
    else {
        return false;
    }
}




/*****************************************************************************
函数名称：fmoney
函数功能：对金额进行格式化
参数	：Obj:textbox空件
返回    ：
作者    ：zmm
修改人  ：
修改日  ：
******************************************************************************/
function fmoney(s, n) {
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var l = s.split(".")[0].split("").reverse(),
   r = s.split(".")[1];
    t = "";
    for (i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    return t.split("").reverse().join("") + "." + r;
}


//调用：fmoney("12345.675910", 3)，返回12,345.676

//还原函数：
//引用

/*****************************************************************************
函数名称：rmoney
函数功能：判断是否是字母和数字
参数	：Obj:textbox空件
返回    ：
作者    ：zmm
修改人  ：
修改日  ：
******************************************************************************/
function rmoney(s) {
    return parseFloat(s.replace(/[^\d\.-]/g, ""));
}
//调用：rmoney("12,345.676")，返回12345.676 

/*****************************************************************************
函数名称：IsExistChn
函数功能：判断是否是包含中文
参数	：s:字符串
返回    ：
作者    ：hhc
修改人  ：
修改日  ：
******************************************************************************/
function IsExistChn(s) {
    // 判断字符串是否包含中文
    var reg = /.*[\u4e00-\u9fa5]+.*$/;

    if (typeof s == "undefined")
        return false;

    return reg.test(s);
}



/*****************************************************************************
函数名称：CheckDiscount
函数功能：对大于0小于1的数正则验证
参数	：Obj:textbox空件
返回    ：
作者    ：zmm
修改人  ：
修改日  ：
******************************************************************************/
function CheckDiscountAndMarkUpRatio(obj) {
    var str = obj;
    var reg = /^([1-9]\d?(\.\d{1,2})?|0\.\d{1,2}|100\.\d{1,2})$/;
    if (reg.test(str)) {
        return true;
    }
    else {
        return false;
    }
}

/*****************************************************************************
函数名称：CheckIsSumZeroAndOne
函数功能：对大于0小于1的小数(包括0和1)正则验证,对加价比的验证
参数	：Obj:textbox空件
返回    ：
作者    ：zmm(2014/10/13)
修改人  ：
修改日  ：
******************************************************************************/
function CheckIsSumZeroAndOne(obj) {
    var str = obj;
    var reg = /^(0([\.]\d*[0-9]+)|0|1)$/;
    if (reg.test(str)) {
        return true;
    }
    else {
        return false;
    }
}

/*****************************************************************************
函数名称：CheckIsEmail
函数功能：验证是否是邮箱
参数	：Obj:textbox空件
返回    ：
作者    ：zmm(2014/12/26)
修改人  ：
修改日  ：
******************************************************************************/
function CheckIsEmail(obj) {
    var str = obj;
    var reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    if (reg.test(str)) {
        return true;
    }
    else {
        return false;
    }
}


/*****************************************************************************
函数名称：CheckTel
函数功能：验证是否是电话
参数	：Obj:textbox空件
返回    ：
作者    ：zmm(2014/12/26)
修改人  ：
修改日  ：
******************************************************************************/
function CheckTel(obj) {
    var str = obj;
    var reg = /^(((13[0-9])|(15([0-3]|[5-9]))|(18[0,5-9]))\\d{8})|(0\\d{2}-\\d{8})|(0\\d{3}-\\d{8})$/;
    if (reg.test(str)) {
        return true;
    }
    else {
        return false;
    }

}

/*****************************************************************************
函数名称：CheckTel
函数功能：验证是否是IP
参数	：Obj:textbox空件
返回    ：
作者    ：zmm(2015/07/22)
修改人  ：
修改日  ：
******************************************************************************/

//检查是否是邮箱
function CheckIsIp(obj) {
    var str = obj;
    var reg = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/;
    if (reg.test(str)) {
        return true;
    }
    else {
        return false;
    }
}



//单击行背景色改变
var pre; //原来的节点，假设原来的背景颜色为白色，点击变为#e6f0fc
function selectArow(sObject) {
    $(sObject).removeClass("trhover").addClass("trclick");
    if (pre != null && pre != sObject) $(pre).addClass("trout").removeClass("trclick");
    pre = sObject;
}

//鼠标悬停事件
function mouseoverRow(obj) {
    //保留单击样式
    if ($(obj).hasClass("trclick")) {
    }
    else {
        $(obj).removeClass().addClass("trhover");
    }
}
//鼠标离开事件
function mouseoutRow(obj) {
    //保留单击样式
    if ($(obj).hasClass("trclick")) {
    }
    else {
        $(obj).removeClass().addClass("trout");
    }
}


