<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="RoleAssigned.aspx.cs" Inherits="HH.Employee.WebUI.UI.RoleAssigned" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
 "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>角色人员分配</title>
<link type="text/css" href="../Scripts/EasyUi/themes/default/newStyle.css" rel="stylesheet" />
<link type="text/css" href="../Scripts/EasyUi/themes/default/style.css" rel="stylesheet" />
 <link type="text/css" href="../Scripts/zTreev3.5.15/css/zTreeStyle/zTreeStyle.css" rel="stylesheet" />
<link href="/Scripts/UI/pager/pagination.css" rel="stylesheet" type="text/css" />
<link href="/Scripts/table/tablediscolor.css" rel="stylesheet" type="text/css" />
    <script src="/Scripts/jquery-1.5.1.min.js" type="text/javascript"></script>
<script src="/Scripts/table/tablediscolor.js" type="text/javascript"></script>

<script src="../Scripts/zTreev3.5.15/js/jquery.ztree.all-3.5.js" type="text/javascript"></script>
 <script src="/Scripts/UI/pager/jquery.pagination.js" type="text/javascript"></script>
  <script src="/Scripts/Common.js" type="text/javascript"></script>
<script type="text/javascript" >
    $(function () {

        //加载菜单树
       // refreshTree();
        //var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        //treeObj.expandAll(true);
        //加载已选人员
        SelectRole();
        //加载列表
        SetPage();
        AjaxStop();
    });
    function AjaxStop() {
        parent.$("#divLoading").hide();
    }
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
            //remove: zTreeOnRemove,
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
        $("#hid_id").val(treeNode.id);
        $("#hid_name").val(treeNode.name);
        $("#hid_Action").val("select");
        SetPage();
        //alert(treeNode.id);
        //alert(treeNode.pId);
    }

    //加载菜单树
    function refreshTree() {
        //var appCode = GetCookie("AppCode"); //$("#AppCode").attr();//所属应用
        //var ajaxUrl = webapi + "/api/Org/GetOrgList";
        ////var ajaxData = { appCode: appCode };
        ////var msgs = AjaxManagers_json(ajaxData, ajaxUrl);

        ////var data = (new Function("", "return " + msgs))();

        ////var zNodes =  msgs ;
        ////var zNodes = eval('[' + msgs + ']');

        //var ajaxData = { "": appCode };

        var ajaxUrl = "/UI/AjaxPage/OrgManager.ashx";
        var ajaxData = "Action=GetOrgList&appCode";
        var msg = AjaxManagers(ajaxData, ajaxUrl);

        var zNodes = (new Function("", "return " + msg))();

        setting.editable = true;
        setting.edit_renameBtn = false;
        setting.edit_removeBtn = false;
        zTree1 = $.fn.zTree.init($("#treeDemo"), setting, zNodes);
        //var treeObj = $.fn.zTree.getZTreeObj("zTreeContent");
        //treeObj.expandAll(true);
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
            items_per_page: 8, // pagesize:每页的数据个数
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
     
        var ck = "";
        var Html = "";
        var ajaxUrl = "/UI/AjaxPage/UserManager.ashx";
        var ajaxData = "Action=GetList&CN_S_LOGIN=" + CN_S_LOGIN + "&CN_S_NAME=" + CN_S_NAME + "&pageIndex=" + pageIndex + "&pageSize=8";
        var msg = AjaxManagers(ajaxData, ajaxUrl);
      
        if (msg != "flase") {
            //字符串转成Json对象
            var data = (new Function("", "return " + msg))();
            //遍历数据行
            $.each(data.LIST, function (i, n) {
                Html += "<tr class=\"trout\" onclick=\"selectArow(this);\">";
                $("#RoleList>a").each(function () {
                    if ($(this).text() == n.CN_S_LOGIN) {
                        //复选框
                        ck = "true";
                        return;
                    }
                });
                if (ck == "true") {
                    //选中的复选框
                    Html += "<td  align='center'> <input  type='checkbox' id=" + n.CN_S_LOGIN + " checked ='checked' name='chkid'  /></td>";
                    ck = "false";
                } else {
                    //复选框
                    Html += "<td  align='center'> <input  type='checkbox'  id=" + n.CN_S_LOGIN + " name='chkid'  /></td>";
                }
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
                Html += "<td align='center'>" + JsonDateFormat(n.CN_T_CREATEDATE) + "</td>";
                Html += "</tr>";
            });
            $("#hdnTotalRow").val(data.totalRows);
        }
        if (Html != "") {
            $("#tbList>tbody").html(Html);
            isAllChecked();
        }
        else {
            $("#hdnTotalRow").val(1);
            $("#tbList>tbody").html("<tr><td bgcolor='#FFFFFF' colspan='13' align='center'>暂无符合条件的数据！</td></tr>");
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
            if ($("#selectall").attr("checked") == false) {
                $("#tbList>tbody>tr>td>input").each(function () {
                    name = this.id;
                    $("#RoleList>a").each(function () {
                        if ($(this).text() == name) {
                            $(this).remove();
                        }
                    });
                });
            } else {
                $("#tbList>tbody>tr>td>input").each(function () {
                    var ck = "";
                    name = this.id;
                    $("#RoleList>a").each(function () {
                        if ($(this).text() != name) {
                            ck = "true";
                        } else {
                            $(this).remove();
                        }
                    });
                    if (ck = "true") {
                        $('#RoleList').append("<a href=javascript:del('" + name + "') >" + name + "</a>");
                    }
                });
            }
        });
    }


    
   //判断当前数据加载时是否全部选中
    function isAllChecked() {
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

    function SelectRole() {
        var GUID = GetQueryString("GUID");
        var Html = "";
        var ajaxUrl = "/UI/AjaxPage/RoleManager.ashx";
        var ajaxData = "Action=GetAssigned&GUID=" + GUID;
        var msg = AjaxManagers(ajaxData, ajaxUrl);
        if (msg != "") {
              var data = (new Function("", "return " + msg))();
              $.each(data, function (i, n) {

                Html += "<a href=javascript:del('" + n.CN_S_LOGIN + "')>" + n.CN_S_LOGIN + "</a>";
            });
            $('#RoleList').append(Html);
        }
    }

    //选择行操作
    function selectArow(e) {
        var name = $(e).find("td[colname='name']").text();
        var ck = "false";
        $("#RoleList>a").each(function () {
            if ($(this).text() == name) {
                ck = "true";
                $(this).remove();
                return false;
            }
            else {
                ck = "false";
            }
        });
        if (ck == "false")
        {
            $('#RoleList').append("<a href=javascript:del('" + name + "')   >" + name + "</a>");
        }
    }

    function Seve() {
        var obj = {};
        obj.CN_S_LOGIN = "";
        obj.CN_S_RULEGUID = GetQueryString("GUID");
        $("#RoleList>a").each(function () {
            obj.CN_S_LOGIN += $(this).text() + ",";
        });

        //if (obj.CN_S_LOGIN == "") {
        //    parent.ShowMsg("请先分配人员!");
        //    return false;
        //}
        obj.CN_S_CREATOR = GetCookie("EmplyeeUserName");
        obj.Flag = GetCookie("EmplyeeUserFlag");
        obj.CN_S_APPCODE = GetCookie("AppCode");
        obj.CN_S_APPCODES = GetQueryString("AppCode");
        var ajaxUrl = "/UI/AjaxPage/RoleManager.ashx";
        var ajaxData = "Action=SeveAssigned&jsonString=" + escape(JSON.stringify(obj));
        var msg = AjaxManagers(ajaxData, ajaxUrl);
        if (msg == true || msg == "true") {
            parent.ShowMsg("保存成功!");
            parent.$('#openFrameDiv').dialog('close');
        }
        else {
            parent.ShowMsg("保存失败!");
        }
    }

    function del(name)
    {
        $("#RoleList>a").each(function () {
            if ($(this).text() == name) {
                $(this).remove();
            }
        })
        $("#tbList>tbody>tr>td>input").each(function () {
            if (this.id == name)
            {
                $(this).click();
                $(this).removeAttr("checked");
            }
        })
    }

    function select() {
        $("#hid_Action").val("SetPage");
        SetPage();
    }
  
</script>

</head>
<body style="background:#bbb;">
    <form id="form1" runat="server">
         <asp:HiddenField ID="hdnPageIndex" runat="server" Value="0" />
         <asp:HiddenField ID="hdnPageSize" runat="server" />
         <asp:HiddenField ID="hdnTotalRow" runat="server"/>
        <input type="hidden" id="hid_id"/>
        <input type="hidden" id="hid_name"  />
        <input type="hidden" id="hid_Action"  />
<div class="popUp" style="width:auto; height:533px;">
    <div class="popCon" style="height:492px; overflow:auto;">
    	<table cellpadding="0" cellspacing="8" width="100%">
        	<tr>
              <%--   <td width="14%" valign="top">
                     <div class="clear">
                     </div>
                     <div id="Div1">
                         <div class="zTreeDemoBackground">
                             <ul id="treeDemo" class="ztree" style="height: 310px;">
                             </ul>
                         </div>
                     </div>
                 </td>--%>
                <td width="100%" valign="top">
                	<div class="pop_search">
                            <div>
                                <span class="title">登录名:</span>
                                <input type="text" id="txt_User" maxlength="25" onkeyup="replaceSpecialSymbol(this)" class="inputText wf100" style="width: 100px;" />
                            </div>
                    
                            
                            <div >
                                <span class="title">真实姓名:</span>
                                <input type="text" id="txt_Name" maxlength="25" onkeyup="replaceSpecialSymbol(this)" class="inputText wf100" style="width: 100px;" />
                            </div>
             
                        <div><span class="title"><a href="#" class="button" onclick="select()" >查询</a></span></div>
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
                                <tbody></tbody>
                            </table>
                        </div>
                        <div id="Pagination" class="right3">
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
            	<td colspan="2">
            		<div class="selectDiv">
                        <span class="title">已选人员：</span>
                        <div class="selectOpera" id="RoleList">
                              
                        </div>
                    </div>
            	</td>
            </tr>
        </table>
    </div>
    <div class="popBottom">
    	<a href="#" class="button blueButton" onclick="Seve()">保存</a>
        <a href="#" class="button" onclick="javascript: parent.$('#openFrameDiv').dialog('close');">关闭</a>
    </div>
</div>
     </form>
</body>
</html>