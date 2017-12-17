<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="TestJQ.aspx.cs" Inherits="HH.Employee.WebUI.UI.TestJQgrid.TestJQ" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=gb2312" />
    <title>EasyUI DataGrid����</title>

    <!--ҳ�湫��JS-----TestJQ.js�൱�ڹ���JS--->
    <script src="/Scripts/Common.js" type="text/javascript"></script>
    <script src="/UI/TestJQgrid/TestJQ.js"></script>


    <!--�б�ҳjquery easyui datagrid��Ҫ����--->
    <link href="/Scripts/EasyUilist/themes/bootstrap/easyui.css" rel="stylesheet" />
    <script src="/Scripts/jquery.min.js"></script>
    <script src="/Scripts/EasyUilist/jquery.easyui.min.js"></script>
    <link href="/Scripts/EasyUilist/themes/icon.css" rel="stylesheet" />

    <script type="text/javascript">
        //ҳ���б�   ��ʼ�������趨  ***Ϊ������
        idField = "CN_ID";                        //����****
        listurl = "/UI/AjaxPage/GridManager.ashx";//ҳ���б����ݻ�ȡ��ַ***
        action = "getdatagridlist";               //һ�㴦���ļ�action****

        var menucode = "";
        window.onload = function () {
            menucode = "datagrid0007";              //ҳ������������˵�id
            // menucode = GetQueryString("menuid");
            pageInit();
        };

        function pageInit() {
            var creator = GetCookie("EmplyeeUserName");           //��ǰ��¼�û�
            var datastr = getParam_Query();                       //ҳ�����
            var ss = getPageSize();
            var width = ss.WinW - 15;                             //�б�߶�
            var height = ss.WinH - 250;                           //�б�߶�
            ListQueryDataGrid($('#magazineGrid'), datastr, creator, width, height);
        }

        //�����Զ���ҳ��
        function doCustom() {
            var creator = GetCookie("EmplyeeUserName");
            var gourl = encodeURI(encodeURI("DoZDY.aspx?menucode=" + menucode + "&coljsonstr=" + coljsonstr));
            dozdy(gourl);
        }

        //��ѯ��������
        function getParam_Query() {
            var username = $('#txt_username').val();        //���� Json��ʽ
            var sex = $('#txt_sex').val();
            return { CN_S_USERNAME: username, CN_SEX: sex };
        }

        function query() {
            $('#magazineGrid').datagrid("reload", getParam_Query());
            $('#magazineGrid').datagrid("clearSelections"); //�˴���Ҫ���ѡ��򣬷����������²��裺��ѯ-��ѡ-��ѯ-��ѡ����ȡ���ʱ�������һ�ι�ѡ���
        }

        //��ȡѡ����
        function getSelect() {
            //���������
            var ids = [];
            var rows = $('#magazineGrid').datagrid('getSelections');
            for (var i = 0; i < rows.length; i++) {
                ids.push(eval("rows[i]." + idField));
            }
            alert("��ѡ�е������ǣ�" + ids);

            ////���������
            //var ids = [];
            //var field = ["CN_ID", "CN_GUID"];//���������
            //var rows = $('#magazineGrid').datagrid('getSelections');
            //for (var i = 0; i < rows.length; i++) {
            //    ids.push(eval("rows[i]." + field[0]) + "$" + eval("rows[i]." + field[1]));//��ƴ�ӣ���̨������ȡ
            //}
            //alert("��ѡ�е������ǣ�" + ids);
        }


        function GetTest(row) {
            return "<a href=\"#\" class=\"alink\" onclick=\"View2('" + row + "');return false;\"><span style=\"color:#15428B\">ɾ��</span></a>";
        }
        function View2(row) {
            alert("����ɾ�������������ǣ�" + row);
        }
    </script>


</head>
<body>
    <form id="form1" runat="server">
        <br />
        �û���
        <input type="text" id="txt_username" onkeyup="replaceSpecialSymbol(this)" style="width: 100px;" />
        �Ա�
        <input type="text" id="txt_sex" onkeyup="replaceSpecialSymbol(this)" style="width: 100px;" />
        &nbsp;<input type="button" value="��    ѯ" id="btn_query" onclick="query();" /><br />
        <br />
        <input type="button" value="�鿴��ϸ" id="btn_sel" onclick="getSelect();" />
        <input type="button" value="�Զ�����" id="Button1" onclick="doCustom();" /><br />
        <br />

        <div id="magazineGrid">
        </div>
    </form>
</body>
</html>
