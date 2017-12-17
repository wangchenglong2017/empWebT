<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="AppEdit.aspx.cs" Inherits="HH.Employee.WebUI.UI.AppEdit" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <title>应用编辑</title>
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
        var code = getQueryString("chkid");
        var name = getQueryString("name");
        var desc = getQueryString("note");
        var url = getQueryString("url");
        $(function () {
            
            if (Action == "Update") {

                $("#txtApp_Name").val(name);
                $("#txtApp_Code").val(code);
                $("#txtApp_Desc").val(desc);
                $("#txtApp_Url").val(url);

            }
            else {
                $("#txtApp_Code").removeAttr("disabled");
            }
        
            AjaxStop();
        });
        //解决接受URL出现乱码问题 GP 2017-7-28
        function getQueryString(key) {
            var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
            var result = window.location.search.substr(1).match(reg);
            return result ? decodeURIComponent(result[2]) : null;               
        }

        function AjaxStop() {
            parent.$("#divLoading").hide();
        }
    
        function Save() {
            var org = {};
            org.CN_S_CREATOR = GetCookie("EmplyeeUserName");
            org.Flag = GetCookie("EmplyeeUserFlag");
            org.AppCode = GetCookie("AppCode");
            org.CN_S_APPCODE = $("#txtApp_Code").val();
            if (org.CN_S_APPCODE == undefined || org.CN_S_APPCODE == "") {
                parent.ShowMsg("应用编号是唯一且必填值!");
                return false;
            }
            org.CN_S_APPNAME = $("#txtApp_Name").val();
            if (org.CN_S_APPNAME == undefined || org.CN_S_APPNAME == "") {
                parent.ShowMsg("应用名称不能为空!");
                return false;
            }
            org.CN_S_DESC = $("#txtApp_Desc").val();
            org.CN_S_URL = $("#txtApp_Url").val();
            if (org.CN_S_URL == "") {
                parent.ShowMsg("链接地址不能为空!");
                return false;
            }
            if (!IsURL(org.CN_S_URL)) {
                parent.ShowMsg("链接地址格式不正确!");
                return false;
            }
            //if (!IsURL(org.CN_S_URL)) {
            //    parent.ShowMsg("连接地址格式不正确！!");
            //    return false;
            //}
            if (Action == "Update") {
                var ajaxUrl = "/UI/AjaxPage/AppManager.ashx";
            }
            else {
                var ajaxUrl = "/UI/AjaxPage/AppManager.ashx";
                Action = "Add";
            }
           
            var ajaxData = "Action=" + Action + "&jsonString=" + escape(JSON.stringify(org));
            var msg = AjaxManagers(ajaxData, ajaxUrl);
            if (msg != "") {
                var data = (new Function("", "return " + msg))();
                if (data.Success == 'true' || data.Success == true) {
                    parent.ShowMsg("保存成功!");
                    parent.$('#tabs .panel:visible iframe')[0].contentWindow.LoadBzTaskList(1);
                    parent.$('#openFrameDiv').dialog('close');
                }
                else {
                    parent.ShowMsg("保存失败:" + data.Msg);
                }
            }
        }

        function Examine() {
            if (Action != "Update") {
                var Code = $("#txtApp_Code").val();
                var ajaxUrl = "/UI/AjaxPage/AppManager.ashx";
                var ajaxData = "Action=Examine&Code=" + Code;
                var msg = AjaxManagers(ajaxData, ajaxUrl);
                if (msg == true || msg == "true") {
                    $("#txtApp_Code").val("");
                    parent.ShowMsg("应用编号是唯一且必填值!");
                    return false;
                }
            }
        }

        function IsURL(str_url) {
            var strRegex = /(ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?/;
            var re = new RegExp(strRegex);
            //re.test()
            if (re.test(str_url)) {
                return (true);
            } else {
                return (false);
            }
        }
    </script>
</head>

<body>

    <div class="main" style="padding: 0;">
        <form id="form1" runat="server">
            <input type="hidden" id="hidTrackType" />
            <div class="buttonArea">
            </div>
            <div class="shadowBoxWhite" style="min-width: 400px; padding: 10px;">
                <div class="clear"></div>
                <div id="tab1" class="tabStyle">
                    <table border="0" cellpadding="8" cellspacing="0" width="100%">
                        <tbody>
                            <tr>
                                
                                <td class="font14" align="right" width="30%"><font color="red">*</font>应用编号：</td>
                                <td align="left" width="70%">
                                    <input id="txtApp_Code" class="inputText wf200"  onkeyup="value=value.replace(/[^\w\.\/]/ig,'')" maxlength="16" type="text"  disabled="disabled" onblur="Examine()" />
                                    <div style="float: left"></div>
                                </td>
                       
                            </tr>
                            <tr>
                            
                                <td class="font14" align="right" width="30%"><font color="red">*</font>应用名称：</td>
                                <td align="left" width="70%">
                                    <input id="txtApp_Name" class="inputText wf200" onkeyup="replaceSpecialSymbol(this)" maxlength="16" type="text" />
                                    <div style="float: left"></div>
                                </td>
                            </tr>
                            <tr>
                            
                                <td class="font14" align="right" width="30%"><font color="red">*</font>链接地址：</td>
                                <td align="left" width="70%">
                                    <input id="txtApp_Url" class="inputText wf200"  maxlength="32" type="text"/>
                                    <div style="float: left"></div>
                                </td>
                            </tr>
                            <tr>
                                
                                <td class="font14" align="right" width="30%">应用描述：</td>
                                <td align="left" width="70%">
                                    <textarea id="txtApp_Desc" style="width:210px;height:80px"  maxlength="40"></textarea>
                                    <div style="float: left"></div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <br />
                    <table width="100%" border="0" cellspacing="0" cellpadding="8">
                        <tr>
                            <td align="center">
                                    <div class="popBottom">
    	                                <a href="#" class="button blueButton" onclick="Save()">保存</a>
                                        <a href="#" class="button"onclick="javascript: parent.$('#openFrameDiv').dialog('close');">关闭</a>
                                    </div>

                       <%--         <a id="btnSave" class="button blueButton" onclick="Save()">保存</a>
                                <a id="btnClose" class="button redButton" onclick="javascript: parent.$('#openFrameDiv').dialog('close');">关闭</a>--%>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </form>
    </div>
</body>
</html>