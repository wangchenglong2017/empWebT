<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="DataGrid.aspx.cs" Inherits="HH.Employee.WebUI.UI.TestJQgrid.DataGrid" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>jquery easyui datagrid</title>

       <!--jquery easyui datagrid必要引用--->
    <link href="/Scripts/EasyUilist/themes/default/easyui.css" rel="stylesheet" />
    <script src="/Scripts/EasyUilist/jquery.min.js"></script>
    <script src="/Scripts/EasyUilist/jquery.easyui.min.js"></script>
    <link href="/Scripts/EasyUilist/themes/icon.css" rel="stylesheet" />
    
      <script type="text/javascript">

          var jq_list_handleurl = "/Handler/CustomColumnHandler.ashx";

          window.onload = function () {
              ListQueryDataGrid();
          };


          function ListQueryDataGrid() {

              $('#magazineGrid').datagrid({
                  height: 340,
                  url: jq_list_handleurl + "?action=getlistgrid",
                  method: 'POST',
                  queryParams: { 'id': 1 },
                  idField: 'CN_S_APPCODE',
                  striped: true,
                  fitColumns: true,
                  singleSelect: false,
                  rownumbers: true,
                  pagination: true,
                  nowrap: false,
                  pageSize: 10,
                  pageList: [10, 20, 50, 100, 150, 200],
                  showFooter: true,
                  columns: [[
                      { field: 'ck', checkbox: true },
                      { field: 'CN_S_APPCODE', title: '应用编码', width: 180, align: 'center' },
                      { field: 'CN_S_APPNAME', title: '应用名称', width: 150, align: 'center' },
                      { field: 'CN_S_DESC', title: '描述', width: 100, align: 'center' },
                      { field: 'CN_S_MODIFY', title: '修改人', width: 100, align: 'center' },
                      { field: 'CN_S_MODIFY_BY', title: '修改人姓名', width: 100, align: 'center' },
                      { field: 'CN_T_MODIFY', title: '修改日期', width: 100, align: 'center' },
                      { field: 'CN_S_CREATOR', title: '创建人', width: 100, align: 'center' },
                      { field: 'CN_S_CREATOR_BY', title: '创建人姓名', width: 80, align: 'center' },
                      { field: 'CN_T_CREATE', title: '创建时间', width: 80, align: 'center' }
                  ]],
                  onBeforeLoad: function (param) {
                  },
                  onLoadSuccess:function(){
                      var pager = $('#magazineGrid').datagrid('getPager');
                      pager.pagination({
                          beforePageText: '第',//页数文本框前显示的汉字
                          afterPageText: '页    共 {pages} 页',
                          displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录',
                          buttons:[{
                              iconCls:'icon-search',
                              handler:function(){alert('search');}
                          },{
                              iconCls:'icon-add',
                              handler:function(){alert('add');}
                          },{
                              iconCls:'icon-edit',
                              handler:function(){alert('edit');}
                          }]
                      });
                      var icon2text = ["首页","上一页","下一页","尾页"];
                      $(".pagination").find("td:eq(2),td:eq(3),td:eq(9),td:eq(10)").each(function(i){
                          $(this).find(".l-btn-text").html(icon2text[i]);
                      });
                  },
                  onLoadError: function () {

                  },
                  onClickCell: function (rowIndex, field, value) {

                  }
              });

          }
      </script>
</head>
<body>
    <form id="form1" runat="server">
    <div id="magazineGrid">
        </div>
    </form>
</body>
</html>
