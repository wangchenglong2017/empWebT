<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="UserList.aspx.cs" Inherits="HH.Employee.WebUI.UI.UserList" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>用户管理</title>
  <link href="/Scripts/EasyUi/themes/default/easyui.css" rel="stylesheet" type="text/css" />
    <link href="/Scripts/EasyUi/themes/default/style.css" rel="stylesheet" type="text/css" />
    <link href="/Scripts/UI/pager/pagination.css" rel="stylesheet" type="text/css" />
    <link href="/Scripts/table/tablediscolor.css" rel="stylesheet" type="text/css" />
    <link href="/Scripts/lhgcalendar/skins/lhgcalendar.css" rel="stylesheet" type="text/css" />
    <script src="/Scripts/jquery-1.5.1.min.js" type="text/javascript"></script>
    <script src="/Scripts/EasyUi/jquery.easyui.min.js" type="text/javascript"></script>
    <script src="/Scripts/UI/pager/jquery.pagination.js" type="text/javascript"></script>
    <script src="/Scripts/lhgcalendar/lhgcalendar.min.js" type="text/javascript"></script>
    <script src="/Scripts/table/tablediscolor.js" type="text/javascript"></script>
    <script src="/Scripts/Common.js" type="text/javascript"></script>
    <script src="/Scripts/UI/pageComm.js"></script>
  
    <script type="text/javascript">
        $(function () {

            //加载数据列表信息
            SetPage();
            Powder();
             AjaxStop();

       
        })
        function AjaxStop() {
            parent.$("#divLoading").hide();
        }

        //加载列表分页函数
        function SetPage() {
            //加载列表分页函数
            LoadBzTaskList(1);
            //3.设置分页控件
            $("#Pagination").pagination($("#hdnTotalRow").val(), {
                callback: pageselectCallback, //PageCallback() 为翻页调用次函数。
                first_text: "首页",
                prev_text: "上一页",
                next_text: "下一页",
                last_text: "尾页",
                jump_text: "GO",
                jump_format_text: "请输入数字!",
                jump_outofrange_text: "已超出页数范围！",
                jump_null_text: "不允许为空",
                isSum: true,
                isJump: true,
                link_to: "javascript:void(0)",
                items_per_page: 10, // pagesize:每页的数据个数
                num_display_entries: 3, //两侧首尾分页条目数
                current_page: 0,   //page:当前页码
                num_edge_entries: 2 //连续分页主体部分分页条目数
            });
        }
        //1、绑定分页控件
        function pageselectCallback(pageIndex, jq) {
            if (parseInt(pageIndex) >= 0) {
                //加载列表分页函数
                LoadBzTaskList(pageIndex + 1);
            }
        }
        //加载任务列表
        function LoadBzTaskList(pageIndex) {
           
            var CN_S_LOGIN = $("#txt_User").val();  //用户名
            var CN_S_NAME = $("#txt_Name").val();//真实姓名

            var Html = "";
            var ajaxUrl = "/UI/AjaxPage/UserManager.ashx";
            var ajaxData = "Action=GetList&CN_S_LOGIN=" + CN_S_LOGIN + "&CN_S_NAME=" + CN_S_NAME +  "&pageIndex=" + pageIndex + "&pageSize=10";
            var msg = AjaxManagers(ajaxData, ajaxUrl);
            if (msg != "flase") {
                //字符串转成Json对象
                var data = (new Function("", "return " + msg))();
                //遍历数据行
                $.each(data.LIST, function (i, n) {
       
                    Html += "<tr class=\"trout\" onclick=\"selectArow(this);\">";
                    //复选框
                    Html += "<td  align='center'> <input   value='" + n.CN_GUID + "' type='checkbox' name='chkid'  /></td>";
                    //用户名
                    Html += "<td align='center' colname='name'>" + n.CN_S_LOGIN + "</td>";
                    //真实姓名
                    Html += "<td align='center'>" + n.CN_S_NAME + "</td>";
                    //所属部门
                    Html += "<td align='center'>" + n.CN_S_ORGNAME + "</td>";
                    //是否启用
                    if (n.CN_N_DISABLED == 1) {
                        Html += "<td align='center'>是</td>";
                    } else {
                        Html += "<td align='center'>否</td>";
                    }
                    //创建日期
                    Html += "<td align='center'>" + JsonDateTimeFormat(n.CN_T_CREATEDATE) + "</td>";
                   // Html += "<td align='center'>" + n.CN_T_CREATEDATE + "</td>";
                    Html += "</tr>";

                });
                $("#hdnTotalRow").val(data.totalRows);
            }
            if (Html != "") {
                $("#tbList>tbody").html(Html);
            }
            else {
                $("#hdnTotalRow").val(1);
                $("#tbList>tbody").html("<tr><td bgcolor='#FFFFFF' colspan='6' align='center'>暂无符合条件的数据！</td></tr>");
            }
            //自定义类，给定值；
            $("#tbList").alterBgColor({
                isclickrowselected: true,
                callback: function () {
                    var isAllChecked = true;
                    $("input[name='chkid']").each(function () {
                        var isChecked = $(this).attr("checked");
                        if (isChecked == false) {
                            isAllChecked = false;
                            $("#selectall").removeAttr("checked");
                            return false;
                        }
                    });
                    if (isAllChecked == true) {
                        $("#selectall").attr("checked", "true");
                    }
                }
            });
            //4.设置全选全不选
            $("#selectall").click(function () {
                $("input[name='chkid']").each(function () {
                    var isChecked = $("#selectall").attr("checked");
                    $(this).attr("checked", isChecked);
                    if (!isChecked) {
                        $(this).parent("td").parent("tr").removeClass("selected");
                    }
                    else {
                        $(this).parent("td").parent("tr").addClass("selected");
                    }
                });
            });
        }

        //新增
        function Add() {
            var Title = "用户编辑";
            //显示进度条 
            parent.$("#divLoading").show();
            parent.$('#openFrameDiv').dialog({
                title: Title,
                width: 700,
                height: 538,
                closed: true,
                cache: false,
                modal: true,
                maximizable: true,
                resizable: true,
                onClose: function () {
                    parent.$('#openIframe')[0].src = "none.html";
                },
                buttons: null
            });
            parent.$('#openIframe')[0].src = "/UI/UserEdit.aspx?Action=Add";
            parent.$('#openFrameDiv').dialog('open');
        }
        //修改
        function Update() {
            var Title = "用户编辑";
            var guid = "";
            $("#tbList>tbody>tr").each(function () {
                if ($(this).find("input[name='chkid']").attr("checked") == true) {
                    guid += $(this).find("input[name='chkid']").val();
                }
            })
         
            if (guid.length > 50 || guid.length == 0) {                
                parent.ShowMsg("必须选择一行数据!");
                return;
            }
            else {
                //显示进度条 
                parent.$("#divLoading").show();
                parent.$('#openFrameDiv').dialog({
                    title: Title,
                    width: 700,
                    height: 538,
                    closed: true,
                    cache: false,
                    modal: true,
                    maximizable: true,
                    resizable: true,
                    onClose: function () {
                        parent.$('#openIframe')[0].src = "none.html";
                    },
                    buttons: null
                });
                parent.$('#openIframe')[0].src = "/UI/UserEdit.aspx?Action=Update"+"&GUID="+guid;
                parent.$('#openFrameDiv').dialog('open');
            }
        }
        //删除
        function deleteBtn() {
            var values = "";
            var name = "";
            $("#tbList>tbody>tr").each(function () {
                if ($(this).find("input[name='chkid']").attr("checked") == true) {
                    name += $(this).find("td[colname='name']").text() + ",";
                    values += $(this).find("input[name='chkid']").val() + ",";
                }
            })
            if (values == "") {
                parent.ShowMsg("最少选择一行！");
                return false;
            }
            deletes(values,name);

        }

        function deletes(values, Name) {
            var obj = {};
            obj.CN_S_CREATOR = GetCookie("EmplyeeUserName");
            obj.Flag = GetCookie("EmplyeeUserFlag");
            obj.CN_S_APPCODE = GetCookie("AppCode");
            obj.Name = Name;
            obj.values = values;
            parent.$.messager.confirm('系统提示', '确认删除吗？', function (r) {
                if (r) {
                    var ajaxUrl = "/UI/AjaxPage/UserManager.ashx";
                    var ajaxData = "Action=Delete&jsonString=" + escape(JSON.stringify(obj));
                    var msg = AjaxManagers(ajaxData, ajaxUrl);
                    if (msg != "") {
                        var data = (new Function("", "return " + msg))();
                        if (data.Success == 'true' || data.Success == true) {
                            parent.ShowMsg("删除成功！");
                            $("#selectall").removeAttr("checked");
                            SetPage();
                        }
                        else {
                            parent.ShowMsg("删除失败:" + data.Msg);
                        }
                    }
                }
            });
        }
        //选择行操作
        function selectArow(e) {
            var name = $(e).find("td[colname='name']").text();
            var Html = "";
            var ajaxUrl = "/UI/AjaxPage/RoleManager.ashx";
            var ajaxData = "Action=GetLogin&CN_S_LOGIN=" + name;
            var msg = AjaxManagers(ajaxData, ajaxUrl);

            if (msg != "flase") {
                //字符串转成Json对象
                var data = (new Function("", "return " + msg))();
                //遍历数据行
                $.each(data, function (i, n) {
                    Html += "<tr>";
                    //复选框
                    //Html += "<td  align='center'> <input   value='" + n.CN_GUID + "' type='checkbox' name='chkid'  /></td>";
                    //角色编码
                    Html += "<td align='center' colname='name'>" + n.CN_S_ROLECODE + "</td>";
                    //角色名称
                    Html += "<td align='center'>" + n.CN_S_ROLENAME + "</td>";
                    //所属应用
                    Html += "<td align='center'>" + n.CN_S_APPNAME + "</td>";
                    Html += "</tr>";
                });
            }
            if (Html != "") {
                $("#tbRoleList>tbody").html(Html);
            }
            else {
                $("#tbRoleList>tbody").html("<tr><td colspan='3' align='center'>暂无符合条件的数据！</td></tr>");
            }
        }

    </script>
</head>
<body>
    <form id="form1" runat="server">
        <input type="hidden" id="hdnTotalRow" value="0" />
        <input type="hidden" id="hdnPageIndex" value="0" />
        <input type="hidden" id="hdnPageSize" />
        <div>
        </div>
        <div id="loading">
        </div>
        <table style="min-width: 882px; min-height: 500px" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td valign="top" bgcolor="#e6e6e8" class="main">
                    <div class="searchShow">
                        <div>
                            <span class="title">登录名:</span>
                            <div>
                                <input type="text" id="txt_User" maxlength="25" onkeyup="replaceSpecialSymbol(this)" class="inputText"/>
                            </div>
                        </div>
              
                        <div>
                            <span class="title">真实姓名:</span>
                            <div>
                                <input type="text" id="txt_Name" maxlength="25" onkeyup="replaceSpecialSymbol(this)" class="inputText"/>
                            </div>
                        </div>
                        <div>
                            <span class="title" style="padding-right:0px;"><a class="button" id="" onclick="SetPage()" power="Select">查询</a></span>
                        </div>
                    </div>
                    <div class="clear height10">
                    </div>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" height="400" style="min-width:1185px">
                        <tr>
                            <td valign="top" width="70%">
                                <div class="clear">
                                </div>
                                <div id="dvOrders">
                                    <div class="shadowBoxWhite" style="width: 98%; padding: 10px 1%;">
                                        <div id="divbutton" runat="server" style="margin: 0 0 10px 0px;">
                                            <a class="button blueButton" id="btnAdd" onclick="Add()"  power="Add">新增</a>
                                            <a class="button blueButton" id="btnUpdate" onclick="Update()" power="Edit">修改</a>
                                            <a class="button redButton" id="btnDelete" onclick="deleteBtn()" power="Delete">删除</a>
                                        </div>
                                        <div class="tableDiv">
                                            <div id="DivProductList">
                                                <table id="tbList" width="100%" border="0" cellspacing="1" cellpadding="5">
                                                    <thead>
                                                        <tr class='caption'>
                                                            <th style="width: 5%; text-align: center">
                                                                <input type="checkbox" id="selectall" name="selectall" />
                                                            </th>
                                                            <th style="width: 15%; text-align: center">登录名
                                                            </th>
                                                            <th style="width: 15%; text-align: center">真实姓名
                                                            </th>
                                                            <th style="width: 15%; text-align: center">所属部门
                                                            </th>
                                                             <th style="width: 15%; text-align: center">是否启用
                                                            </th>
                                                             <th style="width:20%; text-align: center">创建日期
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div id="Pagination" class="right3">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td valign="top" width="29%">
                                   <div id="divAdd" class="quickAdd shadowBoxYellow" style="width: 98%; min-height: 350px; max-height:350px;overflow-y: auto;">
                                    <div class="title" id="divAddTitle" style="width: 100%">
                                        所属角色
                                    </div>
                                       <div >
                                            <div id="DivRole">
                                                <table id="tbRoleList" width="100%" border="0" cellspacing="1" cellpadding="5">
                                                    <thead>
                                                        <tr class='caption'>
                                                            <%--<th style="width: 5%; text-align: center">
                                                                <input type="checkbox" id="selectall" name="selectall" />
                                                            </th>--%>
                                                            <th style="width: 15%; text-align: center">角色编号
                                                            </th>
                                                            <th style="width: 15%; text-align: center">角色名称
                                                            </th> 
                                                            <th style="width: 15%; text-align: center">所属应用
                                                            </th>                                                         
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </form>
</body>
</html>

