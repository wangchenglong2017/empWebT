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

var flag;
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
    //要添加的行的id  
    var addRowID = parseInt(row) + 1;
    //类型
    var itemType = "<select name='" + addRowID + "' onchange='ChangeType(this)'><option value=''></option><option value='固定值'>固定值</option><option value='序号'>序号</option></select>";
    //固定码
    var itemCode = "<input class='inputHover' type='text'/>";
    //填充长度
    var itemCodeLength = "<input class='inputHover' type='text'/>";
    //增长长度
    var itemLength = "<input class='inputHover' type='text'/>";
    //行标记

    //行字符串
    var str = "";

    //新增与删除行
    str += '<tr id="' + addRowID + '" class="trout"><td align="center" >' +
        '<a href="javascript:void(0);" class="addLite" onclick="addRow(' + addRowID + ')"></a>' +
        '<a href="javascript:void(0);" class="delLite" onclick="deltr(' + addRowID + ')"></a></td>';
    //行号
    str += '<td align="center">' + addRowID + '</td>';
    //类型
    str += '<td  colname="itemType">' + itemType + '</td>';
    //固定码
    str += '<td  colname="itemCode" >' + itemCode + '</td>';
    //填充长度
    str += '<td  colname="itemCodeLength" >' + itemCodeLength + '</td>';
    //  长度
    str += ' <td colname="itemLength" >' + itemLength + '</td></tr>';
    if (addRowID == 1) {
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
    }
    //序号重新生成
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
        var _itemCode = $("#txtIput" + id).val();
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
        ////配件编号 修改ID
        //$(this).find('td').eq(2).find("input:.peijianNum").attr("id", "txtIput" + addRowID);
        ////卸载所有事件
        //$(this).find('td').eq(2).find("input:.peijianNum").unbind();
        ////弹出框选择 
        //$(this).find('td').eq(3).find("input").attr("name", addRowID); //从新负值a:name
        //$(this).find('td').eq(3).find("input").unbind("blur"); //卸载单价事件
        //$(this).find('td').eq(3).find("input").blur(function () { //重新绑定事件
        //    ChangeCodeLength(this);
        //});
        $(this).find('td').eq(4).find("input").attr("name", addRowID); //从新负值a:name
        $(this).find('td').eq(4).find("input").unbind("keyup"); //卸载单价事件
        $(this).find('td').eq(4).find("input").unbind("blur"); //卸载单价事件
        $(this).find('td').eq(4).find("input").keyup(function () { //重新绑定事件
            ChangeLength(this);
        });
        $(this).find('td').eq(4).find("input").blur(function () { //重新绑定事件
            ChangeCodeLength(this);
        });
    });
}
function ChangeCodeLength(obj)
{
    //var len = obj.value.length;
    
    var code = $("tr[id='" + $(obj).attr("name") + "'] td[colName='itemCode'] input").val();
    if (code.length > obj.value) {
        parent.ShowMsg("填充长度必须大于起始值！");
        obj.value = "";
    }
}

function ChangeLength(obj)
{
    $("tr[id='" + $(obj).attr("name") + "'] td[colName='itemLength'] input").attr("maxlength", obj.value);
    //ChangeCodeLength(obj);
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
