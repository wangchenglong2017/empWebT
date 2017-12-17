<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="OrgAdd.aspx.cs" Inherits="HH.Employee.WebUI.UI.OrgAdd" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>新增机构</title>
    <link href="/Scripts/lhgcalendar/skins/lhgcalendar.css" rel="stylesheet" type="text/css" />
    <link href="/Scripts/EasyUi/themes/default/style.css" rel="stylesheet" />
    <link href="/Scripts/EasyUi/themes/default/newStyle.css" rel="stylesheet" />
    <script src="/Scripts/jquery-1.5.1.min.js" type="text/javascript"></script>
    <script src="/Scripts/EasyUi/jquery.easyui.min.js" type="text/javascript"></script>
    <link href="/Scripts/UI/pager/pagination.css" rel="stylesheet" type="text/css" />
    <script src="/Scripts/UI/pager/jquery.pagination.js" type="text/javascript"></script>
    <script src="/Scripts/lhgcalendar/lhgcalendar.min.js" type="text/javascript"></script>
    <script src="/Scripts/Common.js" type="text/javascript"></script>
    <script type="text/javascript">
        var pCode = GetQueryString("orgCode");
        var pName = GetQueryString("orgName");
        var login = GetCookie("EmplyeeUserName");
        var flag = GetCookie("EmplyeeUserFlag");
        var appCode = GetCookie("AppCode");
        $(function () {
            //选择
            $("#div_Type>p").bind("click", function () {
                //类型
                var name = $(this).text();
                $("#txtType").val(name);
                $("#div_Type").hide();
            });

            $("#a_Type,#txtType").click(function () {
                $("#div_Type").toggle(200);
            });

            $("#txtPOrg").val(pName);
            $("#txtPOrg").attr("name", pCode);

            $(".tab_title a").click(function () {
                $(this).addClass("type_clicked").siblings().removeClass("type_clicked");
                var index = $(".tab_title a").index(this);
                $(".tab_box > div")
                    .eq(index).show()
                    .siblings().hide();
            })

            parent.$("#divLoading").hide();
        });

        function Seve() {
            var org = {};
            org.CN_GUID = $("#orgCode").val();
            org.CN_S_ORGCODE = $("#txtOrgCode").val();
            if (org.CN_S_ORGCODE == "") {
                parent.ShowMsg("机构编码必填！");
                return false;
            }
            if (org.CN_S_ORGCODE.length >= 36) {
                parent.ShowMsg("机构编码超长！");
                return false;
            }
            org.CN_S_ORGNAME = $("#txtOrgName").val();
            if (org.CN_S_ORGNAME == "") {
                parent.ShowMsg("机构名称必填！");
                return false;
            }
            if (org.CN_S_ORGNAME.length >= 36) {
                parent.ShowMsg("机构名称超长！");
                return false;
            }

            org.CN_S_OWNERID = $("#txtPOrg").attr("name");
            org.CN_N_ORDER = $("#txtOrder").val();
            if (org.CN_N_ORDER == "") {
                parent.ShowMsg("排序必填！");
                return false;
            }
            org.CN_S_ORGTYPE = $("#txtType").val();
            if (org.CN_S_ORGTYPE == "") {
                parent.ShowMsg("请选择组织机构类型！");
                return false;
            }
            org.CN_S_SHORTNAME = $("#txtShortName").val();
            org.CN_S_IMG = $("#CN_S_IMAGE").attr("src");
            org.CN_S_ADDRESS = $("#txtAddress").val();
            org.CN_S_POST = $("#txtPost").val();
            if (org.CN_S_POST != "" && org.CN_S_POST.length > 6) {
                parent.ShowMsg("邮编不能大于6位！");
                return false;
            }
            org.CN_S_PHONE = $("#txtPhone").val();
            org.CN_S_PHONE2 = $("#txtPhone2").val();
            org.CN_S_PHONE3 = $("#txtPhone3").val();
            org.CN_S_FAX = $("#txtFax").val();
            org.CN_S_EMAIL = $("#txtEmail").val();
            org.CN_S_WEBURL = "";
            org.CN_S_NOTE = $("#txtRemark").val();
            org.CN_S_APPCODE = appCode;
            org.login = login;
            org.Flag = flag;

            var ajaxUrl = "/UI/AjaxPage/OrgManager.ashx";//webapi + "/api/Org/AddOrg";
            var ajaxData = "Action=AddOrg&JsonString=" + JSON.stringify(org);

            var msg = AjaxManagers(ajaxData, ajaxUrl);
            if (msg != "") {
                var data = (new Function("", "return " + msg))();
                if (data.Success == 'true' || data.Success == true) {
                    parent.ShowMsg("添加成功！");
                    parent.$('#tabs .panel:visible iframe')[0].contentWindow.refreshTree();
                    parent.$('#openFrameDiv').dialog('close');
                }
                else {
                    parent.ShowMsg("添加失败：" + data.Msg);
                }
            }
        }

        //图片上传预览    IE是用了滤镜。
        function previewImage(file) {
            var MAXWIDTH = 90;
            var MAXHEIGHT = 90;
            var div = document.getElementById('preview');
            if (file.files && file.files[0]) {
                div.innerHTML = '<img id=CN_S_IMAGE onclick=$("#previewImg").click()>';
                var img = document.getElementById('CN_S_IMAGE');
                img.onload = function () {
                    var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
                    img.width = rect.width;
                    img.height = rect.height;
                    //                 img.style.marginLeft = rect.left+'px';
                    img.style.marginTop = rect.top + 'px';
                }
                var reader = new FileReader();
                reader.onload = function (evt) { img.src = evt.target.result; }
                reader.readAsDataURL(file.files[0]);
            }
            else //兼容IE
            {
                var sFilter = 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';
                file.select();
                var src = document.selection.createRange().text;
                div.innerHTML = '<img id=CN_S_IMAGE>';
                var img = document.getElementById('CN_S_IMAGE');
                img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
                var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
                status = ('rect:' + rect.top + ',' + rect.left + ',' + rect.width + ',' + rect.height);
                div.innerHTML = "<div id=divhead style='width:" + rect.width + "px;height:" + rect.height + "px;margin-top:" + rect.top + "px;" + sFilter + src + "\"'></div>";
            }
        }
        function clacImgZoomParam(maxWidth, maxHeight, width, height) {
            var param = { top: 0, left: 0, width: width, height: height };
            if (width > maxWidth || height > maxHeight) {
                rateWidth = width / maxWidth;
                rateHeight = height / maxHeight;

                if (rateWidth > rateHeight) {
                    param.width = maxWidth;
                    param.height = Math.round(height / rateWidth);
                } else {
                    param.width = Math.round(width / rateHeight);
                    param.height = maxHeight;
                }
            }
            param.left = Math.round((maxWidth - param.width) / 2);
            param.top = Math.round((maxHeight - param.height) / 2);
            return param;
        }
    </script>
</head>
<body>
    <div class="popUp" style="width: 700px; height: 450px;">
        <div class="popCon" style="height: 409px; padding: 10px; overflow: auto;">
            <div class="tabsDiv" style="width: 100%;">
                <div class="tab_title">
                    <a href="#" class="type_clicked">基础信息</a>
                    <a href="#">扩展信息</a>
                </div>
                <div class="tab_box">
                    <div style="">
                        <table border="0" cellpadding="8" cellspacing="0" width="100%">
                            <tr>
                                <td width="35%" align="right" class="font14"><font color="red">*</font>上级机构：</td>
                                <td width="65%" align="left">
                                    <input id="txtPOrg" type="text" class="inputText wf200" disabled="disabled" /></td>
                            </tr>
                            <tr>
                                <td width="35%" align="right" class="font14"><font color="red">*</font>机构编码：</td>
                                <td width="65%" align="left">
                                    <input id="txtOrgCode" type="text" class="inputText wf200" maxlength="16" onkeyup="value=value.replace(/[^\w\.\/]/ig,'')"/></td>
                            </tr>
                            <tr>
                                <td width="35%" align="right" class="font14"><font color="red">*</font>机构名称：</td>
                                <td width="65%" align="left">
                                    <input id="txtOrgName" type="text" class="inputText wf200" maxlength="16"/></td>
                            </tr>
                            <tr>
                                <td width="35%" align="right" class="font14"><font color="red">*</font>排序：</td>
                                <td width="65%" align="left">
                                    <input id="txtOrder" type="number"   min="0" onblur="Examine()" class="inputText wf200" onkeyup='this.value=this.value.replace(/\D/gi,"")' /></td>
                            </tr>
                            <tr>
                                <td width="35%" align="right" class="font14"><font color="red">*</font>机构类型：</td>
                                <td width="65%" align="left">
                                    <div style="position: relative; z-index: 4;">
                                        <span class="active" style="width: 210px; margin: 0;">
                                            <input class="inputText" type="text" readonly="readonly" style="width: 180px;" id="txtType">
                                            <a id="a_Type" href="#" class="trigger"></a></span>
                                        <div class="dropList" id="div_Type" style="width: 210px; display: none;">
                                            <p>大区</p>
                                            <p>分公司</p>
                                            <p>子公司</p>
                                            <p>部门</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="35%" align="right" class="font14">机构描述：</td>
                                <td width="65%" align="left">
                                    <textarea class="textarea wf200" rows="3" id="txtRemark" maxlength="100"></textarea>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div style="display: none">
                        <table border="0" cellpadding="8" cellspacing="0" width="100%">
                            <%--<tr>
                                <td width="15%" align="right" class="font14">Logo：</td>
                                <td align="left" colspan="3">
                                    <div id="preview">
                                        <img id="CN_S_IMAGE" title="点击更换" border="0" src="/Images/photo_icon.png" width="48" height="48" onclick="$('#previewImg').click();" />
                                    </div>
                                    <input type="file" onchange="previewImage(this)" style="display: none;" id="previewImg" />
                                </td>
                            </tr>--%>
                            <tr>
                                <td width="15%" align="right" class="font14">简  称：</td>
                                <td width="35%" align="left">
                                    <input id="txtShortName" type="text" class="inputText wf200" /></td>
                                <td width="15%" align="right" class="font14">电  话：</td>
                                <td width="35%" align="left">
                                    <input id="txtPhone" type="text" class="inputText wf200" /></td>
                            </tr>
                            <tr>
                                <td width="15%" align="right" class="font14">电  话2：</td>
                                <td width="35%" align="left">
                                    <input id="txtPhone2" type="text" class="inputText wf200" /></td>
                                <td width="15%" align="right" class="font14">固定电话：</td>
                                <td width="35%" align="left">
                                    <input id="txtPhone3" type="text" class="inputText wf200" /></td>
                            </tr>
                            <tr>
                                <td width="15%" align="right" class="font14">传真：</td>
                                <td width="35%" align="left">
                                    <input id="txtFax" type="text" class="inputText wf200" /></td>
                                <td width="15%" align="right" class="font14">邮箱：</td>
                                <td width="35%" align="left">
                                    <input id="txtEmail" type="email" class="inputText wf200" /></td>
                            </tr>
                            <tr>
                                <td width="15%" align="right" class="font14">邮编：</td>
                                <td width="35%" align="left" colspan="3">
                                    <input id="txtPost" type="text" class="inputText wf200" /></td>
                            </tr>
                            <tr>
                                <td width="15%" align="right" class="font14">地址：</td>
                                <td align="left" colspan="3">
                                    <input id="txtAddress" type="text" class="inputText wf200" style="width: 540px" /></td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div class="popBottom">
            <a href="#" class="button blueButton" onclick="Seve()">保存</a>
            <a href="#" class="button" onclick="javascript: parent.$('#openFrameDiv').dialog('close');">关闭</a>
        </div>
    </div>
</body>
</html>
