<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Location.aspx.cs" Inherits="HH.Employee.WebUI.Location" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">x
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <script src="Scripts/jquery-1.5.1.min.js" type="text/javascript"></script>
    <script src="Scripts/Common.js"></script>
    <script type="text/javascript">
        $(function () {
            var txt_username = GetQueryString("userName");
            var flag = GetQueryString("flag");
            var appCode = GetQueryString("appCode");
            //alert(txt_username,)
            //应用跳转
            LoginApp(txt_username, flag, appCode);
        })

        //登录验证成功后写入
        function LoginApp(txt_username, flag, appCode) {
            if (txt_username != null && txt_username != "" && flag != null && flag != "" && appCode != null && appCode != "") {
                var ajaxUrl = "/UI/AjaxPage/Account.ashx";
                var ajaxData = "Action=Validator&userName=" + txt_username + "&flag=" + flag + "&appCode=" + appCode + "";
                var msg = AjaxManagers(ajaxData, ajaxUrl);
                if (msg != "") {
                    var data = (new Function("", "return " + msg))();
                    if (data.Success == "true" || data.Success == true) {
                        //写入cookie
                        SetCookieUserName(txt_username);
                        SetCookieUserFlag(flag);
                        SetCookieAppCode(appCode);
                        window.location.href = "Index.aspx"
                    }
                    else {
                        $("#location").html(data.Msg + "</br>正在跳转登录");
                        setTimeout("locationLogin()", "3000");
                        return false;
                    }
                }
            }
        }
        function locationLogin() {
            window.location.href = "Login.html";
        }
    </script>
    <style type="text/css">
        body {
            text-align: center;
        }
        div {
            margin: 0 auto;
            width: 400px;
            height: 100px;
        }
    </style>
</head>
<body>
    <div id="location">
    </div>
</body>
</html>
