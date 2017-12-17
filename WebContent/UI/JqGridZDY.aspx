<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="JqGridZDY.aspx.cs" Inherits="HH.Employee.WebUI.UI.JqGridZDY" %>


<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=gb2312" />
    <title>列名自定义</title>
    <meta name="Keywords" content="列名自定义" />
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

    <script src="/Scripts/jquery-1.5.1.min.js"></script>
    <script src="/Scripts/jquery.min.js" type="text/javascript"></script>
    <script src="/Scripts/Common.js" type="text/javascript"></script>
    <style type="text/css">
        #one {
            width: 200px;
            height: 180px;
            float: left;
        }

        #two {
            width: 50px;
            height: 180px;
            float: left;
        }

        #three {
            width: 200px;
            height: 180px;
            float: left;
        }

        .btn {
            width: 50px;
            height: 30px;
            margin-top: 15px;
            margin-left: 30px;
            margin-right: 30px;
            cursor: pointer;
        }

        .auto-style1 {
            width: 519px;
        }
    </style>
    <script type="text/javascript">

        var menucode = "";
        var usercode = "";

        function LoadColumn() {
            //获取列表

            menucode = GetQueryString("menucode");
            var coljsonstr = decodeURI(decodeURI(GetQueryString("coljsonstr")));
            var colNames = new Array();

            //初始化右侧已选列表
            var arrayold = coljsonstr.replace(/\[/g, "").replace(/\]/g, "").replace(/\},{/g, "}@{").split('@');
            $.each(arrayold, function (i, n) {
                if (arrayold[i].indexOf('主键') < 0 && arrayold[i].indexOf('checkbox') < 0 && arrayold[i].indexOf('hidden:true') < 0) {

                    var reg = arrayold[i].match(/title:'(\S*)',name/)[1];
                    $("#select2").append("<option value=\"" + arrayold[i] + "\">" + reg + "</option>");
                    colNames[i] = reg;
                }
            });


            $.ajax({
                type: "POST",
                url: "/UI/AjaxPage/GridManager.ashx",
                data: "Action=GetColumn&menucode=" + menucode,
                async: false,
                beforeSend: function () {
                    $("#select1").empty();
                    $("#hid_ImportantKey").empty();//存放主键json串

                },
                success: function (result) {
                    if (result != "") {
                        //字符串转成Json对象
                        var data = (new Function("", "return " + result))();
                        //遍历数据行
                        $.each(data.LIST, function (i, n) {

                            //给初始值拼接

                            if (n.CN_S_JSON.indexOf('主键') > 0) {
                                $("#hid_ImportantKey").val(n.CN_S_JSON + ","); //防止多主键
                            } else {
                                //  $.each(colNames, function (i, n) {
                                if (colNames.toString().indexOf(n.CN_S_LOGIN) < 0) {
                                    $("#select1").append("<option value=\"" + n.CN_S_JSON + "\">" + n.CN_S_LOGIN + "</option>"); //CN_S_LOGIN是后台暂存title值
                                }
                                //  });
                            }
                        });
                    }
                }
            });
        }


        $(function () {

            LoadColumn();
            //移到右边
            $('#add').click(function () {
                //获取选中的选项，删除并追加给对方
                $('#select1 option:selected').appendTo('#select2');
            });
            //移到左边
            $('#remove').click(function () {
                $('#select2 option:selected').appendTo('#select1');
            });
            //全部移到右边
            $('#add_all').click(function () {
                //获取全部的选项,删除并追加给对方
                $('#select1 option').appendTo('#select2');
            });
            //全部移到左边
            $('#remove_all').click(function () {
                $('#select2 option').appendTo('#select1');
            });
            //双击选项
            $('#select1').dblclick(function () { //绑定双击事件
                //获取全部的选项,删除并追加给对方
                $("option:selected", this).appendTo('#select2'); //追加给对方
            });
            //双击选项
            $('#select2').dblclick(function () {
                $("option:selected", this).appendTo('#select1');
            });

            //上移
            $("#s2up").click(function () {
                var so = $("#select2 option:selected");
                if (so.get(0).index != 0) {
                    so.each(function () {
                        $(this).prev().before($(this));
                    });
                }
            });
            //下移
            $("#s2down").click(function () {
                var alloptions = $("#select2 option");
                var so = $("#select2 option:selected");

                if (so.get(so.length - 1).index != alloptions.length - 1) {
                    for (i = so.length - 1; i >= 0; i--) {
                        var item = $(so.get(i));
                        item.insertAfter(item.next());
                    }
                }
            });
            $("#btnClose").click(function () {
                parent.$('#openFrameDiv').dialog('close');
            });
        });

        //保存用户设置的列名
        function setSelect() {
            var creator = GetCookie("EmplyeeUserName");
            var sele = $("#select2 option").map(function () { return $(this).val(); }).get().join(",");
            if (sele != "") {
                var selectval = "";
                selectval = $("#hid_ImportantKey").val() + sele.replace(/hidden:true/g, "hidden:false");

                $.ajax({
                    type: "POST",
                    url: "/UI/AjaxPage/GridManager.ashx",
                    data: "Action=SetColumn&menucode=" + menucode + "&creator=" + creator + "&sele=" + selectval,
                    async: false,
                    beforeSend: function () {
                    },
                    success: function (reusult) {
                        if (reusult != '') {
                            parent.coljsonstr = reusult;//给主页面变量赋值
                            parent.ShowMsg("保存成功！");
                        } else {
                            parent.ShowMsg("保存失败");
                        }
                    }
                });
            } else {
                parent.ShowMsg("未选择任何列！");
            }
        }

    </script>
</head>
<body>
    <form id="form1" runat="server">
        <input type="hidden" id="hid_ImportantKey" />
        <br />
        <table width="550" align="center" border="0" cellpadding="0" cellspacing="0">
            <tr>
                <th>&nbsp;</th>
                <td></td>
            </tr>
            <tr>
                <th style="width: 30px;">&nbsp;</th>
                <td>
                    <div>
                        <div>
                            <select multiple="multiple" id="select1" style="width: 150px; height: 200px; float: left; padding: 4px;">
                            </select>
                        </div>
                        <div style="float: left">
                            <span id="add">
                                <input type="button" class="btn" value=">" />
                            </span>
                            <br />
                            <span id="add_all">
                                <input type="button" class="btn" value=">>" />
                            </span>
                            <br />
                            <span id="remove">
                                <input type="button" class="btn" value="<" />
                            </span>
                            <br />
                            <span id="remove_all">
                                <input type="button" class="btn" value="<<" />
                            </span>
                        </div>
                        <div>
                            <select multiple="multiple" id="select2" style="width: 150px; height: 200px; float: left; padding: 4px;">
                            </select>
                            <div style="float: left">
                                <span id="upset">
                                    <input type="button" name="s2up" id="s2up" class="btn" style="margin-top: 120px; margin-right: 0px;" value="上移" />
                                </span>
                                <br />
                                <span id="downset">
                                    <input type="button" name="s2down" id="s2down" class="btn" style="margin-top: 20px; margin-right: 0px;" value="下移" />
                                </span>

                            </div>
                        </div>

                    </div>
                </td>
            </tr>
        </table>
        <br />
        <br />
        <div style="width: 75%;">
            <center><input id="seleitem" class="button blueButton" style="margin-left: 100px;" type="button" value="保存结果" onclick="setSelect();"/>
                 &nbsp; &nbsp; &nbsp;<input type="button" id="btnClose" class="button redButton"  value="关闭本页" />  </center>
        </div>


    </form>
</body>
</html>
