<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="RolePowerManager.aspx.cs" Inherits="HH.Employee.WebUI.UI.RolePowerManager" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link type="text/css" href="/Scripts/EasyUi/themes/default/newStyle.css" rel="stylesheet" />
    <link type="text/css" href="/Scripts/EasyUi/themes/default/style.css" rel="stylesheet" />
    <link type="text/css" href="/Scripts/zTreev3.5.15/css/zTreeStyle/zTreeStyle.css" rel="stylesheet" />
    <link href="/Scripts/table/tablediscolor.css" rel="stylesheet" type="text/css" />
    <script src="/Scripts/jquery-1.5.1.min.js" type="text/javascript"></script>
    <script src="/Scripts/zTreev3.5.15/js/jquery.ztree.all-3.5.js" type="text/javascript"></script>
    <script src="/Scripts/Common.js" type="text/javascript"></script>
    <style type="text/css">
        li {
            padding: 3px;
        }

        .ztree .head {
            background: #5787EB;
            padding: 10px;
        }

            .ztree .head div.diy {
                width: 300px;
                border-top: none;
                color: #fff;
                font-family: "Microsoft YaHei";
                font-size: 14px;
            }

        .chk_power {
            margin: 2px 3px 0 0;
        }
    </style>
    <script type="text/javascript">
        var appCode = GetCookie("AppCode");
        var login = GetCookie("EmplyeeUserName");
        var flag = GetCookie("EmplyeeUserFlag");

        //所选中的角色所属应用ID
        var role_appcode = GetQueryString("roleAppCode");
        //所选中的角色ID
        var SelRoleId = GetQueryString("roleId");

        //暂时存放 菜单对应按钮集合
        var menuBottonList;

        $(function () {
            //获得菜单按钮对应关系
            GetMenuButton();

            //初始化数据
            refreshTree();
            var treeObj = $.fn.zTree.getZTreeObj("dataTree");
            treeObj.expandAll(true);

            $("ul>li>a").width(180);
            $(".a_power").width(80);

            //设置已存在
            SetChecked(SelRoleId);

            parent.$("#divLoading").hide();
        });

        var zTreeNodes;
        var setting = {
            view: {
                dblClickExpand: true, //双击展开
                showLayer: false,
                selectedMulti: false, //是否允许多选
                addDiyDom: addDiyDom
            },
            check: {
                enable: true
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onCheck: zTreeOnCheck
            }
        };
        //加载菜单树
        function refreshTree() {

            var ajaxUrl = "/UI/AjaxPage/RoleManager.ashx";//webapi + "/api/Menu/GetList";
            var ajaxData = "Action=GetTreeList&role_appcode=" + role_appcode;//{ AppCode: role_appcode };

            var msgs = AjaxManagers(ajaxData, ajaxUrl);

            var data = (new Function("", "return " + msgs))();
            //alert(data);
            var zNodes = eval('[' + data + ']');

            //初始化列表
            zTreeNodes = zNodes;
            //初始化树
            $.fn.zTree.init($("#dataTree"), setting, zTreeNodes);
        }

        //自定义DOM节点
        function addDiyDom(treeId, treeNode) {
            var spanobj = $("#" + treeNode.tId + "_a");
            //获得树节点菜单ID
            var note_id = treeNode.id;

            for (var i = 0; i < menuBottonList.length; i++) {
                if (menuBottonList[i].MenuId == note_id) {
                    var add = "";
                    add += "<input type='checkbox' class='chk_power' name='" + note_id + "' code='" + menuBottonList[i].ButtonCode + "'>";
                    add += "<a class='a_power'>" + menuBottonList[i].ButtonName + "</a>";
                    spanobj.after(add);
                }
            }
        }

        //选中执行
        function zTreeOnCheck(event, treeId, treeNode) {

            var chk_id = treeNode.id;
            //选中某一节点
            if (treeNode.checked) {
                $("input:[name='" + chk_id + "']").attr("checked", true);
                getAllChildrenNodes(treeNode, true);
            }
            else {
                $("input:[name='" + chk_id + "']").attr("checked", false);
                getAllChildrenNodes(treeNode, false);
            }
        };

        //设置子菜单选中或者不选中
        function getAllChildrenNodes(treeNode, checked) {
            if (treeNode.isParent) {
                var childrenNodes = treeNode.children;
                if (childrenNodes) {
                    for (var i = 0; i < childrenNodes.length; i++) {
                        $("input:[name='" + childrenNodes[i].id + "']").attr("checked", checked);
                        getAllChildrenNodes(childrenNodes[i], checked);
                    }
                }
            }
        }

        //获得菜单按钮对应关系
        function GetMenuButton() {

            var ajaxUrl = "/UI/AjaxPage/RoleManager.ashx";// webapi + "/api/Menu/GetMenuBotton";
            var ajaxData = "Action=GetMenuBotton&role_appcode=" + role_appcode;// { AppCode: role_appcode };

            var msg = AjaxManagers(ajaxData, ajaxUrl);
            if (msg != "") {
                menuBottonList = (new Function("", "return " + msg))();
            }
        }

        //初始化选中
        function SetChecked(roleId) {

            var ajaxUrl = "/UI/AjaxPage/RoleManager.ashx";
            //webapi + "/api/Menu/GetMenuButtonForPower";
            //{ "AppCode": role_appcode, "role_array": roleId };
            var ajaxData = "Action=GetMenuButtonForPower&AppCode=" + role_appcode + "&role_array=" + roleId;

            var msg = AjaxManagers(ajaxData, ajaxUrl);
            if (msg != "") {
                var data = (new Function("", "return " + msg))();

                var zTree = $.fn.zTree.getZTreeObj("dataTree");

                for (var i = 0; i < data.length; i++) {
                    //设置节点选中
                    var node = zTree.getNodeByParam("id", data[i].MenuId);
                    node.checked = true;
                    zTree.updateNode(node);

                    //设置节点中按钮复选框选中
                    $("input[name='" + data[i].MenuId + "'][code='" + data[i].ButtonCode + "']").attr("checked", true);
                }
            }
        }

        //保存
        function Save() {

            var list = {};
            var powars = [];

            //获得选中节点
            var treeObj = $.fn.zTree.getZTreeObj("dataTree");
            var nodes = treeObj.getNodes();
            for (var i = 0; i < nodes.length; i++) {

                //获得一级节点状态
                var check_Node = nodes[i].getCheckStatus();
                //如果是选中或者半选中状态，则说明有子项选中
                if (check_Node.checked == true || check_Node.half == true) {
                    var listdata = [];
                    //获得根节点
                    var pm = GetCheckedData(nodes[i]);
                    listdata.push(pm);
                    //获得子节点
                    listdata = GetChildrenChecked(nodes[i], listdata);

                    for (var m = 0; m < listdata.length; m++) {
                        for (var n = 0; n < listdata[m].length; n++) {
                            powars.push(listdata[m][n]);
                        }
                    }

                }
            }
            if (powars == null || powars.length == 0) {
                parent.ShowMsg("请选择分配的权限！");
                return false;
            }
            else {
                list.login = login;
                list.flag = flag;
                list.roleid = SelRoleId;
                //角色所属应用
                list.roleappid = role_appcode;
                //当前应用
                list.appcode = appCode;
                list.listpow = powars;

                var ajaxUrl = "/UI/AjaxPage/RoleManager.ashx";//webapi + "/api/Role/AddPower";
                var ajaxData = "Action=AddPower&jsonString=" + JSON.stringify(list);

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
        }

        //递归查询子节点
        function GetChildrenChecked(treeNode, powars) {
            //如果是父节点
            if (treeNode.isParent) {
                //获得子节点
                var childrenNodes = treeNode.children;
                if (childrenNodes) {
                    //循环子节点
                    for (var i = 0; i < childrenNodes.length; i++) {
                        var pm = GetCheckedData(childrenNodes[i]);
                        if (!$.isEmptyObject(pm)) {
                            powars.push(pm);
                        }
                        //循环调用
                        GetChildrenChecked(childrenNodes[i], powars);
                    }
                }
            }
            return powars;
        }

        //根据选中节点解析数据
        //node:选中节点
        function GetCheckedData(node) {
            var params = [];
            //获得节点ID(菜单ID)
            var menuid = node.id;
            //获得选中节点下所有的checkbox
            var check_local = $("#" + node.tId + "_a").nextAll("input[type='checkbox']");
            //如果有按钮
            if (check_local != null && check_local.length > 0) {
                //循环checkbox
                for (var i = 0; i < check_local.length; i++) {
                    if ($(check_local[i]).attr("checked") == true) {
                        var buttoncode = $(check_local[i]).attr("code");
                        var pm = { "menuid": menuid, "buttoncode": buttoncode };
                        params.push(pm);
                    }
                }
            }
            else {//如果没有按钮
                var pm = { "menuid": menuid, "buttoncode": "" };
                params.push(pm);
            }
            return params;
        }
    </script>
</head>
<body>
    <div class="shadowBoxWhite" style="width: auto;min-height: 473px;overflow-y:auto">
        <table width="100%" border="0" cellpadding="0" cellspacing="0">
            <tr>
                <td valign="top" width="250">

                    <div class="zTreeDemoBackground">
                        <ul id="dataTree" class="ztree" style="width: 838px; min-height: 450px">
                        </ul>
                    </div>
                </td>
            </tr>
        </table>
    </div>
    <div class="popBottom">
        <a href="#" class="button blueButton" onclick="Save()">保存</a>
        <a href="#" class="button" onclick="javascript: parent.$('#openFrameDiv').dialog('close');">关闭</a>
    </div>
</body>
</html>
