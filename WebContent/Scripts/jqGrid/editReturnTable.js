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

//注意input id和tr 的id要一样 新增行
function addRowSetValue(row, RowJson) {
    //字符串转成Json对象
    var data;
    var isexist = false;
    if (RowJson != "") {
        //JSON转化为字符串
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
    //var defaultState = "新建";//状态
    //配件编号
    var itemCode = RowJson == "" ? defaultStr : (data.itemCode == null ? defaultStr : data.itemCode);
    //配件名称
    var itemName = RowJson == "" ? defaultStr : (data.itemName == null ? defaultStr : data.itemName);
    //规格型号
    var itemModel = RowJson == "" ? defaultStr : (data.itemModel == null ? defaultStr : data.itemModel);
    //库存
    var stockQuatity = RowJson == "" ? 0.00 : (data.stockQuatity == null ? 0.00 : data.stockQuatity);
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
    //标记
    var flag = RowJson == "" ? defaultStr : (data.Flag == null ? defaultStr : data.Flag);
    //标准价
    var standCost = RowJson == "" ? defaultStr : (data.standardPrice == null ? "0.0000" : data.standardPrice);

    //要添加的行的id  
    var addRowID = parseInt(row) + 1;
    //行字符串
    var str = "";
    //新增与删除行
    str += '<tr id="' + addRowID + '" flag="' + flag + '"><td><a href="javascript:void(0);" class="addLite" onclick="addRow(' + addRowID + ')"></a><a href="javascript:void(0);" class="delLite" onclick="deltr(' + addRowID + ')"></a></td>';
    //行号
    str += '<td>' + addRowID + '</td>';
    //配件编号
    str += '<td>';
    str += '<div class="write" standcost="'+standCost+'" code="' + itemCode + '" colname="divcode"><input type="text" id="txtIput' + addRowID + '" value="' + itemCode + '" class="peijianNum" /><a name="' + addRowID + '" class="selectitem" >...</a></div>';
    str += '<input id="hdnLackCode' + addRowID + '"  type="hidden" class="lackcode" value=' + lackcode + '>';
    str += '<input id="hdnLackName' + addRowID + '"  type="hidden" class="lackname"  value=' + lackname + '>';
    str += '<input id="hdnLackState' + addRowID + '" type="hidden" class="lackstate"  value=' + lackstate + '>';
    str += '</td>';
    //配件名称 规格
    str += '<td  colname="itemName" title="' + itemName + '">' + itemName + '</td><td colname="itemModel" title="' + itemModel + '">' + itemModel + '</td>';
    //库存总数  单价
    str += '<td  code="' + itemCode + '" name="' + itemName + '" onclick="GetStockQuantity(this);" colname="stockQuantity" align="center"><img id="imgstock" title="查看库存" src="/Images/viewStock.png" style="cursor:pointer;" /></td><td colname="buyPrice" align="right">' + buyPrice + '</td>';
    //  数量
    str += ' <td  class="inputobj"  colname="quantity" align="right">' + quantity + '</td>';
    //计量单位
    str += '<td colname="itemUnit">' + itemUnit + '</td>';
    //折扣率 折扣额
    str += '<td class="inputobj"  colname="depositRate" align="right">' + depositRate + '</td><td class="inputobj"   colname="depositTalmount" align="right">' + depositTalmount + '</td>';
    //总价
    str += '<td colname="TotalPrice" align="right">' + TotalPrice + '</td>';
    //状态
    str += '<td colname="state" align="center">' + state + '</td>';
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


//配件列表_删除行
function deltr(id) {
    //获得操作类型（修改,复制,新增)
    //获得退货单类型
    var Returntype = GetQueryString("type");
    //得到总行数
    var tblrowcount = $("#tblItemRows>tbody>tr").length;
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
                if (Returntype != "edit" || flag != "0") {//新增或者复制则直接删除表格行还有一种是修改时新添加了行则数据库中暂无该行则无需删除数据库信息
                    $('#' + id).remove();
                    showLineNum();
                }
                else {
                    //获得退货单号
                    var ReturnCode = $("#txt_cn_s_Returncode").val();
                    //获得物料行金额
                    //var RowTotalPrice = $("#" + id).find("td[colname=TotalPrice]").text();
                    //获得该物料行状态
                    var State = $("#" + id).find("td[colname=state]").text();
                    //获取初始化JSON列表 开始
                    $.ajax({
                        type: "POST",
                        url: "/AdminUI/AjaxPages/AddReturn.ashx",
                        data: "Action=DELETEROW&ReturnCode=" + ReturnCode + "&State=" + State + "&Row=" + id,
                        async: false,
                        beforeSend: function () {
                        },
                        success: function (result) {
                            alert(result);
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
                }
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
        //配件编号 修改ID
        $(this).find('td').eq(2).find("input:.peijianNum").attr("id", "txtIput" + addRowID);
        //卸载所有事件
        $(this).find('td').eq(2).find("input:.peijianNum").unbind();
        //弹出框选择 
        $(this).find('td').eq(2).find("a:.selectitem").attr("name", addRowID); //从新负值a:name
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

    });
    //重新计算合计
    totalItemRowsFund();
}


//绑定自动完成
function BindingAutoComplete(row) {
    $("#txtIput" + row).autocomplete("../AjaxPages/ReturnList.ashx", {
        minChars: 0,
        max: 10,
        width: 512,
        autoFill: false,
        scroll: false,
        scrollHeight: 500,
        dataType: "json", //json类型
        matchContains: true,
        extraParams: { param: function () { return $("#txtIput" + row).val(); } },
        //需要把data转换成json数据格式
        parse: function (data) {
            if (data != "false") {
                //字符串转成Json对象 
                //alert(data);
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
            // var flag = ;
            //  alert(flag)
            //  return data.VALUE;
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
            parent.ShowMsg('配件编号[' + data.VALUE + ']]已存在！');
            //编号
            $("#" + row).find("div[colname='divcode']").attr("code", defaultStr);
            //编号
            $("#txtIput" + row).val(defaultStr);
            //名称
            $("#" + row).find("td[colname='itemName']").text(defaultStr);
            //单价
            $("#" + row).find("td[colname='buyPrice']").text(defaultStr);
            //单位
            $("#" + row).find("td[colname='itemUnit']").text(defaultStr);
            //规格型号 
            $("#" + row).find("td[colname='itemModel']").text(defaultStr);
            // 数量
            $("#" + row).find("td[colname='quantity']").text(defaultStr);
            //状态
            $("#" + row).find("td[colname='state']").text(defaultStr);
            //库存
            $("#" + row).find("td[colname=stockQuantity]").attr("code", defaultStr);
            $("#" + row).find("td[colname=stockQuantity]").attr("name", defaultStr);
        }
        else {
            //编号
            $("#txtIput" + row).val(data.VALUE);
            $("#" + row).find("div[colname='divcode']").attr("code", data.VALUE);
            //标准成本
            $("#" + row).find("div[colname='divcode']").attr("standcost", data.ParamValueE);
            //名称
            $("#" + row).find("td[colname=itemName]").text(data.TEXT);
            //单价
            $("#" + row).find("td[colname=buyPrice]").text(ForDight(parseFloat(data.ParamVaule), 2));
            //单位
            $("#" + row).find("td[colname=itemUnit]").text(data.ParamVauleA);
            //库存
            $("#" + row).find("td[colname=stockQuantity]").attr("code", data.VALUE);
            $("#" + row).find("td[colname=stockQuantity]").attr("name", data.TEXT);
            //规格型号
            var _itemModel = data.ParamVauleB == null ? "" : data.ParamVauleB;
            $("#" + row).find("td[colname=itemModel]").text(_itemModel);
            // 数量
            $("#" + row).find("td[colname='quantity']").text("");
            //状态
            $("#" + row).find("td[colname='state']").text("新建");
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
    var itemName = $.trim($("#" + row).find("td[colname='itemName']").text());

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

    //物料编码不可为空
    if ($.trim(itemCode) != "") {
        $.ajax({
            type: "POST",
            url: "/AdminUI/AjaxPages/ReturnList.ashx",
            data: "Action=ISEXISTITEMCODE&ItemCode=" + escape(itemCode) + "",
            async: false,
            success: function (result) {
                if (result != "false") {
                    //字符串转成Json对象 
                    var data = (new Function("", "return " + result))();

                    //编号
                    $("#" + row).find("div[colname='divcode']").attr("code", data.itemCode);
                    //标准成本
                    $("#" + row).find("div[colname='divcode']").attr("standcost", data.standardPrice);
                    //编号
                    $("#txtIput" + row).val(data.itemCode);
                    //名称
                    $("#" + row).find("td[colname='itemName']").text(data.itemName);
                    //单价
                    $("#" + row).find("td[colname='buyPrice']").text(ForDight(parseFloat(data.buyPrice), 2));
                    //单位
                    $("#" + row).find("td[colname='itemUnit']").text(data.itemUnit);
                    //规格型号
                    var _itemModel = data.itemModel == null ? "" : data.itemModel;
                    $("#" + row).find("td[colname='itemModel']").text(_itemModel);
                    // 销售单价
                    //$("#" + row).find("td[colname='salePrice']").text(defaultStr);
                    // 数量
                    $("#" + row).find("td[colname='quantity']").text(defaultStr);
                    //备注
                    $("#" + row).find("td[colname=remark]").text(defaultStr);
                    //状态
                    $("#" + row).find("td[colname='state']").text("新建");
                    //缺货编号 
                    $("#hdnLackCode" + row).val(data.lackcode);
                    //缺货登记ITEM名称  
                    $("#hdnLackName" + row).val(data.lackname);
                    //缺货登记ITEM状态 
                    $("#hdnLackState" + row).val(data.lackstate);
                    //库存
                    $("#" + row).find("td[colname=stockQuantity]").attr("code", data.itemCode);
                    $("#" + row).find("td[colname=stockQuantity]").attr("name", data.itemName);

                }
                else {
                    parent.ShowMsg('没有匹配的数据！');
                    //编号
                    $("#" + row).find("div[colname='divcode']").attr("code", defaultStr);
                    //标准成本
                    $("#" + row).find("div[colname='divcode']").attr("standCost", defaultStr);
                    //编号
                    $("#txtIput" + row).val(defaultStr);
                    //名称
                    $("#" + row).find("td[colname='itemName']").text(defaultStr);
                    //买入单价
                    $("#" + row).find("td[colname='buyPrice']").text(defaultStr);
                    //单位
                    $("#" + row).find("td[colname='itemUnit']").text(defaultStr);
                    //规格型号 
                    $("#" + row).find("td[colname='itemModel']").text(defaultStr);
                    // 销售单价
                    //$("#" + row).find("td[colname='salePrice']").text(defaultStr);
                    // 数量
                    $("#" + row).find("td[colname='quantity']").text(defaultStr);
                    //备注
                    $("#" + row).find("td[colname=remark]").text(defaultStr);
                    //状态
                    $("#" + row).find("td[colname='state']").text(defaultStr);
                    //缺货编号 
                    $("#hdnLackCode" + row).val(defaultStr);
                    //缺货登记ITEM名称  
                    $("#hdnLackName" + row).val(defaultStr);
                    //缺货登记ITEM状态 
                    $("#hdnLackState" + row).val(defaultStr);
                    //库存
                    $("#" + row).find("td[colname=stockQuantity]").attr("code", defaultStr);
                    $("#" + row).find("td[colname=stockQuantity]").attr("name", defaultStr);

                }
            }
        });
    }
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

    });                                                             // 结束  给这些单元格注册鼠标点击事件  

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
        //$("#" + row).find("td[colname=depositRate]").text(ForDight(depositRate, 2));
        if (0 == depositRate)
            depositRate = 100.00;
        //转化折扣率
        depositRate = depositRate.div(100.00);
        //总金额
        var afterTotalPrice = TotalPrice.mul(depositRate);
        //格式化折扣后总价
        _afterTotalPrice = ForDight(afterTotalPrice, 2);
        //赋值总价
        $("#" + row).find("td[colname=TotalPrice]").text(_afterTotalPrice);
        //得到折扣额
        var depositTalmount = TotalPrice.sub(afterTotalPrice);
        //格式化折扣额
        _depositTalmount = ForDight(depositTalmount, 2);
        //赋值折扣额
        $("#" + row).find("td[colname=depositTalmount]").text(_depositTalmount);

    }
    else if (quantity != "" && colname == "depositRate" && depositRate!="") {//数量不为空,修改折扣率,计算折扣额
        depositRate = parseFloat(depositRate);
        // 赋值折扣率
        $("#" + row).find("td[colname=depositRate]").text(ForDight(depositRate, 2));
        if (0 == depositRate)
            depositRate = 100.00;
        // 转化折扣率
        depositRate = depositRate.div(100.00);
        quantity = parseFloat(quantity);
        buyPrice = parseFloat(buyPrice);
        //得到金额
        var TotalPrice = buyPrice.mul(quantity);
        //折扣后总金额
        var afterTotalPrice = TotalPrice.mul(depositRate);
        //格式化折扣后总金额
        _afterTotalPrice = ForDight(afterTotalPrice, 2);
        //赋值总价
        $("#" + row).find("td[colname=TotalPrice]").text(_afterTotalPrice);
        //得到折扣额
        var depositTalmount = TotalPrice.sub(afterTotalPrice);
        //格式化折扣额
        _depositTalmount = ForDight(depositTalmount, 2);
        //赋值折扣额
        $("#" + row).find("td[colname=depositTalmount]").text(_depositTalmount);
    }
    else if (quantity != "" && colname == "depositTalmount" && depositTalmount!="") {//数量不为空,修改折扣额,计算折扣率
        depositTalmount = parseFloat(depositTalmount);
        //赋值折扣额
        $("#" + row).find("td[colname=depositTalmount]").text(depositTalmount = ForDight(depositTalmount, 2));
        quantity = parseFloat(quantity);
        
        buyPrice = parseFloat(buyPrice);
        //得到金额
        var TotalPrice = buyPrice.mul(quantity);
        if (TotalPrice == 0) {
            return false;
        }
        TotalPrice = parseFloat(TotalPrice);
        //折扣后总金额
        var afterTotalPrice = parseFloat(TotalPrice.sub(depositTalmount));
        //格式化折扣后总金额
        _afterTotalPrice = ForDight(afterTotalPrice, 2);
        //赋值总价
        //$("#" + row).find("td[colname=TotalPrice]").text(_afterTotalPrice);
        //折扣率
        _afterTotalPrice = parseFloat(_afterTotalPrice);
        depositRate = _afterTotalPrice.mul(100.00);
        var depositRate = parseFloat(depositRate.div(TotalPrice));
        //格式化折扣率
        var _depositRate = ForDight(depositRate, 2);
        // 赋值折扣率
        $("#" + row).find("td[colname=depositRate]").text(_depositRate);
        //折扣后总价
        var _afterDepositTalprice = parseFloat(TotalPrice.sub(depositTalmount));
       
        //赋值折扣后总金额
        $("#" + row).find("td[colname='TotalPrice']").text(ForDight(_afterDepositTalprice, 2)); 
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
        var buyprice = $(this).find("td[colname='buyPrice']");
        if (buyprice.text() != "") {
            SumbuyPrice = SumbuyPrice.add(getNumValue(buyprice));
        }
        //折扣额
        var depositamount = $(this).find("td[colname='depositTalmount']");

        if (depositamount.text() != "") {
            SumdepositTalmount = SumdepositTalmount.add(getNumValue(depositamount));
        }

        //总价
        var totalprice = $(this).find("td[colname='TotalPrice']");
        if (totalprice.text() != "") {
            SumTotalprice = SumTotalprice.add(getNumValue(totalprice));
        }
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
    var defaultDepositRate = $("#txt_ClientDiscount").val(); //折扣率
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
    var depositRate = RowJson == "" ? defaultDepositRate : (data.depositRate == null ? defaultDepositRate : ForDight(data.depositRate, 2));
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
    //标记
    var flag = RowJson == "" ? defaultStr : (data.Flag == null ? defaultStr : data.Flag);

    //标准价
    var standCost = RowJson == "" ? defaultStr : (data.standardPrice == null ? "0.0000" : data.standardPrice);

    //＝＝＝＝＝＝修改行值＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //行标记
    $("#" + row).attr("flag", flag);
    //编号
    itemCode = $.trim(itemCode);
    $("#txtIput" + row).val(itemCode);
    $("#" + row).find("div[colname='divcode']").attr("code", itemCode);
    //标准价
    $("#" + row).find("div[colname='divcode']").attr("standcost", standCost);
    //名称
    $("#" + row).find("td[colname=itemName]").text(itemName);
    $("#" + row).find("td[colname=itemName]").attr("title", itemName);
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