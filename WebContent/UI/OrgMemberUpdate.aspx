<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="OrgMemberUpdate.aspx.cs" Inherits="HH.Employee.WebUI.UI.OrgMemberUpdate" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>成员换部门</title>
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

        var jsonString = GetQueryString("jsonString");
        $(function () {
            //加载树
            refreshTree();
            var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
            treeObj.expandAll(true);
            SetUserList(jsonString);
            parent.$("#divLoading").hide();
        });
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
        }

        function SetUserList(json) {

            var data = eval("(" + json + ")");
            var Html = "";
            for (var i = 0; i < data.length; i++) {
                Html += "<tr class=\"trout\" onclick=\"selectArow(this);\">";
                //登录名
                Html += "<td align='center' colname='login'>" + data[i].userName + "</td>";
                //真实姓名
                Html += "<td align='center' colname='realName'>" + data[i].realName + "</td>";
                Html += "</tr>";
            }
            $("#tb_userList>tbody").html(Html);
        }

        function getImportItemArray() {
            var orgUser = {};
            var params = [];

            $("#tb_userList tbody tr").each(function (i) {
                var userName = $(this).find("td[colname='login']").text();
                var users = { "login": userName };
                params.push(users);
            });

            var orgCode = $("#orgCode").val();

            orgUser.login = login;
            orgUser.appCode = appCode;
            orgUser.flag = flag;
            orgUser.orgCode = orgCode;
            orgUser.listLoginName = params;

            return orgUser;
        }
    </script>
</head>
<body>
    <input type="hidden" id="orgCode" />
    <div class="shadowBoxWhite" style="width: 98%; padding: 10px 1%;">
        <table width="100%" border="0" cellpadding="0" cellspacing="0">
            <tr>
                <td valign="top" width="250">

                    <div class="zTreeDemoBackground" style="width: 250px;">
                        <ul id="treeDemo" class="ztree" style="width: 220px; min-height: 350px">
                        </ul>
                    </div>
                </td>
                <td valign="top">
                    <div style="overflow-y: auto">
                        <div class="tableDiv">
                            <table width="100%" border="0" cellspacing="1" cellpadding="5" id="tb_userList">
                                <thead>
                                    <tr class='caption'>
                                        <th align="center" width="50%">用户名</th>
                                        <th align="center" width="50%">真实名称</th>
                                    </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
