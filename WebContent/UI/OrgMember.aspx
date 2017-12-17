<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="OrgMember.aspx.cs" Inherits="HH.Employee.WebUI.UI.OrgMember" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>组织机构新增成员</title>
    <link type="text/css" href="../Scripts/EasyUi/themes/default/newStyle.css" rel="stylesheet" />
    <link type="text/css" href="../Scripts/EasyUi/themes/default/style.css" rel="stylesheet" />
    <link type="text/css" href="../Scripts/zTreev3.5.15/css/zTreeStyle/zTreeStyle.css" rel="stylesheet" />
    <link href="/Scripts/UI/pager/pagination.css" rel="stylesheet" type="text/css" />
    <link href="/Scripts/table/tablediscolor.css" rel="stylesheet" type="text/css" />
    <script src="/Scripts/jquery-1.5.1.min.js" type="text/javascript"></script>
    <script src="/Scripts/table/tablediscolor.js" type="text/javascript"></script>
    <script src="/Scripts/zTreev3.5.15/js/jquery.ztree.all-3.5.js" type="text/javascript"></script>
    <script src="/Scripts/UI/pager/jquery.pagination.js" type="text/javascript"></script>
    <script src="/Scripts/Common.js" type="text/javascript"></script>
    <script type="text/javascript">
        var login = GetCookie("EmplyeeUserName");
        var flag = GetCookie("EmplyeeUserFlag");
        var appCode = GetCookie("AppCode");
        $(function () {

            var orgCode = GetQueryString("orgCode");
            var orgName = GetQueryString("orgName");

            $("#txtOrg").val(orgName);
            $("#txtOrg").attr("name", orgCode);

            SetPage();
            parent.$("#divLoading").hide();
        })

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

        //加载未分配部门的用户
        function LoadBzTaskList(pageIndex) {
            var Html = "";
            var userName = $("#txtuserName").val();

            //var ajaxUrl = webapi + "/api/Org/GetNoOrgUserList";
            //var ajaxData = { "userName": userName, "pageIndex": pageIndex, "pageSize": 10 };

            var ajaxUrl = "/UI/AjaxPage/OrgManager.ashx";
            var ajaxData = "Action=GetNoOrgUserList&userName=" + userName + "&pageIndex=" + pageIndex + "&pageSize=10";

            var msg = AjaxManagers(ajaxData, ajaxUrl);
            if (msg != "") {
                //字符串转成Json对象
                var data = (new Function("", "return " + msg))();
                //遍历数据行
                $.each(data.LIST, function (i, n) {
                    Html += "<tr class=\"trout\" onclick=\"selectArow(this);\" >";
                    //复选框
                    Html += "<td  align='center'> <input value='" + n.login + "' type='checkbox' name='chkid'  /></td>";
                    //登录名
                    Html += "<td align='center' colname='code'>" + n.login + "</td>";
                    //真实姓名
                    Html += "<td align='center' colname='name'>" + n.realName + "</td>";
                    //状态
                    Html += "<td align='center' colname='name'>" + (n.state == 1 ? "启用" : "禁用") + "</td>";
                    //创建日期
                    Html += "<td align='center'>" + JsonDateTimeFormat(n.createDate) + "</td>";
                    //设为管理员
                    Html += "<td align='center'><a href='javascript:void(0)' onclick='SetKey(this)' name='supper' issupper='1'>否</a></td>";

                    Html += "</tr>";
                });
                $("#hdnTotalRow").val(data.totalRows);
            }
            if (Html != "") {
                $("#tb_NoOrg>tbody").html(Html);
            }
            else {
                $("#hdnTotalRow").val(1);
                $("#tb_NoOrg>tbody").html("<tr><td bgcolor='#FFFFFF' colspan='6' align='center'>暂无符合条件的数据！</td></tr>");
            }
            //自定义类，给定值；
            $("#tb_NoOrg").alterBgColor({
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
        //设置是否负责人
        function SetKey(obj) {
            var now = $(obj).text();
            if (now == "否") {
                $(obj).attr("issupper", "0");
                $(obj).text("是");
            }
            else {
                $(obj).attr("issupper", "1");
                $(obj).text("否");
            }
        }
        //保存
        function Save() {
            var orgUser = {};

            var params = [];
            $("#tb_NoOrg tbody tr").each(function (i) {
                //得到选中行
                if ($(this).find("input[name='chkid']").attr("checked") == true) {
                    var logins = $(this).find("input[name='chkid']").val();
                    var isSupper = $(this).find("a[name='supper']").attr("issupper");
                    var users = { "login": logins, "isSupper": isSupper };
                    params.push(users);
                }
            });
            if (params.length == 0) {
                parent.ShowMsg("请选择需要新增的成员!");
            }
            else {
                var orgCode = $("#txtOrg").attr("name");
                orgUser.login = login;
                orgUser.orgCode = orgCode;
                orgUser.appCode = appCode;
                orgUser.flag = flag;
                orgUser.listLoginName = params;
                
                var ajaxUrl = "/UI/AjaxPage/OrgManager.ashx";
                var ajaxData = "Action=SetOrgUser&jsonString=" + JSON.stringify(orgUser);

                var msg = AjaxManagers(ajaxData, ajaxUrl);
                if (msg != "") {
                    var data = (new Function("", "return " + msg))();
                    if (data.Success) {
                        parent.ShowMsg("保存成功！");
                        parent.$('#tabs .panel:visible iframe')[0].contentWindow.SetPage();
                        parent.$('#openFrameDiv').dialog('close');
                    }
                    else {
                        parent.ShowMsg("保存失败：" + data.Msg);
                    }
                }
            }
        }
    </script>
</head>
<body>
    <form id="form1" runat="server">
        <asp:HiddenField ID="hdnPageIndex" runat="server" Value="0" />
        <asp:HiddenField ID="hdnPageSize" runat="server" />
        <asp:HiddenField ID="hdnTotalRow" runat="server" />
        <div>
            <div class="searchShow">
                <span class="title">当前机构:</span>
                <div style="width: 110px; padding: 0; margin: 0;">
                    <input type="text" id="txtOrg" disabled="disabled" class="inputText wf100" style="width: 100px;" />
                </div>
                <div>
                    <span class="title">用户名:</span>
                    <div style="width: 110px; padding: 0; margin: 0;">
                        <input type="text" id="txtuserName" onkeyup="replaceSpecialSymbol(this)" class="inputText wf100" style="width: 100px;" />
                    </div>
                </div>
                <div>
                    <span class="title" style="padding-right: 0px;"><a class="button" id="" onclick="SetPage()">查询</a></span>
                </div>
            </div>
            <div class="tableDiv">
                <table width="100%" border="0" cellspacing="1" cellpadding="5" id="tb_NoOrg">
                    <thead>
                        <tr class='caption'>
                            <th align="center" width="5%">
                                <input type="checkbox" id="selectall" name="selectall" /></th>
                            <th align="center" width="20%">用户名</th>
                            <th align="center" width="20%">真实名称</th>
                            <th align="center" width="15%">状态</th>
                            <th align="center" width="25%">创建日期</th>
                            <th align="center" width="15%">设为负责人
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
        <div class="popBottom">
            <a href="javascript:Save()" class="button blueButton" >保存</a>
            <a href="#" class="button" onclick="javascript: parent.$('#openFrameDiv').dialog('close');">关闭</a>
        </div>
    </form>
</body>
</html>
