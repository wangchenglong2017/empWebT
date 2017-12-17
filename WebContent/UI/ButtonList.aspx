<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ButtonList.aspx.cs" Inherits="HH.Employee.WebUI.UI.ButtonList" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
 "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>按钮管理</title>
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
    <script src="/Scripts/UI/pageComm.js"  type="text/javascript"></script>
     <script type="text/javascript">
         $(function () {
             //加载列表
             SetPage();
             Powder();
             GetAPP();
             $("#btnAddAll").hide();
             AjaxStop();
             //加载应用code
             $("#Text_AppCode,#aAppCode").click(function () {
                 $("#DAppCode p").unbind("click").bind("click", function () {
                     $("#Text_AppCode").val($(this).text());
                     $("#Text_AppCode").attr("title",$(this).attr("title"));
                     $("#DAppCode").hide();
                 });
                 $("#DAppCode").toggle(200);
             });
             //加载查询应用code
             $("#Text_AppCodeSelect,#aAppCodeSelect").click(function () {
                 $("#DAppCodeSelect p").unbind("click").bind("click", function () {
                     $("#Text_AppCodeSelect").val($(this).text());
                     $("#Text_AppCodeSelect").attr("title", $(this).attr("title"));
                     $("#DAppCodeSelect").hide();
                 });
                 $("#DAppCodeSelect").toggle(200);
             });

         });// End Of $(function(){
         function AjaxStop() {
             parent.$("#divLoading").hide();
         }
         //加载应用列表
         function GetAPP() {
             var html = "";
             var ajaxUrl = "/UI/AjaxPage/AppManager.ashx";
             var ajaxData = "Action=GetList&CN_S_APPNAME&CN_S_APPCODE";
             var msg = AjaxManagers(ajaxData, ajaxUrl);
             if (msg != "flase") {
                 //字符串转成Json对象
                 var data = (new Function("", "return " + msg))();
                 html += "<p>请选择</p>";
                 //遍历数据行
                 $.each(data.LIST, function (i, n) {
                     html += "<p title=" + n.CN_S_APPCODE + ">" + n.CN_S_APPNAME + "</p>";
                 });
             }
             $("#DAppCode").html(html);
             $("#DAppCodeSelect").html(html);
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

             var CN_S_CODE = $("#txt_ButtonCode").val();  //按钮编码
             var CN_S_NAME = $("#txt_ButtonName").val();//按钮名称
             var CN_S_APPCODE = $("#Text_AppCodeSelect").attr("title");

             var Html = "";
             var ajaxUrl = "/UI/AjaxPage/ButtonManager.ashx";
             var ajaxData = "Action=GetList&CN_S_CODE=" + CN_S_CODE + "&CN_S_NAME=" + CN_S_NAME +"&CN_S_APPCODE=" + CN_S_APPCODE + "&pageIndex=" + pageIndex + "&pageSize=10";
             var msg = AjaxManagers(ajaxData, ajaxUrl);
             if (msg != "flase") {
                 //字符串转成Json对象
                 var data = (new Function("", "return " + msg))();
                 //遍历数据行
                 $.each(data.LIST, function (i, n) {
                     Html += "<tr class=\"trout\" onclick=\"selectArow(this);\">";
                     //复选框
                     Html += "<td  align='center'> <input   value='" + n.CN_GUID + "' type='checkbox' name='chkid'  /></td>";
                     //按钮编号
                     Html += "<td align='center' colname='code'>" + n.CN_S_CODE + "</td>";
                     //按钮名称
                     Html += "<td align='left' colname='name'>" + n.CN_S_NAME + "</td>";
                     //描述
                     Html += "<td align='left' colname='note'>" + n.CN_S_NOTE + "</td>";
                     //创建人
                     //Html += "<td align='center'>" + n.CN_S_CREATOR_BY + "</td>";
                     //创建日期
                     //Html += "<td align='center'>" + JsonDateFormat(n.CN_T_CREATE) + "</td>";
                     //修改人
                     Html += "<td align='center'>" + n.CN_S_MODIFY_BY + "</td>";
                     //修改日期
                     Html += "<td align='center'>" + JsonDateTimeFormat(n.CN_T_MODIFY) + "</td>";
                     //所属应用
                     Html += "<td align='center' colname='AppCode' title='" + n.CN_S_APPCODE + "'>" + n.CN_S_APPNAME + "</td>";
                     //Html += "<td align='center'>" + n.CN_T_MODIFY + "</td>";
                     Html += "</tr>";

                 });
                 $("#hdnTotalRow").val(data.totalRows);
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
         //选择行操作
         function selectArow(e) {
             var code = $(e).find("td[colname='code']").text();
             var name = $(e).find("td[colname='name']").text();
             var note = $(e).find("td[colname='note']").text();
             var AppCode = $(e).find("td[colname='AppCode']").text();
             var AppCodetitle = $(e).find("td[colname='AppCode']").attr("title");
             $("#Text_AppCode").attr("title", AppCodetitle);
             $("#Text_AppCode").val(AppCode);
             $("#divAddTitle").text("按钮查看");
             $("#Text_Desc").val(note);
             $("#Text_Code").val(code);
             $("#Text_Name").val(name);
             $("#btnAddAll").hide();
             disp();
         }
          //禁用
         function disp()
         {
             $("#Text_Code").attr("disabled", "true");
             $("#Text_Desc").attr("disabled", "true");
             $("#Text_Name").attr("disabled", "true");
             $("#Text_AppCode").attr("disabled", "true");
             $("#Text_AppCode").width(176);
             $("#aAppCode").hide();

         }


         //保存
         function Seve() {
             var obj = {};
             obj.CN_S_CREATOR = GetCookie("EmplyeeUserName");
             obj.Flag = GetCookie("EmplyeeUserFlag");
             obj.CN_S_APPCODE = GetCookie("AppCode");
             obj.CN_S_NOTE = $("#Text_Desc").val();
             obj.CN_S_CODE = $("#Text_Code").val();
             if (obj.CN_S_CODE == "") {
                 parent.ShowMsg("按钮编码不能为空!");
                 return false;
             }
             obj.CN_S_NAME = $("#Text_Name").val();
             if (obj.CN_S_NAME == "" || obj.CN_S_NAME == undefined)
             {
                 parent.ShowMsg("按钮名称不能为空!");
                 return false;
             }
             obj.CN_S_APPCODES = $("#Text_AppCode").attr("title");
             if (obj.CN_S_APPCODES == "") {
                 parent.ShowMsg("所属应用不能为空!");
                 return false;
             }
              Examine();
              var ex = $("#hid_ex").val();
              if (ex == "1")
              {
                  parent.ShowMsg("重复的按钮编号!");
                  return false;
              }

             var Action = $("#hid_Action").val();
             if (Action == "Add")
             {                                                                 
                 var ajaxUrl = "/UI/AjaxPage/ButtonManager.ashx";
                 var ajaxData = "Action=" + Action + "&jsonString=" + escape(JSON.stringify(obj));
             }
             if (Action == "Update")
             {
                 obj.CN_GUID = $("#hid_guid").val();
                 var ajaxUrl = "/UI/AjaxPage/ButtonManager.ashx";
                 var ajaxData = "Action=" + Action + "&jsonString=" + escape(JSON.stringify(obj));
             }
             var msg = AjaxManagers(ajaxData, ajaxUrl);
             if (msg != "") {
                 var data = (new Function("", "return " + msg))();
                 if (data.Success == 'true' || data.Success == true) {
                     parent.ShowMsg("保存成功!");
                     Add();
                     SetPage();
                 }
                 else {
                     parent.ShowMsg("保存失败:" + data.Msg);
                 }
             }
         }

         function Examine() {
           
             var CN_S_CODE = $("#Text_Code").val();
             var CN_S_APPCODES = $("#Text_AppCode").attr("title");
             
             if ($("#hid_Action").val() != "Update") {
                 var ajaxUrl = "/UI/AjaxPage/ButtonManager.ashx";
                 var ajaxData = "Action=Examine&CN_S_CODE=" + CN_S_CODE + "&CN_S_APPCODES="+CN_S_APPCODES;
                 var msg = AjaxManagers(ajaxData, ajaxUrl);
                 if (msg == true || msg == "true") {
                     $("#hid_ex").val("1");
                 } else {
                     $("#hid_ex").val("0");
                 }
             }
         }

         //新增
         function Add()
         {
             $("#divAddTitle").text("按钮新增");
             $("#btnAddAll").show();
             $("#hid_Action").val("Add");
            $("#Text_Desc").val("");
            $("#Text_Code").val("");
            $("#Text_Name").val("");
            $("#Text_AppCode").val("");
            $("#Text_Code").removeAttr("disabled");
            $("#Text_Desc").removeAttr("disabled");
            $("#Text_Name").removeAttr("disabled");
            $("#Text_AppCode").attr("title", "");
            $("#Text_AppCode").removeAttr("disabled", "true");
            $("#Text_AppCode").width(156);
            $("#aAppCode").show();
         }

         //修改
         function Update() {
             $("#Text_Desc").removeAttr("disabled");
             $("#Text_Name").removeAttr("disabled");
             $("#hid_Action").val("Update");
             $("#Text_Code").attr("disabled", "true");
             $("#Text_AppCode").attr("disabled", "true");
             $("#aAppCode").hide();
             $("#Text_AppCode").width(176);
             var guid = "", code = "", name = "", note = "", AppCode = "",AppCodetitle="";
             $("#tbList>tbody>tr").each(function () {
                 if ($(this).find("input[name='chkid']").attr("checked") == true) {
                     guid += $(this).find("input[name='chkid']").val();
                     code = $(this).find("td[colname='code']").text();
                     name = $(this).find("td[colname='name']").text();
                     note = $(this).find("td[colname='note']").text();
                     AppCode = $(this).find("td[colname='AppCode']").text();
                     AppCodetitle = $(this).find("td[colname='AppCode']").attr("title");
                 }
             })
             if (guid.length > 50||guid.length==0) {
                 //alert("必须或只能选择一行数据");
                 parent.ShowMsg("必须选择一行数据!");
                 return;
             }
             else {
                 $("#divAddTitle").text("按钮修改");
                 $("#hid_Action").val("Update");
                 $("#btnAddAll").show();
                 $("#Text_Desc").val(note);
                 $("#Text_Code").val(code);
                 $("#Text_Name").val(name);
                 $("#Text_AppCode").val(AppCode);
                 $("#hid_guid").val(guid);
                 $("#Text_AppCode").attr("title", AppCodetitle);
             }
         }

         //删除
         function deleteBtn() {
             var values = "",Name="";
             $("#tbList>tbody>tr").each(function () {
                 if ($(this).find("input[name='chkid']").attr("checked") == true) {
                     //获得任务单号
                     values += $(this).find("input[name='chkid']").val() + ",";
                     Name += $(this).find("td[colname='name']").text() + ",";
                 }
             })
             if (values == "") {
                 parent.ShowMsg("最少选择一行！");
                 return false;
             }
             deletes(values,Name);
         }
         function deletes(values,Name) {
             var org = {};
             org.CN_S_CREATOR = GetCookie("EmplyeeUserName");
             org.Flag = GetCookie("EmplyeeUserFlag");
             org.CN_S_APPCODE = GetCookie("AppCode");
             org.Name = Name;
             org.values = values;
             parent.$.messager.confirm('系统提示', '确认删除吗？', function (r) {
                 if (r) {
                     var ajaxUrl = "/UI/AjaxPage/ButtonManager.ashx";
                     var ajaxData = "Action=Delete&jsonString=" + escape(JSON.stringify(org));
                     var msg = AjaxManagers(ajaxData, ajaxUrl);
                     if (msg != "") {
                         var data = (new Function("", "return " + msg))();
                         if (data.Success == 'true' || data.Success == true) {
                             parent.ShowMsg("删除成功！");
                             $("#selectall").removeAttr("checked");
                             Add();
                             SetPage();
                         }
                         else {
                             parent.ShowMsg("删除失败:" + data.Msg);
                         }
                     }
                 }
             });
         }


     </script>
</head>
<body>
    <form id="form1" runat="server">
         <asp:HiddenField ID="hdnPageIndex" runat="server" Value="0" />
         <asp:HiddenField ID="hdnPageSize" runat="server" />
         <asp:HiddenField ID="hdnTotalRow" runat="server"/>
         <input type="hidden" id="hid_Action"  value="Add"/>
        <input type="hidden" id="hid_guid"  />
          <input type="hidden" id="hid_optype"  />
        <input type="hidden" id="hid_ex"  />
        <div id="loading">
        </div>
        <table style="min-width: 882px; min-height: 500px" width="100%" border="0" cellspacing="0"
            cellpadding="0">
            <tr>
                <td valign="top" bgcolor="#e6e6e8" class="main">
                    <div class="searchShow">
                         <div>
                            <span class="title">按钮编号</span>
                            <input class="inputText" id="txt_ButtonCode" type="text"  onkeyup="replaceSpecialSymbol(this)" />
                        </div>
                         <div>
                            <span class="title">按钮名称</span>
                             <input class="inputText" id="txt_ButtonName" type="text" onkeyup="replaceSpecialSymbol(this)"/>
                        </div>
                        <div>
                            <span class="title">所属应用</span>
                              <div style="position:relative; z-index:2; padding:0;text-align:Left">
                                    <span class="active" style="width: 156px; margin: 0;">
                                       <input id="Text_AppCodeSelect" class="inputText" type="text" value="请选择" readonly="readonly" style="width: 126px;cursor:pointer;border:none;"/>
                                       <a id="aAppCodeSelect" href="javascript:void(0);" name="a_SelfDropDown" class="trigger" ></a>
                                   </span>
                                   <div  id="DAppCodeSelect"  class="dropList" style="width: 156px; display: none; z-index: 7;overflow-y: auto;max-height:150px;">
                                   </div>
                             </div>
                        </div>
                        <div>
                            <span class="title"><a class="button" id="btnSelect" onclick="SetPage()">查询</a></span>
                        </div>
                          
                    </div>
                    <div class="clear height10">
                    </div>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" height="400">
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
                                                            <th style="width: 15%; text-align: center">按钮编号
                                                            </th>
                                                            <th style="width: 15%; text-align: center">按钮名称
                                                            </th>
                                                            <th style="width: 27%; text-align: center">描述
                                                            </th>
                                                            <th style="width: 10%; text-align: center">修改人
                                                            </th> 
                                                             <th style="width: 20%; text-align: center">修改日期
                                                            </th>
                                                            <th style="width: 10%; text-align: center">所属应用
                                                            </th>                                         
                                                        </tr>
                                                    </thead>
                                                    <tbody></tbody>
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
                                <div  id="divAdd" class ="quickAdd shadowBoxYellow" style="width: 98%; min-height: 300px;">
                                    <div class="title" id="divAddTitle" style="width: 100%">
                                        按钮新增
                                    </div>
                                    <div class="text">
                                       
                                        <div id="divUserRoleList">
                                            <table width="100%" border="0" cellspacing="0" cellpadding="5">
                                                <tbody id="foucs">
                                                    <tr>
                                                        <td style="text-align: right"><span style="color: red">*</span>按钮编号：</td>
                                                         <td>
                                                            <input class="inputText" id="Text_Code" type="text" maxlength="16" onkeyup="value=value.replace(/[^\w\.\/]/ig,'')"   />
                                                        </td>
                                                    </tr>
                                                     <tr>
                                                        <td style="text-align: right"><span style="color: red">*</span>按钮名称：</td>
                                                         <td>
                                                            <input class="inputText" id="Text_Name" type="text" maxlength="16"  onkeyup="replaceSpecialSymbol(this)" />
                                                        </td>
                                                    </tr>
                                                       <tr>
                                                        <td style="text-align: right"><span style="color: red">*</span>所属应用：</td>
                                                        <td>
                                                           <div style="position:relative; z-index:2; padding:0;text-align:Left">
                                                              <span class="active" style="width: 186px; margin: 0;">
                                                                 <input id="Text_AppCode" class="inputText" type="text" value="请选择" readonly="readonly" style="width: 156px;cursor:pointer;border:none;"/>
                                                                 <a id="aAppCode" href="javascript:void(0);" name="a_SelfDropDown" class="trigger" ></a>
                                                             </span>
                                                             <div  id="DAppCode" name="div_SelfDropDown" class="dropList" style="width: 186px; display: none; z-index: 7;overflow-y: auto;max-height:100px;">
                                                             </div>
                                                           </div>
                                                        </td>
                                                    </tr>
                                                     <tr>
                                                        <td style="text-align: right">描述：</td>
                                                         <td>
                                                                 <textarea id="Text_Desc" style="width:185px;height:80px" maxlength="100" ></textarea>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td colspan="2" style="text-align: center">
                                                            <a class="button blueButton" id="btnAddAll" onclick="Seve()">保存</a>
                                                         
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
