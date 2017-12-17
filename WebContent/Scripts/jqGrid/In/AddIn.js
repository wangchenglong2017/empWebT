//新增空行
function addRow(row, data) {
    //新增空行 
    addRowSetValue(row, data);
}

//选择物料增加行
function SelectItemAddRow(row, data) {
    //设置json
    addRowSetValue(row, data);
}

//清空行
function clearRow() {
    $("#tblItemRows>tbody").html("");
}
function bindingClick(row) {
    $("#ddlUnit" + row + " p").bind("click", function () {
        $("#txtUnit" + row).val($(this).text());
        $("#ddlUnit" + row).hide();
    });
    $("#ddlUnit" + row).toggle(200);
}


//注意input的id和tr的id要一样,新增行
function addRowSetValue(row, data) {

    //要添加的行的id  
    var addRowID = parseInt(row) + 1;
    //行字符串
    var str = "";

    //新增与删除行
    str += '<tr id="' + addRowID + '" class =\"trout\" ><td ><a href="javascript:void(0);" class="addLite" onclick="addRow(' + addRowID + ')"></a><a href="javascript:void(0);" class="delLite" onclick="deltr(' + addRowID + ')"></a></td>';
    //行号
    str += '<td >' + addRowID + '</td>';
    //托盘编号
    str += '<td colname="itemTraycode">';
    str += '<div class="write" colname="traycode">';
    str += '<input type="text" id="txtTraycode' + addRowID + '" class="peijianNum" onkeyup="replaceSpecialSymbol(this)"/>';
    str += '<a name="' + addRowID + '" class="selectitem" >...</a></div>';
    str += '</td>';
    //拓展容器编号
    str += '<td  colname="itemTrayext"></td>';
    //物料编码
    str += '<td colname="itemItemcode">';
    str += '<div class="write">';
    str += '<input type="text" id="txtItemcode' + addRowID + '" class="peijianNum" onkeyup="replaceSpecialSymbol(this)"/>';
    str += '<a name="' + addRowID + '" class="selectitem" >...</a></div>';
    str += '</td>';
    //物料名称
    str += '<td  colname="itemItemname"></td>';
    //序列号
    str += '<td  colname="itemSerialno" >';
    str += '<input class="inputHover" id="txtSerialno' + addRowID + '" type=\"text\" onkeyup="replaceSpecialSymbol(this)"/></td>';
    //批次号
    str += '<td  colname="itemLotcode" >';
    str += '<input class="inputHover" id="txtLotcode' + addRowID + '" type=\"text\" onkeyup="replaceSpecialSymbol(this)"/></td>';
    //生产单号
    str += '<td  colname="itemBillno" >';
    str += '<input class="inputHover" id="txtBillno' + addRowID + '" type=\"text\" onkeyup="replaceSpecialSymbol(this)"/></td>';
    //物料状态
    str += '<td align="center" colname="itemStatus" >'
    str += '<div style=" position:relative;"><span class="active" style="margin:0;position:relative;width:98%;height:24px;">'
    str += '<input id="txtStatus' + addRowID + '" class="inputText" type="text" readonly="readonly" style="width:70%;padding:5px;"/>'
    //供应商编号
    str += '<td  colname="itemVendorcode" >';
    str += '<input class="inputHover" id="txtVendorcode' + addRowID + '" type=\"text\" onkeyup="replaceSpecialSymbol(this)"/></td>';
    //出厂时间
    str += '<td colname="itemDate">';
    str += '<input id="txtDate' + addRowID + '" readonly="readonly" class="inputText wf80 mdate" style="width:90%;padding:5px;" '
    str += ' type="text" name="' + addRowID + '" /></td>';
    //数量
    str += '<td  colname="itemQuantity" >';
    str += '<input class="inputHover" id="txtQuantity' + addRowID + '" type=\"text\" onkeyup="replaceSpecialSymbol(this)"/></td>';
    //最近检验时间
    str += '<td colname="itemCheckdate">';
    str += '<input id="txtCheckdate' + addRowID + '" readonly="readonly" class="inputText wf80 mdate" style="width:90%;padding:5px;" '
    str += ' type="text" name="' + addRowID + '" /></td>';
    //资产颜色
    str += '<td  colname="itemColor" >';
    str += '<input class="inputHover" id="txtColor' + addRowID + '" type=\"text\" onkeyup="replaceSpecialSymbol(this)"/></td>';
    //电流档
    str += '<td  colname="itemElectricgare" >';
    str += '<input class="inputHover" id="txtElectricgare' + addRowID + '" type=\"text\" onkeyup="replaceSpecialSymbol(this)"/></td>';
    //功率档
    str += '<td  colname="itemPowergare" >';
    str += '<input class="inputHover" id="txtPowergare' + addRowID + '" type=\"text\" onkeyup="replaceSpecialSymbol(this)"/></td>';
    //时间功率
    str += '<td  colname="itemPower" >';
    str += '<input class="inputHover" id="txtPower' + addRowID + '" type=\"text\" onkeyup="replaceSpecialSymbol(this)"/></td>';
    //毛重
    str += '<td  colname="itemQrossweight" >';
    str += '<input class="inputHover" id="txtQrossweight' + addRowID + '" type=\"text\" onkeyup="replaceSpecialSymbol(this)"/></td>';
    //净重
    str += '<td  colname="itemNetweight" >';
    str += '<input class="inputHover" id="txtNetweight' + addRowID + '" type=\"text\" onkeyup="replaceSpecialSymbol(this)"/></td>';
    //描述
    str += '<td  colname="itemDesc" >';
    str += '<input class="inputHover" id="txtDesc' + addRowID + '" type=\"text\" onkeyup="replaceSpecialSymbol(this)"/></td>';

    if (data != null) {
        UpdateRowSetValue(addRowID, data);
    }
    else {
        if ($("#tblItemRows>tbody>tr").length == 0) {
            $("#tblItemRows>tbody").html(str);
        } else {
            var currentRowObj = $('#' + row + '');
            currentRowObj.after(str);
        }
    }
    showLineNum();
}

//配件列表_删除行
function deltr(id) {
    //获得操作类型（修改,复制,新增)
    //获得订单类型
    var Ordertype = GetQueryString("type");
    //得到总行数
    var tblrowcount = $("#tblItemRows>tbody>tr").length;
    //获得该行标记
    var flag = $("#" + id).attr("flag");
    //至少保留一行
    if (tblrowcount != 1) {
        var _itemCode = $("#txtCode" + id).val();
        if ("" == _itemCode) {
            $('#' + id).remove();
            showLineNum();
            return;
        }

        $.messager.confirm('系统提示', '确认删除吗？', function (r) {
            if (r) {
                if (Ordertype != "edit" || flag != "0") {//新增或者复制则直接删除表格行还有一种是修改时新添加了行则数据库中暂无该行则无需删除数据库信息
                    $('#' + id).remove();
                    showLineNum();
                }
                else {//修改的时候若删除行则必须同时删除数据库中该行信息
                    //获得订单号
                    var OrderCode = $("#txt_cn_s_Ordercode").val();
                    //获得物料行金额
                    //var RowTotalPrice = $("#" + id).find("td[colname=TotalPrice]").text();
                    //获得该物料行状态
                    var State = $("#" + id).find("td[colname=state]").text();
                    //获取初始化JSON列表 开始
                    $.ajax({
                        type: "POST",
                        url: "/AdminUI/AjaxPages/AddOrder.ashx",
                        data: "Action=DELETEROW&OrderCode=" + OrderCode + "&State=" + State + "&Row=" + id,
                        async: false,
                        beforeSend: function () {
                        },
                        success: function (result) {
                            if (result == "True") {
                                parent.ShowMsg("删除成功!");
                                $('#' + id).remove();
                                showLineNum();
                            }
                            else {
                                parent.ShowMsg("删除失败!");
                                return false;
                            }

                        }
                    });
                }// else 结束
                //showLineNum();
            }
        });
    }
    else {
        parent.ShowMsg('配件列表至少保留一行！');
    }
}

//重新设置行号
function showLineNum() {
    var addRowID;
    var htmlstr = "";
    $('#tblItemRows>tbody>tr').each(function (i) {
        //当前行号
        addRowID = i + 1;
        //新增 删除
        htmlstr = '<a href="javascript:void(0);" class="addLite" onclick="addRow(' + addRowID + ')"></a><a href="javascript:void(0);" class="delLite" onclick="deltr(' + addRowID + ')"></a>';
        //设置行ID
        $(this).attr("id", addRowID);
        //设置序号的值
        $(this).find('td').eq(1).html(addRowID);
        //设置新增与删除
        $(this).find('td').eq(0).html(htmlstr);

        $(this).find('td').eq(2).find("input:.peijianNum").attr("id", "txtTraycode" + addRowID);
        $(this).find('td').eq(2).find("input:.peijianNum").unbind();
        $(this).find('td').eq(2).find("a:.selectitem").attr("name", addRowID); //从新负值a:name
        $(this).find('td').eq(2).find("a:.selectitem").unbind("click").click(function () { //重新绑定事件
            //SearchOperation('1', $(this).attr("name"), escape('保养'));
        });

        $(this).find('td').eq(5).find("a").attr("name", addRowID);
        $(this).find('td').eq(5).find("div[id^='ddlUnit']").find("p").unbind("click")
        $(this).find('td').eq(5).find("a").unbind("click").bind("click", function () {
            bindingClick($(this).attr("name"));
        });

        $(this).find('td').eq(6).find('input').calendar({
            format: 'yyyy-MM-dd HH:mm:ss'
        });

        //绑定自动完成
        BindingAutoComplete3(addRowID);
        //单元格单击 
        //BingCellClick(addRowID);

    });
}

function AutoOper(index, data) {
    if (index != null)
        SelItem(index, 0, data);
}

//绑定自动完成
function BindingAutoComplete3(row) {
    $("#txtTraycode" + row).autocomplete3("/AdminUI/AjaxPages/Equipment/OperationManage.ashx", {
        minChars: 0,
        max: 10,
        width: 512,
        autoFill: false,
        scroll: false,
        scrollHeight: 500,
        dataType: "json", //json类型
        matchContains: true,
        matchCase: true,
        rownum: row,
        extraParams: { param: function () { return $("#txtTraycode" + row).val(); } },
        //需要把data转换成json数据格式
        parse: function (data) {
            if (data != "false") {
                //字符串转成Json对象 
                // var data = (new Function("", "return " + data))(); 
                return $.map(eval(data), function (row) {
                    return {
                        data: row,
                        value: row.CN_S_CODE,
                        result: row.CN_S_CODE
                        // result: "<table width='512px'><tr><td align='left'>" + row.VALUE + "</td><td align='left'>" + row.TEXT + "</td><td align='left'>" + row.ParamVauleB + "</td><td align='right'>" + row.ParamVaule + "</td><td align='center'><font style='color: #009933; font-family: 黑体; font-style: italic'>" + row.ParamVauleA + "</font></td></tr></table>"
                    }
                });
            }
        },
        formatItem: function (data, i, total) {
            //规格型号
            //var _itemModel = data.ParamVauleB == null ? "&nbsp;" : data.ParamVauleB;
            return "<table id='tbqqq' width='300px'><tr><td align='left' width='100px'>" + data.CN_S_CODE + "</td><td align='left' width='100px'>" + data.CN_S_NAME + "</td><td align='center' width='100px'>" + data.CN_S_NOTE + "</td></tr></table>";

        },
        formatMatch: function (data, i, total) {
            //return data.VALUE + data.TEXT;
        },
        formatResult: function (data, value) {
            // var flag = ;
            //  alert(flag)
            //  return data.VALUE;
        },
        nodatatip: function () {
            CheckItemCode(row)
        }
    }).result(function (event, data, formatted) { //回调 
        //ItemCodeBlur(data.ParamVauleD, row);
        var defaultStr = "";
        //已存在
        if (TblisExistItemCode(row, data.CN_S_CODE)) {
            //信息提示
            parent.ShowMsg('操作项目[' + data.CN_S_CODE + ']已存在！');
            UpdateRowSetValue(row, null);
        }
        else {
            UpdateRowSetValue(row, data);
        }
    })
}

//检查物料编码是否存在
function CheckItemCode(row) {
    var str = false;
    var itemCode = $.trim($("#txtCode" + row).val());
    var defaultStr = "";
    //已存在
    if (itemCode != "") {
        //信息提示
        if (TblisExistItemCode(row, itemCode)) {
            parent.ShowMsg('操作项目[' + itemCode + ']已存在！');
            UpdateRowSetValue(row, null);
            //$("#txtCode" + row).val("");
            //var itemCode = $.trim($("#txtCode" + row).val(""));
            return;
        }
    }
    /* ITEM 离开 判断数据库是否存在 */
    ItemCodeBlur(itemCode, row);
}

/* ITEM 离开 判断数据库是否存在 */
function ItemCodeBlur(itemCode, row) {
    var defaultStr = "";
    //物料编码不可为空
    if ($.trim(itemCode) != "") {
        $.ajax({
            type: "POST",
            url: "/AdminUI/AjaxPages/Equipment/OperationManage.ashx",
            data: "Action=ISEXISTITEMCODE&ItemCode=" + escape(itemCode) + "",
            async: false,
            success: function (result) {
                if (result != "false") {
                    //字符串转成Json对象 
                    var data = (new Function("", "return " + result))();
                    $("tr[id='" + row + "']").find("input[id='txtCode" + row + "']").val(data.CN_S_CODE);
                    $("tr[id='" + row + "'] td[colName='itemName']").html(data.CN_S_NAME);
                }
                else {
                    parent.ShowMsg('没有匹配的数据！');
                    $("tr[id='" + row + "']").find("input[id='txtCode" + row + "']").val("");
                    $("tr[id='" + row + "'] td[colName='itemName']").html("");
                }
            }
        });
    }
}

//判断已选择的ITEMCODE是否已存在
function TblisExistItemCode(row, ItemCode) {
    var isexist = false;
    if (ItemCode != "") {
        ItemCode = $.trim(ItemCode);
        //判断是否存在  
        row--;
        $("#tblItemRows>tbody>tr").each(function (i) {

            if (row != i && $(this).find("td div[colname='divcode']").find("input").val() == ItemCode) {
                isexist = true;
                return true;
            }
        });
    }
    return isexist;

}

//注意input的id和tr的id要一样,新增行
function UpdateRowSetValue(row, data) {
    if (data != null) {
        $("tr[id='" + row + "']").find("input[id='txtCode" + row + "']").val(data.CN_S_CODE);
        $("tr[id='" + row + "'] td[colName='itemName']").html(data.CN_S_NAME);
        $("tr[id='" + row + "']").find("input[id='txtCycle" + row + "']").val(data.CN_N_MAINTAINCYCLE == undefined ? "" : data.CN_N_MAINTAINCYCLE);
        $("tr[id='" + row + "']").find("input[id='txtUnit" + row + "']").val(data.CN_S_UNIT == undefined ? "月" : data.CN_S_UNIT);
        $("tr[id='" + row + "']").find("input[id='txtDate" + row + "']").val(data.CN_T_LASTMAINTAINTIME == undefined ? "" : ChangeDateTimeFormat(data.CN_T_LASTMAINTAINTIME));
    }
    else {
        $("tr[id='" + row + "']").find("input[id='txtCode" + row + "']").val("");
        $("tr[id='" + row + "'] td[colName='itemName']").html("");
        $("tr[id='" + row + "']").find("input[id='txtCycle" + row + "']").val("");
        $("tr[id='" + row + "']").find("input[id='txtUnit" + row + "']").val("");
        $("tr[id='" + row + "']").find("input[id='txtDate" + row + "']").val("");
    }
}

//在弹出框中选择一条或多条后添加到表格中
function SelItem(index, order, data) {
    index--;
    index += order;

    if (TblisExistItemCode1((index + 1), data.CN_S_CODE)) {
        parent.ShowMsg('操作项目[' + data.CN_S_CODE + ']已存在！');
        return false;
    }
    if ($("#tblItemRows>tbody>tr").length <= index)
        addRow(index, null);
    UpdateRowSetValue(++index, data);
    return true;
}
