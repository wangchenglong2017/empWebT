//显示数据加载进度条
function AjaxStart() {
    parent.$("#divLoading").show();
}
//隐藏数据加载进度条
function AjaxStop() {
    parent.$("#divLoading").hide();
}

//新增初始化函数
function IniAddRow(length) {
    var _length = length;
    for (var i = 0; i < _length; i++) {
        addRow(i);
    }
}

//新增空行
function addRow(row) {
    //新增空行 
    addRowSetValue(row, "");
}

//选择物料增加行
function SelectItemAddRow(row, RowJson) {
    //设置json
    addRowSetValue(row, RowJson);
}
//根据订单编号，得到订单对应的物料行
function GetRowItemsByOrderCode(OrderCode, Ordertype) {

    //获取初始化JSON列表 开始
    $.ajax({
        type: "POST",
        url: "/AdminUI/AjaxPages/AddOrder.ashx",
        data: "Action=EDITITEMLIST&ORDERCODE=" + OrderCode + "&OrderType=" + Ordertype,
        async: false,
        beforeSend: function () {

        },
        success: function (result) {
            if (result != "") {
                //字符串转成Json对象 
                var data = (new Function("", "return " + result))();
                if (data != null) { //没有错误信息
                    //遍历数据行
                    $.each(data.ROWITEMLIST, function (i, n) {
                        //对象转化成json字符串
                        var ItemJson = JSON.stringify(n);
                        //从第一行开始
                        var startRow = parseInt(n.row) - 1;
                        //新增行
                        SelectItemAddRow(startRow, ItemJson);
                    });
                }
                else {
                }
            }
        }
    });
}



//根据订单编号，得到订单主表信息
function LoadOrderHead(OrderCode, OrderType) {
    //获取初始化JSON列表 开始
    $.ajax({
        type: "POST",
        url: "/AdminUI/AjaxPages/AddOrder.ashx",
        data: "Action=GETHEADENTITY&ORDERCODE=" + OrderCode + "",
        async: false,
        beforeSend: function () {
        },
        success: function (result) {
            if (result != "") {
                //字符串转成Json对象 
                var data = (new Function("", "return " + result))();
                //alert(result);
                if (data != null) { //有值
                    //订单号
                    $("#txt_cn_s_Ordercode").val(data.CN_S_ORDERCODE);
                    //税率
                    $("#dpttax_rate ").val(data.CN_F_TAX_RATE);
                    //折扣率
                    //$("#txt_ClientDiscount").val(data.CN_F_DEPOSIT_RATE);
                    //收货地址
                    $("#txtReAddress").val(data.CN_S_READDRESS);
                    //编制日期订单日期
                    if ("copy" != OrderType) {
                        $("#txt_cn_t_tdate").val(JsonDateFormat(data.CN_T_TDATE));
                    }
                    //编制人
                    $("#txt_UserName").val(data.CN_S_CREATOR_NAME);
                    //总金额
                    var SumbuytTotalprice = parseFloat(data.CN_F_TOTALPRICE);
                    $("#txt_SumsaleTotalprice").val(ForDight(SumbuytTotalprice, 2));
                   
                    //税额
                    var tax_amount = parseFloat(data.CN_F_TAX_AMOUNT);
                    tax_amount = ForDight(tax_amount, 2);
                    $("#txt_tax_amount").val(tax_amount);
                    //不含税总金额
                    var ntax_totalamount = parseFloat(data.CN_F_NTAX_TOTALAMOUNT);
                    ntax_totalamount = ForDight(ntax_totalamount, 2);
                    $("#txt_ntax_totalamount").val(ntax_totalamount);

                }

            }

        }
    });


}


//注意input的id和tr的id要一样,新增行
function addRowSetValue(row, RowJson) {
    //字符串转成Json对象   
    var data;
    var isexist = false;

    if (RowJson != "") {
        data = (new Function("", "return " + RowJson))();
        if (data.itemCode != "") {
            //判断是否存在
            $("#tblItemRows>tbody>tr:has(td:has(div[code='" + data.itemCode + "']))").each(function () {
                var updaterow = $(this).attr("id");
                //覆盖已存在的ITEM
                UpdateRowSetValue(updaterow, RowJson);
                //存在
                isexist = true;
            });
        }
    }

    if (isexist) {
        return;
    }
    //默认值
    var defaultStr = ""; //字符串
    var defaultFloat = ""; //金额
    var defaultDepositRate = parseFloat("0.00"); //折扣率
    //var defaultState = "新建";
    //配件编号
    var itemCode = RowJson == "" ? defaultStr : (data.itemCode == null ? defaultStr : data.itemCode);
    //配件名称
    var itemName = RowJson == "" ? defaultStr : (data.itemName == null ? defaultStr : data.itemName);
    //规格型号
    var itemModel = RowJson == "" ? defaultStr : (data.itemModel == null ? defaultStr : data.itemModel);
    //库存
    //var stockQuatity = RowJson == "" ? ForDight(0.00, 2) : (data.stockQuatity == null ? ForDight(0.00, 2) : ForDight(data.stockQuatity));
    //累计发货量
    var AddUpQuatity = RowJson == "" ? defaultStr : (data.AddUpQuatity == null ? defaultStr : ForDight(data.AddUpQuatity, 2));
    //买入单价
    var buyPrice = RowJson == "" ? defaultStr : (data.buyPrice == null ? defaultFloat : ForDight(data.buyPrice, 2));
    //数量
    var quantity = RowJson == "" ? defaultStr : (data.quantity == null ? defaultFloat : ForDight(data.quantity, 2));
    //单位
    var itemUnit = RowJson == "" ? defaultStr : (data.itemUnit == null ? defaultStr : data.itemUnit);
    //折扣率
    var depositRate = RowJson == "" ? ForDight(defaultDepositRate, 2) : (data.depositRate == null ? ForDight(defaultDepositRate, 2) : ForDight(data.depositRate, 2));
    //折扣额
    var depositTalmount = RowJson == "" ? defaultStr : (data.depositTalmount == null ? defaultFloat : ForDight(data.depositTalmount, 2));
    //总价
    var TotalPrice = RowJson == "" ? defaultStr : (data.afterDepositTalprice == null ? defaultFloat : ForDight(data.afterDepositTalprice, 2));
    //状态
    var state = RowJson == "" ? defaultStr : (data.state == null ? defaultStr : data.state);
    //备注
    var remark = RowJson == "" ? defaultStr : (data.remark == null ? defaultStr : data.remark);
    //要添加的行的id  
    var addRowID = parseInt(row) + 1;
    //行字符串
    var str = "";
    //新增与删除行
    if (state == "申请关闭"||state=="关闭") {
        str += '<tr id="' + addRowID + '"><td><a href="javascript:void(0);" title="' + state + '" class="nrecloseLite" onclick="closetr(' + addRowID + ')"></a></td>';
    }
    else {
        str += '<tr id="' + addRowID + '"><td><a href="javascript:void(0);" title="申请关闭" class="precloseLite" onclick="closetr(' + addRowID + ')"></a></td>';
    }
    //行号
    str += '<td >' + addRowID + '</td>';
    //配件编号
    str += '<td colname="itemCode">' + itemCode+'</td>';
   
    //配件名称 规格
    str += '<td  colname="itemName" title="' + itemName + '"><span>' + itemName + '</span></td>';
    //规格
    str += '<td  colname="itemModel" title="' + itemModel + '">' + itemModel + '</td>';
    //库存总数
    //str += '<td  code="' + itemCode + '" name="' + itemName + '" onclick="GetStockQuantity(this);"  colname="stockQuantity" align="center"><img id="imgstock" title="查看库存" src="/Images/viewStock.png" style="cursor:pointer;" /></td>';
    //累计发货量
    str += '<td colname="AddUpQuatity" align="right">' + AddUpQuatity + '</td>';
    //单价
    str += '<td colname="buyPrice" align="right">' + buyPrice + '</td>';
    //  数量
    str += ' <td    colname="quantity" align="right">' + quantity + '</td>';
    //计量单位
    str += '<td colname="itemUnit">' + itemUnit + '</td>';
    //折扣率 折扣额
    str += '<td   colname="depositRate" align="right">' + depositRate + '</td><td   colname="depositTalmount" align="right">' + depositTalmount + '</td>';
    //总价
    str += '<td  colname="TotalPrice" align="right">' + TotalPrice + '</td>';
    //状态
    str += '<td   colname="state" align="center">' + state + '</td>';
    //备注
    str += '<td  colname="remark" title="' + remark + '">' + remark + '</td></tr>';
    if (addRowID == 1) {
        // $("#tblItemRows>tbody").html(str);
        if (RowJson != '') {
            UpdateRowSetValue(addRowID, RowJson);
        }
        else {
            $("#tblItemRows>tbody").html(str);
        }
    }
    else {
        //获取表格的最后一行
        var currentRowObj = $('#' + row + '');
        //当前行之后插入一行  
        currentRowObj.after(str);
        // $("#tblItemRows>tbody").append(str);
    }
    //序号重新生成
    showLineNum();

}


//重新设置行号
function showLineNum() {
    var addRowID;
    var htmlstr = "";
    $('#tblItemRows>tbody>tr').each(function (i) {
        //当前行号
        addRowID = i + 1;
        //新增 删除
        if ($(this).find('td[colname=state]').text() == "申请关闭"||$(this).find('td[colname=state]').text()=="关闭") {
            htmlstr = '<a href="javascript:void(0);" class="nrecloseLite" title="'+$(this).find('td[colname=state]').text()+'" onclick="closetr(' + addRowID + ')"></a>';
        }
        else {
            htmlstr = '<a href="javascript:void(0);" class="precloseLite" title="申请关闭" onclick="closetr(' + addRowID + ')"></a>';
        }
        //设置行ID
        $(this).attr("id", addRowID);
        //设置序号的值
        $(this).find('td').eq(1).html(addRowID);
        //设置新增与删除
        $(this).find('td').eq(0).html(htmlstr);
        //配件编号 修改ID


    });
    //重新计算合计
    totalItemRowsFund();

}

//行关闭事件
function closetr(row) {
    //如果已经是申请关闭则单击无效
    if ($("#" + row).find("td[colname=state]").text() == "申请关闭" || $("#" + row).find("td[colname=state]").text() == "完成" || $("#" + row).find("td[colname=state]").text() == "关闭")
    {
       parent.ShowMsg('该行不允许申请关闭！');
       return false;
    }
    //获得订单编号
    var OrderCode = $("#txt_cn_s_Ordercode").val();
    //得到总行数
    var tblrowcount = $("#tblItemRows>tbody>tr").length;
    var flag = "false";
    $("#tblItemRows>tbody>tr").each(function () {
        if ($(this).find("td[colname=state]").text() == "申请关闭" && $(this).attr("id") != row) {
            if (flag != "true") {
                flag = "true";
            }
        }
    });
    if (tblrowcount != 0) {
        $.messager.confirm('系统提示', '确认关闭吗？', function (r) {
            if (r) {
                //获取列表
                $.ajax({
                    type: "POST",
                    url: "/AdminUI/AjaxPages/AddOrder.ashx",
                    data: "Action=UPDATECLOSESTATE&OrderCode=" + OrderCode + "&row=" + row + "&flag=" + flag,
                    async: false,
                    beforeSend: function () {
                    },
                    success: function (result) {
                        if (result == "end") {
                            parent.ShowMsg('该配件企业已发货完成,不允许关闭！');
                            $("#" + row).find("td[colname=state]").text("完成");
                            return false;
                        }
                        else if (result == "true") {
                            parent.ShowMsg('申请关闭成功！');
                            $("#" + row).find("td[colname=state]").text("申请关闭");
                            $("#" + row).find("td:eq(0)").find("a").removeClass("precloseLite").addClass("nrecloseLite");
                        }
                        else {
                            parent.ShowMsg('申请关闭失败！');
                            return false;
                        }
                    }
                });
            }
        });
    }
    else {
        parent.ShowMsg('配件列表至少保留一行！');
    }
}


//当前行对象 row：当前修改的行，修改的当前字段
function RowCalculator(row, colname) {
    //默认数值类型
    //  var defaultfloat = "0.00";
    //单价
    var buyPrice = $("#" + row).find("td[colname=buyPrice]").text();
    //数量
    var quantity = $("#" + row).find("td[colname=quantity]").text();
    //折扣率
    var depositRate = $("#" + row).find("td[colname=depositRate]").text();
    //折扣额
    var depositTalmount = $("#" + row).find("td[colname=depositTalmount]").text();
    //总价
    var TotalPrice = $("#" + row).find("td[colname=TotalPrice]").text();
    if (quantity != "" && colname == "quantity") { //修改数量，得到总价
        quantity = parseFloat(quantity);
        buyPrice = parseFloat(buyPrice);
        // 更改数量
        $("#" + row).find("td[colname=quantity]").text(ForDight(quantity, 2));
        //得到金额
        var TotalPrice = buyPrice.mul(quantity);
        depositRate = parseFloat(depositRate);
        //赋值折扣率
        $("#" + row).find("td[colname=depositRate]").text(ForDight(depositRate, 2));
        if (0 == depositRate)
            depositRate = 100.00;
        //转化折扣率
        depositRate = depositRate.div(100.00);
        //得到折扣额
        var depositTalmount = TotalPrice.mul(1 - depositRate);
        //格式化折扣额
        _depositTalmount = ForDight(depositTalmount, 2);
        //赋值折扣额
        $("#" + row).find("td[colname=depositTalmount]").text(_depositTalmount);
        //总价
        var afterTotalPrice = TotalPrice.sub(_depositTalmount);
        //格式化折扣后总价
        _afterTotalPrice = ForDight(afterTotalPrice, 2);
        //赋值总价
        $("#" + row).find("td[colname=TotalPrice]").text(_afterTotalPrice);
    }
    //重新计算合计
    totalItemRowsFund();
}


/*
合计函数
*/
function totalItemRowsFund() {
    //单价合计
    var SumbuyPrice = 0.00;
    //折扣额 
    var SumdepositTalmount = 0.00;
    //金额
    var SumTotalprice = 0.00;
    //遍历配件行
    $("#tblItemRows>tbody>tr").each(function () {
        //单价合计
        $(this).find("td[colname='buyPrice']").each(function () {
            if ($(this).text() != "") {
                SumbuyPrice = SumbuyPrice.add(getNumValue($(this)));
            }
        });
        //折扣额
        $(this).find("td[colname='depositTalmount']").each(function () {
            if ($(this).text() != "") {
                SumdepositTalmount = SumdepositTalmount.add(getNumValue($(this)));
            }
        });
        //总价
        $(this).find("td[colname='TotalPrice']").each(function () {
            if ($(this).text() != "") {
                SumTotalprice = SumTotalprice.add(getNumValue($(this)));
            }
        });

    });
    //alert(SumbuyPrice + "|" + SumdepositTalmount + "|" + SumTotalprice);
    //单价合计
    if (SumbuyPrice != 0) {
        $("#trtotal td.SumbuyPrice").text(ForDight(SumbuyPrice, 2));
    }
    //折扣额 
    if (SumdepositTalmount != 0) {
        $("#trtotal td.SumdepositTalmount").text(ForDight(SumdepositTalmount, 2));
        //$("#txt_SumdepositTalmount").val(ForDight(SumdepositTalmount, 2));
    }
    //金额 
    if (SumTotalprice != 0) {
        $("#trtotal td.SumTotalprice").text(ForDight(SumTotalprice, 2));
        //总金额
        $("#txt_SumsaleTotalprice").val(ForDight(SumTotalprice, 2));
    }
    //计算税额
    var tax_rate = $("#dpttax_rate").val();
    if (tax_rate != "") {
        tax_rate = parseFloat(tax_rate);
        var tax_amount = SumTotalprice.mul(tax_rate.div(100.00));
        if (tax_amount != 0) {
            $("#txt_tax_amount").val(ForDight(tax_amount, 2));
        }
        //不含税金额
        var ntax_totalamount = SumTotalprice - tax_amount;
        if (ntax_totalamount != 0) {
            $("#txt_ntax_totalamount").val(ForDight(ntax_totalamount, 2));
        }
    }
}



//注意input的id和tr的id要一样,新增行
function UpdateRowSetValue(row, RowJson) {
    //字符串转成Json对象
    var data;
    if (RowJson != "") {
        data = (new Function("", "return " + RowJson))();
    }
    //默认值
    var defaultStr = ""; //字符串
    var defaultFloat = ""; //金额
    var defaultDepositRate = parseFloat("0.00"); //折扣率
    //var defaultState = "新建";
    //配件编号
    var itemCode = RowJson == "" ? defaultStr : (data.itemCode == null ? defaultStr : data.itemCode);
    //配件名称
    var itemName = RowJson == "" ? defaultStr : (data.itemName == null ? defaultStr : data.itemName);
    //规格型号
    var itemModel = RowJson == "" ? defaultStr : (data.itemModel == null ? defaultStr : data.itemModel);
    //库存
    //var stockQuatity = RowJson == "" ? 0.00 : (data.stockQuatity == null ? 0.00 : data.stockQuatity);
    //累计发货量
    var AddUpQuatity = RowJson == "" ? defaultStr : (data.AddUpQuatity == null ? defaultStr : ForDight(data.AddUpQuatity,2));
    //单位
    var itemUnit = RowJson == "" ? defaultStr : (data.itemUnit == null ? defaultStr : data.itemUnit);
    //买入单价
    var buyPrice = RowJson == "" ? defaultStr : (data.buyPrice == null ? defaultFloat : ForDight(data.buyPrice, 2));
    //数量
    var quantity = RowJson == "" ? defaultStr : (data.quantity == null ? defaultFloat : ForDight(data.quantity, 2));
    //单位
    var itemUnit = RowJson == "" ? defaultStr : (data.itemUnit == null ? defaultStr : data.itemUnit);
    //折扣率
    var depositRate = RowJson == "" ? ForDight(defaultDepositRate, 2) : (data.depositRate == null ? ForDight(defaultDepositRate, 2) : ForDight(data.depositRate, 2));
    //折扣额
    var depositTalmount = RowJson == "" ? defaultStr : (data.depositTalmount == null ? defaultFloat : ForDight(data.depositTalmount, 2));
    //总价
    var TotalPrice = RowJson == "" ? defaultStr : (data.afterDepositTalprice == null ? defaultFloat : ForDight(data.afterDepositTalprice, 2));
    //状态
    var state = RowJson == "" ? defaultStr : (data.state == null ? defaultStr : data.state);
    //备注
    var remark = RowJson == "" ? defaultStr : (data.remark == null ? defaultStr : data.remark);

    //＝＝＝＝＝＝修改行值＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //修改关闭类
    //新增与删除行
    if (state == "申请关闭"||state=="关闭") {
        $("#" + row).find("td:eq(0)").find("a").removeClass("precloseLite").addClass("nrecloseLite");
    }
    else {
       
    }
    //编号
    itemCode = $.trim(itemCode);
    $("#" + row).find("td[colname='itemCode']").text(itemCode);
    //名称
    $("#" + row).find("td[colname='itemName']").find("span").text(itemName);
    $("#" + row).find("td[colname='itemName']").find("span").attr("title", itemName);
    //规格型号 
    $("#" + row).find("td[colname=itemModel]").text(itemModel);
    $("#" + row).find("td[colname=itemModel]").attr("title", itemModel);
    //单位
    $("#" + row).find("td[colname=itemUnit]").text(itemUnit);
    //买入单价
    $("#" + row).find("td[colname=buyPrice]").text(buyPrice);

    //数量
    $("#" + row).find("td[colname=quantity]").text(quantity);
    //库存
    //$("#" + row).find("td[colname=stockQuantity]").attr("code", itemCode);
    //$("#" + row).find("td[colname=stockQuantity]").attr("name", itemName);
    $("#" + row).find("td[colname=AddUpQuatity]").text(AddUpQuatity);
    //折扣率
    $("#" + row).find("td[colname=depositRate]").text(depositRate);
    //折扣额
    $("#" + row).find("td[colname=depositTalmount]").text(depositTalmount);
    //状态
    $("#" + row).find("td[colname=state]").text(state);

    //总价
    $("#" + row).find("td[colname=TotalPrice]").text(TotalPrice);
    //备注
    $("#" + row).find("td[colname=remark]").text(remark);
    $("#" + row).find("td[colname=remark]").attr("title", remark);
    //重新计算合计
    totalItemRowsFund();
}

/// <summary>
/// td中的字符串转化成float
/// </summary>
/// <param name="controlid">TD对象</param>
/// <returns type="">float or 0</returns>
function getNumValue(controlid) {
    var num = controlid.text();
    if (validateInput(num)) {
        num = parseFloat(num);
    }
    else {
        controlid.text("");
        num = 0.00;
    }
    return num;
}
/// <summary>
/// 得到的值是不是数字
/// </summary>
/// <param name="inputstr">值</param>
/// <returns type="">bool</returns>
function validateInput(inputstr) {
    flag = false;
    if (inputstr != "") {
        if (isNaN(inputstr)) {
            flag = false; //如果输入字符不是数字
        }
        else {//输入数字但是小于0
            if (parseFloat(inputstr) < 0)
                flag = false;
            else
                flag = true;
        }
    }
    return flag;
}



//定位行 aLocationRow
var LocationCurrentRow = 0;
function LocationRowByCon() {

    //定位关键字
    var LocationKey = $("#txt_LocationRow").val();

    //报价单号 不可为空
    if (LocationKey == "") {
        parent.ShowMsg('请输入配件编号或配件名称!');
        $("#txt_LocationRow").trigger("focus");
        return false;
    }

    //总行数
    var rowcount = $("#tblItemRows>tbody>tr").length;
    //遍历行
    $("#tblItemRows>tbody>tr").each(function (i) {
        $("#" + rowcount).find("td[colname=itemCode]").css("color", "");
        $("#" + rowcount).find("td[colname='itemName']").css("color", "");
        var flag = false;
        //当前行号
        var row = $(this).attr("id");
        //物料编码
        var itemCode = $(this).find("td[colname=itemCode]").text();
        if (itemCode != "") {
            //物料名称
            var itemName = $(this).find("td[colname=itemName]").text();
            //  alert(LocationCurrentRow + '| row:' + row);
            //物料编码包含
            if (itemCode.toUpperCase().indexOf(LocationKey.toUpperCase()) > -1 && parseInt(LocationCurrentRow) < parseInt(row)) {
                $(this).find("td[colname=itemCode]").css("color", "#0000FF");
                flag = true;
            }
            else {
                $(this).find("td[colname=itemCode]").css("color", "");
                $(this).find("td[colname='itemName']").css("color", "");
            }

            //物料名称包含
            if (itemName.toUpperCase().indexOf(LocationKey.toUpperCase()) > -1 && parseInt(LocationCurrentRow) < parseInt(row)) {
                $(this).find("td[colname='itemName']").css("color", "red");
                flag = true;
            }
            else {
                $(this).find("td[colname='itemName']").css("color", "");
            }

            if (flag) {
                //记录当前行
                LocationCurrentRow = row;
                //第二次
                if (parseInt(rowcount) == parseInt(row)) {
                    LocationCurrentRow = 0;
                }
                itemInput = $(this).find("td[colname=itemCode]");
                var tableObj = $("#_fixTableMain");
                var tableTop = tableObj.offset().top;
                var inputTop = itemInput.offset().top - tableTop;
                var inputHeight = $(this).find("td[colname=itemCode]").height();
                ///var inputHeight = $("#" + row).height();    // 单元格的高度>input控件的高度 故取单元格的高度
                //var inputTop = parseFloat(inputHeight) * (parseInt(row) - 1);

                if ($("#_fixTableMain").scrollTop() > (inputTop + $(this).find("td[colname=itemCode]").outerHeight())) {
                    //这个表达式结果为true时,表示元素已经向上滚动,并超出了可视区域.
                    $("#_fixTableMain").animate({ scrollTop: inputTop }, 50);
                }
                else if (0 < (inputTop + inputHeight - $("#_fixTableMain").height())) {
                    //这个表达式结果为true时,表示元素已经向下滚动,并超出了可视区域.
                    $("#_fixTableMain").animate({ scrollTop: (tableObj.scrollTop()) + inputTop + inputHeight - tableObj.height() + 25 }, 50);

                }
                //跳槽循环 
                return false;
            }
        }
        //第二次
        if (parseInt(rowcount) == parseInt(row)) {
            LocationCurrentRow = 0;
            //处发第一次单击
            $("#aLocationRow").trigger("click");
        }

    });


}