<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="demoList.aspx.cs" Inherits="HH.Employee.WebUI.UI.demoList" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <link href="../Scripts/Iconfont/iconfont.css" rel="stylesheet" type="text/css" />
    <link href="/Scripts/EasyUi/themes/default/style.css" rel="stylesheet" type="text/css" />
    <link href="../Scripts/Iconfont/demo.css" rel="stylesheet" type="text/css" />
    <script src="/Scripts/jquery-1.5.1.min.js?v1.0" type="text/javascript"></script>
    <script src="/Scripts/Common.js" type="text/javascript"></script>
    <script type="text/javascript">
        $(function () {
            //$("li").unbind("click").bind("click", function () {
            //    var span_code = $(this).find("div[class='code']").text();
            //    $("ul").find("i[class='icon iconfont clicked']").removeClass("clicked");
            //    $(this).find("i[class='icon iconfont']").addClass("clicked");
            //    $("#hnd_imgid").val(span_code);
            //    //alert(span_code);
            //})

            SetPage();
            AjaxStop();
        })

        function AjaxStop() {
            parent.$("#divLoading").hide();
        }

        function SetPage() {

            var CN_S_CODE = $("#txt_ImgCode").val();  //图片编码
            var CN_S_NAME = "";//$("#txt_ImgName").val();//图片名称
            var CN_S_TAG = "";//$("#txt_ImgTag").val();//图片标签

            var Html = "";
            var ajaxUrl = "/UI/AjaxPage/ImgManager.ashx";
            var ajaxData = "Action=GetListNoPage&CN_S_CODE=" + CN_S_CODE + "&CN_S_NAME=" + CN_S_NAME + "&CN_S_TAG=" + CN_S_TAG;
            var msg = AjaxManagers(ajaxData, ajaxUrl);
            if (msg != "flase") {

                //字符串转成Json对象
                var data = (new Function("", "return " + msg))();
                //遍历数据行
                $.each(data, function (i, n) {
                    var iconcode = "&" + n.CN_S_CODE;
                    Html += "<li  onclick=\"selectArow(this);\" style='cursor:pointer'> ";
                    Html += "<i class=\"icon iconfont\">" + iconcode + "</i>";
                    Html += "<div class=\"name\" style='font-size:12px'>" + ConvertStringt(n.CN_S_NAME, 6) + "</div>";
                    Html += "<div class=\"code\" style='display:none'>&amp;" + n.CN_S_CODE + "</div>";
                    Html += "<div class=\"fontclass\">" + n.CN_S_TAG + "</div>";
                    Html += "</li>";
                });
                if (Html != "") {
                    $("#tbList").html(Html);
                }
                else {
                    parent.ShowMsg("未查询到需要的图标!");
                }
            }
            else {
                parent.ShowMsg("未查询到需要的图标!");
            }
        }

        function ConvertStringt(value, lengths) {
            if (value != null && value.length > lengths) {
                return value.substring(0, lengths) + "...";
            }
            else {
                return value;
            }
        }

        function selectArow(e) {
            var span_code = $(e).find("div[class='code']").text();
            $("ul").find("i[class='icon iconfont clicked']").removeClass("clicked");
            $(e).find("i[class='icon iconfont']").addClass("clicked");
            $("#hnd_imgid").val(span_code);

        }

    </script>


</head>
<body>

    <div class="main" style="padding: 0;">
        <div class="shadowBoxWhite" style="min-width: 400px; padding: 10px;">
            <div class="clear"></div>
            <div id="tab1" class="tabStyle">
                <input hidden="hidden" id="hnd_imgid" />
                <div>
                    <span>查询条件：</span>
                    <input class="inputText" id="txt_ImgCode" type="text" onkeyup="replaceSpecialSymbol(this)" />
                    <span class="title"><a class="button" id="btnSelect" onclick="SetPage()">查询</a></span>
                </div>
                <ul class="icon_lists clear" id="tbList">
                </ul>
            </div>
        </div>
    </div>


</body>
</html>
