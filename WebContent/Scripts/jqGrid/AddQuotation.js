
//开启进度条
function AjaxStart() {
    parent.$("#divLoading").show();
}
//隐藏进度条
function AjaxStop() {
    parent.$("#divLoading").hide();
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
    //便利行
    $("#tblItemRows>tbody>tr").each(function (i) {
        var flag = false;
        //当前行号
        var row = $(this).attr("id");
        //物料编码
        var itemCode = $("#txtIput" + row).val();
        if (itemCode != "") {
            //物料名称
            var itemName = $(this).find("td[colname=itemName]").find("span").text();
            //  alert(LocationCurrentRow + '| row:' + row);
            //物料编码包含
            if (itemCode.toUpperCase().indexOf(LocationKey.toUpperCase()) > -1 && parseInt(LocationCurrentRow) < parseInt(row)) {
                $("#txtIput" + row).css("color", "blue");
                flag = true;
            }
            else {
                $("#txtIput" + row).css("color", "");
                $(this).find("td[colname='itemName']").find("span").css("color", "");
            }

            //物料名称包含
            if (itemName.toUpperCase().indexOf(LocationKey.toUpperCase()) > -1 && parseInt(LocationCurrentRow) < parseInt(row)) {
                $(this).find("td[colname='itemName']").find("span").css("color", "red");
                flag = true;
            }
            else {
                $(this).find("td[colname='itemName']").find("span").css("color", "");
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
            //处发第一次单击
            if (parseInt(rowcount) == parseInt(StartLocationRow)) {
                $("#aLocationRow").trigger("click");
            }
        }

    });


} 


//加载客户信息客户
function LoadClient() {
    //报价编号
    var keyWord = $("#txtkeyWord").val();
    //保存行HTMl
    var Html = '';//  '<thead><tr><th width="100px">客户名称</th><th width="60px">折扣率</th></tr></thead><tbody>';
    //获取列表
    $.ajax({
        type: "POST",
        url: "/AdminUI/AjaxPages/AddQuotation.ashx",
        data: "Action=CLIENTLIST",
        async: false,
        beforeSend: function () {
            $("#tblClientList").empty()
        },
        success: function (result) {
            if (result != "") {
                //字符串转成Json对象 
                var data = (new Function("", "return " + result))();
                //遍历数据行
                $.each(data.CLIENTLIST, function (i, n) {
                    Html += ' <tr  name="' + n.CN_S_CODE + '">'; //onclick="selItem(this)"
                    //经销商编号 CN_S_CODE  
                    //  Html += '<td align="left">' + n.CN_S_CODE + '</td>';
                    //简称 CN_S_SHORTNAME
                    Html += '<td align="left" style="width:50%;padding:0px;" allName="' + n.CN_S_SHORTNAME + '">&nbsp;&nbsp;' + GetLeftSubString(n.CN_S_SHORTNAME, 14) + '</td>';
                    //折扣率 CN_S_DISCOUNT
                    Html += '<td align="center" style="width:25%; padding:0px;" >' + ForDight(parseFloat(n.CN_F_DISCOUNT).mul(100.0), 2) + '</td>';

                    Html += '<td align="center" style="width:25%; padding:0px;" >' + ForDight(parseFloat(n.CN_F_MARK_UP_RATIO).mul(100.0), 2) + '</td>';
                    Html += '</tr> ';

                });
            }

        }
    });
 //   Html += '<tr><td  bgcolor="#FFFFFF" colspan="2" align="center"><a href="javascript:void(0)" onclick="SelectAddClient();">新增客户</a></td></tr>';
    if (Html != "") {

        $("#tblClientList").append(Html);
    }
    else {
        $("#tblClientList").append("<tr><td bgcolor='#FFFFFF' colspan='2' align='center' >暂无符合条件的数据！</td></tr>");
    }

    // @绑定纵向滚动条
    $("#divClientData").unbind().niceScroll({
        cursorcolor: "#FF0000", //十六进制改变光标颜色，默认值是“＃000000” D1D1D4
        cursorwidth: "5px", //像素光标的宽度，默认值为5（你可以写“加入5px”太）  
        autohidemode: false,  //一直显示
        horizrailenabled: false  //隐藏左右滚动条 
    });
}

// @20140816 mdf by hhc 加载客户信息客户,拷贝报价单历史中用，不可同时新增
function LoadClient_SelHistory() {
    //报价编号
    var keyWord = $("#txtQuoteCode").val();
    //保存行HTMl 
 //   var Html = '<tr><th width="140px">客户编号</th><th width="100px">客户名称</th><th width="60px">折扣率</th></tr>';
    var Html = '';//  '<tr><th width="100px" align="center">客户名称</th></tr>';
    //获取列表
    $.ajax({
        type: "POST",
        url: "/AdminUI/AjaxPages/AddQuotation.ashx",
        data: "Action=CLIENTLIST",
        async: false,
        beforeSend: function () {
            $("#tblClientList").empty()
        },
        success: function (result) {
            if (result != "") {
                //字符串转成Json对象 
                var data = (new Function("", "return " + result))();
                //遍历数据行
                Html += '<tr><td></td></tr>'; //onclick="selItem_history(this)
                $.each(data.CLIENTLIST, function (i, n) {
                    Html += ' <tr>'; //onclick="selItem_history(this)"
                    //经销商编号 CN_S_CODE  
                    //Html += '<td align="left">' + n.CN_S_CODE + '</td>';
                    //简称 CN_S_SHORTNAME
                    Html += '<td style="width:200px;padding:0px;" align="left" allName="' + n.CN_S_SHORTNAME + '">&nbsp;&nbsp;' + GetLeftSubString(n.CN_S_SHORTNAME, 14) + '</td>';
                    Html += '</tr> ';

                });
            }

        }
    });
    if (Html != "") {

        $("#tblClientList").append(Html);
    }
    else {
        $("#tblClientList").append("<tr><td bgcolor='#FFFFFF' colspan='2' align='center' >暂无符合条件的数据！</td></tr>");
    }

    //绑定每行的单击事件
    $("#tblClientList tr").unbind("click").bind("click", function () {
        selItem_history(this);
    });

    // @绑定纵向滚动条
    $("#divClientData").unbind().niceScroll({
        cursorcolor: "#D1D1D4", //十六进制改变光标颜色，默认值是“＃000000”#D1D1D4 
        cursorwidth: "3px", //像素光标的宽度，默认值为5（你可以写“加入5px”太）  
        autohidemode: false,  //一直显示
        horizrailenabled: false  //隐藏左右滚动条 
    });
}

//点击赋值
function selClientItem(obj) {
    //客户编号
    var _ClientCode = $(obj).attr("name");
    if ("" == _ClientCode)
        return;

    $("#hdnClientCode").val(_ClientCode);
    //客户名称
    $("#txt_ClientName").val($(obj).find('td').eq(0).attr("allName")); 
    //加价比
    var MarkUpRate = $(obj).find('td').eq(2).html();
    $("#txt_MarkUpRate").val(ForDight(MarkUpRate, 2));
  //  $("#txt_MarkUpRate").attr("oldvalue", $(obj).find('td').eq(2).html());
    $("#txt_MarkUpRate").trigger("blur");

    //折扣率
    var depositRate = $(obj).find('td').eq(1).html();
    $("#txt_ClientDiscount").val(ForDight(depositRate, 2));
    // $("#txt_ClientDiscount").attr("oldvalue", $(obj).find('td').eq(2).html());
    $("#txt_ClientDiscount").trigger("blur");



    //隐藏
    $("#divCustomerChoose").hide();
    $("#divClientData").getNiceScroll().resize();
 
    //重新计算行合计
    totalItemRowsFund();    
}

//点击赋值
function selItem_history(obj) {
    //客户名称
    $("#txtClientName").val($(obj).find('td').eq(0).attr("allName"));
    //隐藏
    $("#divCustomerChoose").hide();
    $("#divClientData").getNiceScroll().resize();
}


//加载税率
function LoadTaxRate() {
    var Html = ''; //  '<tr><th width="100px" align="center">客户名称</th></tr>';
    //获取列表
    $.ajax({
        type: "POST",
        url: "/AdminUI/AjaxPages/CommonFun.ashx",
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
}

//点击赋值
function seltblTaxRate(obj) {
    //收货地址
    $("#dpttax_rate").val($(obj).find('td').eq(0).attr("allName"));
    //隐藏
    $("#divTaxRateChoose").hide();
    //重新计算
    totalItemRowsFund();
    
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
function SetQuoteHeadInofo() {
    //是否成功的标记
    var flag = false;
    // var tdate = eval('(' + '{Date:"' + $("#txt_cn_t_tdate").val() + '"}' + ')');  
      //是否成功的标记
    var flag = false;
    //主表Json主符串
    var HeadJsonStr = "";
    //默认数值类型
    var defaultfloat="0.00";
     //默认数值类型
    var defaultstr="";
   //税率
    var _tax_rate = $("#dpttax_rate").val();
    _tax_rate = $.trim(_tax_rate) == "" ? defaultfloat : $.trim(_tax_rate); 
    //加价比 
    var _cn_f_markup_rate = $("#txt_MarkUpRate").val();
    _cn_f_markup_rate = $.trim(_cn_f_markup_rate) == "" ? defaultfloat : $.trim(_cn_f_markup_rate);
    //税额
    var _tax_amount = $("#txt_tax_amount").val();
    _tax_amount = $.trim(_tax_amount) == "" ? defaultfloat : $.trim(_tax_amount);
    //折扣总金额
    var _deposit_totalprice = $("#txt_SumafterDepositTalprice").val();
    _deposit_totalprice = $.trim(_deposit_totalprice) == "" ? defaultfloat : $.trim(_deposit_totalprice); 
     //不含税总金额
    var ntax_totalamount = $("#txt_ntax_totalamount").val();
     ntax_totalamount = $.trim(ntax_totalamount) == "" ? defaultfloat : $.trim(ntax_totalamount); 
    //对象
    var QuoteHead = {
        CN_S_QUOTECODE: $("#txt_cn_s_quotecode").val(), //报价单号
        CN_S_CUSTOMER_CODE: $("#hdnClientCode").val(), //客户编号
        CN_S_CUSTOMER_NAME: $("#txt_ClientName").val(), //客户名称
        CN_F_DEPOSIT_RATE: $("#txt_ClientDiscount").val(), //折扣率
        CN_F_MARKUP_RATE: $("#txt_MarkUpRate").val(),
        CN_F_TAX_RATE: _tax_rate, //税率
        CN_F_TAX_AMOUNT: _tax_amount, //税额 
        CN_F_NTAX_TOTALAMOUNT: ntax_totalamount, //不含税总金额
        CN_S_CURRENCY_UNIT: "RMB", //货币单位
        CN_S_LACK_STATE: "0", // 缺货标志: 0未缺货
        CN_S_REMARK: $("#hdnNote").val()//备注
        //CN_T_TDATE: tdate //报价时间 
    };
    //  alert(JSON.stringify(QuoteHead)); 

    //保存主表信息
    HeadJsonStr = JSON.stringify(QuoteHead);
    $("#hdnHead").val(HeadJsonStr);
    flag = true;
    return flag 

}
 

//缓存物料行
function SetQuoteItems() {
    //是否成功的标记
    var flag = false;
    var ItemJsonStr = "";
    var curRow = 0;
    $("#tblItemRows>tbody>tr").each(function (index) {
        //当前行
        var row = parseInt(index) + 1;
        ////配件报价单号
        var _QuoteCode = $("#txt_cn_s_quotecode").val();
        if (_QuoteCode != "") {
            //物料编码
            var _ITEM_CODE = $("#txtIput" + row).val();
            //物料名称
            var _ITEM_NAME = $(this).find("td[colname=itemName]").find("span").text();
            //规格型号
            var _ITEM_MODEL = $(this).find("td[colname=itemModel]").text();
            //数量
            var _QUANTITY = $(this).find("td[colname=quantity]").text();
            //计量单位
            var _ITEM_UNIT = $(this).find("td[colname=itemUnit]").text();
            //采购单价
            var _BUY_PRICE = $(this).find("td[colname=buyPrice]").text();
            //加价比
            var _CN_F_MARKUP_RATE = $(this).find("td[colname=markuprate]").text();
            //销售单价
            var _SALE_PRICE = $(this).find("td[colname=salePrice]").text();
            //折扣率
            var _DEPOSIT_RATE = $(this).find("td[colname=depositRate]").text();
            //折扣额
            var _DEPOSIT_AMOUNT = $(this).find("td[colname=depositTalmount]").text();
            //折扣后销售总价
            var _DPTAFTER_SALES_TOTALPRICE = $(this).find("td[colname=afterDepositTalprice]").text();
            //毛利
            var _CN_F_GROSSPRICE = $(this).find("td[colname='grossprice']").text();
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
                    CN_S_QUOTECODE: _QuoteCode, //配件报价单号
                    CN_N_ROW: N_ROW, //行号
                    CN_S_ITEM_CODE: _ITEM_CODE, //物料编码
                    CN_S_ITEM_NAME: _ITEM_NAME, //物料名称
                    CN_S_ITEM_MODEL: _ITEM_MODEL, //规格型号
                    CN_F_QUANTITY: _QUANTITY, //数量
                    CN_S_ITEM_UNIT: _ITEM_UNIT, //计量单位
                    CN_F_BUY_PRICE: _BUY_PRICE, //采购单价
                    CN_F_MARKUP_RATE: _CN_F_MARKUP_RATE, //加价比     
                    CN_F_SALE_PRICE: _SALE_PRICE, //销售单价
                    CN_F_DEPOSIT_RATE: _DEPOSIT_RATE, //折扣率
                    CN_F_DEPOSIT_AMOUNT: _DEPOSIT_AMOUNT, //折扣额 
                    CN_F_DPTAFTER_SALES_TOTALPRICE: _DPTAFTER_SALES_TOTALPRICE, //折扣后销售总价
                    CN_F_GROSSPRICE: _CN_F_GROSSPRICE,
                    CN_S_LACKITEM_CODE: _LACKITEM_CODE, //缺货编号
                    CN_S_LACKITEM_NAME: _LACKITEM_NAME, //缺货名称
                    CN_S_LACK_STATE: _LACK_STATE, //缺货状态
                    CN_S_REMARK: _REMARK//备注  
                };
                //  alert(JSON.stringify(ItemList));
                ItemJsonStr += JSON.stringify(ItemList) + "|";
            }
        }
    });
    
    $("#hdntblCartList").val(ItemJsonStr);
    flag = true; 
     
    return flag;
}
//缓存其他费用
function SetQuoteOtherCost() {
    //是否成功的标记
    var flag = false;
    var otherJsonStr = "";
    $("input[gname='othercost']").each(function (index) {
        //其他费用对象
        var OtherCost = {
            CN_S_QUOTECODE: $("#txt_cn_s_quotecode").val(), //配件报价单号
            CN_S_CTL_CODE: $(this).attr("id"), //控件编号
            CN_S_CTL_NAME: $(this).attr("name"), //控件名称
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

//得到报价单号
function GetQuoteBillCode() {
    //获取列表
    $.ajax({
        type: "POST",
        url: "/AdminUI/AjaxPages/AddQuotation.ashx",
        data: "Action=NEWQUOTEBILLCODE",
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
                    $("#txt_cn_s_quotecode").val(data.Data);
                }
                else {
                    $("#txt_cn_s_quotecode").val("");
                    parent.ShowMsg(data.Data);
                }

            }

        }
    });


}

//保存报价单saveflag:保存后新增，保存；
function SaveQuoteInofo(saveflag) {
 //操作类型otype：add edit copy
 var otype=GetQueryString("type"); 
//报价单号
 var s_quotecode= $("#txt_cn_s_quotecode").val(); //报价单号 
 //客户名称
 var s_clientName = $("#txt_ClientName").val();  //客户名称
 //获得税率
 var taxRate = $("#dpttax_rate").val();   //税率
 //报价单号 不可为空
 if (s_quotecode == "") {
     parent.ShowMsg('报价单号不允许为空!');
     $("#txt_cn_s_quotecode").trigger("focus");
     return false;
 }
 else {
     if (otype != "edit") {
         //判断报价单号是否被占用
         $.ajax({
             type: "POST",
             url: "/AdminUI/AjaxPages/AddQuotation.ashx",
             data: "Action=EXISTQUOTEBILLCODE&QUOTECODE=" + s_quotecode + "",
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
                         GetQuoteBillCode();
                         //新的订单号
                         var newQuoteCode = $("#txt_cn_s_quotecode").val();
                         //弹出提示
                         parent.ShowMsg("报价单号（" + s_quotecode + "）已被占用，新的报价单号（" + newQuoteCode + "）已生成！请继续保存订单！");
                     }

                 }

             }
         });
     }
 
 } 

 //客户名称
 if (s_clientName == "") {
     parent.ShowMsg('客户名称不允许为空!');
     $("#txt_ClientName").trigger("focus");
     return false;
 }
 //税率
 if (taxRate == "" || taxRate == null) {
     parent.ShowMsg('请选择税率!');
     return false;
 }

 var itemflag = false;
 var imessage = ""; 
 //检查物料行
 $("#tblItemRows>tbody>tr").each(function (index) {
     //当前行
     var row = parseInt(index) + 1;
     ////配件报价单号
     var _QuoteCode = $("#txt_cn_s_quotecode").val();
     //行号
     //    var N_ROW = $(this).attr("id");
     var N_ROW = row;
     //物料编码
     var _ITEM_CODE = $("#txtIput" + row).val();
     //物料名称
     var _ITEM_NAME = $(this).find("td[colname=itemName]").find("span").text();
     //规格型号
     var _ITEM_MODEL = $(this).find("td[colname=itemModel]").text();
     //数量
     var _QUANTITY = $(this).find("td[colname=quantity]").text();
     //计量单位
     var _ITEM_UNIT = $(this).find("td[colname=itemUnit]").text();
     //采购单价
     var _BUY_PRICE = $(this).find("td[colname=buyPrice]").text();
     //加价比
     var _MarkUpRate = $(this).find("td[colname=markuprate]").text();
     //销售单价
     var _SALE_PRICE = $(this).find("td[colname=salePrice]").text();
     //折扣率
     var _DEPOSIT_RATE = $(this).find("td[colname=depositRate]").text();
     //折扣额
     var _DEPOSIT_AMOUNT = $(this).find("td[colname=depositTalmount]").text();
     //采购总金额
     //  var _BUY_TOTALPRICE = $(this).find("td[colname=buytTotalprice]").text();
     var _BUY_TOTALPRICE = 0.00;
     //销售总价
     // var _SALES_TOTALPRICE = $(this).find("td[colname=saleTotalprice]").text();
     var _SALES_TOTALPRICE =0.00;
     //折扣后销售总价
     var _DPTAFTER_SALES_TOTALPRICE = $(this).find("td[colname=afterDepositTalprice]").text();
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

         if ($.trim(_MarkUpRate) == "") {
             itemflag = true;
             $(this).find("td[colname=markuprate]").trigger("click");
             imessage = "请输入第（" + row + "）行加价比!";
             return false;
         } 
         if ($.trim(_SALE_PRICE) == "") {
             itemflag = true;
             $(this).find("td[colname=salePrice]").trigger("click");
             imessage = "请输入第（" + row + "）行销售单价!";
             return false;
         }
         if ($.trim(_QUANTITY) == "" || 0 == parseFloat($.trim(_QUANTITY))) {
             itemflag = true;
             $(this).find("td[colname=quantity]").trigger("click");
             imessage = "第（" + row + "）行的数量必须大于0!";
             return false;
         }
     }
 });

     //物料行检查
     if (itemflag && imessage!="") {
         parent.ShowMsg(imessage); 
         imessage = "";
         return false;
     }  
      //1、保存报价单主表json
       var Hflag = SetQuoteHeadInofo();   
     //2、保存物料行json
        var Itemflag = SetQuoteItems();
        //3、保存其他费用json
        var Costflag = SetQuoteOtherCost();
        //缓存成功
        if (Hflag && Itemflag && Costflag) {
           //保存save 保存后新增saveflag
            $("#hdnFlag").val(saveflag);
            //4、提交保存
            $("#frmAddQuote").submit();
            if (saveflag == "saveadd") {//保存
                $(".btnRight").find("a[id=btnsave]").text("保存中...");
                $(".btnRight").find("a[id=btnsave]").attr("disabled", "disabled");
            }
            else {//保存并关闭 saveflag=saveclose
                $(".btnRight").find("a[id=btnsaveadd]").text("保存中...");
                $(".btnRight").find("a[id=btnsaveadd]").attr("disabled", "disabled");
            }
        }
        else { //保存失败
            parent.ShowMsg("保存不成功!"); 
            return false;
        }

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
                      //RowCalculator(currentRow, "markuprate");
                  }
                  else {
                      parent.$("#tabs .panel:visible iframe")[0].contentWindow.SelectItemAddRow(currentRow, ItemJson);
                      //RowCalculator(currentRow, "markuprate");
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


/*复制报价单历史 弹出对话框*/
function CopyHistoryItemList() { 
    //显示进度条 
    parent.$("#divLoading").show();
    parent.$('#openFrameDiv').dialog({
        title: '复制报价单历史',
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
                    var row = $("#tblItemRows>tbody>tr>td").find("input[colname='inputItemCode'][value!='']").length;
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
    parent.$('#openIframe')[0].src = "/AdminUI/DealerSale/SelectHistoryItemList.aspx";
    parent.$('#openFrameDiv').dialog('open');
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
                    var row = $("#tblItemRows>tbody>tr>td").find("input[colname='inputItemCode'][value!='']").length;
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
    parent.$('#openIframe')[0].src = "/AdminUI/DealerSale/ImportItemList.aspx";
    parent.$('#openFrameDiv').dialog('open');
}

/*选择报价购物车弹出对话框*/
function SelectQuoteCartList() {
    //  var row = $("#tblItemRows>tbody>tr:has(td:has(div[code!='']))").length;
    var row = $("#tblItemRows>tbody>tr>td").find("input[colname='inputItemCode'][value!='']").length;
    
    //显示进度条 
    parent.$("#divLoading").show();
    parent.$('#openFrameDiv').dialog({
        title: '报价购物车',
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
                    var row = $("#tblItemRows>tbody>tr>td").find("input[colname='inputItemCode'][value!='']").length; 
                    //转化成数组
                    var currentRow = parseInt(row);
                    //得到JSON
                    var ItemJson = CartItemArray[i].JsonStr;
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
    parent.$('#openIframe')[0].src = "/AdminUI/DealerSale/SelectQuoteCart.aspx";
    parent.$('#openFrameDiv').dialog('open');
}

/* 新增客户 弹出对话框*/
function SelectAddClient() {
    $("#divCustomerChoose").hide();
    $("#divClientData").getNiceScroll().resize();

    //显示进度条 
    parent.$("#divLoading").show();
    parent.$('#openFrameDiv').dialog({
        title: '新增客户',
        width: 350,
        height: 360,
        closed: false,
        cache: false,
        modal: true,
        maximizable: false,
        resizable: true,
        onClose: function () {
            parent.$('#openIframe')[0].src = "none.html";
        },
        buttons:null
    });
    parent.$('#openIframe')[0].src = "/AdminUI/DealerSale/AddClient.aspx";
    parent.$('#openFrameDiv').dialog('open');
}

/* 新增缺货登记 弹出对话框*/
function SelectLackItems(row,defaultvalue) {
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
    parent.$('#openIframe')[0].src = "/AdminUI/DealerSale/ShortageAdd.aspx?row=" + row + "&defaultvalue=" + defaultvalue;
    parent.$('#openFrameDiv').dialog('open');
}


//获得库存根据配件编号
//onOpen:function(){ alert('onOpen: colorbox is about to open'); },
//onLoad:function(){ alert('onLoad: colorbox has started to load the targeted content'); },
//onComplete:function(){ alert('onComplete: colorbox has displayed the loaded content'); },
//onCleanup:function(){ alert('onCleanup: colorbox has begun the close process'); },
//onClosed:function(){ alert('onClosed: colorbox has completely closed'); }
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
        $.colorbox({
            href: "/AdminUI/DealerSale/StockInfo.aspx?code=" + escape(Code) + "&name=" + escape(Name) + "&Type=0&row=" + escape(row),
            iframe: true,
            innerWidth: 545,
            innerHeight: 360
//            onClosed: function () {
//                //var value = $("#colorboxIframe")[0].window.$("#hdnStockNum]").val();
//                var value = window.top.$("#hdnStockNum]").val(); 
//                alert(value);
//            }


        });
    }
}

