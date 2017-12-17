<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="LogList.aspx.cs" Inherits="HH.Employee.WebUI.UI.LogList" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
 "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>日志管理</title>
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
            //绑定日期
            $('#txtStartDate').calendar({ maxDate: '%y-%M-%d' });
            //绑定日期
            $('#txtEndDate').calendar({ minDate: '#txtStartDate', maxDate: '%y-%M-%d' });
            $("#Text_type,#atype").click(function () {
                $("#Dtype p").unbind("click").bind("click", function () {
                    $("#Text_type").val($(this).text());
                    $("#Text_type").attr("title", $(this).attr("title"));
                    $("#Dtype").hide();
                });
                $("#Dtype").toggle(200);
            });
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

            var txtStartDate = $("#txtStartDate").val();
            var txtEndDate = $("#txtEndDate").val();
            var type = $("#Text_type").val();
            var Html = "";
            var ajaxUrl = "/UI/AjaxPage/Log.ashx";
            var ajaxData = "Action=GetList&txtStartDate=" + txtStartDate + "&txtEndDate=" + txtEndDate + "&type=" + type + "&pageIndex=" + pageIndex + "&pageSize=15";
            var msg = AjaxManagers(ajaxData, ajaxUrl);
            if (msg != "") {
                //字符串转成Json对象
                msg = eval('[' + msg + ']');
                var data = (new Function("", "return " + msg))();
                //alert(data);
               // alert(data);
               
                //alert(data);
               // alert(data[0].LIST);
                //遍历数据行
                $.each(data.LIST, function (i, n) {
                    Html += "<tr class=\"trout\" onclick=\"selectArow(this);\">";
                    //复选框
                    Html += "<td  align='center'> <input   value='" + n.CN_S_LOGLD + "' type='checkbox' name='chkid'  /></td>";
                    //日志描述
                    Html += "<td align='center'>" + n.CN_S_LOGDESC + "</td>";
                    //ip
                    Html += "<td align='center'>" + n.CN_S_LOGTYPE+ "</td>";
                    //日志类型
                    Html += "<td align='center'>" + n.CN_S_CLIENTIP + "</td>";
                    //操作人
                    Html += "<td align='center'>" + n.CN_S_MODIFY_BY + "</td>";
                    //操作时间
                    //Html += "<td align='center'>" + JsonDateFormat(n.CN_T_MODIFY) + "</td>";
                    Html += "<td align='center'>" + datatime(n.CN_T_MODIFY) + "</td>";    // timeFormatter
                    Html += "</tr>";

                });
                //alert(data[0].totalCount);
                $("#hdnTotalRow").val(data.totalCount);
            }
            if (Html != "") {
                $("#tbList>tbody").html(Html);
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
            });
        }

        //function timeFormatter(value) {

        //    var da = new Date(parseInt(value.replace("/Date(", "").replace(")/", "").split("+")[0]));

        //    return da.getFullYear() + "-" + (da.getMonth() + 1) + "-" + da.getDate() + " " + da.getHours() + ":" + da.getMinutes() + ":" + da.getSeconds();
        //}

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
        function datatime(data)
        {
           return  data.replace("T", " ");

        }

            function deletes(values) {
                parent.$.messager.confirm('系统提示', '确认删除吗？', function (r) {
                    if (r) {
                        var ajaxUrl = "/UI/AjaxPage/Log.ashx";
                        var ajaxData = "Action=Delect&values=" + values;
                        var msgs = AjaxManagers(ajaxData, ajaxUrl);

                        parent.ShowMsg("删除成功！");
                        $("#selectall").removeAttr("checked");
                        SetPage();
                    }
                });
            }

            //清空日期
            function clearDate() {
                $("#txtStartDate").val("");
                $("#txtEndDate").val("");
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
                        <%--<div>
                            <span class="title">日志描述:</span>
                            <div>
                                <input type="text" id="txt_desc" onkeyup="replaceSpecialSymbol(this)" class="inputText"/>
                            </div>   
                        </div>
              
                        <div>
                            <span class="title">日志类型:</span>
                            <div>
                                <input type="text" id="txt_type" onkeyup="replaceSpecialSymbol(this)" class="inputText"/>
                            </div>
                        </div>--%>
                          <div>
                            <span class="title">日志类型</span>
                              <div style="position:relative; z-index:2; padding:0;text-align:Left">
                                    <span class="active" style="width: 156px; margin: 0;">
                                       <input id="Text_type" class="inputText" type="text" value="" readonly="readonly" style="width: 126px;cursor:pointer;border:none;"/>
                                       <a id="atype" href="javascript:void(0);" name="a_SelfDropDown" class="trigger" ></a>
                                   </span>
                                   <div  id="Dtype"  class="dropList" style="width: 156px; display: none; z-index: 7;overflow-y: auto;max-height:150px;">
                                       <p></p>
                                       <p>新增</p>
                                       <p>修改</p>
                                       <p>删除</p>
                                       <p>登录</p>
                                       <p>退出</p>
                                   </div>
                             </div>
                        </div>
                          <div >
                          <span class="title">日志日期</span>
                          <input id="txtStartDate" class="inputText wf100 mdate" style="width:120px;" readonly="readonly" type="text" value="" name="txtStartDate" />
                          <span>&nbsp;&nbsp;&nbsp;&nbsp_&nbsp;&nbsp;&nbsp;&nbsp;</span>
                          <input id="txtEndDate" class="inputText wf100 mdate" readonly="readonly" style="width:120px;"  type="text" value=""
                              name="txtEndDate" />
                          <span onclick="clearDate()" id="Span1" style="padding-top:8px;padding-left:6px;cursor: pointer;"><a href="#">清空</a></span>
                      </div>
                        <div>
                            <span class="title" style="padding-right:0px;"><a class="button" id="" power="Select" onclick="SetPage()">查询</a></span>
                             <a class="button redButton" id="btnDelete" onclick="deleteBtn()"  power="Delete">删除</a>
                        </div>
                    </div>
                    <div class="clear height10">
                    </div>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" height="400" style="min-width:1185px">
                        <tr>
                            <td valign="top">
                                <div class="clear">
                                </div>
                                <div id="dvOrders">
                                    <div class="shadowBoxWhite" style="width: 98%; padding: 10px 1%;">
                                        <div class="tableDiv">
                                            <div id="DivProductList">
                                                <table id="tbList" width="100%" border="0" cellspacing="1" cellpadding="5">
                                                    <thead>
                                                        <tr class='caption'>
                                                            <th style="width: 3%; text-align: center">
                                                                <input type="checkbox" id="selectall" name="selectall" />
                                                            </th>
                                                            <th style="width: 20%; text-align: center">日志描述
                                                            </th>
                                                            <th style="width: 15%; text-align: center">日志类型
                                                            </th>
                                                            <th style="width: 20%; text-align: center">客户IP
                                                            </th>
                                                            <th style="width: 20%; text-align: center">操作人
                                                            </th>
                                                             <th style="width: 20%; text-align: center">操作时间
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
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </form>
</body>
</html>
