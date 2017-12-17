<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="PwdEdit.aspx.cs" Inherits="HH.Employee.WebUI.UI.PwdEdit" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>修改密码</title>
    <link rel="stylesheet" type="text/css" href="/Scripts/EasyUi/themes/default/style.css?v1.0" />
    <link rel="stylesheet" type="text/css" href="/Scripts/EasyUi/themes/default/easyui.css?v1.0" />
    <link href="/Scripts/alert/css/jquery.alert.css" rel="stylesheet" type="text/css" />
    <script src="/Scripts/jquery-1.9.1.min.js" type="text/javascript"></script>
    <script src="/Scripts/alert/jquery.alert.js" type="text/javascript"></script>
    <script src="/Scripts/Common.js"></script>
    <script type="text/javascript">
        $(function () {
            AjaxStop();
        });

        function AjaxStart() {
            parent.$("#divLoading").show();
        }
        function AjaxStop() {
            parent.$("#divLoading").hide();
        }
    </script>
</head>
<body>
    <div>
        <table border="0" cellpadding="0" cellspacing="5" width="100%">
            <tbody>
               
                <tr>
                    <td width="120" style="text-align: center;">
                        <span style="color: red;">*</span>原登录密码：
                    </td>
                    <td>
                        <input class="InputDept" id="ResUserPassword"
                            name="ResUserPassword" type="password" value="" />
                    </td>
                </tr>
                <tr>
                    <td style="text-align: center;">
                        <span style="color: red;">*</span>新登录密码：
                    </td>
                    <td>
                        <input class="InputDept" id="NewUserPassword" name="NewUserPassword" type="password" />
                    </td>
                </tr>
                <tr>
                    <td style="text-align: center;">
                        <span style="color: red;">*</span>确认新密码：
                    </td>
                    <td>
                        <input class="InputDept" id="ConfirmNewUserPassword" name="ConfirmNewUserPassword" type="password" />
                    </td>
                </tr>
                <tr>
                    <td colspan="2"></td>
                </tr>
                <tr>
                    <td colspan="2" align="center">
                        <input type="button" id="btnSave" class="button" value="确定" />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <script type="text/javascript">
        var userName = GetCookie("EmplyeeUserName");
        var appCode = GetCookie("AppCode");
        $(document).ready(function () {
            $("#ResUserPassword").val("");
        });
        //截取空格
        String.prototype.trim = function () {
            return this.replace(/(^\s*)|(\s*$)/g, '');
        };
        $("#btnSave").click(function () {
            var oldpsd = $("#ResUserPassword").val().trim();
            var newpsd = $("#NewUserPassword").val().trim();
            var renewpsd = $("#ConfirmNewUserPassword").val().trim();
            if (oldpsd == "") {
                parent.ShowMsg("原登录密码不能为空!");
                return false;
            }
            if (newpsd == "") {
                parent.ShowMsg("新登录密码不能为空!");
                $("#NewUserPassword").focus();
                return false;
            }
            if (newpsd.length < 6 || newpsd.length > 20) {
                parent.ShowMsg("密码长度为6-20个字符！");
                return false;
            }
            if (newpsd != renewpsd) {
                parent.ShowMsg("您两次输入的新密码不一致，请重新输入！");
                return false;
            }

            if (oldpsd != "" && newpsd != "") {
                var ajaxData = "Action=PwdEdit&userName=" + userName + "&oldPwd=" + oldpsd + "&newPwd=" + newpsd + "&appCode=" + appCode;
                var ajaxUrl = "/UI/AjaxPage/Account.ashx";
                var msg = AjaxManagers(ajaxData, ajaxUrl);
                if (msg != "") {
                    var data = (new Function("", "return " + msg))();
                    if (data.Success) {
                        parent.ShowMsg("保存成功！");
                        parent.$('#openFrameDiv').dialog('close');
                    }
                    else {
                        parent.ShowMsg("保存失败：" + data.Msg);
                    }
                }
            }
        });
    </script>
</body>
</html>
