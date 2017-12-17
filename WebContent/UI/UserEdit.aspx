<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="UserEdit.aspx.cs" Inherits="HH.Employee.WebUI.UI.UserEdit" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>编辑用户</title>
    <link href="/Scripts/lhgcalendar/skins/lhgcalendar.css" rel="stylesheet" type="text/css" />
    <link href="/Scripts/EasyUi/themes/default/style.css" rel="stylesheet" />
    <link href="/Scripts/EasyUi/themes/default/newStyle.css" rel="stylesheet" />
    <script src="/Scripts/jquery-1.5.1.min.js" type="text/javascript"></script>
    <script src="/Scripts/EasyUi/jquery.easyui.min.js" type="text/javascript"></script>
    <link href="/Scripts/UI/pager/pagination.css" rel="stylesheet" type="text/css" />
    <script src="/Scripts/UI/pager/jquery.pagination.js" type="text/javascript"></script>
    <script src="/Scripts/lhgcalendar/lhgcalendar.min.js" type="text/javascript"></script>
    <script src="/Scripts/Common.js" type="text/javascript"></script>

    <script type="text/javascript">
        var Action = GetQueryString("Action");
        $(function () {
            if (Action == "Update") {
                $(".tr_pwd").hide();
                SetModel();
            } else {
                $("#txt_LOGIN").removeAttr("disabled");
            }

            AjaxStop();

            $(".tab_title a").click(function () {
                $(this).addClass("type_clicked").siblings().removeClass("type_clicked");
                var index = $(".tab_title a").index(this);
                $(".tab_box > div")
                    .eq(index).show()
                    .siblings().hide();
            })



            //是否启用   
            $("#txt_Disabled,#aDisabled").click(function () {
                $("#ddDisabled p").bind("click", function () {
                    $("#txt_Disabled").val($(this).text());
                    $("#ddDisabled").hide();
                });
                $("#ddDisabled").toggle(200);
            });


        });

        function AjaxStop() {
            parent.$("#divLoading").hide();
        }

        function Seve() {
            var isPass = true;
            var obj = {};
            obj.CN_S_LOGIN = $("#txt_LOGIN").val();
            if (obj.CN_S_LOGIN == undefined || obj.CN_S_LOGIN == "") {
                parent.ShowMsg("登录名不能为空!");
                isPass = false;
                return false;
            }
            if (obj.CN_S_LOGIN.length > 12) {
                parent.ShowMsg("登录名长度不能大于12位!");
                isPass = false;
                return false;
            }
            obj.CN_S_NAME = $("#txt_Name").val();
            if (obj.CN_S_NAME == undefined || obj.CN_S_NAME == "") {
                parent.ShowMsg("真实姓名不能为空!");
                isPass = false;
                return false;
            }
            if (obj.CN_S_NAME.length > 12) {
                parent.ShowMsg("真实姓名长度不能大于12位!");
                isPass = false;
                return false;
            }
            var CN_S_PASS = $("#txt_PASSWORD").val();
            obj.CN_S_PASSWORD = $("#txt_PASSWORDS").val();

            if (obj.CN_S_PASSWORD == undefined || obj.CN_S_PASSWORD == "") {
                parent.ShowMsg("密码不能为空!");
                isPass = false;
                return false;
            }
            if (CN_S_PASS != obj.CN_S_PASSWORD) {
                parent.ShowMsg("两次密码不相同，请重新输入!");
                isPass = false;
                return false;
            }

            obj.CN_N_DISABLED = $("#txt_Disabled").val();
            if (obj.CN_N_DISABLED == "是") {
                obj.CN_N_DISABLED = "1";
            }
            if (obj.CN_N_DISABLED == "否") {
                obj.CN_N_DISABLED = "0";
            }
            if (obj.CN_N_DISABLED == undefined || obj.CN_N_DISABLED == "") {
                parent.ShowMsg("是否启用不能为空!");
                isPass = false;
                return false;
            }
            if (isPass) {
                obj.CN_S_PHONE = $("#CN_S_PHONE").val();
                obj.CN_S_EMAIL = $("#CN_S_EMAIL").val();
                obj.CN_S_HANDSET = $("#CN_S_HANDSET").val();
                obj.CN_S_JFUNCTIONS = $("#CN_S_JFUNCTIONS").val();
                obj.CN_S_FAX = $("#CN_S_FAX").val();
                obj.CN_S_TITLE = $("#CN_S_TITLE").val();
                obj.CN_S_SPECIALTY = $("#CN_S_SPECIALTY").val();
                obj.CN_S_SEX = $("#CN_S_SEX").val();
                obj.CN_H_ADDRESS = $("#CN_H_ADDRESS").val();
                obj.CN_H_FAX = $("#CN_H_FAX").val();
                obj.CN_S_IDCARD = $("#CN_S_IDCARD").val();
                obj.CN_S_QQNO = $("#CN_S_QQNO").val();
                obj.CN_S_WECHAT = $("#CN_S_WECHAT").val();
                obj.CN_S_CORNET = $("#CN_S_CORNET").val();
                obj.CN_S_TELEXT = $("#CN_S_TELEXT").val();
                obj.CN_H_MATE = $("#CN_H_MATE").val();
                Examine();
                var ex = $("#hid_ex").val();
                if (ex == "1") {
                    parent.ShowMsg("重复的登录名!");
                    return false;
                }

                obj.CN_S_CREATOR = GetCookie("EmplyeeUserName");
                obj.Flag = GetCookie("EmplyeeUserFlag");
                obj.CN_S_APPCODE = GetCookie("AppCode");

                var Action = GetQueryString("Action");
                if (Action == "Update") {
                    obj.CN_GUID = GetQueryString("GUID");
                    var ajaxUrl = "/UI/AjaxPage/UserManager.ashx";
                    var ajaxData = "Action=" + Action + "&jsonString=" + escape(JSON.stringify(obj));
                }
                else {
                    Action = "Add";
                    var ajaxUrl = "/UI/AjaxPage/UserManager.ashx";
                    var ajaxData = "Action=" + Action + "&jsonString=" + escape(JSON.stringify(obj));
                }

                var msg = AjaxManagers(ajaxData, ajaxUrl);
                if (msg != "") {
                    var data = (new Function("", "return " + msg))();
                    if (data.Success == 'true' || data.Success == true) {
                        parent.ShowMsg("保存成功!");
                        parent.$('#tabs .panel:visible iframe')[0].contentWindow.SetPage();
                        parent.$('#openFrameDiv').dialog('close');
                    }
                    else {
                        parent.ShowMsg("保存失败:" + data.Msg);
                    }
                }
            }
        }

        function Examines() {
            var pass1 = $("#txt_PASSWORD").val();
            var pass2 = $("#txt_PASSWORDS").val();
            if (pass1 != pass2) {
                parent.ShowMsg("两次密码不相同，请重新输入!");
                $("#hidPass").val("1");
            } else {
                $("#hidPass").val("0");
            }

        }

        function SetModel() {
            var CN_GUID = GetQueryString("GUID");
            var ajaxUrl = "/UI/AjaxPage/UserManager.ashx";
            var ajaxData = "Action=GetModelPro&CN_GUID=" + CN_GUID;
            var msg = AjaxManagers(ajaxData, ajaxUrl);
            var data = (new Function("", "return " + msg))();
            $("#txt_LOGIN").val(data.CN_S_LOGIN)
            $("#txt_Name").val(data.CN_S_NAME);
            $("#txt_PASSWORDS").val(data.CN_S_PASSWORD);
            $("#txt_PASSWORD").val(data.CN_S_PASSWORD);

            if (data.CN_N_DISABLED == 1) {
                $("#txt_Disabled").val("是");
            } else {
                $("#txt_Disabled").val("否");
            }
            $("#CN_S_PHONE").val(data.CN_S_PHONE);
            $("#CN_S_EMAIL").val(data.CN_S_EMAIL);
            $("#CN_S_HANDSET").val(data.CN_S_HANDSET);
            $("#CN_S_JFUNCTIONS").val(data.CN_S_JFUNCTIONS);
            $("#CN_S_FAX").val(data.CN_S_FAX);
            $("#CN_S_TITLE").val(data.CN_S_TITLE);
            $("#CN_S_SPECIALTY").val(data.CN_S_SPECIALTY);
            $("#CN_S_SEX").val(data.CN_S_SEX);
            $("#CN_H_ADDRESS").val(data.CN_H_ADDRESS);
            $("#CN_H_FAX").val(data.CN_H_FAX);
            $("#CN_S_IDCARD").val(data.CN_S_IDCARD);
            $("#CN_S_QQNO").val(data.CN_S_QQNO);
            $("#CN_S_WECHAT").val(data.CN_S_WECHAT);
            $("#CN_S_CORNET").val(data.CN_S_CORNET);
            $("#CN_S_TELEXT").val(data.CN_S_TELEXT);
            $("#CN_H_MATE").val(data.CN_H_MATE);
        }

        function Examine() {
            if (Action != "Update") {
                var Login = $("#txt_LOGIN").val();
                var ajaxUrl = "/UI/AjaxPage/UserManager.ashx";
                var ajaxData = "Action=Examine&Login=" + Login;
                var msg = AjaxManagers(ajaxData, ajaxUrl);
                if (msg == true || msg == "true") {
                    $("#txt_LOGIN").val("");
                    parent.ShowMsg("重复的用户名!");
                    return false;
                }
            }

        }


    </script>
</head>

<body style="background: #bbb;">
    <input type="hidden" id="hidPass" />
    <div class="popUp" style="width: 700px; height: 500px;">
        <div class="popCon" style="height: 459px; padding: 10px; overflow: auto;">
            <div class="tabsDiv" style="width: 100%;">
                <div class="tab_title">
                    <a href="#" class="type_clicked">基础信息</a>
                    <a href="#">扩展信息</a>
                </div>
                <div class="tab_box">
                    <div style="">
                        <table border="0" cellpadding="8" cellspacing="0" width="100%">
                            <tr>
                                <td width="35%" align="right" class="font14"><font color="red">*</font>登录名：</td>
                                <td width="65%" align="left">
                                    <input id="txt_LOGIN" maxlength="20 " placeholder="只能输入字母、数字或下划线的组合" onkeyup="value=value.replace(/[^\w\.\/]/ig,'')" type="text" class="inputText wf200" onblur="Examine()" disabled="disabled" />
                                    <span></span>
                                </td>
                            </tr>
                            <tr>
                                <td width="35%" align="right" class="font14"><font color="red">*</font>真实姓名：</td>
                                <td width="65%" align="left">
                                    <input id="txt_Name" maxlength="20" type="text" class="inputText wf200" /></td>
                            </tr>
                            <tr class="tr_pwd">
                                <td width="35%" align="right" class="font14"><font color="red">*</font>密码：</td>
                                <td width="65%" align="left">
                                    <input id="txt_PASSWORD" maxlength="25" type="password" class="inputText wf200" /></td>
                            </tr>
                            <tr class="tr_pwd">
                                <td width="35%" align="right" class="font14"><font color="red">*</font>确认密码：</td>
                                <td width="65%" align="left">
                                    <input id="txt_PASSWORDS" maxlength="25" type="password" onblur="Examines()" class="inputText wf200" /></td>
                            </tr>

                            <tr>
                                <td width="35%" align="right" class="font14"><font color="red">*</font>是否启用：</td>
                                <td width="65%" align="left">
                                    <div style="position: relative; z-index: 2;">
                                        <span class="active" style="width: 210px; margin: 0;">
                                            <input id="txt_Disabled" value="是" class="inputText" type="text" readonly="readonly" style="width: 180px;" />
                                            <a id="aDisabled" href="#" class="trigger"></a>
                                        </span>
                                        <div id="ddDisabled" class="dropList" style="width: 210px; display: none; z-index: 4">
                                            <p>是</p>
                                            <p>否</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div style="display: none">
                        <table border="0" cellpadding="8" cellspacing="0" width="100%">
                            <tr>
                                <td width="15%" align="right" class="font14">电话：</td>
                                <td width="35%" align="left">
                                    <input id="CN_S_PHONE" type="text" class="inputText wf200" maxlength="25" /></td>
                                <td width="15%" align="right" class="font14">邮箱：</td>
                                <td width="35%" align="left">
                                    <input id="CN_S_EMAIL" type="text" class="inputText wf200" maxlength="25" /></td>
                            </tr>
                            <tr>
                                <td width="15%" align="right" class="font14">手机号码：</td>
                                <td width="35%" align="left">
                                    <input id="CN_S_HANDSET" type="text" class="inputText wf200" maxlength="25" /></td>
                                <td width="15%" align="right" class="font14">职能：</td>
                                <td width="35%" align="left">
                                    <input id="CN_S_JFUNCTIONS" type="text" class="inputText wf200" maxlength="25" /></td>
                            </tr>
                            <tr>
                                <td width="15%" align="right" class="font14">传真：</td>
                                <td width="35%" align="left">
                                    <input id="CN_S_FAX" type="text" class="inputText wf200" maxlength="20" /></td>
                                <td width="15%" align="right" class="font14">头衔：</td>
                                <td width="35%" align="left">
                                    <input id="CN_S_TITLE" type="text" class="inputText wf200" maxlength="25" /></td>
                            </tr>
                            <tr>
                                <td width="15%" align="right" class="font14">专业：</td>
                                <td width="35%" align="left">
                                    <input id="CN_S_SPECIALTY" type="text" class="inputText wf200" maxlength="25" /></td>
                                <td width="15%" align="right" class="font14">性别：</td>
                                <td width="35%" align="left">
                                    <input id="CN_S_SEX" type="text" class="inputText wf200" maxlength="2" /></td>
                            </tr>
                            <tr>
                                <td width="15%" align="right" class="font14">家庭住址：</td>
                                <td colspan="3" align="left">
                                    <input id="CN_H_ADDRESS" type="text" class="inputText" style="width: 97%;" maxlength="32" /></td>
                            </tr>
                            <tr>
                                <td width="15%" align="right" class="font14">家庭传真：</td>
                                <td width="35%" align="left">
                                    <input id="CN_H_FAX" type="text" class="inputText wf200" maxlength="20" /></td>
                                <td width="15%" align="right" class="font14">身份证：</td>
                                <td width="35%" align="left">
                                    <input id="CN_S_IDCARD" type="text" class="inputText wf200" maxlength="18" /></td>
                            </tr>
                            <tr>
                                <td width="15%" align="right" class="font14">QQ：</td>
                                <td width="35%" align="left">
                                    <input id="CN_S_QQNO" type="text" class="inputText wf200" maxlength="25" /></td>
                                <td width="15%" align="right" class="font14">微信：</td>
                                <td width="35%" align="left">
                                    <input id="CN_S_WECHAT" type="text" class="inputText wf200" maxlength="25" /></td>
                            </tr>
                            <tr>
                                <td width="15%" align="right" class="font14">短号：</td>
                                <td width="35%" align="left">
                                    <input id="CN_S_CORNET" type="text" class="inputText wf200" maxlength="25" /></td>
                                <td width="15%" align="right">分机号：</td>
                                <td width="35%" align="left">
                                    <input id="CN_S_TELEXT" type="text" class="inputText wf200" maxlength="25" /></td>
                            </tr>
                            <tr>
                                <td width="15%" align="right" class="font14">配偶：</td>
                                <td width="35%" align="left">
                                    <input id="CN_H_MATE" type="text" class="inputText wf200" maxlength="25" /></td>
                                <td width="15%" align="right"></td>
                                <td width="35%" align="left"></td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div class="popBottom">
            <a href="#" class="button blueButton" onclick="Seve()">保存</a>
            <a href="#" class="button" onclick="javascript: parent.$('#openFrameDiv').dialog('close');">关闭</a>
        </div>
    </div>

</body>
</html>



<%--<body>

    <div class="main" style="padding: 0;">
        <form id="form1" runat="server">
            <input id="hidPass" type="hidden" value="0" />
            <input type="hidden" id="hidTrackType" />
            <div class="buttonArea">
            </div>
            <div class="shadowBoxWhite" style="min-width: 800px; padding: 10px;">
                <div class="clear"></div>
                <div id="tab1" class="tabStyle">
                    <table border="0" cellpadding="8" cellspacing="0" width="100%">
                        <tbody>
                            <tr>
                                <td width="10%"></td>
                                <td class="font14" align="right" width="15%"><font color="red">*</font>登录名：</td>
                                <td align="left" width="25%">
                                    <input id="txt_LOGIN" class="inputText wf200" onkeyup="replaceSpecialSymbol(this)" maxlength="50" type="text" onblur="Examine()" />
                                    <div style="float: left"></div>
                                </td>
                            </tr>
                            <tr>
                                <td width="10%"></td>
                                <td class="font14" align="right" width="15%"><font color="red">*</font>真实姓名：</td>
                                <td align="left" width="25%">
                                    <input id="txt_Name" class="inputText wf200" onkeyup="replaceSpecialSymbol(this)" maxlength="16" type="text" />
                                    <div style="float: left"></div>
                                </td>
                            </tr>
                             <tr>
                                <td width="10%"></td>
                                <td class="font14" align="right" width="15%"><font color="red">*</font>密码：</td>
                                <td align="left" width="25%">
                                    <input id="txt_PASSWORD" class="inputText wf200" onkeyup="replaceSpecialSymbol(this)" maxlength="50" type="password" />
                                    <div style="float: left"></div>
                                </td>
                            </tr>
                              <tr>
                                <td width="10%"></td>
                                <td class="font14" align="right" width="15%"><font color="red">*</font>确认密码：</td>
                                <td align="left" width="25%">
                                    <input id="txt_PASSWORDS" class="inputText wf200" onkeyup="replaceSpecialSymbol(this)" maxlength="50" type="password"  onblur="Examine()"/>
                                    <div style="float: left"></div>
                                </td>
                            </tr>
                              <tr>
                                <td width="10%"></td>
                                <td class="font14" align="right" width="15%"><font color="red">*</font>是否超级用户：</td>
                                <td align="left" width="25%">
                                     <div style="position: relative; z-index: 4; padding: 0;margin: 0;">
                                        <span class="active" style="width: 80px; margin: 0;">
                                            <input id="txt_SuperUser" class="inputText" type="text" value="是" readonly="readonly" style="width: 50px; cursor: pointer;" />
                                            <a id="aSuperUser" href="javascript:void(0);" class="trigger"></a></span>
                                        <div id="ddSuperUser" class="dropList" style="width: 80px; display: none; z-index: 6">
                                            <p >是</p>
                                            <p >否</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                              <tr>
                                <td width="10%"></td>
                                <td class="font14" align="right" width="15%"><font color="red">*</font>是否系统用户：</td>
                                <td align="left" width="25%">
                                      <div style="position: relative; z-index: 3; padding: 0;margin: 0;">
                                        <span class="active" style="width: 80px; margin: 0;">
                                            <input id="txt_SysUser" class="inputText" type="text" value="是" readonly="readonly" style="width: 50px; cursor: pointer;" />
                                            <a id="aSysUser" href="javascript:void(0);" class="trigger"></a></span>
                                        <div id="ddSysUser" class="dropList" style="width: 80px; display: none; z-index: 5">
                                            <p >是</p>
                                            <p >否</p>
                                        </div>
                                    </div>
                                </td>
                             </tr>
                             <tr>
                                <td width="10%"></td>
                                <td class="font14" align="right" width="15%"><font color="red">*</font>是否启用：</td>
                                <td align="left" width="25%">                           
                                      <div style="position: relative; z-index: 2; padding: 0;margin: 0;">
                                        <span class="active" style="width: 80px; margin: 0;">
                                            <input id="txt_Disabled" class="inputText" type="text" value="是" readonly="readonly" style="width: 50px; cursor: pointer;" />
                                            <a id="aDisabled" href="javascript:void(0);" class="trigger"></a></span>
                                        <div id="ddDisabled" class="dropList" style="width: 80px; display: none; z-index: 4">
                                            <p >是</p>
                                            <p >否</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <br />
                    <table width="100%" border="0" cellspacing="0" cellpadding="8">
                        <tr>
                            <td align="center">
                                <%--<a id="btnSave" class="button blueButton" onclick="Save()">保存</a>
                                <a id="btnClose" class="button redButton" onclick="javascript: parent.$('#openFrameDiv').dialog('close');">关闭</a>--%>
<%--                 <div class="popBottom">
    	                                <a href="#" class="button blueButton" onclick="Seve()">保存</a>
                                        <a href="#" class="button"onclick="javascript: parent.$('#openFrameDiv').dialog('close');">关闭</a>
                                    </div>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </form>
    </div>
</body>
</html>--%>