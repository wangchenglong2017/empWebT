$(function () {
    $('#cg').combogrid({
        panelWidth: 400,
        idField: 'PersonId',        //ID字段  
        textField: 'PersonName',    //显示的字段  
        url: "/test/ComboGridHandler.ashx?action=search",
        fitColumns: true,
        striped: true,
        editable: true,
        pagination: true,           //是否分页
        rownumbers: true,           //序号
        collapsible: false,         //是否可折叠的
        fit: true,                  //自动大小
        method: 'post',
        columns: [[
                    { field: 'PersonId', title: '用户编号', width: 80, hidden: true },
                    { field: 'PersonName', title: '用户名称', width: 150 },
                    { field: 'Gender', title: '用户性别', width: 150 }
                ]],
        keyHandler: {
            up: function () {               //【向上键】押下处理
                //取得选中行
                var selected = $('#cg').combogrid('grid').datagrid('getSelected');
                if (selected) {
                    //取得选中行的rowIndex
                    var index = $('#cg').combogrid('grid').datagrid('getRowIndex', selected);
                    //向上移动到第一行为止
                    if (index > 0) {
                        $('#cg').combogrid('grid').datagrid('selectRow', index - 1);
                    }
                } else {
                    var rows = $('#cg').combogrid('grid').datagrid('getRows');
                    $('#cg').combogrid('grid').datagrid('selectRow', rows.length - 1);
                }
            },
            down: function () {             //【向下键】押下处理
                //取得选中行
                var selected = $('#cg').combogrid('grid').datagrid('getSelected');
                if (selected) {
                    //取得选中行的rowIndex
                    var index = $('#cg').combogrid('grid').datagrid('getRowIndex', selected);
                    //向下移动到当页最后一行为止
                    if (index < $('#cg').combogrid('grid').datagrid('getData').rows.length - 1) {
                        $('#cg').combogrid('grid').datagrid('selectRow', index + 1);
                    }
                } else {
                    $('#cg').combogrid('grid').datagrid('selectRow', 0);
                }
            },
            enter: function () {             //【回车键】押下处理
                //设置【性别】文本框的内容为选中行的的性别字段内容
                $('#txtGender').val($('#cg').combogrid('grid').datagrid('getSelected').Gender);
                //选中后让下拉表格消失
                $('#cg').combogrid('hidePanel');
            },
            query: function (keyword) {     //【动态搜索】处理
                //设置查询参数
                var queryParams = $('#cg').combogrid("grid").datagrid('options').queryParams;
                queryParams.keyword = keyword;
                $('#cg').combogrid("grid").datagrid('options').queryParams = queryParams;
                //重新加载
                $('#cg').combogrid("grid").datagrid("reload");

                $('#cg').combogrid("setValue", keyword);
                //将查询条件存入隐藏域
                $('#hdKeyword').val(keyword);
            }
        },
        onSelect: function () {              //选中处理
            $('#txtGender').val($('#cg').combogrid('grid').datagrid('getSelected').Gender);
        }
    });

    //取得分页组件对象
    var pager = $('#cg').combogrid('grid').datagrid('getPager'); 

    if (pager) {
        $(pager).pagination({
            pageSize: 10,               //每页显示的记录条数，默认为10
            pageList: [10, 5, 3],       //可以设置每页记录条数的列表
            beforePageText: '第',       //页数文本框前显示的汉字
            afterPageText: '页    共 {pages} 页',
            displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录',
            //选择页的处理
            onSelectPage: function (pageNumber, pageSize) {
                //按分页的设置取数据
                getData(pageNumber, pageSize);
                //设置表格的pageSize属性，表格变化时按分页组件设置的pageSize显示数据
                $('#cg').combogrid("grid").datagrid('options').pageSize = pageSize;
                //将隐藏域中存放的查询条件显示在combogrid的文本框中
                $('#cg').combogrid("setValue", $('#hdKeyword').val());
                $('#txtGender').val('');
            },
            //改变页显示条数的处理
            //（处理后还是走onSelectPage事件，所以设置也写到onSelectPage事件中了）
            onChangePageSize: function () { },
            //点击刷新的处理
            onRefresh: function (pageNumber, pageSize) {
                //按分页的设置取数据
                getData(pageNumber, pageSize);
                //将隐藏域中存放的查询条件显示在combogrid的文本框中
                $('#cg').combogrid("setValue", $('#hdKeyword').val());
                $('#txtGender').val('');
            }
        });
    }

    var getData = function (page, rows) {
        $.ajax({
            type: "POST",
            url: "/test/ComboGridHandler.ashx?action=search",
            data: "page=" + page + "&rows=" + rows + "&keyword=" + $('#hdKeyword').val(),
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert(textStatus);
                $.messager.progress('close');
            },
            success: function (data) {
                $('#cg').combogrid('grid').datagrid('loadData', data);
            }
        });
    };
});