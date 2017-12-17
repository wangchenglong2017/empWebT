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
    var defaultDepositRate = $("#txt_ClientDiscount").val(); //折扣率
    //var defaultState = "新建";
    //配件编号
    var itemCode = RowJson == "" ? defaultStr : (data.itemCode == null ? defaultStr : data.itemCode);
    //配件名称
    var itemName = RowJson == "" ? defaultStr : (data.itemName == null ? defaultStr : data.itemName);
    //规格型号
    var itemModel = RowJson == "" ? defaultStr : (data.itemModel == null ? defaultStr : data.itemModel);
    //库存
    var stockQuatity = RowJson == "" ? 20 : (data.stockQuatity == null ? 20 : data.stockQuatity);
   
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
    //缺货编号
    var lackcode = RowJson == "" ? defaultStr : (data.lackcode == null ? defaultStr : data.lackcode);
    //缺货名称
    var lackname = RowJson == "" ? defaultStr : (data.lackname == null ? defaultStr : data.lackname);
    //缺货状态
    var lackstate = RowJson == "" ? defaultStr : (data.lackstate == null ? defaultStr : data.lackstate);
    //要添加的行的id  
    var addRowID = parseInt(row) + 1;
    //行字符串
    var str = "";

    //新增与删除行
    str += '<tr id="' + addRowID + '"><td><a href="javascript:void(0);" class="delLite" onclick="deltr(' + addRowID + ')"></a></td>';
    //行号
    str += '<td>' + addRowID + '</td>';
    //配件编号
    str += '<td  colname="itemCode"><span>' + itemCode + '</span>';
    str += '<div class="write" style="display:none;" code="' + itemCode + '" colname="divcode"><input type="hidden"   id="txtIput' + addRowID + '" value="' + itemCode + '"   class="peijianNum" /></div>';
    str += '<input id="hdnLackCode' + addRowID + '"  type="hidden" class="lackcode" value=' + lackcode + '>';
    str += '<input id="hdnLackName' + addRowID + '"  type="hidden" class="lackname"  value=' + lackname + '>';
    str += '<input id="hdnLackState' + addRowID + '" type="hidden" class="lackstate"  value=' + lackstate + '>';
    str += '</td>';
    //配件名称 规格
    str += '<td  align="left" colname="itemName" title="' + itemName + '">' + itemName + '</td><td colname="itemModel" title="' + itemModel + '">' + itemModel + '</td>';
    //库存总数  
    str += '<td code="' + itemCode + '" name="' + itemName + '" onclick="GetStockQuantity(this);" colname="stockQuantity" align="center"><img id="imgstock" title="查看库存" src="/Images/viewStock.png" style="cursor:pointer;" /></td>';
   
    //单价
    str += '<td  colname="buyPrice" align="right">' + buyPrice + '</td>';
    //  数量
    str += ' <td colname="quantity" class="inputobj" align="right">' + quantity + '</td>';
    //计量单位
    str += '<td  colname="itemUnit">' + itemUnit + '</td>';
    //折扣率 折扣额
    str += '<td colname="depositRate"  align="right">' + depositRate + '</td><td    colname="depositTalmount" align="right">' + depositTalmount + '</td>';
    //总价
    str += '<td  colname="TotalPrice" align="right">' + TotalPrice + '</td>';
    //状态
    str += '<td  colname="state" align="center">' + state + '</td>';
   
    //备注
    str += '<td class="inputobj" colname="remark" title="' + remark + '">' + remark + '</td></tr>';
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



//配件列表_删除行
function deltr(id) {
    //得到总行数
    var tblrowcount = $("#tblItemRows>tbody>tr").length;
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
                $('#' + id).remove();
                showLineNum();
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
        htmlstr = '<a href="javascript:void(0);" class="delLite" onclick="deltr(' + addRowID + ')"></a>';
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
        //单元格单击 
        BingCellClick(addRowID);
    });
    //重新计算合计
    totalItemRowsFund();

}

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

        //列名
        var colname = $(this).attr("colname");
        var input = $("<input type='text'  value='" + oldText + "'/>"); //文本框的html代码  
        objTD.html(input);  //td变为文本 

        //设置文本框的点击事件失效  
        input.click(function () {
            return false;
        });
        //设置文本框的样式  
        // input.css("border-width", 0);  //边框为0  
        input.css("margin", 0);
        // input.css("padding", 0);
        input.css("color", "black");
        input.height("12px"); //文本框的高度为当前td的高度  
        input.width("95%");
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

                this.value = this.value.replace(/[^\d.]/g, "");
                //必须保证第一个为数字而不是.
                this.value = this.value.replace(/^\./g, "");
                //保证只有出现一个.而没有多个.
                this.value = this.value.replace(/\.{2,}/g, ".");
                //保证.只出现一次，而不能出现两次以上
                this.value = this.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
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
                    parent.ShowMsg('第' + row + '行,请输入配件编号!');
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
                if (itemCode != "" && newText != "" && 0 == parseFloat(newText)) {
                    // 格式化，仅取两位销售
                    newText = parseFloat(newText);
                    newText = ForDight(newText, 2);
                    $("#" + row).find("td[colname=" + colname + "]").val(newText);
                }
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

    });                                                               // 结束  给这些单元格注册鼠标点击事件  

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
    var stockQuatity = RowJson == "" ? 0.00 : (data.stockQuatity == null ? 0.00 : data.stockQuatity);
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

    //缺货编号
    var lackcode = RowJson == "" ? defaultStr : (data.lackcode == null ? defaultStr : data.lackcode);
    //缺货名称
    var lackname = RowJson == "" ? defaultStr : (data.lackname == null ? defaultStr : data.lackname);
    //缺货状态
    var lackstate = RowJson == "" ? defaultStr : (data.lackstate == null ? defaultStr : data.lackstate);
    

    //＝＝＝＝＝＝修改行值＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
   
    //编号
    itemCode = $.trim(itemCode);
    $("#txtIput" + row).val(itemCode);
    $("#" + row).find("div[colname='divcode']").attr("code", itemCode);
    $("#" + row).find("td[colname=itemCode]").find("span").text(itemCode);
    //名称
    $("#" + row).find("td[colname='itemName']").text(itemName);
    $("#" + row).find("td[colname='itemName']").attr("title", itemName);
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
    $("#" + row).find("td[colname=stockQuantity]").attr("code", itemCode);
    $("#" + row).find("td[colname=stockQuantity]").attr("name", itemName);
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

    //缺货编号 
    $("#hdnLackCode" + row).val(lackcode);
    //缺货登记ITEM名称  
    $("#hdnLackName" + row).val(lackname);
    //缺货登记ITEM状态 
    $("#hdnLackState" + row).val(lackstate);
    //重新计算合计
    totalItemRowsFund();
}



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
                Html += ' <tr ">'; //onclick="selItem_history(this)
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
                $(this).find("td[colname=itemCode]").css("color", "#0000FF");
                flag = true;
            }
            else {
                $(this).find("td[colname=itemCode]").css("color", "");
                $(this).find("td[colname=itemName]").css("color", "");
            }

            //物料名称包含
            if (itemName.toUpperCase().indexOf(LocationKey.toUpperCase()) > -1 && parseInt(LocationCurrentRow) < parseInt(row)) {
                $(this).find("td[colname=itemName]").css("color", "red");
                flag = true;
            }
            else {
                $(this).find("td[colname=itemName]").css("color", "");
            }
            if (flag) {
                //记录当前行
                LocationCurrentRow = row;
                StartLocationRow = row;
                //第二次
                if (parseInt(rowcount) == parseInt(row)) {
                    LocationCurrentRow = 0;
                }
                //itemInput = $("#txtIput" + row);
                itemInput = $("#" + row).find("td[colname=itemCode]");
                var tableObj = $("#_fixTableMain");
                var tableTop = tableObj.offset().top;
                var inputTop = itemInput.offset().top - tableTop;
                var inputHeight = itemInput.height();
                if ($("#_fixTableMain").scrollTop() > (inputTop + itemInput.outerHeight())) {
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

//根据报价单号加载物料行
function GetRowItemsByQuoteCode(QuoteCode) {
    //获取初始化JSON列表 开始
    $.ajax({
        type: "POST",
        url: "/AdminUI/AjaxPages/AddQuotation.ashx",
        data: "Action=GENERATEORDER&QUOTECODE=" + QuoteCode + "",
        async: false,
        beforeSend: function () {

        },
        success: function (result) {
            if (result != "") {
                //字符串转成Json对象 
                var data = (new Function("", "return " + result))();
                if (data != null) { //没有错误信息
                    //遍历数据行
                    $.each(data.ORDERROWITEMLIST, function (i, n) {
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
        $.colorbox({ href: "/AdminUI/DealerSale/StockInfo.aspx?code=" + escape(Code) + "&name=" + escape(Name) + "&Type=0&row=" + escape(row), iframe: true, innerWidth: 545, innerHeight: 360 });
    }
}




//保存订单saveflag:保存后新增，保存；
function SaveOrderInfo() {
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
        //$("#hdnFlag").val(saveflag);
        //4、提交保存
        $("#frmAddOrder").submit();
        $(".btnRight").find("a[id=btnsave]").text("保存中...");
        $(".btnRight").find("a[id=btnsave]").attr("disabled", "disabled");
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
        CN_S_SOURCE: "报价单", //来源
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

    $("#tblItemRows>tbody>tr").each(function (index) {
        //当前行
        var row = parseInt(index) + 1;
        ////订单单号
        var OrderCode = $("#txt_cn_s_Ordercode").val();
        //行号
        var N_ROW = $(this).attr("id");
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
                CN_S_STATE: state,
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