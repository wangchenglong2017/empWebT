(function ($) {
    $.fn.fixTable = function (options) {
        var defaults = {
            fixColumn: 0,
            width: 0,
            height: 0
        };
        var opts = $.extend(defaults, options);
        var _this = $(this);
        var _clone = _this.clone();
        var _columnClone = _this.clone();
        var _columnDataClone = _this.clone();
        _this.wrap(function () {
            return $("<div id='_fixTableMain'></div>");
        });

        $("#_fixTableMain").css({

            "width": defaults["width"],
            "height": defaults["height"],
            "overflow": "scroll",
            "position": "relative",
        });

        $("#_fixTableMain").wrap(function () {
            return $("<div id='_fixTableBody'></div>");
        });

        $("#_fixTableBody").css({
            "background-color": "#fff", //"background-color":"yellow",
            "width": defaults["width"],
            "height": defaults["height"],
            "overflow": "hidden",
            "position": "relative"
        });
        $("#_fixTableBody").append("<div id='_fixTableHeader'></div>");
        $(_clone).height($(_clone).find("thead").height());
        $("#_fixTableHeader").append(_clone);  // º”±Ì ˝æ›
        $("#_fixTableHeader").css({
            "background-color": "#d7d7d7",
            "overflow": "hidden",
            "width": defaults["width"] - 17,
            "height": _clone.find("thead").find("tr").height() + 2,
            "position": "absolute",
            "z-index": "1", //88888
            "top": "0",
            "left": "0"
        });

        $("#_fixTableBody").append("<div id='_fixTableColumn'></div>");

        $("#_fixTableHeader table").removeAttr("id");

        $("#_fixTableHeader table tbody").remove();
        //≈–∂œ‰Ø¿¿∆˜ «≤ª «IE7
        if (myBrowser() == "IE7") {
            var width = $("#_fixTableHeader table thead").find("th[name=h_remark]").attr("width") - 17;
            $("#_fixTableHeader table thead").find("th[name=h_remark]").attr("width", width);
            
        }

        //			var _fixColumnNum = defaults["fixColumn"];
        //			var _fixColumnWidth = 0;
        //			$($(_this).find("thead").find("tr").find("th")).each(function(index, element) {
        //               	if((index+1)<=_fixColumnNum){
        //					_fixColumnWidth += $(this).width()+4;
        //				}
        //            });
        //			
        //			$("#_fixTableColumn").css({
        //				"overflow":"hidden",
        //				"width":_fixColumnWidth,
        //				"height":defaults["height"]-17,
        //				"position":"absolute",
        //				"z-index":"2",//99999
        //				"top":"0",
        //				"left":"0"
        //			});
        //			
        //			
        //			$("#_fixTableColumn").append("<div id='_fixTableColumnHeader'></div>");

        //			$("#_fixTableColumnHeader").css({
        //				"background-color":"#abc123",
        //				"width":$("#_fixTableColumn").width(),
        //				"height":_this.find("thead").find("tr").height()+1,
        //				"overflow":"hidden",
        //				"position":"absolute",
        //				"z-index":"2",//99999
        //			});

        //	$("#_fixTableColumnHeader").append(_columnClone);  º”±Ì…Ëº∆
        //			
        //			$("#_fixTableColumn").append("<div id='_fixTableColumnBody'></div>");
        //			
        //            $("#_fixTableColumnBody").css({
        //				"background-color":"#acd542",
        //				"width":$("#_fixTableColumn").width(),
        //				"height":defaults["height"]-17,
        //				"overflow":"hidden",
        //				"position":"absolute",
        //				"z-index":"2",//99999
        //				"top":"0"
        //			});

        //$("#_fixTableColumnBody").append(_columnDataClone);//º”±Ì ˝æ›

        $("#_fixTableMain").scroll(function (e) {
            $("#_fixTableHeader").scrollLeft($(this).scrollLeft());
            $("#_fixTableColumnBody").scrollTop($(this).scrollTop());
        });
    };

})(jQuery);




function myBrowser() {
    var userAgent = navigator.userAgent; //»°µ√‰Ø¿¿∆˜µƒuserAgent◊÷∑˚¥Æ
    var isOpera = userAgent.indexOf("Opera") > -1; //≈–∂œ «∑ÒOpera‰Ø¿¿∆˜
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //≈–∂œ «∑ÒIE‰Ø¿¿∆˜
    var isFF = userAgent.indexOf("Firefox") > -1; //≈–∂œ «∑ÒFirefox‰Ø¿¿∆˜
    var isSafari = userAgent.indexOf("Safari") > -1; //≈–∂œ «∑ÒSafari‰Ø¿¿∆˜


    if (isIE) {
        var IE5 = IE55 = IE6 = IE7 = IE8 = false;
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);

        IE55 = fIEVersion == 5.5;
        IE6 = fIEVersion == 6.0;
        IE7 = fIEVersion == 7.0;
        IE8 = fIEVersion == 8.0;

        if (IE55) { return "IE55"; }
        if (IE6) { return "IE6"; }
        if (IE7) { return "IE7"; }
        if (IE8) { return "IE8"; }
    } //isIE end

    if (isFF) { return "FF"; }
    if (isOpera) { return "Opera"; }

} //myBrowser() end