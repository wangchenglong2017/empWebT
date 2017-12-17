

//绑带指定行 单元格单击
var tflag = false;
var _inputObj = null; 
function BingCellClick(row) {
    //卸载单价事件
    $("#" + row + " td.inputobj").unbind("click");
    //给这些单元格注册鼠标点击事件
    $("#" + row + " td.inputobj").click(function () {//给页面中的modelname的标签加上click事件 
        //当前行的ITEM编号
        var itemCode = $.trim($("#txtIput" + row).val());
        // alert(row);
        var objTD = $(this);
        //点击后，内容变成文本框  
        var oldText = $.trim($(this).text());  //保存原来的文本   

        //列名u
        var colname = $(this).attr("colname");
        var input = $("<input type='text'  value='" + oldText + "'/>"); //文本框的html代码  
        objTD.html(input);  //td变为文本 

        //设置文本框的点击事件失效  
        input.click(function () {
            return false;
        });
        //设置文本框的样式  
        input.attr("style", "border:0px solid #d7d7d7;margin:0 auto;color:black;height:15px;width:95%;");

        input.trigger("focus").trigger("select"); //全选 

        // @20140820 MDF BY HHC 备注字段通过改事件，控制长度
        //设置除备注字段外，其他文本框只能输入数字与小数点
        if (colname != "remark") {
            input.unbind("keyup cut paste");
            input.keyup(function () {
                //得到ITEM编号
                var itemCode = $("#txtIput" + row).val();
                if (itemCode == "") {
                    parent.ShowMsg('第' + row + '行,请选输入配件编号!');
                    input.val("");
                    $("#txtIput" + row).trigger("focus");
                    return false;
                }
                //this.value = this.value.replace(/[^\d.]/g, "");
                ////必须保证第一个为数字而不是.
                //this.value = this.value.replace(/^\./g, "");
                ////保证只有出现一个.而没有多个.
                //this.value = this.value.replace(/\.{2,}/g, ".");
                ////保证.只出现一次，而不能出现两次以上
                //this.value = this.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
                LimitPositiveNumber($(this));
            }).bind("cut paste", function () {  //CTR+V事件处理   
                setTimeout(function () {
                    $(input).val($(input).val().replace(/[^0-9.]/g, ''));
                }, 100);

            }).css("ime-mode", "disabled"); //CSS设置输入法不可用   
        }

        if (colname == "remark") {
            input.unbind("keydown");
            input.keydown(function () {

                //得到ITEM编号
                var itemCode = $("#txtIput" + row).val();
                if (itemCode == "") {
                    parent.ShowMsg('第' + row + '行,请选输入配件编号!');
                    input.val("");
                    $("#txtIput" + row).trigger("focus");
                    return false;
                }
            });

            input.unbind("keyup paste");
            input.bind("keyup", function () {
                LimitStringLength(this, 32);
                replaceSpecialSymbol(this);
            });

            input.unbind("cut paste");
            input.bind("cut paste", function () {
                setTimeout(function () {
                    LimitStringLength(input, 32);
                    replaceSpecialSymbol(input);
                }, 100);
            });
        }

        input.unbind("blur");
        //文本框失去焦点的时候变为文本  
        var colname = $(this).attr("colname");

        input.blur(function () {
            var msg = "";
            var newText = $(this).val();

            if (colname != "remark") {

                if (itemCode != "" && newText != "") {
                    // 格式化，仅取两位小数
                    newText = parseFloat(newText);
                    newText = ForDight(newText, 2);
                    $("#" + row).find("td[colname=" + colname + "]").text(newText);
                }
            }

            var input_blur = $(this);
            //采购单价
            var buyPrice = $("#" + row).find("td[colname='buyPrice']").text();
            //采购单价
            var grossprice = $("#" + row).find("td[colname='grossprice']").text();
            //销售单价
            var salePrice = newText;
            //销售单价小于采购单价给出提示
            if (itemCode != "" && colname == "salePrice" && parseFloat(buyPrice) > parseFloat(salePrice)) {
                parent.ShowMsg('第' + row + '行销售单价小于采购单价,已标记为红色显示!');
                $("#" + row).find("td[colname=salePrice]").css("color", "#FF0000");
                $(this).trigger("focus").trigger("select");
                //return false;
            }
            else if ((itemCode != "" && colname == "salePrice" && parseFloat(buyPrice) < parseFloat(salePrice))) {
                $("#" + row).find("td[colname=salePrice]").css("color", "#000000");
            }

            var flag = true;
            // 折扣额大于销售金额
            if (colname == "depositTalmount") {
                //折扣额
                var depositTalmount = newText;
                //销售总价
                var saleTotalprice = $("#" + row).find("td[colname=saleTotalprice]").text();
                if (parseFloat(depositTalmount) > parseFloat(saleTotalprice)) {
                    flag = false;
                }
            }

            if (itemCode != "" && !flag) {
                parent.ShowMsg('第' + row + '行折扣额大于销售总额!');
                $("#" + row).find("td[colname=depositTalmount]").click();
                $(this).trigger("focus").trigger("select");
                //  return false;
            }
            //当原来的名称与修改后的名称不同时才进行数据库提交操作  
            if (oldText != newText) {
                // 新值
                objTD.html($.trim(newText));

                // 备注列，同时影响title属性
                if (colname == "remark" || colname == "itemName") {
                    objTD.attr("title", $.trim(newText));
                }
                //计算数值
                RowCalculator(row, colname);
            }
            else {
                //前后文本一样，将文本宽变成标签  
                objTD.html($.trim(oldText));
            }
        }); //结束 文本框失去焦点的时候变为文本   

    });                                                                // 结束  给这些单元格注册鼠标点击事件  

}


//当前行对象 row：当前修改的行，修改的当前字段
function RowCalculator(row, colname) {
    //默认数值类型
  //  var defaultfloat = "0.00";
    //采购单价
    var buyPrice = $("#" + row).find("td[colname='buyPrice']").text();
    //加价比
    var MarkUpRate = $("#" + row).find("td[colname='markuprate']").text();
    //销售单价
    var salePrice = $("#" + row).find("td[colname='salePrice']").text();
    //数量
    var quantity = $("#" + row).find("td[colname='quantity']").text();
    //采购总价
//    var buytTotalprice = $("#" + row).find("td[colname='buytTotalprice']").text();
    //销售总价
    var saleTotalprice = 0.00; 
    if (salePrice != "" && quantity!="")
    {
     // @20140818 MDF BY jxj 数字运算，采用函数        
        salePrice = parseFloat(salePrice);
        quantity = parseFloat(quantity); 
        //销售总价
        saleTotalprice = salePrice.mul(quantity);  
    } 

    //折扣率
    var depositRate = $("#" + row).find("td[colname='depositRate']").text();
    //折扣额
    var depositTalmount = $("#" + row).find("td[colname='depositTalmount']").text();
    //折扣后总金额
    var afterDepositTalprice = $("#" + row).find("td[colname='afterDepositTalprice']").text();
    //修改销售单单价，得到总价
    if (salePrice != "" && colname == "salePrice") {
        salePrice = parseFloat(salePrice);
        // 更改销售单价
        $("#" + row).find("td[colname='salePrice']").text(ForDight(salePrice, 2));
        var _markuprate = "0";
        buyPrice = parseFloat(buyPrice);
        //采购单价如果采购单价为空或0则加价比为0
        if (buyPrice != "" && buyPrice != "0") {
            _markuprate = parseFloat((salePrice.div(buyPrice))-1).mul(100.00);
        }
        //赋值加价比
        $("#" + row).find("td[colname='markuprate']").text(ForDight(parseFloat(_markuprate), 2));
    }
    //格式化数量为两位小数
    if (quantity != "" && colname == "quantity") {
        quantity = parseFloat(quantity);
        // 更改数量
        $("#" + row).find("td[colname='quantity']").text(ForDight(quantity, 2));
    }

    //1、修改加价比
    if (buyPrice != "" && parseFloat(buyPrice)>0 && colname == "markuprate") {
        if (MarkUpRate == "") {
            MarkUpRate = 0;
            //赋值加价比
            $("#" + row).find("td[colname='markuprate']").text(ForDight(parseFloat(MarkUpRate), 2));
        }
        var t_salePrice = parseFloat(buyPrice).mul(1 + parseFloat(MarkUpRate).div(100.00));
        $("#" + row).find("td[colname='salePrice']").text(ForDight(t_salePrice, 2));
        $("#" + row).find("td[colname='salePrice']").css("color", "");
        if (t_salePrice != "" && quantity != "") {
            // @20140818 MDF BY jxj 数字运算，采用函数        
            salePrice = parseFloat(t_salePrice);
            quantity = parseFloat(quantity);
            //销售总价
            saleTotalprice = salePrice.mul(quantity);
        }
        //总价不为空，计算折扣额 
        if (saleTotalprice != "") {           
            saleTotalprice = parseFloat(saleTotalprice);
            depositRate = parseFloat(depositRate);
            if (0 == depositRate)
                depositRate = 100.00;
            depositRate = depositRate.div(100.00);
            //折扣后总金额
            var _afterDepositTalprice = saleTotalprice.mul(depositRate);
            //得到折扣额  销售总价-(销售总价*折扣率)
            var _depositTalmount = saleTotalprice.sub(_afterDepositTalprice);
            //毛利
            var _tbuyprice = parseFloat(buyPrice).mul(parseFloat(quantity));
            var _grossprice = parseFloat(_afterDepositTalprice).sub(parseFloat(_tbuyprice)); 
            //赋值折扣后总金额
            $("#" + row).find("td[colname='afterDepositTalprice']").text(ForDight(_afterDepositTalprice, 2));
            //赋值折扣额
            $("#" + row).find("td[colname='depositTalmount']").text(ForDight(_depositTalmount, 2));
            //毛利 
            $("#" + row).find("td[colname='grossprice']").text(ForDight(_grossprice, 2));
        }

    }
    //2、修改销售单价与数据的时候
    else if (salePrice != "" && quantity != "" && (colname == "salePrice" || colname == "quantity")) { //修改销售单击或数量，得到总价
        salePrice = parseFloat($("#" + row).find("td[colname='salePrice']").text());
        quantity = parseFloat($("#" + row).find("td[colname='quantity']").text());
        //修改的是数量
        if (buyPrice != "" && parseFloat(buyPrice) > 0) {
            //计算总价
            buyPrice = parseFloat(buyPrice);
            var _buytTotalprice = buyPrice.mul(quantity);
            _markuprate = MarkUpRate;
            //格式化采购总价
            _buytTotalprice = ForDight(_buytTotalprice, 2);
            //计算加价比
            if (colname == "salePrice" && parseFloat(buyPrice) != 0) {
                if (parseFloat(_markuprate) == 100) {
                    _markuprate = 0.00;
                }  
                //销售价与采购价差价
                var chaValue = parseFloat(salePrice).sub(buyPrice); 
                //加价比
                //var markuprate = parseFloat(chaValue).div(buyPrice); 
                var markuprate=parseFloat((salePrice.div(buyPrice)) - 1).mul(100.00)
                //赋值加价比
                $("#" + row).find("td[colname='markuprate']").text(ForDight(markuprate, 2));
            } //计算加价比 结束
        } //修改的是数量 结束  
         if (saleTotalprice != "" && quantity != "") {
            // @20140818 MDF BY jxj 数字运算，采用函数        
            salePrice = parseFloat(salePrice);
            quantity = parseFloat(quantity);
            //销售总价
            saleTotalprice = salePrice.mul(quantity);
        } 

        if (saleTotalprice != "") { //总价不为空，计算折扣额           
            saleTotalprice = parseFloat(saleTotalprice);
            depositRate = parseFloat(depositRate);
            if (0 == depositRate)
                depositRate = 100.00;
            depositRate = depositRate.div(100.00);
            //折扣后总金额
            var _afterDepositTalprice = saleTotalprice.mul(depositRate);
            //得到折扣额  销售总价-(销售总价*折扣率)
            var _depositTalmount = saleTotalprice.sub(_afterDepositTalprice); 
            //赋值折扣后总金额
            $("#" + row).find("td[colname='afterDepositTalprice']").text(ForDight(_afterDepositTalprice, 2));
            //赋值折扣额
            $("#" + row).find("td[colname='depositTalmount']").text(ForDight(_depositTalmount, 2));
            //毛利=赋值折扣后总金-(采购单击*数量)
            var _grossprice = parseFloat(_afterDepositTalprice).sub(parseFloat(buyPrice).mul(quantity));
            //毛利
            $("#" + row).find("td[colname='grossprice']").text(ForDight(_grossprice, 2));
            
        }
    }
    else if (saleTotalprice != "" && colname == "depositRate") { //总价不为空，修改折扣率，计算折扣额
      
        //得到折扣额
        saleTotalprice = parseFloat(saleTotalprice);
        if (depositRate == "") {
            depositRate = ForDight(parseFloat(0), 2);
        }
        depositRate = parseFloat(depositRate);
        // 赋值折扣率
        $("#" + row).find("td[colname=depositRate]").text(ForDight(depositRate, 2));

        if (0 == parseFloat(depositRate))
            depositRate = 100.00;
        // 转化折扣率
        depositRate = depositRate.div(100.00); 
        //折扣后总金额
        var _afterDepositTalprice = saleTotalprice.mul(depositRate);
        //得到折扣额  销售总价-(销售总价*折扣率)
        var _depositTalmount = saleTotalprice.sub(_afterDepositTalprice); 
        //赋值折扣后总金额
        $("#" + row).find("td[colname=afterDepositTalprice]").text( ForDight(_afterDepositTalprice, 2));  
        //赋值折扣额
        $("#" + row).find("td[colname=depositTalmount]").text(ForDight(_depositTalmount, 2));
        //得到最新的数量
        quantity = parseFloat($("#" + row).find("td[colname='quantity']").text());
        //毛利=赋值折扣后总金-(采购单击*数量)
        var _grossprice = parseFloat(_afterDepositTalprice).sub(parseFloat(buyPrice).mul(quantity));
        //赋值毛利
        $("#" + row).find("td[colname='grossprice']").text(ForDight(_grossprice, 2));
 

    }
    else if (saleTotalprice != "" && colname == "depositTalmount") { //总价不为空，修改折扣额，计算折扣率

        saleTotalprice = parseFloat(saleTotalprice);
        if (depositTalmount == "") {
            depositTalmount = parseFloat(0);
        }
        depositTalmount = parseFloat(depositTalmount);
       
        if (depositTalmount > saleTotalprice) {//防止折扣额输入过大出现折扣率为负值
            parent.ShowMsg("折扣额不能大于销售单价乘以数量!");
            //折扣率
            var depositRate = $("#" + row).find("td[colname='depositRate']").text();
            depositRate = parseFloat(depositRate);
            if (0 == depositRate)
                depositRate = 100.00;
            // 转化折扣率
            depositRate = depositRate.div(100.00);
            //折扣后总金额
            var _afterDepositTalprice = saleTotalprice.mul(depositRate);
            //得到折扣额  销售总价-(销售总价*折扣率)
            var _depositTalmount = saleTotalprice.sub(_afterDepositTalprice);
            _depositTalmount = parseFloat(_depositTalmount);
            
            $("#" + row).find("td[colname=depositTalmount]").text(depositTalmount = ForDight(_depositTalmount, 2));
            return;
        }
        //赋值折扣额
        $("#" + row).find("td[colname=depositTalmount]").text(depositTalmount = ForDight(depositTalmount, 2));
        //得到折扣率
        var _depositRate = parseFloat(saleTotalprice.sub(depositTalmount));
        _depositRate = _depositRate.mul(100.00);
        _depositRate = parseFloat(_depositRate).div(saleTotalprice); 
        //折扣率
        $("#" + row).find("td[colname=depositRate]").text(ForDight(_depositRate, 2));
        //折扣后总金额
        var _afterDepositTalprice = saleTotalprice.sub(depositTalmount); 
        //赋值折扣后总金额
        $("#" + row).find("td[colname='afterDepositTalprice']").text(ForDight(_afterDepositTalprice, 2)); 

        //得到最新的数量
        quantity = parseFloat($("#" + row).find("td[colname='quantity']").text());
        //毛利=折扣后总金额-(采购单价*数量)
        var _grossprice = parseFloat(_afterDepositTalprice).sub(parseFloat(buyPrice).mul(quantity));
        //赋值毛利
        $("#" + row).find("td[colname='grossprice']").text(ForDight(_grossprice, 2));

    }
    //重新计算合计
    totalItemRowsFund();
}



//绑定自动完成
function BindingAutoComplete(row) {
    $("#txtIput" + row).autocomplete("../AjaxPages/QuotationList.ashx", {
        minChars: 0,
        max: 10,
        width: 512,
        autoFill: false,
        scroll: false,
        scrollHeight: 500,
        dataType: "json", //json类型
        matchContains: true,
        rownum: row,
        extraParams: { param: function () { return $("#txtIput" + row).val(); } },
        //需要把data转换成json数据格式
        parse: function (data) {
            if (data != "false") {
                //字符串转成Json对象 
                // var data = (new Function("", "return " + data))(); 
                return $.map(eval(data), function (row) {
                    return {
                        data: row,
                        value: row.VALUE,
                        result: row.TEXT + row.VALUE
                        // result: "<table width='512px'><tr><td align='left'>" + row.VALUE + "</td><td align='left'>" + row.TEXT + "</td><td align='left'>" + row.ParamVauleB + "</td><td align='right'>" + row.ParamVaule + "</td><td align='center'><font style='color: #009933; font-family: 黑体; font-style: italic'>" + row.ParamVauleA + "</font></td></tr></table>"
                    }
                });
            }
        },
        formatItem: function (data, i, total) {
            //规格型号
            var _itemModel = data.ParamVauleB == null ? "&nbsp;" : data.ParamVauleB;
            return "<table width='512px'><tr><td align='left' width='160px'>" + data.VALUE + "</td><td align='left' width='120px'>" + data.TEXT + "</td><td align='left'>" + _itemModel + "</td><td align='center' width='60px'>" + data.ParamVaule + "</td><td align='center' width='60px'>" + data.ParamVauleA + "</td></tr></table>";

        },
        formatMatch: function (data, i, total) {
            //return data.VALUE + data.TEXT;
        },
        formatResult: function (data, value) {

        },
        nodatatip: function () {
            CheckItemCode(row)
        }
    }).result(function (event, data, formatted) { //回调
        //空
        var defaultStr = "";
        var divitemcode = $("#" + row).find("div[colname='divcode']").attr("code");

        //已存在
        if (TblisExistItemCode(data.VALUE) && data.VALUE != divitemcode) {
            //信息提示
            parent.ShowMsg('配件编号[' + data.VALUE + ']已存在！');
            //编号
            $("#" + row).find("div[colname='divcode']").attr("code", defaultStr);
            //编号
            $("#txtIput" + row).val(defaultStr);
            //名称
            // $("#" + row).find("td[colname='itemName']").text(defaultStr);
            $("#" + row).find("td[colname='itemName']").find("span").text(defaultStr);
            $("#" + row).find("td[colname='itemName']").find("span").attr("title", defaultStr);
            //买入单价
            $("#" + row).find("td[colname='buyPrice']").text(defaultStr);
            //单位
            $("#" + row).find("td[colname='itemUnit']").text(defaultStr);
            //规格型号 
            $("#" + row).find("td[colname='itemModel']").text(defaultStr);
            // 销售单价
            $("#" + row).find("td[colname='salePrice']").text(defaultStr);
            // 数量
            $("#" + row).find("td[colname='quantity']").text(defaultStr);
            // 毛利
            $("#" + row).find("td[colname='grossprice']").text(defaultStr);
            //库存
            $("#" + row).find("td[colname=stockQuantity]").attr("code", defaultStr);
            $("#" + row).find("td[colname=stockQuantity]").attr("name", defaultStr);
            //
           



        }
        else {
            //编号
            $("#txtIput" + row).val(data.VALUE);
            $("#" + row).find("div[colname='divcode']").attr("code", data.VALUE);
            //名称 
            $("#" + row).find("td[colname='itemName']").find("span").text(data.TEXT);
            $("#" + row).find("td[colname='itemName']").find("span").attr("title", data.TEXT);
            //买入单价
            $("#" + row).find("td[colname='buyPrice']").text(ForDight(parseFloat(data.ParamVaule), 2));
            //单位
            $("#" + row).find("td[colname='itemUnit']").text(data.ParamVauleA);
            //规格型号
            var _itemModel = data.ParamVauleB == null ? "" : data.ParamVauleB;
            $("#" + row).find("td[colname='itemModel']").text(_itemModel);
            //库存
            $("#" + row).find("td[colname=stockQuantity]").attr("code", data.VALUE);
            $("#" + row).find("td[colname=stockQuantity]").attr("name", data.TEXT);
            // 加价比
            $("#" + row).find("td[colname='markuprate']").text($("#txt_MarkUpRate").val());
            //折扣率
            $("#" + row).find("td[colname=depositRate]").text($("#txt_ClientDiscount").val());
            //加价比
            var _markuprate = $("#" + row).find("td[colname='markuprate']").text();
            // 毛利
            $("#" + row).find("td[colname='grossprice']").text(defaultStr);
            //折扣额
            $("#" + row).find("td[colname='depositTalmount']").text(defaultStr);
            //销售金额
            $("#" + row).find("td[colname='afterDepositTalprice']").text(defaultStr);
            
            //买入价
            var _buyPrice = $("#" + row).find("td[colname='buyPrice']").text();
            if (_buyPrice != "" && parseFloat(_buyPrice) > 0 && _markuprate != "" && parseFloat(_markuprate) > 0) {

                if (parseFloat(_markuprate) == 100) {
                    _markuprate = 0.00;
                }
                var t_salePrice = parseFloat(_buyPrice).mul(1 + parseFloat(_markuprate).div(100.00));
                if (parseFloat(t_salePrice) >= 0) {
                    $("#" + row).find("td[colname='salePrice']").text(ForDight(parseFloat(t_salePrice), 2));
                }

            }
            else {
                // 销售单价
                $("#" + row).find("td[colname='salePrice']").text("");
            }
            // 数量
            $("#" + row).find("td[colname='quantity']").text("");
            //缺货编号 
            $("#hdnLackCode" + row).val(data.VALUE);
            //缺货登记ITEM名称  
            $("#hdnLackName" + row).val(data.TEXT);
            //缺货登记ITEM状态 
            $("#hdnLackState" + row).val(data.ParamVauleC);

            var lackHtml = '';
            var lackTitle = '';
           
            if (data.ParamVauleC == "N") {
                lackHtml = "lackstatus_w";
                lackTitle = "缺件待处理";
                //缺货登记ITEM状态 
                $("#hdnLackState" + row).val("1");
            }
            else if (data.ParamVauleC == "Y") {
                lackHtml = "lackstatus_g";
                lackTitle = "缺件已处理为：[ " + data.ParamVauleD + " ]";
                //已存在
                if (data.ParamVauleD != "") {
                    //信息提示
                    if (TblisExistItemCode(data.ParamVauleD)) {
                        //配件编号已存在
                        parent.ShowMsg('配件编号[' + data.ParamVauleD + ']]已存在！');
                        //编号
                        $("#" + row).find("div[colname='divcode']").attr("code", defaultStr);
                        //编号
                        $("#txtIput" + row).val(defaultStr);
                        //名称
                        // $("#" + row).find("td[colname='itemName']").text(defaultStr);
                        $("#" + row).find("td[colname='itemName']").find("span").text(defaultStr);
                        $("#" + row).find("td[colname='itemName']").find("span").attr("title", defaultStr);
                        //买入单价
                        $("#" + row).find("td[colname='buyPrice']").text(defaultStr);
                        //单位
                        $("#" + row).find("td[colname='itemUnit']").text(defaultStr);
                        //规格型号 
                        $("#" + row).find("td[colname='itemModel']").text(defaultStr);
                        // 销售单价
                        $("#" + row).find("td[colname='salePrice']").text(defaultStr);
                        // 数量
                        $("#" + row).find("td[colname='quantity']").text(defaultStr);
                        // 毛利
                        $("#" + row).find("td[colname='grossprice']").text(defaultStr);
                        //库存
                        $("#" + row).find("td[colname=stockQuantity]").attr("code", defaultStr);
                        $("#" + row).find("td[colname=stockQuantity]").attr("name", defaultStr);

                        return;
                    }
                }

                //编号
                $("#txtIput" + row).val(data.ParamVauleD);
                $("#" + row).find("div[colname='divcode']").attr("code", data.ParamVauleD);
                /* ITEM 离开 判断数据库是否存在 */
                ItemCodeBlur(data.VALUE, row);
            }
            //标识
            $("#" + row).find("td[colname='itemName']").find("a").attr("class", lackHtml);
            $("#" + row).find("td[colname='itemName']").find("a").attr("title", lackTitle);

            //重新计算合计
            totalItemRowsFund();
        }

    })
}


//检查物料编码是否存在
function CheckItemCode(row) {
    var str = false;
    //物料编码
    var itemCode = $.trim($("#txtIput" + row).val());
    var divitemcode = $("#" + row).find("div[colname='divcode']").attr("code");
    //物料名称
    var itemName = $.trim($("#" + row).find("td[colname='itemName']").find("span").text());

    //空
    var defaultStr = "";

    if (divitemcode == itemCode)
        return;
     //已存在
    if (itemCode != "" && divitemcode != itemCode) {
        //信息提示
        if (TblisExistItemCode(itemCode)) {
            parent.ShowMsg('配件编号[' + itemCode + ']]已存在！');
            $("#txtIput" + row).val("");
            $("#" + row).find("div[colname='divcode']").attr("code", "");
            return;
        }
    }
    /* ITEM 离开 判断数据库是否存在 */
    ItemCodeBlur(itemCode, row);
   
}
/* ITEM 离开 判断数据库是否存在 */
function ItemCodeBlur(itemCode, row) {
    //空
    
    var defaultStr = "";
  //物料编码不可为空
    if ($.trim(itemCode) != "") {
        $.ajax({
            type: "POST",
            url: "/AdminUI/AjaxPages/QuotationList.ashx",
            data: "Action=ISEXISTITEMCODE&ItemCode=" + escape(itemCode) + "",
            async: false,
            success: function (result) {
                if (result != "false") {
                    //字符串转成Json对象 
                    var data = (new Function("", "return " + result))();
                    //编号
                    $("#" + row).find("div[colname='divcode']").attr("code", data.itemCode);
                    //编号
                    $("#txtIput" + row).val(data.itemCode);
                    //名称
                    $("#" + row).find("td[colname='itemName']").find("span").text(data.itemName);
                    $("#" + row).find("td[colname='itemName']").find("span").attr("title", data.itemName);
                    //买入单价
                    $("#" + row).find("td[colname='buyPrice']").text(ForDight(parseFloat(data.buyPrice), 2));
                    //单位
                    $("#" + row).find("td[colname='itemUnit']").text(data.itemUnit);
                    //规格型号
                    var _itemModel = data.itemModel == null ? "" : data.itemModel;
                    $("#" + row).find("td[colname='itemModel']").text(_itemModel);
                    // 销售单价
                    $("#" + row).find("td[colname='salePrice']").text(defaultStr);
                    // 加价比
                    $("#" + row).find("td[colname='markuprate']").text($("#txt_MarkUpRate").val());
                    //采购单价为0 则销售单价为0
                    if (parseFloat($("#" + row).find("td[colname='buyPrice']").text()) == 0) {
                        $("#" + row).find("td[colname='salePrice']").text(defaultStr);
                    }
                    else {//采购单价部不为0

                        if (parseFloat($("#" + row).find("td[colname='markuprate']").text()) == 0) {
                            //如果加价比为0,销售单价等于采购单价
                            $("#" + row).find("td[colname='salePrice']").text(defaultStr);
                        }
                        else {
                            var t_salePrice = parseFloat($("#" + row).find("td[colname='buyPrice']").text()).mul(1 + parseFloat($("#" + row).find("td[colname='markuprate']").text()).div(100.00));

                            $("#" + row).find("td[colname='salePrice']").text(ForDight(parseFloat(t_salePrice), 2));
                        }
                    }
                    //折扣率
                    $("#" + row).find("td[colname=depositRate]").text($("#txt_ClientDiscount").val());
                    // 毛利
                    $("#" + row).find("td[colname='grossprice']").text(defaultStr);
                    // 数量
                    $("#" + row).find("td[colname='quantity']").text(defaultStr);
                    //备注
                    $("#" + row).find("td[colname=remark]").text(defaultStr);
                    //库存
                    $("#" + row).find("td[colname=stockQuantity]").attr("code", data.itemCode);
                    $("#" + row).find("td[colname=stockQuantity]").attr("name", data.itemName);

                    var lackHtml = '';
                    var lackTitle = '';
                    var lackcode = '';
                    //  缺货未处理
                    if (data.lackstate == "YN") {
                        lackHtml = "lackstatus_w";
                        lackTitle = "缺件待处理";
                        lackcode = 1;
                    }
                    //缺货已处理
                    else if (data.lackstate == "YY") {
                        lackHtml = "lackstatus_g";
                        lackTitle = "缺件已处理为：[" + data.itemCode + "]";
                        lackcode = 2;
                    } //非缺件
                    else {
                        lackcode = 0;
                    }
                    //缺货编号 
                    $("#hdnLackCode" + row).val(itemCode);
                    //缺货登记ITEM名称  
                    $("#hdnLackName" + row).val(data.itemName);
                    //缺货登记ITEM状态 
                    $("#hdnLackState" + row).val(lackcode);

                    //标识
                    $("#" + row).find("td[colname='itemName']").find("a").attr("class", lackHtml);
                    $("#" + row).find("td[colname='itemName']").find("a").attr("title", lackTitle);

                }
                else {
                    parent.ShowMsg('没有匹配的数据！');
                    //编号
                    $("#" + row).find("div[colname='divcode']").attr("code", defaultStr);
                    //编号
                    $("#txtIput" + row).val(defaultStr);
                    //名称
                    $("#" + row).find("td[colname='itemName']").find("span").text(defaultStr);
                    //买入单价
                    $("#" + row).find("td[colname='buyPrice']").text(defaultStr);
                    //单位
                    $("#" + row).find("td[colname='itemUnit']").text(defaultStr);
                    //规格型号 
                    $("#" + row).find("td[colname='itemModel']").text(defaultStr);
                    // 销售单价
                    $("#" + row).find("td[colname='salePrice']").text(defaultStr);
                    // 数量
                    $("#" + row).find("td[colname='quantity']").text(defaultStr);
                    //库存
                    $("#" + row).find("td[colname=stockQuantity]").attr("code", defaultStr);
                    $("#" + row).find("td[colname=stockQuantity]").attr("name", defaultStr);
                    // 加价比
                    $("#" + row).find("td[colname='markuprate']").text(defaultStr);
                    //备注
                    $("#" + row).find("td[colname=remark]").text(defaultStr);
                    //缺货编号 
                    $("#hdnLackCode" + row).val(defaultStr);
                    //缺货登记ITEM名称  
                    $("#hdnLackName" + row).val(defaultStr);
                    //缺货登记ITEM状态 
                    $("#hdnLackState" + row).val(defaultStr);
                    //标识
                    $("#" + row).find("td[colname='itemName']").find("a").attr("class", defaultStr);
                    $("#" + row).find("td[colname='itemName']").find("a").attr("title", defaultStr);
                    // 毛利
                    $("#" + row).find("td[colname='grossprice']").text(defaultStr);

                }
            }
        });
    }

} 
/*
合计函数
*/
function totalItemRowsFund() {
    //采购单价合计
    var SumbuyPrice = 0.00;
    //销售单价合计
    var SumsalePrice = 0.00;
    //数量合计
    var SumsaleQty = 0.00;
    //采购总价合计
    var SumbuytTotalprice = 0.00;
    //销售总价合计
    var SumsaleTotalprice = 0.00;
    //折扣额 
    var SumdepositTalmount = 0.00;
    //折扣后销售金额
    var SumafterDepositTalprice = 0.00;
    //毛利合计
    var Sumgrossprice = 0.00;

    var tindex = 0;
    //遍历配件行
    $("#tblItemRows>tbody>tr").each(function () {
        //采购单价合计
        $(this).find("td[colname='buyPrice']").each(function () {
            if ($(this).text() != "") {
                // @20140814 MDF BY HHC 以下相关浮点数技术，调用封装的方法
                //     SumbuyPrice += getNumValue($(this));
 
                    var value = parseFloat($(this).text());
                    SumbuyPrice = SumbuyPrice.add(value);
                
            }
        });
        //销售单价合计
        $(this).find("td[colname='salePrice']").each(function () {
            if ($(this).text() != "") {  
                    var value = parseFloat($(this).text());
                    SumsalePrice = SumsalePrice.add(value);
                    //毛利为赋值
                    if (value <= 0) {
                        $(this).css("color", "#FF0000");
                    }
                    else if (parseFloat(value) > 0) {
                        $(this).css("color", "#000000");
                    } 
                

            }
        });
        //采购总价合计
        //        $(this).find("td[colname='buytTotalprice']").each(function () {
        //            if ($(this).text() != "") {
        //                //       SumbuytTotalprice += getNumValue($(this));
        //                SumbuytTotalprice = SumbuytTotalprice.add(getNumValue($(this)));
        //            }
        //        });
        //数量合计
        $(this).find("td[colname='quantity']").each(function () {
            if ($(this).text() != "") {
                //       SumbuytTotalprice += getNumValue($(this));
                var value = parseFloat($(this).text());
                SumsaleQty = SumsaleQty.add(value);
            }
        });

        //销售总价合计
        //        $(this).find("td[colname='saleTotalprice']").each(function () {
        //            if ($(this).text() != "") {
        //                //    SumsaleTotalprice += getNumValue($(this));
        //                SumsaleTotalprice = SumsaleTotalprice.add(getNumValue($(this)));
        //            }
        //        });
        //折扣额
        $(this).find("td[colname='depositTalmount']").each(function () {
            if ($(this).text() != "") {
                //       SumdepositTalmount += getNumValue($(this));
                var value = parseFloat($(this).text());
                SumdepositTalmount = SumdepositTalmount.add(value);
            }
        });
        //折扣后销售金额
        $(this).find("td[colname='afterDepositTalprice']").each(function () {
            if ($(this).text() != "") {
                //       SumafterDepositTalprice += getNumValue($(this));
                var value = parseFloat($(this).text());
                SumafterDepositTalprice = SumafterDepositTalprice.add(value);
            }
        });

        //毛利合计
        $(this).find("td[colname='grossprice']").each(function () {
            if ($(this).text() != "") {
                var value = parseFloat($(this).text());
                Sumgrossprice = Sumgrossprice.add(value); 
                //毛利为赋值
                if (value <= 0) { 
                    $(this).css("color", "#FF0000");  
                }
                else if (parseFloat(value)>0) {
                    $(this).css("color", "#000000");
                } 
            }
        });



      

    });

    //采购单价合计
    if (SumbuyPrice != 0) {
        $("#trtotal td.SumbuyPrice").text(ForDight(SumbuyPrice, 2));
    }
    //销售单价合计
    if (SumsalePrice != 0) {
        $("#trtotal td.SumsalePrice").text(ForDight(SumsalePrice, 2));
    }
    //数量合计 
    if (SumsaleQty != 0) {
        $("#trtotal td.SumsaleQty").text(ForDight(SumsaleQty, 2));
    } 
    //采购总价合计  
   // if (SumbuytTotalprice != 0) {
     //   $("#trtotal td.SumbuytTotalprice").text(ForDight(SumbuytTotalprice, 2));
       //     $("#txt_SumbuytTotalprice").val(ForDight(SumbuytTotalprice, 2));
   //  } 
    //销售总价合计 
  //  if (SumsaleTotalprice != 0) {
     //   $("#trtotal td.SumsaleTotalprice").text(ForDight(SumsaleTotalprice, 2));
      //  $("#txt_SumsaleTotalprice").val(ForDight(SumsaleTotalprice,2));
   // }
    //折扣额 
    if (SumdepositTalmount != 0) {
        $("#trtotal td.SumdepositTalmount").text(ForDight(SumdepositTalmount, 2));
        $("#txt_SumdepositTalmount").val(ForDight(SumdepositTalmount, 2));
    }
    //折扣后销售金额 
    if (SumafterDepositTalprice != 0) {
        $("#trtotal td.SumafterDepositTalprice").text(ForDight(SumafterDepositTalprice, 2));
        $("#txt_SumafterDepositTalprice").val(ForDight(SumafterDepositTalprice,2));
    }

    // 毛利合计 
    if (Sumgrossprice != 0) {
        $("#trtotal td.Sumgrossprice").text(ForDight(Sumgrossprice, 2)); 
    }
    //计算税额
    var tax_rate = $("#dpttax_rate").val();
    if (tax_rate != "") {
        tax_rate = parseFloat(tax_rate);
        var tax_amount = SumafterDepositTalprice.mul(tax_rate.div(100.00));
        if (tax_amount != 0) {
            $("#txt_tax_amount").val(ForDight(tax_amount, 2));
        }
        var ntax_totalamount = SumafterDepositTalprice - tax_amount;
        if (ntax_totalamount != 0) {
            $("#txt_ntax_totalamount").val(ForDight(ntax_totalamount, 2));
        }
    }
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

//新增空行
function addRow(row) {
    //新增空行 
   addRowSetValue(row,""); 
}

//选择物料增加行
function SelectItemAddRow(row, RowJson) {
    //设置json
    addRowSetValue(row, RowJson);
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
    var defaultstate = "";
    var defaultFloat = ""; //金额
    var defaultDepositRate = $("#txt_ClientDiscount").val(); //折扣率
    var defaultMarkUpRate = $("#txt_MarkUpRate").val();
    //配件编号
    var itemCode = RowJson == "" ? defaultStr : (data.itemCode == null ? defaultStr : data.itemCode);
    //配件名称
    var itemName = RowJson == "" ? defaultStr : (data.itemName == null ? defaultStr : data.itemName);
    //规格型号
    var itemModel = RowJson == "" ? defaultStr : (data.itemModel == null ? defaultStr : data.itemModel);
    //单位
    var itemUnit = RowJson == "" ? defaultStr : (data.itemUnit == null ? defaultStr : data.itemUnit);
    //买入单价
    var buyPrice = RowJson == "" ? defaultStr : (data.buyPrice == null ? defaultFloat : ForDight(data.buyPrice,2));
    //销售单价
    var salePrice = RowJson == "" ? defaultStr : (data.salePrice == null ? defaultFloat : ForDight(data.salePrice,2));
    //数量
    var quantity = RowJson == "" ? defaultStr : (data.quantity == null ? defaultFloat : ForDight(data.quantity,2));
    //采购总价 
    var buytTotalprice = RowJson == "" ? defaultStr : (data.buytTotalprice == null ? defaultFloat : ForDight(data.buytTotalprice,2));
    //加价比
    var markuprate = RowJson == "" ? defaultMarkUpRate : (data.markUpRate == null ? defaultMarkUpRate : ForDight(data.markUpRate, 2));
    //销售总价
    var saleTotalprice = RowJson == "" ? defaultStr : (data.saleTotalprice == null ? defaultFloat : ForDight(data.saleTotalprice,2));
    //折扣率
    var depositRate = RowJson == "" ? defaultDepositRate : (data.depositRate == null ? defaultDepositRate : ForDight(data.depositRate,2));
    //折扣额
    var depositTalmount = RowJson == "" ? defaultStr : (data.depositTalmount == null ? defaultFloat : ForDight(data.depositTalmount,2));
    //折扣后总金额
    var afterDepositTalprice = RowJson == "" ? defaultStr : (data.afterDepositTalprice == null ? defaultFloat :ForDight(data.afterDepositTalprice,2));
    //毛利
    var grossprice = RowJson == "" ? defaultStr : (data.grossprice == null ? defaultFloat : ForDight(data.grossprice, 2));
    //备注
    var remark = RowJson == "" ? defaultStr : (data.remark == null ? defaultStr : data.remark);

    //缺货编号
    var lackcode = RowJson == "" ? defaultStr : (data.lackcode == null ? defaultStr : data.lackcode);
    //缺货名称
    var lackname = RowJson == "" ? defaultStr : (data.lackname == null ? defaultStr : data.lackname);
    //缺货状态
    var lackstate = RowJson == "" ? defaultstate : (data.lackstate == null ? defaultstate : data.lackstate);
    //标记
    var flag = RowJson == "" ? defaultStr : (data.Flag == null ? defaultStr : data.Flag);


    //＝＝＝＝＝＝修改行值＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //行标记
    $("#" + row).attr("flag", flag);
    //编号
    itemCode = $.trim(itemCode);
    $("#txtIput" + row).val(itemCode); 
    $("#" + row).find("div[colname='divcode']").attr("code", itemCode);
    //名称
    $("#" + row).find("td[colname='itemName']").find("span").text(itemName);
    $("#" + row).find("td[colname='itemName']").find("span").attr("title", itemName);
    //规格型号 
    $("#" + row).find("td[colname='itemModel']").text(itemModel);
    $("#" + row).find("td[colname='itemModel']").attr("title", itemModel);
    //单位
    $("#" + row).find("td[colname='itemUnit']").text(itemUnit);
    //买入单价
    $("#" + row).find("td[colname='buyPrice']").text(buyPrice);
    //加价比
    $("#" + row).find("td[colname='markuprate']").text(markuprate);
    //销售单价
    $("#" + row).find("td[colname='salePrice']").text(salePrice);
    //数量
    $("#" + row).find("td[colname='quantity']").text(quantity);
    //采购总价
    $("#" + row).find("td[colname='buytTotalprice']").text(buytTotalprice);
    //销售总价
    $("#" + row).find("td[colname='saleTotalprice']").text(saleTotalprice);
    //折扣率
    $("#" + row).find("td[colname='depositRate']").text(depositRate);

    //采购单价为0 则销售单价为0
//    if (parseFloat($("#" + row).find("td[colname='buyPrice']").text()) == 0) {
//        $("#" + row).find("td[colname='salePrice']").text(defaultStr);
//    }
//    else {//采购单价部不为0

//        if (parseFloat($("#" + row).find("td[colname='markuprate']").text()) == 0) {
//            //如果加价比为0,销售单价等于采购单价
//            $("#" + row).find("td[colname='salePrice']").text(defaultStr);
//        }
//        else {
//            var t_salePrice = parseFloat($("#" + row).find("td[colname='buyPrice']").text()).mul(1 + parseFloat($("#" + row).find("td[colname='markuprate']").text()).div(100.00));

//            $("#" + row).find("td[colname='salePrice']").text(ForDight(parseFloat(t_salePrice), 2));
//        }
//    }
    //库存
    $("#" + row).find("td[colname=stockQuantity]").attr("code", itemCode);
    $("#" + row).find("td[colname=stockQuantity]").attr("name", itemName);
    //折扣额
    $("#" + row).find("td[colname='depositTalmount']").text(depositTalmount);
    //折扣后总金额
    $("#" + row).find("td[colname='afterDepositTalprice']").text(afterDepositTalprice);
    //毛利
    $("#" + row).find("td[colname='grossprice']").text(grossprice);
    //备注
    $("#" + row).find("td[colname='remark']").text(remark);
    $("#" + row).find("td[colname='remark']").attr("title", remark); 

  
    //   $("#" + row).find("td[colname=lackstate]").text(lackstate); 
    var lackHtml = '';
    var lackTitle = '';
    // 缺货 待处理
    if (lackstate == "1") {
        lackHtml = "lackstatus_w";
        lackTitle = "缺件待处理";
        lackstate = "1";
    }
    // //缺货 已处理
    else if (lackstate == "2") {
        lackHtml = "lackstatus_g";
        lackTitle = "缺件已处理为：" + itemCode + "";
        lackstate = "2";
    }
    //非缺货
    else {
        lackstate = "0";
    }

    //缺货编号 
    $("#hdnLackCode" + row).val(lackcode);
    //缺货登记ITEM名称  
    $("#hdnLackName" + row).val(lackname);
    //缺货登记ITEM状态 
    $("#hdnLackState" + row).val(lackstate);

    //标识
    $("#" + row).find("td[colname='itemName']").find("a").attr("class", lackHtml);
    $("#" + row).find("td[colname='itemName']").find("a").attr("title", lackTitle);
    //行计算加价比
    var MarkUpRate = $("#txt_MarkUpRate").val();
    if (MarkUpRate != "") {
        if (parseFloat(MarkUpRate) > 0) {
            RowCalculator(row, "markuprate");
        }
    }
    //RowCalculator(row, "markuprate");
    //行计算销售单价
    //RowCalculator(row, "salePrice");
    //重新计算合计
    totalItemRowsFund();
}
//判断已选择的ITEMCODE是否已存在
function TblisExistItemCode(ItemCode) {
    var isexist = false;
    if (ItemCode != "") {
       ItemCode = $.trim(ItemCode);
       //判断是否存在  
       $("#tblItemRows>tbody>tr:has(td:has(div[code='" + ItemCode + "']))").each(function () {
           isexist = true;
       });
    }
    return isexist;

}  
//注意input的id和tr的id要一样,新增行  
function addRowSetValue(row,RowJson) {
    //字符串转成Json对象   
    var data;
    var isexist = false;
 
    if (RowJson!="") {
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
//   alert(row + "|" + RowJson);
    //默认值
    var defaultStr = ""; //字符串
    var defaultstate = "新建";
    var defaultFloat = ""; //金额
    var defaultDepositRate = $("#txt_ClientDiscount").val(); //折扣率
    var defaultMarkUpRate = $("#txt_MarkUpRate").val(); //加价比
    //配件编号
    var itemCode = RowJson == "" ? defaultStr : (data.itemCode == null ? defaultStr : data.itemCode);
    //配件名称
    var itemName = RowJson == "" ? defaultStr : (data.itemName == null ? defaultStr : data.itemName);
    //规格型号
    var itemModel = RowJson == "" ? defaultStr : (data.itemModel == null ? defaultStr : data.itemModel);
    //单位
    var itemUnit = RowJson == "" ? defaultStr : (data.itemUnit == null ? defaultStr : data.itemUnit);
    //买入单价
    var buyPrice = RowJson == "" ? defaultStr : (data.buyPrice == null ? defaultFloat : ForDight(data.buyPrice,2));
    //销售价格
    var salePrice = RowJson == "" ? defaultStr : (data.salePrice == null ? defaultFloat :ForDight(data.salePrice,2));
    //数量
    var quantity = RowJson == "" ? defaultStr : (data.quantity == null ? defaultFloat : ForDight(data.quantity, 2));
    //库存数量
   // var storeqty = RowJson == "" ? defaultStr : (data.quantity == null ? defaultFloat : ForDight(data.quantity, 2)); 
    //采购总价
    var buytTotalprice = RowJson == "" ? defaultStr : (data.buytTotalprice == null ? defaultFloat :ForDight(data.buytTotalprice,2));
    //加价比
    var markuprate = RowJson == "" ? defaultMarkUpRate : (data.markUpRate == null ? defaultMarkUpRate : ForDight(data.markUpRate, 2));
    //销售总价
    var saleTotalprice = RowJson == "" ? defaultStr : (data.saleTotalprice == null ? defaultFloat : ForDight(data.saleTotalprice,2));
    //折扣率
    var depositRate = RowJson == "" ? defaultDepositRate : (data.depositRate == null ? defaultDepositRate : ForDight(data.depositRate,2));
    //折扣额
    var depositTalmount = RowJson == "" ? defaultStr : (data.depositTalmount == null ? defaultFloat : ForDight(data.depositTalmount,2));
    //折扣后总金额
    var afterDepositTalprice = RowJson == "" ? defaultStr : (data.afterDepositTalprice == null ? defaultFloat : ForDight(data.afterDepositTalprice, 2));
    //毛利
    var grossprice = RowJson == "" ? defaultStr : (data.grossprice == null ? defaultFloat : ForDight(data.grossprice, 2));
    //备注
    var remark = RowJson == "" ? defaultStr : (data.remark == null ? defaultStr : data.remark);
    //缺货编号
    var lackcode = RowJson == "" ? defaultStr : (data.lackcode == null ? defaultStr : data.lackcode);
    //缺货名称
    var lackname = RowJson == "" ? defaultStr : (data.lackname == null ? defaultStr : data.lackname);
    //缺货状态
    var lackstate = RowJson == "" ? defaultstate : (data.lackstate == null ? defaultstate : data.lackstate);
    //标记
    var flag = RowJson == "" ? defaultStr : (data.Flag == null ? defaultStr : data.Flag);

    var lackHtml = '';
    var lackTitle='';
    //待处理
    if (lackstate == "1") {
        lackHtml = "lackstatus_w";
        lackTitle = "[" + lackcode + "]缺件待处理";
        lackstate = "1";
    }
    //已处理
    else if (lackstate == "2") {
        lackHtml = "lackstatus_g";
        lackTitle = "[" + lackcode + "] 缺件已处理为：[" + itemCode + "]";
        lackstate = "2";
    }
    //非缺货
    else {
        lackstate = "0";
    }

    //要添加的行的id  
    var addRowID = parseInt(row) + 1;
    //行字符串
    var str = "";
    //新增与删除行
    str += '<tr id="' + addRowID + '"  flag="' + flag + '"><td><div class="tableEdit"><a href="javascript:void(0);" class="addLite" onclick="addRow(' + addRowID + ')"></a><a href="javascript:void(0);" class="delLite" onclick="deltr(' + addRowID + ')"></a></div></td>';
    //行号
    str += '<td>' + addRowID + '</td>'; 
    //配件编号
    str += '<td>';
    str += '<div class="write" code="' + itemCode + '" colname="divcode">';
    str += '<input type="text" id="txtIput' + addRowID + '" colname="inputItemCode" value="' + itemCode + '" class="peijianNum" />';
    str += '<a name="' + addRowID + '" class="selectitem" >...</a></div>'; 
    str += '<input id="hdnLackCode' + addRowID + '"  type="hidden" class="lackcode" value=' + lackcode + '>';
    str += '<input id="hdnLackName' + addRowID + '"  type="hidden" class="lackname"  value=' + lackname + '>';
    str += '<input id="hdnLackState' + addRowID + '" type="hidden" class="lackstate"  value=' + lackstate + '>';
    str += '</td>'; 

    //配件名称 规格  
    str += '<td colname="itemName" align="left" title="' + itemName + '"><span>' + itemName + '</span><a title="' + lackTitle + '"  class="' + lackHtml + '"></a></td>';
    //规格型号
    str += ' <td  colname="itemModel"  align="left" title="' + itemModel + '">' + itemModel + '</td>';
     //库存数量
    str += '<td  code="' + itemCode + '" name="' + itemName + '" onclick="GetStockQuantity(this);"  colname="stockQuantity" align="center"><img id="imgstock" title="查看库存" src="/Images/viewStock.png" style="cursor:pointer;" /></td>';
    //采购价格
    str += ' <td colname="buyPrice" align="right">' + buyPrice + '</td>';
    //加价比
    str += ' <td  class="inputobj"  colname="markuprate" align="right">' + markuprate + '</td>';
    //销售价格  数量
    str += ' <td class="inputobj"  colname="salePrice" align="right">' + salePrice + '</td>';
    //计量单位
    str += '<td class="inputobj"  colname="quantity" align="right">' + quantity + '</td>';
    //计量单位
    str += '<td colname="itemUnit">' + itemUnit + '</td>'; 
    //折扣率 
    str += '<td class="inputobj" colname="depositRate" align="right">' + depositRate + '</td>';
    //折扣额
    str += '<td  class="inputobj" colname="depositTalmount" align="right">' + depositTalmount + '</td>';
    //折扣后总金额
    str += '<td  colname="afterDepositTalprice" align="right">' + afterDepositTalprice + '</td>';
    //毛利
    str += ' <td colname="grossprice" align="right">' + grossprice + '</td>';
    //备注
    str += '<td class="inputobj" colname="remark" title="'+remark+'">' + remark + '</td></tr>'; 
   
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
    //行计算加价比
    var MarkUpRate = $("#txt_MarkUpRate").val();
    if (MarkUpRate != "") {
        if (parseFloat(MarkUpRate) > 0) {
            RowCalculator(addRowID, "markuprate");
        }
    }
    //行计算加价比
    //RowCalculator(row, "markuprate");
    //行计算销售单价
    //RowCalculator(row, "salePrice");
   //序号重新生成
    showLineNum();  
   
}

//配件列表_删除行
function deltr(id) {
    //得到总行数
    var tblrowcount = $("#tblItemRows>tbody>tr").length;
    //得到操作类型（修改,复制,新增)
    var Quotetype = GetQueryString("type");
    //获得该行标记
    var flag = $("#" + id).attr("flag");
    //至少保留一行
    if (tblrowcount != 1) {
        var _itemCode = $("#txtIput" + id).val();
        if ("" == _itemCode) {
            $('#' + id).remove();
            showLineNum();
            return;
        }

        $.messager.confirm('系统提示', '确认删除吗？', function (r) {
            if (r) {
                //                $('#' + id).remove();
                //                showLineNum();
                if (Quotetype != "edit" || flag != "0") {//新增或者复制则直接删除表格行还有一种是修改时新添加了行则数据库中暂无该行则无需删除数据库信息
                    $('#' + id).remove();
                    showLineNum();
                }
                else {//修改的时候若删除行则必须同时删除数据库中该行信息
                    //获得报价单号
                    var QuoteCode = $("#txt_cn_s_quotecode").val();
                    //获取初始化JSON列表 开始
                    $.ajax({
                        type: "POST",
                        url: "/AdminUI/AjaxPages/AddQuotation.ashx",
                        data: "Action=DELETEROW&QuoteCode=" + QuoteCode + "&Row=" + id,
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
                }//else结束

            }// if(r) 结束
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
        htmlstr = '<div class="tableEdit"><a href="javascript:void(0);" class="addLite" onclick="addRow(' + addRowID + ')"></a><a href="javascript:void(0);" class="delLite" onclick="deltr(' + addRowID + ')"></a><div>';
        //设置行ID
        $(this).attr("id", addRowID);
        //设置序号的值
        $(this).find('td').eq(1).html(addRowID);
        //设置新增与删除
        $(this).find('td').eq(0).html(htmlstr);
        //配件编号 修改ID
        $(this).find('td').eq(2).find("input:.peijianNum").attr("id", "txtIput" + addRowID);
        //卸载所有事件
        $(this).find('td').eq(2).find("input:.peijianNum").unbind();
        //弹出框选择 
        $(this).find('td').eq(2).find("a:.selectitem").attr("name", addRowID);//从新负值a:name
        $(this).find('td').eq(2).find("a:.selectitem").unbind("click"); //卸载单价事件
        $(this).find('td').eq(2).find("a:.selectitem").click(function () { //重新绑定事件
            SelectItemList($(this).attr("name"));
        });
        //缺货登记ITEM编号
        $(this).find('td').eq(2).find("input:.lackcode").attr("id", "hdnLackCode" + addRowID);
        //缺货登记ITEM名称 
        $(this).find('td').eq(2).find("input:.lackname").attr("id", "hdnLackName" + addRowID);
        //缺货登记ITEM状态 
        $(this).find('td').eq(2).find("input:.lackstate").attr("id", "hdnLackState" + addRowID);
        //绑定自动完成
        BindingAutoComplete(addRowID);
        //单元格单击 
        BingCellClick(addRowID);
        //RowCalculator(addRowID, "markuprate");
    });
   
    //重新计算合计
    totalItemRowsFund(); 

}  
