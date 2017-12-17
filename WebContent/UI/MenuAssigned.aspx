<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="MenuAssigned.aspx.cs" Inherits="HH.Employee.WebUI.UI.MenuAssigned" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
 "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>菜单按钮分配</title>
 <%--<link type="text/css" rel="stylesheet" href="css/style.css" />
<link type="text/css" rel="stylesheet" href="css/newStyle.css" />--%>
    <link type="text/css" href="../Scripts/EasyUi/themes/default/newStyle.css" rel="stylesheet" />
    <link type="text/css" href="../Scripts/EasyUi/themes/default/style.css" rel="stylesheet" />

<script src="/Scripts/jquery-1.5.1.min.js" type="text/javascript"></script>
<script src="/Scripts/Common.js" type="text/javascript"></script>
<script src="/Scripts/EasyUi/jquery.easyui.min.js" type="text/javascript"></script>
<script src="/Scripts/UI/pager/jquery.pagination.js" type="text/javascript"></script>
<script src="/Scripts/lhgcalendar/lhgcalendar.min.js" type="text/javascript"></script>
<script src="/Scripts/table/tablediscolor.js" type="text/javascript"></script>
<script type="text/javascript">
    $(function () {
        //装载按钮列表
        Select();
        AjaxStop();
        $('#b1').click(function () {
            $obj = $('select option:selected').clone(true);
            if ($obj.size() == 0) {
                parent.ShowMsg("请至少选择一条!");
            }
            $('#rList').append($obj);
            $('select option:selected').remove();
        });

        $('#b2').click(function () {
            $('#rList').append($('#lList option'));
        });

        $('#b3').click(function () {
            $obj = $('select option:selected').clone(true);
            if ($obj.size() == 0) {
                parent.ShowMsg("请至少选择一条!");
            }
            var GUID = GetQueryString("GUID");
            var buttonCode="";
            $('#rList option').each(function () {
                if ($(this).attr('selected') == true)
                {
                    buttonCode +="'"+ $(this).attr("title") + "',";
                }
            })
            var Html = "";
            var ajaxUrl = "/UI/AjaxPage/MenuManager.ashx";
            var ajaxData = "Action=GetButtonUse&buttonCode=" + buttonCode + "&GUID=" + GUID;
            var msg = AjaxManagers(ajaxData, ajaxUrl);
            if (msg == false || msg=="false")
            {
                parent.ShowMsg("操作按钮已被使用,无法移除!");
                return;
            }
            $('#lList').append($obj);
            $('select option:selected').remove();
        });

        $('#b4').click(function () {
            var GUID = GetQueryString("GUID");
            var buttonCode = "";
            $('#rList option').each(function () {
                    buttonCode += "'" + $(this).attr("title") + "',";
            })
            var Html = "";
            var ajaxUrl = "/UI/AjaxPage/MenuManager.ashx";
            var ajaxData = "Action=GetButtonUse&buttonCode=" + buttonCode + "&GUID=" + GUID;
            var msg = AjaxManagers(ajaxData, ajaxUrl);
            if (msg == false || msg == "false") {
                parent.ShowMsg("操作按钮已被使用,无法移除!");
                return;
            }
            $('#lList').append($('#rList option'));
        });                                                                    

        $('option').dblclick(function () {
            var flag = $(this).parent().attr('id');
            if (flag == "lList") {
                var $obj = $(this).clone(true);
                $('#rList').append($obj);
                $(this).remove();
            } else {
                var $obj = $(this).clone(true);
                $('#lList').append($obj);
                $(this).remove();
            }
        });
    });
   
    ///装载所有按钮功能
    function Select()
    {
        var AppCode = GetQueryString("AppCode");
        var Html = "";
        var ajaxUrl = "/UI/AjaxPage/ButtonManager.ashx";
        var ajaxData = "Action=GetModel&AppCode=" + AppCode;
        var msg = AjaxManagers(ajaxData, ajaxUrl);
        var data = (new Function("", "return " + msg))();
        if (data != "")
        {
            $.each(data, function (i, n) {
                Html += "<option title='"+n.CN_S_CODE+"' value="+n.CN_GUID+">" + n.CN_S_NAME + "</option>";
            });
            $('#lList').append(Html);
        }
        
        SelectMenu();
    }

    ///装载已添加的按钮功能
    function SelectMenu()
    {

        var GUID = GetQueryString("GUID");
        //alert(Guid);
        var Html = "";
        var ajaxUrl = "/UI/AjaxPage/MenuManager.ashx";
        var ajaxData = "Action=GetAssigned&GUID=" + GUID;
        var msg = AjaxManagers(ajaxData, ajaxUrl);
        var data = (new Function("", "return " + msg))();
        if (data != "") {
          //  var data = (new Function("", "return " + msg))();
            $.each(data, function (i, n) {
              
                $("#lList>option").each(function () {
                    $(this).find("", n.CN_S_NAME).remove();
                    if ($(this).val() == n.CN_S_BUTTONID)
                    {
                        $(this).remove();
                    }
                });
              
                Html += "<option  title=" + n.CN_S_CODE + "  value=" + n.CN_S_BUTTONID + ">" + n.CN_S_NAME + "</option>";
            });
            $('#rList').append(Html);
        }

    }


    function Seve() {
        var obj = {};
        obj.CN_S_BUTTONID = "";
        obj.CN_S_NAME = "";
        obj.CN_S_MENUID = GetQueryString("GUID");
        $("#rList>option").each(function () {
            obj.CN_S_BUTTONID += $(this).val() + ",";
            obj.CN_S_NAME += $(this).text() + ",";
        });
        if (obj.CN_S_BUTTONID == "") {
            parent.ShowMsg("请先分配功能!");
            return false;
        }
        obj.CN_S_CREATOR = GetCookie("EmplyeeUserName");
        obj.Flag = GetCookie("EmplyeeUserFlag");
        obj.CN_S_APPCODE = GetCookie("AppCode");
        obj.CN_S_APPCODES =GetQueryString("AppCode");
        var ajaxUrl = "/UI/AjaxPage/MenuManager.ashx";
        var ajaxData = "Action=Assigned&jsonString=" + escape(JSON.stringify(obj));
        var msg = AjaxManagers(ajaxData, ajaxUrl);
        if (msg == true || msg == "true") {
            parent.ShowMsg("保存成功!");
            parent.$('#openFrameDiv').dialog('close');
        }
        else {
            parent.ShowMsg("保存失败!");
        }
    }

    function AjaxStop() {
        parent.$("#divLoading").hide();
    }

</script>
</head>
<body style="background:#bbb;">

<div class="popUp" style="width:600px; height:460px;">
    <div class="popCon twoWaySelect">
        <table cellpadding="0" cellspacing="8" width="100%">
            <tr style="font-size:15px; font-weight:bold;">
                <td align="left">请选择按钮</td>
                <td>&nbsp;</td>
                <td align="left">已选择</td>
            </tr>
            <tr>
				<td width="35%">
					<select id="lList" multiple="multiple">
                        
					</select>
				</td>
				<td width="30%" align="center">
					<p><input type="button" id="b1" class="select_btn" value="--&gt;" /></p>
					<p><input type="button" id="b2" class="select_btn" value="--&gt;&gt;" /></p>
					<p><input type="button" id="b3" class="select_btn" value="&lt;--" /></p>
					<p><input type="button" id="b4" class="select_btn" value="&lt;&lt;--" /></p>
				</td>
				<td width="35%">
                	<select id="rList" name="rList" multiple="multiple">

                	</select>
                </td>
			</tr>
        </table>
    </div>
    <div class="popBottom">
    	<a href="#" class="button blueButton" onclick="Seve()">保存</a>
        <a href="#" class="button"onclick="javascript: parent.$('#openFrameDiv').dialog('close');">关闭</a>
    </div>
</div>

</body>
</html>
