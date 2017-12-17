<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="TestJQ.aspx.cs" Inherits="HH.Employee.WebUI.UI.TestJQgrid.TestJQ" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=gb2312" />
    <title>EasyUI DataGrid测试</title>

    <!--页面公共JS-----TestJQ.js相当于公有JS--->
    <script src="/Scripts/Common.js" type="text/javascript"></script>
    <script src="/UI/TestJQgrid/TestJQ.js"></script>


    <!--列表页jquery easyui datagrid必要引用--->
    <link href="/Scripts/EasyUilist/themes/bootstrap/easyui.css" rel="stylesheet" />
    <script src="/Scripts/jquery.min.js"></script>
    <script src="/Scripts/EasyUilist/jquery.easyui.min.js"></script>
    <link href="/Scripts/EasyUilist/themes/icon.css" rel="stylesheet" />

    <script type="text/javascript">
        //页面列表   初始化参数设定  ***为必设项
        idField = "CN_ID";                        //主键****
        listurl = "/UI/AjaxPage/GridManager.ashx";//页面列表数据获取地址***
        action = "getdatagridlist";               //一般处理文件action****

        var menucode = "";
        window.onload = function () {
            menucode = "datagrid0007";              //页面基本参数：菜单id
            // menucode = GetQueryString("menuid");
            pageInit();
        };

        function pageInit() {
            var creator = GetCookie("EmplyeeUserName");           //当前登录用户
            var datastr = getParam_Query();                       //页面参数
            var ss = getPageSize();
            var width = ss.WinW - 15;                             //列表高度
            var height = ss.WinH - 250;                           //列表高度
            ListQueryDataGrid($('#magazineGrid'), datastr, creator, width, height);
        }

        //弹出自定义页面
        function doCustom() {
            var creator = GetCookie("EmplyeeUserName");
            var gourl = encodeURI(encodeURI("DoZDY.aspx?menucode=" + menucode + "&coljsonstr=" + coljsonstr));
            dozdy(gourl);
        }

        //查询条件处理
        function getParam_Query() {
            var username = $('#txt_username').val();        //参数 Json格式
            var sex = $('#txt_sex').val();
            return { CN_S_USERNAME: username, CN_SEX: sex };
        }

        function query() {
            $('#magazineGrid').datagrid("reload", getParam_Query());
            $('#magazineGrid').datagrid("clearSelections"); //此处需要清除选择框，否则在做如下步骤：查询-勾选-查询-勾选，获取结果时会带出第一次勾选结果
        }

        //获取选中行
        function getSelect() {
            //单主键情况
            var ids = [];
            var rows = $('#magazineGrid').datagrid('getSelections');
            for (var i = 0; i < rows.length; i++) {
                ids.push(eval("rows[i]." + idField));
            }
            alert("你选中的数据是：" + ids);

            ////多主键情况
            //var ids = [];
            //var field = ["CN_ID", "CN_GUID"];//多主键情况
            //var rows = $('#magazineGrid').datagrid('getSelections');
            //for (var i = 0; i < rows.length; i++) {
            //    ids.push(eval("rows[i]." + field[0]) + "$" + eval("rows[i]." + field[1]));//先拼接，后台分离提取
            //}
            //alert("你选中的数据是：" + ids);
        }


        function GetTest(row) {
            return "<a href=\"#\" class=\"alink\" onclick=\"View2('" + row + "');return false;\"><span style=\"color:#15428B\">删除</span></a>";
        }
        function View2(row) {
            alert("你想删除的数据主键是：" + row);
        }
    </script>


</head>
<body>
    <form id="form1" runat="server">
        <br />
        用户名
        <input type="text" id="txt_username" onkeyup="replaceSpecialSymbol(this)" style="width: 100px;" />
        性别
        <input type="text" id="txt_sex" onkeyup="replaceSpecialSymbol(this)" style="width: 100px;" />
        &nbsp;<input type="button" value="查    询" id="btn_query" onclick="query();" /><br />
        <br />
        <input type="button" value="查看详细" id="btn_sel" onclick="getSelect();" />
        <input type="button" value="自定义列" id="Button1" onclick="doCustom();" /><br />
        <br />

        <div id="magazineGrid">
        </div>
    </form>
</body>
</html>
