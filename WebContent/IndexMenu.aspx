<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="IndexMenu.aspx.cs" Inherits="HH.Employee.WebUI.IndexMenu" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">


<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <link href="/Scripts/Iconfont/iconfont.css" rel="stylesheet" type="text/css" />
    <link href="Scripts/EasyUi/themes/default/style.css" rel="stylesheet" type="text/css" />
    <script src="Scripts/jquery-1.5.1.min.js" type="text/javascript"></script>
    <script src="Scripts/EasyUi/jquery.easyui.min.js" type="text/javascript"></script>
    <script src="Scripts/Common.js" type="text/javascript"></script>
    <script type="text/javascript">

        var parentId = GetQueryString("MenuID");
        var parentName = GetQueryString("MenuName");
        var userName = GetCookie("EmplyeeUserName");
        var appCode = GetCookie("AppCode");

        $(function () {
            $("#span_title").text(parentName);
            GetMenu(parentId, parentName);
            parent.$("#divLoading").hide();
        })

        //根据主菜单ID获得子菜单信息
        function GetMenu(parentId, parentName) {

            //var ajaxUrl = webapi + "/api/Menu/GetMenuByUser";
            //var ajaxData = { "userName": userName, "appCode": appCode, "parentCode": parentId };
            var ajaxUrl = "/UI/AjaxPage/Account.ashx";
            var ajaxData = "Action=GetMenuByUser&userName=" + userName + "&appCode=" + appCode + "&parentCode=0";
            var msg = AjaxManagers(ajaxData, ajaxUrl);

            if (msg != null && msg != "") {

                var data = (new Function("", "return " + msg))();
                //获得成功
                if (data.Code == "0") {
                    $("#divFrame").empty();
                    //删除顶级菜单数据
                    var menuList = $.grep(data.UserMenuList, function (item) {
                        return item.pId != '-1';
                    });
                    var html = "";
                    for (var i = 0; i < menuList.length; i++) {
                        if (menuList[i].pId == parentId) {
                            html += "<div class='quick-links menulist'>";
                            html += "    <div class='title' onclick='FoldOrOpen(this)'>";
                            html += "        <div>" + menuList[i].name + "</div>";
                            html += "        <div class='arrowEdit arrow_Up'></div>";
                            html += "    </div>";

                            //子项
                            var menu_children = $.grep(menuList, function (item) {
                                return item.pId == menuList[i].id;
                            });

                            var html_child = GetMenuChildren(menu_children);
                            html += html_child;

                            html += "</div>";
                        }
                    }
                    $("#divFrame").append(html);
                }
            }
        }

        function GetMenuChildren(menuList) {
            var html = "";
            if (menuList.length > 0) {
                html += "<div class='menu'>";
                html += "<ul>";
                for (var i = 0; i < menuList.length; i++) {
                    var icon = "&" + $.trim(menuList[i].iconSkin);
                    html += "<li>";
                    html += "<a href='javascript:void(0);' id='" + menuList[i].id + "' title='" + menuList[i].name + "' parenttitle='" + parentName + "' onclick=\"OpenWindow(this);return false;\" url='" + menuList[i].url + "'>";
                    html += "<span class='icon iconfont'>" + icon + "</span><p>" + menuList[i].name + "</p></a>";
                    html += "</li>";
                }
                html + "</ul>";
                html += "</div>";
            }
            return html;
        }

        //打开页面
        function OpenWindow(obj) {
            //获得标题
            var title = $.trim($(obj).attr("title"));
            //获得菜单ID
            var id = $.trim($(obj).attr("id"));
            //获得链接Url
            var href = $(obj).attr("url") + "?menuid=" + id;
            //父节点文本
            var parentTitle = $(obj).attr("parentTitle");
            parent.childAddTab(title, href, parentTitle);
        }

        //折叠展开菜单
        function FoldOrOpen(obj) {
            // window.onresize();
            //获得属性
            var id = $(obj).attr("tag");

            $("div[id=" + id + "]").toggle();
            //向上和向下的图标切换
            if ($("div[pic=" + id + "]").hasClass("arrow_Down")) {
                $("div[pic=" + id + "]").removeClass("arrow_Down").addClass("arrow_Up");
            }
            else if ($("div[pic=" + id + "]").hasClass("arrow_Up")) {
                $("div[pic=" + id + "]").removeClass("arrow_Up").addClass("arrow_Down");
            }
        }
    </script>
</head>
<body>
    <div id="loading">
    </div>
    <table id="tabdiv" style="min-width: 882px;" width="100%" border="0" height="90%" cellspacing="0" cellpadding="0">
        <tbody>
            <tr>
                <td valign="top" bgcolor="#e6e6e8" class="main">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tbody>
                            <tr>
                                <td valign="top">
                                    <div class="shadowBoxWhite twoMenu" id="divFrame" style="min-height: 450px;">

                                        <!--相当于一项-->
                                        <%--<div class="quick-links menulist">
                                            <div class="title" tag="3" onclick="FoldOrOpen(this)">
                                                <div id="span_title"></div>
                                                <div pic="3" class="arrowEdit arrow_Up"></div>
                                            </div>

                                        </div>--%>
                                    </div>

                                    <!-- chart -->
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>

</body>
</html>
