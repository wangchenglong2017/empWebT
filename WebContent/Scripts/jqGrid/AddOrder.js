//显示数据加载进度条
function AjaxStart() {
    parent.$("#divLoading").show();
}
//隐藏数据加载进度条
function AjaxStop() {
    parent.$("#divLoading").hide();
}


//得到订单号
function GetOrderBillCode() {
    //获取列表
    $.ajax({
        type: "POST",
        url: "/AdminUI/AjaxPages/AddOrder.ashx",
        data: "Action=NEWORDERBILLCODE",
        async: false,
        beforeSend: function () {
            //  $("#tblClientList").empty()
        },
        success: function (result) {
            if (result != "") {
                //字符串转成Json对象 
                var data = (new Function("", "return " + result))();
                //遍历数据行
                if (data.Code == "0") {
                    $("#txt_cn_s_Ordercode").val(data.Data);
                }
                else {
                    $("#txt_cn_s_Ordercode").val("");
                    parent.ShowMsg(data.Data);
                }

            }

        }
    });
}

/*选择ITEM物料 弹出对话框*/
function SelectItemList(row) {
    //显示进度条 
    parent.$("#divLoading").show();
    parent.$('#openFrameDiv').dialog({
        title: '选择配件',
        width: 1020,
        height: 600,
        closed: false,
        cache: false,
        modal: true,
        maximizable: true,
        resizable: true,
        onClose: function () {
            parent.$('#openIframe')[0].src = "none.html";
        },
        buttons: [{
            text: '确定',
            iconcls: 'l-btn-left2',
            handler: function () {

                var SelectItemArray = parent.$('#openIframe')[0].contentWindow.getSelectItemArray();
                var currentRow = parseInt(row);
                for (var i = 0; i < SelectItemArray.length; i++) {
                    var ItemJson = SelectItemArray[i].JsonStr;
                    if (i == 0) {
                        parent.$("#tabs .panel:visible iframe")[0].contentWindow.UpdateRowSetValue(currentRow, ItemJson);
                    }
                    else {
                        parent.$("#tabs .panel:visible iframe")[0].contentWindow.SelectItemAddRow(currentRow, ItemJson);
                        currentRow = currentRow + 1;
                    }
                }
                parent.$('#openFrameDiv').dialog('close');
            }
        }, {
            text: '取消',
            handler: function () {

                parent.$('#openFrameDiv').dialog('close');
            }
        }]
    });
    parent.$('#openIframe')[0].src = "/AdminUI/DealerSale/SelectItemList.aspx?row=" + row;
    parent.$('#openFrameDiv').dialog('open');
}


//定位行 aLocationRow
var LocationCurrentRow = 0;
var StartLocationRow = 0;
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
        var flag = false;
        //当前行号
        var row = $(this).attr("id");
        //物料编码
        var itemCode = $("#txtIput" + row).val();
        if (itemCode != "") {
            //物料名称
            var itemName = $(this).find("td[colname=itemName]").text();
            //  alert(LocationCurrentRow + '| row:' + row);
            //物料编码包含
            if (itemCode.toUpperCase().indexOf(LocationKey.toUpperCase()) > -1 && parseInt(LocationCurrentRow) < parseInt(row)) {
                $("#txtIput" + row).css("color", "#0000FF");
                flag = true;
            }
            else {
                $("#txtIput" + row).css("color", "");
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
                StartLocationRow = row;
                //第二次
                if (parseInt(rowcount) == parseInt(row)) {
                    LocationCurrentRow = 0;
                }
                itemInput = $("#txtIput" + row);
                var tableObj = $("#_fixTableMain");
                var tableTop = tableObj.offset().top;
                var inputTop = itemInput.offset().top - tableTop;
                var inputHeight = $("#txtIput" + row).height();
                ///var inputHeight = $("#" + row).height();    // 单元格的高度>input控件的高度 故取单元格的高度
                //var inputTop = parseFloat(inputHeight) * (parseInt(row) - 1);

                if ($("#_fixTableMain").scrollTop() > (inputTop + $("#txtIput" + row).outerHeight())) {
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
            if (parseInt(rowcount) == parseInt(StartLocationRow)) {
                //处发第一次单击
                $("#aLocationRow").trigger("click");
            }
        }

    });


}


/*选择导入ITEM 弹出对话框*/
function SelectImportItemList() {
    //显示进度条 
    parent.$("#divLoading").show();
    parent.$('#openFrameDiv').dialog({
        title: '批量导入',
        width: 590,
        height: 430,
        closed: false,
        cache: false,
        modal: true,
        maximizable: false,
        resizable: true,
        onClose: function () {
            parent.$('#openIframe')[0].src = "none.html";
        },
        buttons: [{
            text: '确定',
            iconcls: 'l-btn-left2',
            handler: function () {
                var ImportItemArray = parent.$('#openIframe')[0].contentWindow.getImportItemArray();
                // var currentRow = parseInt(row);
                //alert(ImportItemArray.length);
                for (var i = 0; i < ImportItemArray.length; i++) {
                    //得到当前不为空的行数
                    var row = $("#tblItemRows>tbody>tr:has(td:has(input[value!='']))").length;
                    //转化成数组
                    var currentRow = parseInt(row);
                    //得到JSON
                    var ItemJson = ImportItemArray[i].JsonStr;
                    //增加新行
                    parent.$("#tabs .panel:visible iframe")[0].contentWindow.SelectItemAddRow(currentRow, ItemJson);
                }
                parent.$('#openFrameDiv').dialog('close');

            }
        }, {
            text: '取消',
            handler: function () {
                parent.$('#openFrameDiv').dialog('close');

            }
        }]
    });
    parent.$('#openIframe')[0].src = "/AdminUI/DealerSale/ImportItemListOrder.aspx";
    parent.$('#openFrameDiv').dialog('open');
}

/* 新增缺货登记 弹出对话框*/
function SelectLackItems(row) {
    //alert(row);
    
    //显示进度条 
    parent.$("#divLoading").show();
    parent.$('#openFrameDiv').dialog({
        title: '新增缺货登记',
        width: 650,
        height: 500,
        closed: false,
        cache: false,
        modal: true,
        maximizable: false,
        resizable: true,
        onClose: function () {
            parent.$('#openIframe')[0].src = "none.html";
        },
        buttons: null
    });
    parent.$('#openIframe')[0].src = "/AdminUI/DealerSale/ShortageAdd.aspx?Type=add&row=" + row;
    parent.$('#openFrameDiv').dialog('open');
}



/*选择订单购物车弹出对话框*/
function SelectOrderCartList() {
    var row = $("#tblItemRows>tbody>tr:has(td:has(input[value!='']))").length;
    //显示进度条 
    parent.$("#divLoading").show();
    parent.$('#openFrameDiv').dialog({
        title: '订单购物车',
        width: 900,
        height: 500,
        closed: false,
        cache: false,
        modal: true,
        maximizable: true,
        resizable: true,
        onClose: function () {
            parent.$('#openIframe')[0].src = "none.html";
        },
        buttons: [{
            text: '确定',
            iconcls: 'l-btn-left2',
            handler: function () {
                //得到选中数组
                var CartItemArray = parent.$('#openIframe')[0].contentWindow.getSelectItemArray();
                //遍历选中物料数组
                for (var i = 0; i < CartItemArray.length; i++) {
                    //得到当前不为空的行数
                    var row = $("#tblItemRows>tbody>tr:has(td:has(input[value!='']))").length;
                    //转化成数组
                    var currentRow = parseInt(row);
                    //得到JSON
                    var ItemJson = CartItemArray[i].JsonStr;
                    //增加新行
                    parent.$("#tabs .panel:visible iframe")[0].contentWindow.SelectItemAddRow(currentRow, ItemJson);
                    //计算数值
                    //RowCalculator(currentRow + 1, "quantity");

                }
                parent.$('#openFrameDiv').dialog('close');

            }
        }, {
            text: '取消',
            handler: function () {
                parent.$('#openFrameDiv').dialog('close');

            }
        }]
    });
    parent.$('#openIframe')[0].src = "/AdminUI/DealerSale/SelectOrderCart.aspx";
    parent.$('#openFrameDiv').dialog('open');
}


/*复制订单历史 弹出对话框*/
function CopyHistoryOrderItemList() {
    //获得订单类型
    var Ordertype = GetQueryString("type");
    var OrderCode="";
    if (Ordertype == "edit" || Ordertype == "copy") {
        //得到订单
        OrderCode = GetQueryString("qcode");
    }
    //显示进度条 
    parent.$("#divLoading").show();
    parent.$('#openFrameDiv').dialog({
        title: '复制订单历史',
        width: 900,
        height: 610,
        closed: false,
        cache: false,
        modal: true,
        maximizable: true,
        resizable: false,
        onClose: function () {
            parent.$('#openIframe')[0].src = "none.html";
        },
        buttons: [{
            text: '确定',
            iconcls: 'l-btn-left2',
            handler: function () {
                var SelectItemArray = parent.$('#openIframe')[0].contentWindow.getSelectItemArray();
                //  alert(SelectItemArray.length);
                for (var i = 0; i < SelectItemArray.length; i++) {
                    //得到当前不为空的行数
                    var row = $("#tblItemRows>tbody>tr:has(td:has(input[value!='']))").length;
                    //转化成数组
                    var currentRow = parseInt(row);
                    //得到JSON
                    var ItemJson = SelectItemArray[i].JsonStr;
                    //增加新行
                    parent.$("#tabs .panel:visible iframe")[0].contentWindow.SelectItemAddRow(currentRow, ItemJson);
                }
                parent.$('#openFrameDiv').dialog('close');
            }
        }, {
            text: '取消',
            handler: function () {
                parent.$('#openFrameDiv').dialog('close');
            }
        }]
    });
    parent.$('#openIframe')[0].src = "/AdminUI/DealerSale/SelectHistoryOrderItemList.aspx?OrderCode=" + OrderCode;
    parent.$('#openFrameDiv').dialog('open');
}

//保存订单saveflag:保存后新增，保存；
function SaveOrderInofo(saveflag) {
    //操作类型otype：add edit copy
    var otype = GetQueryString("type");
    //订单号
    var Ordercode = $("#txt_cn_s_Ordercode").val(); //订单号 
    //收货地址
    var ReAddress = $("#txtReAddress").val();  //收货地址
    //税率
    var TaxRate = $("#dpttax_rate").val();
    //订单号 不可为空
    if (Ordercode == "") {
        parent.ShowMsg('订单号不允许为空!');
        $("#txt_cn_s_Ordercode").trigger("focus");
        return false;
    }
    else {
        if (otype != "edit") {
            //判断订单号是否被占用
            $.ajax({
                type: "POST",
                url: "/AdminUI/AjaxPages/AddOrder.ashx",
                data: "Action=EXISTORDERBILLCODE&ORDERCODE=" + Ordercode + "",
                async: false,
                beforeSend: function () {
                    //  $("#tblClientList").empty()
                },
                success: function (result) {
                    if (result != "") {
                        //字符串转成Json对象 
                        var data = (new Function("", "return " + result))();
                        //遍历数据行
                        if (data.Code == "0") {
                            //重新生成
                            GetOrderBillCode();
                            //新的订单号
                            var newOrderCode = $("#txt_cn_s_Ordercode").val();
                            //弹出提示
                            parent.ShowMsg("订单号（" + Ordercode + "）已被占用，新的订单号（" + newOrderCode + "）已生成！请继续保存订单！");
                        }

                    }

                }
            });
        }

    }

    //收货地址
    if (ReAddress == "请选择" || $.trim(ReAddress) == "" || $.trim(ReAddress) == null) {
        parent.ShowMsg('请选择收货地址!');
        $("#txtReAddress").trigger("focus");
        return false;
    }
    //税率
    if (TaxRate == "" || TaxRate == null) {
        parent.ShowMsg('请选择税率!');
        return false;
    }

    var itemflag = false;
    var imessage = "";
    //检查物料行
    $("#tblItemRows>tbody>tr").each(function (index) {
        //当前行
        var row = parseInt(index) + 1;
        ////订单单号
        var OrderCode = $("#txt_cn_s_Ordercode").val();
        //行号
        var N_ROW = row;
        //物料编码
        var _ITEM_CODE = $("#txtIput" + row).val();
        //物料名称
        var _ITEM_NAME = $(this).find("td[colname=itemName]").text();
        //规格型号
        var _ITEM_MODEL = $(this).find("td[colname=itemModel]").text();
        //数量
        var _QUANTITY = $(this).find("td[colname=quantity]").text();
        //计量单位
        var _ITEM_UNIT = $(this).find("td[colname=itemUnit]").text();
        //单价
        var _BUY_PRICE = $(this).find("td[colname=buyPrice]").text();
        //折扣率
        var _DEPOSIT_RATE = $(this).find("td[colname=depositRate]").text();
        //折扣额
        var _DEPOSIT_AMOUNT = $(this).find("td[colname=depositTalmount]").text();
        //总金额
        var _BUY_TOTALPRICE = $(this).find("td[colname=TotalPrice]").text();
        //缺货编号
        var _LACKITEM_CODE = $(this).find("input:.lackcode").val();
        //缺货名称
        var _LACKITEM_NAME = $(this).find("input:.lackname").val();
        //缺货状态
        var _LACK_STATE = $(this).find("input:.lackstate").val();
        //备注  
        var _REMARK = $(this).find("td[colname=remark]").text();

        //物料编码
        if ($.trim(_ITEM_CODE) == "" && row == 1) {
            itemflag = true;
            $("#txtIput" + row).trigger("focus");
            imessage = "请输入第（" + row + "）行物料编码!";
            return false;
        }
        if ($.trim(_ITEM_CODE) != "") {
            if ($.trim(_QUANTITY) == "" || 0 == parseFloat($.trim(_QUANTITY))) {
                itemflag = true;
                $(this).find("td[colname=quantity]").trigger("click");
                imessage = "第（" + row + "）行的数量必须大于0!";
                return false;
            }
        }
    });
    //物料行检查
    if (itemflag && imessage != "") {
        parent.ShowMsg(imessage);
        imessage = "";
        return false;
    }
    //1、保存订单主表json
    var Hflag = SetOrderHeadInofo();
    //2、保存物料行json
    var Itemflag = SetOrderItems();
    //3、保存其他费用json
    var Costflag = SetOrderOtherCost();
    //4. 保存企业单据主表
    //var Comflag = SetComOrderInfo();
    //缓存成功
    if (Hflag && Itemflag && Costflag) {
        //保存save 保存后新增saveflag
        $("#hdnFlag").val(saveflag);
        //4、提交保存
        $("#frmAddOrder").submit();
        if (saveflag == "save") {//保存
            $(".btnRight").find("a[id=btnsave]").text("保存中...");
            $(".btnRight").find("a[id=btnsave]").attr("disabled", "disabled");
        }
        else {//保存并关闭 saveflag=saveclose
            $(".btnRight").find("a[id=btnsaveclose]").text("保存中...");
            $(".btnRight").find("a[id=btnsaveclose]").attr("disabled", "disabled");
        }
    }
    else { //保存失败
        parent.ShowMsg("保存不成功!");
        return false;
    }

}

// 计算其他相关总金额 运费+其他费用+税费
function CalOtherTotalAmount() {
    var _totalAmount = 0.0;

    $("input[groupclass='inputnumber']").each(function () {
        if ("" != $(this).val())
            _totalAmount = _totalAmount.add(parseFloat($(this).val()));
    });

    return _totalAmount;
}


//缓存主表信息
function SetOrderHeadInofo() {
    //是否成功的标记
    var flag = false;
    //主表Json主符串
    var HeadJsonStr = "";
    //默认数值类型
    var defaultfloat = "0.00";
    //默认数值类型
    var defaultstr = "";
    //税率
    var _tax_rate = $("#dpttax_rate").val();
    _tax_rate = $.trim(_tax_rate) == "" ? defaultfloat : $.trim(_tax_rate);
    //税额
    var _tax_amount = $("#txt_tax_amount").val();
    _tax_amount = $.trim(_tax_amount) == "" ? defaultfloat : $.trim(_tax_amount);
    //总金额
    var _Sum_totalprice = $("#txt_SumsaleTotalprice").val();
    _Sum_totalprice = $.trim(_Sum_totalprice) == "" ? defaultfloat : $.trim(_Sum_totalprice);
    //不含税总金额
    var ntax_totalamount = $("#txt_ntax_totalamount").val();
    ntax_totalamount = $.trim(ntax_totalamount) == "" ? defaultfloat : $.trim(ntax_totalamount);
    //其他费用总金额
    var _other_totalcost = CalOtherTotalAmount(); // $("#hdnOther_TotalCost").val();
    _other_totalcost = $.trim(_other_totalcost) == "" ? defaultfloat : $.trim(_other_totalcost);


    //对象
    var QuoteHead = {
        CN_S_ORDERCODE: $("#txt_cn_s_Ordercode").val(), //订单号
        CN_S_READDRESS: $("#txtReAddress").val(), //收货地址
        CN_F_DEPOSIT_RATE: parseFloat("0.00"), //折扣率
        CN_F_TAX_RATE: _tax_rate, //税率
        CN_F_TAX_AMOUNT: _tax_amount, //税额
        CN_F_TOTALPRICE: _Sum_totalprice, //总价
        CN_F_NTAX_TOTALAMOUNT: ntax_totalamount, //不含税总金额
        CN_F_OTHER_TOTALCOST: _other_totalcost, //其他费用总金额
        CN_S_CURRENCY_UNIT: "RMB", //货币单位
        CN_S_SOURCE:"手工",//来源
        CN_S_REMARK: $("#hdnNote").val()//备注
    };
    //保存主表信息
    HeadJsonStr = JSON.stringify(QuoteHead);
    $("#hdnHead").val(HeadJsonStr);
    flag = true;
    return flag
}

//缓存物料行
function SetOrderItems() {
    //是否成功的标记
    var flag = false;
    var ItemJsonStr = "";
    var curRow = 0;
    $("#tblItemRows>tbody>tr").each(function (index) {
        //当前行
        var row = parseInt(index) + 1;
        ////订单单号
        var OrderCode = $("#txt_cn_s_Ordercode").val();
        //行号
        //var N_ROW = $(this).attr("id");
        //物料编码
        var _ITEM_CODE = $("#txtIput" + row).val();
        //标准成本
        var standardPrice = $(this).find("div[colname=divcode]").attr("standcost");
        //物料名称
        var _ITEM_NAME = $(this).find("td[colname=itemName]").text();
        //规格型号
        var _ITEM_MODEL = $(this).find("td[colname=itemModel]").text();
        //数量
        var _QUANTITY = $(this).find("td[colname=quantity]").text();
        //计量单位
        var _ITEM_UNIT = $(this).find("td[colname=itemUnit]").text();
        //单价
        var _BUY_PRICE = $(this).find("td[colname=buyPrice]").text();
        //折扣率
        var _DEPOSIT_RATE = $(this).find("td[colname=depositRate]").text();
        //折扣额
        var _DEPOSIT_AMOUNT = $(this).find("td[colname=depositTalmount]").text();
        //总价
        var TotalPrice = parseFloat(_BUY_PRICE).mul(_QUANTITY);
        //状态
        var state = $(this).find("td[colname=state]").text();
        //折扣后总价
        var AfterTotalPrice = $(this).find("td[colname=TotalPrice]").text();
        //缺货编号
        var _LACKITEM_CODE = $(this).find("input:.lackcode").val();
        //缺货名称
        var _LACKITEM_NAME = $(this).find("input:.lackname").val();
        //缺货状态
        var _LACK_STATE = $(this).find("input:.lackstate").val();
        //备注  
        var _REMARK = $(this).find("td[colname=remark]").text();
        if ($.trim(_ITEM_CODE) != "" && $.trim(_ITEM_NAME) != "") {
            curRow = parseInt(curRow) + 1;
            //行号
            var N_ROW = curRow;
            //物料行对象
            var ItemList = {
                CN_S_ORDERCODE: OrderCode, //订单号
                CN_N_ROW: N_ROW, //行号
                CN_S_ITEM_CODE: _ITEM_CODE, //物料编码
                CN_S_ITEM_NAME: _ITEM_NAME, //物料名称
                CN_S_ITEM_MODEL: _ITEM_MODEL, //规格型号
                CN_F_QUANTITY: _QUANTITY, //数量
                CN_F_ADDUP_QUANTITY: "0.00",
                CN_S_ITEM_UNIT: _ITEM_UNIT, //计量单位
                CN_F_BUY_PRICE: _BUY_PRICE, //单价
                CN_F_DEPOSIT_RATE: _DEPOSIT_RATE, //折扣率
                CN_F_DEPOSIT_AMOUNT: _DEPOSIT_AMOUNT, //折扣额
                CN_F_BUY_TOTALPRICE: TotalPrice, //总价
                CN_F_DPTAFTER_SALES_TOTALPRICE: AfterTotalPrice, //折扣后总价
                CN_S_LACKITEM_CODE: _LACKITEM_CODE, //缺货编号
                CN_S_LACKITEM_NAME: _LACKITEM_NAME, //缺货名称
                CN_S_LACK_STATE: _LACK_STATE, //缺货状态
                CN_S_STATE: "新建",
                CN_F_STANDARDCOST:standardPrice,//标准成本
                CN_S_REMARK: _REMARK//备注  
            };
            //  alert(JSON.stringify(ItemList));
            ItemJsonStr += JSON.stringify(ItemList) + "|";
        }
    });

    $("#hdntblCartList").val(ItemJsonStr);
    flag = true;

    return flag;
}
//缓存其他费用
function SetOrderOtherCost() {
    //是否成功的标记
    var flag = false;
    var otherJsonStr = "";
    $("input:.othercost").each(function (index) {
        //其他费用对象
        var OtherCost = {
            CN_S_ORDERCODE: $("#txt_cn_s_Ordercode").val(), //订单号
            CN_S_C_CODE: $(this).attr("id"), //控件编号
            CN_S_C_NAME: $(this).attr("name"), //控件名称
            CN_F_AMOUNT: $(this).val(), //费用金额
            CN_N_ORDER: $(this).attr("order")//显示顺序 
        };
        //保存其他费用
        otherJsonStr += JSON.stringify(OtherCost) + "|";
    });

    $("#hdnOtherCost").val(otherJsonStr);
    flag = true;

    return flag;
}

//缓存企业单据主表
//function SetComOrderInfo() {
//    //是否成功标记
//    var flag = false;
//    var ComJsonStr = "";
//    ////订单号
//    var OrderCode = $("#txt_cn_s_Ordercode").val();
//    //总金额
//    var _Sum_totalprice = $("#txt_SumsaleTotalprice").val();
//    _Sum_totalprice = $.trim(_Sum_totalprice) == "" ? defaultfloat : $.trim(_Sum_totalprice);
//    //对象
//    var ComInfo = {
//        CN_S_ORDERCODE: OrderCode,
//        CN_F_TOTALPRICE: _Sum_totalprice,
//        CN_S_STATE: "新建"
//    };
//    ComJsonStr = JSON.stringify(ComInfo);
//    $("#hdnComInfo").val(ComJsonStr);
//    flag = true;
//    return flag
//}




function LoadReaddressHistory() {
    //保存行HTMl 
    //   var Html = '<tr><th width="140px">客户编号</th><th width="100px">客户名称</th><th width="60px">折扣率</th></tr>';
    var Html = ''; //  '<tr><th width="100px" align="center">客户名称</th></tr>';
    //获取列表
    $.ajax({
        type: "POST",
        url: "/AdminUI/AjaxPages/AddOrder.ashx",
        data: "Action=READDRESSLIST",
        async: false,
        beforeSend: function () {
            $("#tblReAddressList").empty()
        },
        success: function (result) {
            if (result != "") {
                //字符串转成Json对象 
                var data = (new Function("", "return " + result))();
                //遍历数据行
               //onclick="selItem_history(this)
                $.each(data.READDRESSLIST, function (i, n) {
                    Html += ' <tr>'; //onclick="selItem_history(this)"
                    //经销商编号 CN_S_CODE  
                    //     Html += '<td align="left">' + n.CN_S_CODE + '</td>';
                    //简称 CN_S_SHORTNAME
                    Html += '<td style="width:100%;padding:0px;" align="left" isdefault="' + n.CN_S_ISDEFAULT + '" allName="' + n.CN_S_DISTRICT + n.CN_S_READDRESS + '">&nbsp;&nbsp;' + GetLeftSubString(n.CN_S_DISTRICT + n.CN_S_READDRESS, 30) + '</td>';
                    Html += '</tr> ';

                });
            }

        }
    });
    if (Html != "") {
        $("#tblReAddressList").append(Html);
    }
    else {
        $("#tblReAddressList").append("<tr><td bgcolor='#FFFFFF' colspan='2' align='center' >暂无符合条件的数据！</td></tr>");
    }

    //绑定每行的单击事件
    $("#tblReAddressList tr").unbind("click").bind("click", function () {
        selReAddress_history(this);
    });

    // @绑定纵向滚动条
    $("#divClientData").unbind().niceScroll({
        cursorcolor: "#D1D1D4", //十六进制改变光标颜色，默认值是“＃000000” 
        cursorwidth: "3px", //像素光标的宽度，默认值为5（你可以写“加入5px”太）  
        autohidemode: false,  //一直显示
        horizrailenabled: false  //隐藏左右滚动条 
    });
}

//点击赋值
function selReAddress_history(obj) {
    //收货地址
    $("#txtReAddress").val($(obj).find('td').eq(0).attr("allName"));
    //隐藏
    $("#divReAddress").hide();
    $("#divClientData").getNiceScroll().resize();
}


//加载税率
function LoadTaxRate() {
 var Html = ''; //  '<tr><th width="100px" align="center">客户名称</th></tr>';
    //获取列表
 $.ajax({
     type: "POST",
     url: "/AdminUI/AjaxPages/AddOrder.ashx",
     data: "Action=TAXRATE",
     async: false,
     beforeSend: function () {
         $("#tblTaxRate").empty()
     },
     success: function (result) {
         if (result != "") {
             //字符串转成Json对象 
             var data = (new Function("", "return " + result))();
             //遍历数据行
             $.each(data.TAXRATELIST, function (i, n) {
                 Html += ' <tr>'; //onclick="selItem_history(this)"
                 //经销商编号 CN_S_CODE  
                 //     Html += '<td align="left">' + n.CN_S_CODE + '</td>';
                 //简称 CN_S_SHORTNAME
                 Html += '<td style="width:200px;padding:0px;" align="left" allName="' + n.ParamCode + '">&nbsp;&nbsp;' + n.ParamText + '</td>';
                 Html += '</tr> ';
//                 Html += "<p>" + n.ParamText + "</p>";
             });
         }

     }
 });
    if (Html != "") {

        $("#tblTaxRate").append(Html);
    }
    else {
        $("#tblTaxRate").append("<tr><td bgcolor='#FFFFFF' align='center' >暂无符合条件的数据！</td></tr>");
    }

    //绑定每行的单击事件
    $("#tblTaxRate tr").unbind("click").bind("click", function () {
        seltblTaxRate(this);
    });

    // @绑定纵向滚动条
//    $("#divClientData").unbind().niceScroll({
//        cursorcolor: "#D1D1D4", //十六进制改变光标颜色，默认值是“＃000000” 
//        cursorwidth: "3px", //像素光标的宽度，默认值为5（你可以写“加入5px”太）  
//        autohidemode: false,  //一直显示
//        horizrailenabled: false  //隐藏左右滚动条 
    //    });
}

//点击赋值
function seltblTaxRate(obj) {
    //收货地址
    $("#dpttax_rate").val($(obj).find('td').eq(0).attr("allName"));
    //隐藏
    $("#divTaxRateChoose").hide();
    totalItemRowsFund();
    //$("#divClientData").getNiceScroll().resize();
}



/* 新增收货地址 弹出对话框*/
function SelectAddReAddress() {
    $("#divReAddress").hide();
    $("#divClientData").getNiceScroll().resize();

    //显示进度条 
    parent.$("#divLoading").show();
    parent.$('#openFrameDiv').dialog({
        title: '新增收货地址',
        width: 750,
        height: 630,
        closed: false,
        cache: false,
        modal: true,
        maximizable: false,
        resizable: true,
        onClose: function () {
            parent.$('#openIframe')[0].src = "none.html";
        },
        buttons: null
    });
    parent.$('#openIframe')[0].src = "/AdminUI/DealerSale/AddReAddress.aspx";
    parent.$('#openFrameDiv').dialog('open');
}


//获得库存根据配件编号
function GetStockQuantity(obj) {
    var Code = $(obj).attr("code");
    var Name = $(obj).attr("name");
    //获得行号
    var row = $(obj).parent().attr("id");
    if (Code == "" || Code == null) {
        parent.ShowMsg("请输入配件编号!");
        return false;
    }
    else {
        $.colorbox({ href: "/AdminUI/DealerSale/StockInfo.aspx?code=" + escape(Code) + "&name=" + escape(Name)+"&Type=0&row="+escape(row), iframe: true, innerWidth: 545, innerHeight: 360 });
    }
}

