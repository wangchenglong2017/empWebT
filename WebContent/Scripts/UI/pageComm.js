///页面通用JS
/// HanHe(何厚超)2014/10/23 CREATED

//显示数据加载进度条
function AjaxStart() {
    parent.$("#divLoading").show();
}
//隐藏数据加载进度条
function AjaxStop() {
    parent.$("#divLoading").hide();
}

// 分页
function PagiantionFun(perPageItems, dispalyNum, edgeNum) {
    $("#Pagination").pagination($("#hdnTotalRow").val(), {
        callback: pageselectCallback, //PageCallback() 为翻页调用次函数。
        first_text: "首页",
        prev_text: "上一页",
        next_text: "下一页",
        last_text: "尾页",
        jump_text: "GO",
        jump_format_text: "请输入数字!",
        jump_outofrange_text: "已超出页数范围！",
        jump_null_text: "不允许为空",
        isSum: true,
        isJump: true,
        link_to: "javascript:void(0)",
        items_per_page: perPageItems, // pagesize:每页的数据个数
        num_display_entries: dispalyNum, //两侧首尾分页条目数 
        current_page: 0,   //page:当前页码
        num_edge_entries: edgeNum //连续分页主体部分分页条目数
    });
}

    // 委托，当单击指定标签外，隐藏指定标签
    // obj  对象筛选器  形如  #ID  .Class  Div等
    function HideCtlByClickOut(objDiv, objA) {
        //$(document).unbind("click").bind("click", function (e) {
        $(document).bind("click", function (e) {

            var target = $(e.target);
            $(objA).not(e.target).each(function () {
               
                $(this).parent().next().hide();

                // 存在                
                var divScroll = $(this).parent().next().find("div[name='div_SelfScroll']");
                if (divScroll) {
                    //$(divScroll).getNiceScroll().resize();
                }

            });

            //    for (var a in e)
            //      console.info(a);
            //if (target.closest(objDiv).length == 0 && target.closest(objA).length ==0) {
            //    $(objDiv).hide();
            //}
        })

    }

    // 委托，当单击指定标签外，隐藏指定标签
    // obj  对象筛选器  形如  #ID  .Class  Div等
    function HideDDLCtlByClickOut() {
        var objDiv = 'div[name="div_SelfDropDown"]';
        var objA = 'a[name="a_SelfDropDown"]';

        HideCtlByClickOut(objDiv, objA);
    }