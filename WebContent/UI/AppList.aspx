<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="AppList.aspx.cs" Inherits="HH.Employee.WebUI.UI.AppList" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
 "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>应用管理</title>
     <link href="../Scripts/Iconfont/iconfont.css" rel="stylesheet" type="text/css" />
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
    <script src="/Scripts/UI/pageComm.js" type="text/javascript"></script>

    <script type="text/javascript">
        $(function () {

            //加载数据列表信息
            LoadBzTaskList();
            Powder();
            AjaxStop();
            $("#aimg").hide();
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
                items_per_page: 15, // pagesize:每页的数据个数
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

            var CN_S_APPNAME = $("#txt_App_Name").val();
            var CN_S_APPCODE = $("#txt_App_Code").val();
            var Html = "";
            var ajaxUrl = "/UI/AjaxPage/AppManager.ashx";
            var ajaxData = "Action=GetList&CN_S_APPNAME=" + CN_S_APPNAME + "&CN_S_APPCODE=" + CN_S_APPCODE;
            var msg = AjaxManagers(ajaxData, ajaxUrl);
            if (msg != "") {

                var data = (new Function("", "return " + msg))();

                //遍历数据行
                $.each(data.LIST, function (i, n) {
                    var iconcode = "&" + n.CN_S_IMAGE;
                    Html += "<tr class=\"trout\" onclick=\"selectArow(this);\">";
                    //复选框
                    Html += "<td  align='center'> <input   value='" + n.CN_S_APPCODE + "' type='checkbox' name='chkid'  /></td>";
                    //应用编号
                    Html += "<td align='center' colname='code'>" + n.CN_S_APPCODE + "</td>";
                    //应用名称
                    Html += "<td align='center' colname='name'>" + n.CN_S_APPNAME + "</td>";
                    //url
                    Html += "<td align='left' colname='url'>" + n.CN_S_URL + "</td>";
                    //描述
                    Html += "<td align='left' colname='note'>" + n.CN_S_DESC + "</td>";
                    //图片
                    Html += "<td align='left' colname='img' title='" + n.CN_S_IMAGE + "'><i class='icon iconfont'   style='font-size:14px'>" + iconcode + "</i></td>";
                    //修改人
                    Html += "<td align='center'>" + n.CN_S_MODIFY_BY + "</td>";
                    //修改日期
                    Html += "<td align='center'>" + JsonDateTimeFormat(n.CN_T_MODIFY) + "</td>";
                    //Html += "<td align='center'>" + n.CN_T_CREATE + "</td>";
                    Html += "</tr>";

                });
                // $("#hdnTotalRow").val(data.totalRows);
            }
            if (Html != "") {
                $("#tbList>tbody").html(Html);
            }
            else {
                $("#hdnTotalRow").val(1);
                $("#tbList>tbody").html("<tr><td bgcolor='#FFFFFF' colspan='7' align='center'>暂无符合条件的数据！</td></tr>");
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

        //删除
        function deleteBtn() {
            var values = "";
            $("#tbList>tbody>tr").each(function () {
                if ($(this).find("input[name='chkid']").attr("checked") == true) {
                    //获得任务单号
                    values += $(this).find("input[name='chkid']").val() + ",";
                }
            })
            if (values == "") {
                parent.ShowMsg("最少选择一行！");
                return false;
            }
            deletes(values);

        }

        function deletes(values) {
            var org = {};
            org.CN_S_CREATOR = GetCookie("EmplyeeUserName");
            org.Flag = GetCookie("EmplyeeUserFlag");
            org.CN_S_APPCODE = GetCookie("AppCode");
            org.values = values;
            parent.$.messager.confirm('系统提示', '确认删除吗？', function (r) {
                if (r) {
                    var ajaxUrl = "/UI/AjaxPage/AppManager.ashx";
                    var ajaxData = "Action=Delete&jsonString=" + escape(JSON.stringify(org));
                    var msg = AjaxManagers(ajaxData, ajaxUrl);
                    if (msg != "") {
                        var data = (new Function("", "return " + msg))();
                        if (data.Success == "true" || data.Success == true) {
                            parent.ShowMsg("删除成功！");
                            $("#selectall").removeAttr("checked");
                            Add();
                            LoadBzTaskList();
                        }
                        else {
                            parent.ShowMsg("删除失败!当前应用已被使用!");
                        }
                    }
                }
            });
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
            org.CN_S_IMAGE = $("#CN_S_IMAGE").val();            //图片
            org.CN_S_IMAGE = org.CN_S_IMAGE.substr(1);
            var Action = $("#hid_Action").val();
         
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
            var Action = $("#hid_Action").val();
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

        //选择行操作
        function selectArow(e) {
            var code = $(e).find("td[colname='code']").text();
            var name = $(e).find("td[colname='name']").text();
            var note = $(e).find("td[colname='note']").text();
            var url = $(e).find("td[colname='url']").text();
            var img = $(e).find("td[colname='img']").attr("title");

            $("#divAddTitle").text("应用查看");
            $("#txtApp_Desc").val(note);
            $("#txtApp_Code").val(code);
            $("#txtApp_Name").val(name);
            $("#txtApp_Url").val(url);
            $("#CN_S_IMAGE").val("&"+img);
            $("#CN_S_IMAGES").html("&" + img);
            disp();
        }

        //禁用
        function disp() {
            $("#txtApp_Code").attr("disabled", "true");
            $("#txtApp_Name").attr("disabled", "true");
            $("#txtApp_Url").attr("disabled", "true"); 
            $("#txtApp_Desc").attr("disabled", "true");
            $("#btnAddAll").hide();
            $("#aimg").hide();
        }

        //新增                                                                       
        function Add() {
            $("#divAddTitle").text("应用新增");
            $("#btnAddAll").show();
            $("#aimg").show();
            $("#hid_Action").val("Add");
            $("#txtApp_Code").val("");
            $("#txtApp_Name").val("");
            $("#txtApp_Url").val("");
            $("#txtApp_Desc").val("");
            $("#CN_S_IMAGES").html("&#xe624;");
            $("#CN_S_IMAGE").val("");
            $("#txtApp_Code").removeAttr("disabled");
            $("#txtApp_Name").removeAttr("disabled");
            $("#txtApp_Url").removeAttr("disabled");
            $("#txtApp_Desc").removeAttr("disabled");
         
        }

        //修改
        function Update() {
            $("#txtApp_Name").removeAttr("disabled");
            $("#txtApp_Url").removeAttr("disabled");
            $("#txtApp_Desc").removeAttr("disabled");
           
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
                $("#divAddTitle").text("应用修改");
                $("#hid_Action").val("Update");
                $("#btnAddAll").show();
                $("#aimg").show();
            }
        }

        function ImgClick() {
            //显示进度条 
            parent.$("#divLoading").show();
            parent.$('#openFrameDiv').dialog({
                title: '选择图片',
                width: 850,
                height: 508,
                closed: false,
                cache: false,
                modal: true,
                maximizable: false,
                resizable: true,
                onClose: function () {
                    parent.$('#openIframe')[0].src = "none.html";
                },
                buttons: [{
                    text: '确定',
                    iconcls: 'l-btn-left2',
                    handler: function () {
                        var Code = parent.$('#openIframe')[0].contentWindow.$('#hnd_imgid').val();
                        if (Code != "") {
                            $("#CN_S_IMAGE").val(Code);
                            $("#CN_S_IMAGES").html(Code);
                            parent.$('#openFrameDiv').dialog('close');
                        }
                        else {
                            parent.ShowMsg("请选择图片!");
                            return false;
                        }
                    }
                }, {
                    text: '关闭',
                    handler: function () {
                        parent.$('#openFrameDiv').dialog('close');
                    }
                }],
            });
            parent.$('#openIframe')[0].src = "/UI/demoList.aspx"
            parent.$('#openFrameDiv').dialog('open');
        }

    </script>
</head>
<body>
    <form id="form1" runat="server">
        <input type="hidden" id="hdnTotalRow" value="0" />
        <input type="hidden" id="hdnPageIndex" value="0" />
        <input type="hidden" id="hdnPageSize" />
        <input type="hidden" id="hid_Action" />
        <div>
        </div>
        <div id="loading">
        </div>
        <table style="min-width: 882px; min-height: 500px" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td valign="top" bgcolor="#e6e6e8" class="main">
                    <div class="searchShow">
                        <div>
                            <span class="title">应用编号:</span>
                            <div>
                                <input type="text" id="txt_App_Code" onkeyup="replaceSpecialSymbol(this)" class="inputText" />
                            </div>
                        </div>

                        <div>
                            <span class="title">应用名称:</span>
                            <div>
                                <input type="text" id="txt_App_Name" onkeyup="replaceSpecialSymbol(this)" class="inputText" />
                            </div>
                        </div>
                        <div>
                            <span class="title" style="padding-right: 0px;"><a class="button" id="" power="Select" onclick="LoadBzTaskList()">查询</a></span>
                        </div>
                    </div>
                    <div class="clear height10">
                    </div>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" height="400" style="min-width: 1185px">
                        <tr>
                            <td valign="top" width="70%">
                                <div class="clear">
                                </div>
                                <div id="dvOrders">
                                    <div class="shadowBoxWhite" style="width: 98%; padding: 10px 1%;">
                                        <div id="divbutton" runat="server" style="margin: 0 0 10px 0px;">
                                            <a class="button blueButton" id="btnAdd" onclick="Add()" power="Add">新增</a>
                                            <a class="button blueButton" id="btnUpdate" onclick="Update()" power="Edit">修改</a>
                                            <a class="button redButton" id="btnDelete" onclick="deleteBtn()" power="Delete">删除</a>
                                        </div>
                                        <div class="tableDiv">
                                            <div id="DivProductList">
                                                <table id="tbList" width="100%" border="0" cellspacing="1" cellpadding="5">
                                                    <thead>
                                                        <tr class='caption'>
                                                            <th style="width: 3%; text-align: center">
                                                                <input type="checkbox" id="selectall" name="selectall" />
                                                            </th>
                                                            <th style="width: 11%; text-align: center">应用编号
                                                            </th>
                                                            <th style="width: 11%; text-align: center">应用名称
                                                            </th>
                                                            <th style="width: 20%; text-align: center">发布地址
                                                            </th>
                                                            <th style="width: 15%; text-align: center">描述
                                                            </th>
                                                            <th style="width: 10%; text-align: center">图标
                                                            </th>
                                                            <th style="width: 10%; text-align: center">修改人
                                                            </th>
                                                            <th style="width: 20%; text-align: center">修改日期
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
                            <td width="25%" valign="top">
                                <div class="clear">
                                </div>
                                <div  id="divAdd" class ="quickAdd shadowBoxYellow" style="width: 98%; min-height: 380px;">
                                    <div class="title" id="divAddTitle" style="width: 100%">
                                        应用新增
                                    </div>
                                    <div class="text">
                                       
                                        <div id="divUserRoleList">
                                            <table width="100%" border="0" cellspacing="0" cellpadding="5">
                                                <tbody id="foucs">
                                                        <tr>
                                                           <td class="font14" align="right"><font color="red">*</font>应用图标：</td>
                                                         <td style="text-align: left">
                                                                <i class="icon iconfont" id="CN_S_IMAGES" style="font-size:35px">&#xe624;</i>
                                                             <input type="hidden" id="CN_S_IMAGE" />
                                                             <a   id="aimg" onclick="ImgClick()" style="cursor:pointer">更改</a>           
                                                         </td>
                                                     </tr>
                                                     <tr>
                                                    <td class="font14" align="right"><font color="red">*</font>应用编号：</td>
                                                    <td align="left">
                                                        <input id="txtApp_Code" class="inputText wf200"  onkeyup="value=value.replace(/[^\w\.\/]/ig,'')" maxlength="16" type="text"  disabled="disabled" onblur="Examine()" />
                                                        <div style="float: left"></div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="font14" align="right"><font color="red">*</font>应用名称：</td>
                                                    <td align="left" >
                                                        <input id="txtApp_Name" class="inputText wf200" onkeyup="replaceSpecialSymbol(this)" maxlength="16" type="text" />
                                                        <div style="float: left"></div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="font14" align="right" ><font color="red">*</font>链接地址：</td>
                                                    <td align="left" >
                                                        <input id="txtApp_Url" class="inputText wf200"  maxlength="200" type="text"/>
                                                        <div style="float: left"></div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="font14" align="right">应用描述：</td>
                                                    <td align="left" >
                                                        <textarea id="txtApp_Desc" style="width:180px;height:80px"  maxlength="40"></textarea>
                                                        <div style="float: left"></div>
                                                    </td>
                                                </tr>
                                                     
                                                  <tr>
                                                        <td colspan="2" style="text-align: center">
                                                            <a class="button blueButton" id="btnAddAll" onclick="Save()">保存</a>
                                                        </td>
                                                    </tr>
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
