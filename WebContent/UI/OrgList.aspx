<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="OrgList.aspx.cs" Inherits="HH.Employee.WebUI.UI.OrgList" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>组织机构管理</title>
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
        var login = "";
        var flag = "";
        var appCode = "";
        $(function () {
            login = GetCookie("EmplyeeUserName");
            flag = GetCookie("EmplyeeUserFlag");
            appCode = GetCookie("AppCode");

            ///切换选项卡
            $(".tab_title a").click(function () {
                $(this).addClass("type_clicked").siblings().removeClass("type_clicked");
                var index = $(".tab_title a").index(this);
                $(".tab_box > div")
                    .eq(index).show()
                    .siblings().hide();
            });

            //选择
            $("#div_Type>p").bind("click", function () {
                //类型
                var name = $(this).text();
                $("#txtType").val(name);
                $("#div_Type").hide();
            });

            $("#a_Type,#txtType").click(function () {
                $("#div_Type").toggle(200);
            });

            //加载树
            refreshTree();
            //加载用户
            SetPage();
            //获得权限
            Powder();

            AjaxStop();
        })

        var zTree1;
        var setting;
        //设置操作菜单的回调函数
        setting = {
            view: {
                dblClickExpand: true, //双击展开  
                showLayer: false,
                selectedMulti: false //是否允许多选  
                //showIcon: showIconForTree//显示节点小图标  
            },
            data: {
                simpleData: {
                    enable: true,
                    idKey: "id", //设定最进步数据
                    pIdKey: "pId",
                    rootPId: ""
                }
            },
            callback: {
                beforeClick: zTreeBeforeClick,
                beforeRename: null,
                onClick: zTreeOnClick,
                beforeDrag: zTreeBeforeDrag
            }
        };
        //拖拽菜单前执行的函数
        function zTreeBeforeDrag(treeId, treeNode) {
            return false;
        }

        //单击某一菜单前执行的函数
        function zTreeBeforeClick(treeId, treeNode) {
            var r = $("#beforeClickTrue").attr("checked");
            return r;
        }

        //点击树节点
        function zTreeOnClick(event, treeId, treeNode) {
            //alert(treeNode.id);
            $("#orgCode").val(treeNode.id);
            $("#txtPname").val(treeNode.pname);
            $("#txtOrgCode").val(treeNode.code);
            $("#txtOrgName").val(treeNode.name);
            $("#txtOrder").val(treeNode.order);
            $("#txtType").val(treeNode.type);

            GetOrgDetail(treeNode.id);

            SetPage();
        }

        //加载菜单树
        function refreshTree() {
            var ajaxUrl = "/UI/AjaxPage/OrgManager.ashx";
            var ajaxData = "Action=GetOrgList&appCode=" + appCode;
            var msg = AjaxManagers(ajaxData, ajaxUrl);

            var zNodes = (new Function("", "return " + msg))();

            setting.editable = true;
            setting.edit_renameBtn = false;
            setting.edit_removeBtn = false;
            zTree1 = $.fn.zTree.init($("#treeDemo"), setting, zNodes);
            var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
            treeObj.expandAll(true);
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

            var orgCode = $("#orgCode").val();
            var login = "";//$("#txtLogin").val();

            var Html = "";

            var ajaxUrl = "/UI/AjaxPage/OrgManager.ashx";
            var ajaxData = "Action=GetOrgUser&login=" + login + "&appCode=" + appCode + "&orgCode=" + orgCode + "&pageIndex=" + pageIndex + "&pageSize=10";
            var msg = AjaxManagers(ajaxData, ajaxUrl);
            if (msg != "") {
                //字符串转成Json对象
                var data = (new Function("", "return " + msg))();
                //遍历数据行
                $.each(data.LIST, function (i, n) {
                    Html += "<tr class=\"trout\" onclick=\"selectArow(this);\" id='" + n.orgCode + "'>";
                    //复选框
                    Html += "<td  align='center'> <input value='" + n.login + "' type='checkbox' name='chkid'  /></td>";
                    //登录名
                    Html += "<td align='center'>" + n.login + "</td>";
                    //真实姓名
                    Html += "<td align='center' colname='realName'>" + n.realName + "</td>";
                    //状态
                    Html += "<td align='center'>" + (n.state == 1 ? "启用" : "禁用") + "</td>";
                    //创建日期
                    Html += "<td align='center'>" + JsonDateTimeFormat(n.createDate) + "</td>";
                    //是否机构负责人
                    Html += "<td align='center'>" + (n.isSupper == 1 ? "否" : "是") + "</td>";
                    Html += "</tr>";
                });
                $("#hdnTotalRow").val(data.totalRows);
            }
            if (Html != "") {
                $("#tb_OrgList>tbody").html(Html);
            }
            else {
                $("#hdnTotalRow").val(1);
                $("#tb_OrgList>tbody").html("<tr><td bgcolor='#FFFFFF' colspan='6' align='center'>暂无符合条件的数据！</td></tr>");
            }
            //自定义类，给定值；
            $("#tb_OrgList").alterBgColor({
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

        //删除组织机构
        function DelOrg() {
            var orgCode = $("#orgCode").val();
            if (orgCode != null && orgCode != "") {
                parent.$.messager.confirm('系统提示', '提示：确定删除吗？', function (r) {
                    if (r) {
                        var ajaxUrl = "/UI/AjaxPage/OrgManager.ashx";
                        var ajaxData = "Action=DeleteOrg&orgCode=" + orgCode;
                        var msg = AjaxManagers(ajaxData, ajaxUrl);
                        if (msg != "") {
                            var data = (new Function("", "return " + msg))();
                            if (data.Success == "true" || data.Success == true) {
                                parent.ShowMsg("删除成功！");
                                refreshTree();
                                treeObj.expandAll(true);
                            }
                        }
                    }
                });
            }
            else {
                parent.ShowMsg("请选择组织机构！");
            }
        }

        //删除组织机构人员关系
        function DelOrgUser() {
            var params = [];
            $("#tb_OrgList tbody tr").each(function (i) {
                //得到选中行
                if ($(this).find("input[name='chkid']").attr("checked") == true) {
                    var logins = $(this).find("input[name='chkid']").val();
                    var orgs = $(this).attr("id");
                    var orguser = { "login": logins, "orgCode": orgs };
                    params.push(orguser);
                }
            });

            if (params.length == 0) {
                parent.ShowMsg("请选择需要删除的人员!");
            }
            else {
                parent.$.messager.confirm('系统提示', '提示：确定删除吗？', function (r) {
                    if (r) {

                        var ajaxUrl = "/UI/AjaxPage/OrgManager.ashx";
                        var ajaxData = "Action=DeleteOrgUser&jsonString=" + JSON.stringify(params);
                        var msg = AjaxManagers(ajaxData, ajaxUrl);
                        if (msg != "") {
                            var data = (new Function("", "return " + msg))();
                            if (data.Success == "true" || data.Success == true) {
                                parent.ShowMsg("删除成功！");
                                SetPage();
                            }
                            else {
                                parent.ShowMsg("删除失败：" + data.Msg);
                            }
                        }
                    }
                });
            }
        }

        //获得组织机构详细
        function GetOrgDetail(orgCode) {

            var ajaxUrl = "/UI/AjaxPage/OrgManager.ashx";
            var ajaxData = "Action=GetModelDetail&orgCode=" + orgCode;

            var msg = AjaxManagers(ajaxData, ajaxUrl);

            if (msg != "null" && msg != "") {
                //字符串转成Json对象
                var data = (new Function("", "return " + msg))();

                $("#txtShortName").val(data.CN_S_SHORTNAME);

                $("#txtAddress").val(data.CN_S_ADDRESS);
                $("#txtPhone").val(data.CN_S_PHONE);
                $("#txtPhone2").val(data.CN_S_PHONE2);
                $("#txtPhone3").val(data.CN_S_PHONE3);
                $("#txtFax").val(data.CN_S_FAX);
                $("#txtEmail").val(data.CN_S_EMAIL);
                $("#txtPost").val(data.CN_S_POST);
                $("#txtRemark").val(data.CN_S_NOTE);

            }
        }

        //更新组织机构
        function UpdateOrg() {
            var org = {};

            org.CN_GUID = $("#orgCode").val();
            org.CN_S_ORGCODE = $("#txtOrgCode").val();
            if (org.CN_S_ORGCODE == "" || org.CN_S_ORGCODE.length >= 36) {
                parent.ShowMsg("机构编码必填且不能大于36位！");
                return false;
            }
            org.CN_S_ORGNAME = $("#txtOrgName").val();
            if (org.CN_S_ORGNAME == "" || org.CN_S_ORGNAME.length >= 36) {
                parent.ShowMsg("机构名称必填且不能大于36位！");
                return false;
            }
            //org.CN_S_OWNERID = "";
            //org.CN_S_OWNERID = $("#txtRemark").val();
            org.CN_N_ORDER = $("#txtOrder").val();
            if (org.CN_N_ORDER == "") {
                parent.ShowMsg("排序号必填！");
                return false;
            }
            var result = (org.CN_N_ORDER.toString()).indexOf(".");
            if (result != -1) {
                parent.ShowMsg("排序号必须是大于0的整数！");
                return false;
            }
            org.CN_S_ORGTYPE = $("#txtType").val();
            if (org.CN_S_ORGTYPE == "") {
                parent.ShowMsg("请选择组织机构类型！");
                return false;
            }
            org.CN_S_SHORTNAME = $("#txtShortName").val();
            org.CN_S_IMG = "";
            org.CN_S_ADDRESS = $("#txtAddress").val();
            org.CN_S_POST = $("#txtPost").val();
            if (org.CN_S_POST != "" && org.CN_S_POST.length > 6) {
                parent.ShowMsg("邮编不能大于6位！");
                return false;
            }
            org.CN_S_PHONE = $("#txtPhone").val();
            org.CN_S_PHONE2 = $("#txtPhone2").val();
            org.CN_S_PHONE3 = $("#txtPhone3").val();
            org.CN_S_FAX = $("#txtFax").val();
            org.CN_S_EMAIL = $("#txtEmail").val();
            org.CN_S_WEBURL = "";
            org.CN_S_NOTE = $("#txtRemark").val();
            org.CN_S_APPCODE = appCode;
            org.login = login;
            org.Flag = flag;

            var ajaxUrl = "/UI/AjaxPage/OrgManager.ashx";
            var ajaxData = "Action=UpdateOrg&jsonString=" + escape(JSON.stringify(org));

            var msg = AjaxManagers(ajaxData, ajaxUrl);
            if (msg != "") {
                var data = (new Function("", "return " + msg))();
                if (data.Success == 'true' || data.Success == true) {
                    parent.ShowMsg("修改成功！");
                    refreshTree();
                }
                else {
                    parent.ShowMsg("修改失败：" + data.Msg);
                }
            }
        }

        //新增机构
        function Add() {
            var orgCode = $("#orgCode").val();
            var orgName = $("#txtOrgName").val();
            if (orgCode == "" || orgName == "") {
                parent.ShowMsg("请选择上级组织机构！");
            }
            else {
                var Title = "新增机构";
                //显示进度条 
                parent.$("#divLoading").show();
                parent.$('#openFrameDiv').dialog({
                    title: Title,
                    width: 700,
                    height: 488,
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


                parent.$('#openIframe')[0].src = "/UI/OrgAdd.aspx?orgCode=" + orgCode + "&orgName=" + escape(orgName);
                parent.$('#openFrameDiv').dialog('open');
            }
        }

        //新增机构人员
        function AddMember() {
            var orgCode = $("#orgCode").val();
            var orgName = $("#txtOrgName").val();
            if (orgCode == "" || orgName == "") {
                parent.ShowMsg("请选择组织机构！");
            }
            else {
                var Title = "新增成员";
                //显示进度条 
                parent.$("#divLoading").show();
                parent.$('#openFrameDiv').dialog({
                    title: Title,
                    width: 700,
                    height: 510,
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
                parent.$('#openIframe')[0].src = "/UI/OrgMember.aspx?orgCode=" + orgCode + "&orgName=" + escape(orgName);
                parent.$('#openFrameDiv').dialog('open');
            }
        }

        //成员换部门
        function UpdateMember() {
            var loginparams = [];
            $("#tb_OrgList tbody tr").each(function (i) {
                //得到选中行
                if ($(this).find("input[name='chkid']").attr("checked") == true) {
                    var userName = $(this).find("input[name='chkid']").val();
                    var realName = $(this).find("td[colname='realName']").text();
                    var users = { "userName": userName, "realName": escape(realName) };
                    loginparams.push(users);
                }
            });

            if (loginparams.length == 0) {
                parent.ShowMsg("请选择需要变更部门的人员!");
            }
            else {
                var Title = "成员换部门";
                //显示进度条 
                parent.$("#divLoading").show();
                parent.$('#openFrameDiv').dialog({
                    title: Title,
                    width: 650,
                    height: 460,
                    closed: true,
                    cache: false,
                    modal: true,
                    maximizable: true,
                    resizable: true,
                    onClose: function () {
                        parent.$('#openIframe')[0].src = "none.html";
                    },
                    buttons: [{
                        text: '确定',
                        iconcls: 'l-btn-left2',
                        handler: function () {
                            var data = parent.$('#openIframe')[0].contentWindow.getImportItemArray();
                            if (data != null && data != "") {
                                var orgCode = data.orgCode;
                                if (orgCode == null || orgCode == "") {
                                    parent.ShowMsg("请选择变更的部门！");
                                }
                                else {
                                    //var ajaxUrl = webapi + "/api/Org/UpdateOrgUser";
                                    var ajaxUrl = "/UI/AjaxPage/OrgManager.ashx";
                                    var ajaxData = "Action=UpdateOrgUser&jsonString=" + JSON.stringify(data);
                                    var msg = AjaxManagers(ajaxData, ajaxUrl);


                                    if (msg != "") {
                                        var data = (new Function("", "return " + msg))();
                                        if (data.Success) {
                                            parent.ShowMsg("保存成功！");
                                            parent.$('#openFrameDiv').dialog('close');
                                            SetPage();
                                        }
                                        else {
                                            parent.ShowMsg("保存失败：" + data.Msg);
                                        }
                                    }
                                }
                            }
                        }
                    }, {
                        text: '关闭',
                        handler: function () {
                            parent.$('#openFrameDiv').dialog('close');
                        }
                    }]
                });
                parent.$('#openIframe')[0].src = "/UI/OrgMemberUpdate.aspx?jsonString=" + JSON.stringify(loginparams);
                parent.$('#openFrameDiv').dialog('open');
            }
        }

        function AjaxStop() {
            parent.$("#divLoading").hide();
        }

        var indexNode = 0;
        //定位
        function Fixed() {
            var keywords = $("#txtFixed").val();
            var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
            var nodes = treeObj.getNodesByParamFuzzy("name", keywords, null);
            //如果已经定位到最后一个  则从第一个重新定位
            if (indexNode == nodes.length ) {
                indexNode = 0;
            }
            //如果有匹配项，则定位
            if (nodes.length > 0) {
                treeObj.selectNode(nodes[indexNode]);
                indexNode++;
            }
        }

    </script>
</head>
<body>
    <form id="form1" runat="server">
        <input type="hidden" id="orgCode" value="" />
        <asp:HiddenField ID="hdnPageIndex" runat="server" Value="0" />
        <asp:HiddenField ID="hdnPageSize" runat="server" />
        <asp:HiddenField ID="hdnTotalRow" runat="server" />
        <div class="main">
            <div class="shadowBoxWhite" style="width: 98%; padding: 10px 1%; min-width: 882px; min-height: 500px">
                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                        <td valign="top" width="250">
                            <div style="margin-bottom: 10px;">
                                <input type="text" class="inputText" id="txtFixed" style="margin-right: 5px;" /><a href="javascript:Fixed()" class="button greenButton">定位</a>
                            </div>
                            <div class="zTreeDemoBackground" style="width: 250px;">
                                <ul id="treeDemo" class="ztree" style="width: 220px; min-height: 380px">
                                </ul>
                            </div>
                        </td>
                        <td valign="top">
                            <div class="tabsDiv" style="width: 100%;">
                                <div class="tab_title">
                                    <a href="#" class="type_clicked">单位成员</a>
                                    <a href="#">属性</a>
                                </div>
                                <div class="tab_box">
                                    <div>
                                        <div style="margin-bottom: 10px;">
                                            <a href="javascript:Add()" class="button blueButton" power="Add">新增机构</a>
                                            <a href="javascript:DelOrg()" class="button redButton" power="Delete">删除机构</a>
                                            <a href="javascript:AddMember()" class="button blueButton" power="Add">新增成员</a>
                                            <a href="javascript:UpdateMember()" class="button blueButton" power="MemberOrg">成员换部门</a>
                                            <a href="javascript:DelOrgUser()" class="button redButton" power="Delete">删除成员</a>
                                        </div>
                                        <div class="tableDiv">
                                            <table width="100%" border="0" cellspacing="1" cellpadding="5" id="tb_OrgList">
                                                <thead>
                                                    <tr class='caption'>
                                                        <th align="center" width="5%">
                                                            <input type="checkbox" id="selectall" name="selectall" /></th>
                                                        <th align="center" width="22%">用户名</th>
                                                        <th align="center" width="23%">真实名称</th>
                                                        <th align="center" width="10%">状态</th>
                                                        <th align="center" width="30%">创建日期</th>
                                                        <th align="center" width="10%">机构负责人
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
                                    <div style="display: none">
                                        <table border="0" cellpadding="8" cellspacing="0" width="100%">
                                            <tr>
                                                <td width="100px" align="right" class="font14">上级机构：</td>
                                                <td align="left">
                                                    <input type="text" class="inputText wf200" id="txtPname" disabled="disabled" /></td>
                                                <td align="right" class="font14">机构编码：</td>
                                                <td align="left">
                                                    <input type="text" class="inputText wf200" id="txtOrgCode" disabled="disabled" /></td>
                                            </tr>
                                            <tr>
                                                <td width="100px" align="right" class="font14">机构名称：</td>
                                                <td align="left">
                                                    <input type="text" class="inputText wf200" id="txtOrgName" /></td>
                                                <td align="right" class="font14">排　　序：</td>
                                                <td align="left">
                                                    <input type="number" class="inputText wf200" id="txtOrder" /></td>
                                            </tr>
                                            <tr>
                                                <td width="100px" align="right" class="font14">机构类型：</td>
                                                <td align="left">
                                                    <div style="position: relative; z-index: 4;">
                                                        <span class="active" style="width: 210px; margin: 0;">
                                                            <input class="inputText" type="text" readonly="readonly" style="width: 180px;" id="txtType">
                                                            <a id="a_Type" href="#" class="trigger"></a></span>
                                                        <div class="dropList" id="div_Type" style="width: 210px; display: none;">
                                                            <p>大区</p>
                                                            <p>分公司</p>
                                                            <p>子公司</p>
                                                            <p>部门</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td align="right" class="font14">简　　称：</td>
                                                <td align="left">
                                                    <input type="text" class="inputText wf200" id="txtShortName" /></td>
                                            </tr>
                                            <tr>
                                                <td width="100px" align="right" class="font14">地　　址：</td>
                                                <td align="left">
                                                    <input type="text" class="inputText wf200" id="txtAddress" /></td>
                                                <td align="right" class="font14">电　　话：</td>
                                                <td align="left">
                                                    <input type="text" class="inputText wf200" id="txtPhone" /></td>
                                            </tr>
                                            <tr>
                                                <td width="100px" align="right" class="font14">电　话 2：</td>
                                                <td width="230px" align="left">
                                                    <input type="tel" class="inputText wf200" id="txtPhone2" /></td>
                                                <td align="right" class="font14">固定电话：</td>
                                                <td align="left">
                                                    <input type="text" class="inputText wf200" id="txtPhone3" /></td>
                                            </tr>
                                            <tr>
                                                <td width="100px" align="right" class="font14">传　　真：</td>
                                                <td align="left">
                                                    <input type="text" class="inputText wf200" id="txtFax" /></td>
                                                <td align="right" class="font14">邮　　箱：</td>
                                                <td align="left">
                                                    <input type="text" class="inputText wf200" id="txtEmail" /></td>
                                            </tr>
                                            <tr>
                                                <td width="100px" align="right" class="font14">邮　　编：</td>
                                                <td align="left">
                                                    <input type="text" class="inputText wf200" id="txtPost" /></td>
                                                <td align="right" class="font14"></td>
                                                <td align="left"></td>
                                            </tr>
                                            <tr>
                                                <td width="100px" align="right" class="font14">机构描述：</td>
                                                <td align="left">
                                                    <textarea class="textarea wf200" rows="3" id="txtRemark" maxlength="100"></textarea></td>
                                                <td align="right"></td>
                                                <td align="left"></td>
                                            </tr>
                                            <tr>
                                                <td colspan="6" align="center">
                                                    <a href="javascript:UpdateOrg()" class="button blueButton" power="Edit">保存</a>
                                                    <a href="#" class="button">取消</a>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </form>
</body>
</html>
