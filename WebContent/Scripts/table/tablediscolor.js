(function ($) {
    $.fn.extend({
        "alterBgColor": function (options) { 
            //设置默认值
         var option = $.extend({
                odd: "odd", //奇怪
                even: "even", //偶数
                selected: "selected", //选中行
                mouseover: "mouseover", //移入该行
                issingle: false, //是否单选
                isclickrowselected: true, //是否单击行选中
                callback: function () { return true; }
            }, options); //注意这个options 同上面的function(options)中的option是同一个对象

         //   callbackFun = option.callback;

            //鼠标移入该行和鼠标移除该行的事件
            $('tbody>tr', this).mouseover(function () {
                var hasSelected = $(this).hasClass(option.selected);
                if (!hasSelected) {
                    $(this).addClass(option.mouseover);
                }
                else {
                    $(this).removeClass(option.mouseover);
                }
            }).mouseout(function () {
                $(this).removeClass(option.mouseover);
            });

            //隔行变色
            $("tbody>tr:even", this).addClass(option.even);
            $("tbody>tr:odd", this).addClass(option.odd);

            //单击行变色
            $('tbody>tr', this).click(function () {
                var hasSelected = $(this).hasClass(option.selected);

                // 移除当前行的 鼠标移入样式
                $(this).removeClass(option.mouseover);


                if (option.issingle) {  //单选
                    $(this).siblings().removeClass(option.selected); // 取消其他行的选中状态
                    $(this).siblings().find(":checkbox").attr('checked', false); // 取消其他行的checkbox的选中状态
                }
                $(this)[hasSelected ? "removeClass" : "addClass"](option.selected); // 实现单击同一行时，实现行的选中/取消选中操作
                if (option.isclickrowselected) {//单击行，同时选中checkbox
                    $(this).find(":checkbox").attr('checked', !hasSelected); // 实现单击同一行时，实现行的checkbox 的选中与取消选中状态
                }

                option.callback(hasSelected, this);

            //    if (callbackFun)
                 //   callbackFun(hasSelected, this);
            });


            //            $('tbody>tr>td:has(td:has(input:checkbox))', this).click(function () {
            //                   var hasSelected = $(this).hasClass(option.selected);
            //                    //多选
            //                    if (!option.issingle) {
            //                        $(this)[hasSelected ? "removeClass" : "addClass"](option.selected).find(":checkbox").attr('checked', !hasSelected);
            //                    }
            //                    else {  //单选
            //                        $(this).addClass(option.selected).siblings().removeClass(option.selected);
            //                        $(this)[hasSelected ? "removeClass" : "addClass"](option.selected).find(":checkbox").attr('checked', !hasSelected);
            //                    }
            //              
            //                option.callback(hasSelected, this);
            //            });








            $("tbody>tr:has(:checked)", this).addClass(option.selected);

            return this;  //返回this，使方法可链
        }

    });

})(jQuery);


function AddStyle(rowObj,muitSel)
{
    $(rowObj).mouseover(function () {
        var hasSelected = $(this).hasClass("selected");
        if (!hasSelected) {
            $(this).addClass("mouseover");
        }
        else {
            $(this).removeClass("mouseover");
        }
    }).mouseout(function () {
        $(this).removeClass("mouseover");
    }).click(function () {
        var hasSelected = $(this).hasClass("selected");
        // 移除当前行的 鼠标移入样式
        $(this).removeClass("mouseover");
        if (muitSel == 0) {
            $(this).siblings().removeClass("selected"); // 取消其他行的选中状态
            $(this).siblings().find(":checkbox").attr('checked', false); // 取消其他行的checkbox的选中状态
        }
        $(this)[hasSelected ? "removeClass" : "addClass"]("selected"); // 实现单击同一行时，实现行的选中/取消选中操作
        $(this).find(":checkbox").attr('checked', !hasSelected); // 实现单击同一行时，实现行的checkbox 的选中与取消选中状态

    });
}