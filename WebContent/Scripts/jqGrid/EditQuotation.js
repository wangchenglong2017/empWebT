//根据报价单编号，得到报价单对应的物料行
function GetRowItemsByQuoteCode(QuoteCode, Quotetype) { 

  //获取初始化JSON列表 开始
    $.ajax({
        type: "POST",
        url: "/AdminUI/AjaxPages/AddQuotation.ashx",
        data: "Action=EDITITEMLIST&QUOTECODE=" + QuoteCode + "&Quotetype=" + Quotetype + "",
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
                  //      alert(ItemJson + '|' + n.row);
                        //从第一行开始
                        var startRow = parseInt(n.row) - 1;
                        //alert(startRow);
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
 
//根据报价单编号，得到报价单主表信息
function LoadQuoteHead(QuoteCode, QuoteType) { 

    //获取初始化JSON列表 开始
    $.ajax({
        type: "POST",
        url: "/AdminUI/AjaxPages/AddQuotation.ashx",
        data: "Action=GETHEADENTITY&QUOTECODE=" + QuoteCode + "",
        async: false,
        beforeSend: function () {
        },
        success: function (result) {
            if (result != "") {
                //字符串转成Json对象 
                var data = (new Function("", "return " + result))();
                //alert(result);
                if (data != null) { //有值
                    //报价单号
                    $("#txt_cn_s_quotecode").val(data.CN_S_QUOTECODE);
                    //客户编号
                    $("#hdnClientCode").val(data.CN_S_CUSTOMER_CODE)
                    //客户名称
                    $("#txt_ClientName").val(data.CN_S_CUSTOMER_NAME);
                    //折扣率
                    $("#txt_ClientDiscount").val(data.CN_F_DEPOSIT_RATE);
                    $("#txt_ClientDiscount").attr("oldvalue", data.CN_F_DEPOSIT_RATE);

                    //加价比
                    $("#txt_MarkUpRate").val(data.CN_F_MARKUP_RATE);
                    $("#txt_MarkUpRate").attr("oldvalue", data.CN_F_MARKUP_RATE);
                    //税率
                    $("#dpttax_rate ").val(data.CN_F_TAX_RATE);

                    //报价日期
                    if ("copy" != QuoteType) {
                        $("#txt_cn_t_tdate").val(JsonDateFormat(data.CN_T_TDATE));
                    }
                    //编制人
                    $("#txt_UserName").val(data.CN_S_CREATOR_NAME);

                    //备注
                    $("#textNote").val(data.CN_S_REMARK);
                    $("#hdnNote").val(data.CN_S_REMARK);
                    $("#aNoteDiv").attr("title", data.CN_S_REMARK);
                    if ($.trim(data.CN_S_REMARK) == "") {
                        $("#aNote").removeClass("note_hc").addClass("note_nc");
                    }
                    else {
                        $("#aNote").removeClass("note_nc").addClass("note_hc");
                    }
                    //税额
                    var tax_amount = parseFloat(data.CN_F_TAX_AMOUNT);
                    tax_amount = ForDight(tax_amount, 2);
                    $("#txt_tax_amount").val(tax_amount);
                    //不含税总金额
                    var ntax_totalamount = parseFloat(data.CN_F_NTAX_TOTALAMOUNT);
                    ntax_totalamount = ForDight(ntax_totalamount, 2);
                    $("#txt_ntax_totalamount").val(ntax_totalamount);
                    // 销售金额
                    var SumafterDepositTalprice = parseFloat(tax_amount.add(ntax_totalamount));
                    SumafterDepositTalprice = ForDight(SumafterDepositTalprice, 2);
                    $("#txt_SumafterDepositTalprice").val(SumafterDepositTalprice);

                }

            }

        }
    });


}









