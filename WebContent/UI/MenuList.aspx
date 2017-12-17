<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="MenuList.aspx.cs" Inherits="HH.Employee.WebUI.UI.MenuList" validateRequest="false" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
 "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>菜单管理</title>
    <link rel="stylesheet" type="text/css" href="/Scripts/EasyUi/themes/default/style.css?v1.0" />
    <link rel="stylesheet" type="text/css" href="/Scripts/EasyUi/themes/icon.css?v1.0" />
    <link rel="stylesheet" type="text/css" href="/Scripts/UI/pager/pagination.css?v1.0" />
     <link href="../Scripts/Iconfont/iconfont.css" rel="stylesheet" type="text/css" />
    <link type="text/css" href="../Scripts/zTreev3.5.15/css/zTreeStyle/zTreeStyle.css" rel="stylesheet" />
    <script src="/Scripts/jquery-1.5.1.min.js?v1.0" type="text/javascript"></script>
    <script src="/Scripts/EasyUi/jquery.easyui.min.js?v1.0" type="text/javascript"></script>
    <script src="../Scripts/zTreev3.5.15/js/jquery.ztree.all-3.5.js" type="text/javascript"></script>
    <script src="/Scripts/UI/filter.js" type="text/javascript"></script>
    <script src="/Scripts/Common.js" type="text/javascript"></script>
    <link href="../Scripts/uploadify3.2/uploadify.css" rel="stylesheet" />
    <script src="../Scripts/uploadify3.2/jquery.uploadify.js" type="text/javascript"></script>
    <script type="text/javascript">
        $(function () {

            $("#butAdd").hide();
            $("#Abut").hide();
            var CN_S_APPCODE = GetCookie("AppCode");
            $("#AppCode").attr("title",CN_S_APPCODE);
            GetAPP();
            //是否是启用
            $("#CN_N_STATE,#aCN_N_STATE").click(function () {
                $("#ddCN_N_STATE p").bind("click", function () {
                    $("#CN_N_STATE").val($(this).text());
                    $("#ddCN_N_STATE").hide();
                });
                $("#ddCN_N_STATE").toggle(200);
            });
            //加载应用code
            $("#AppCode,#aAppCode").click(function () {
                $("#DAppCode p").unbind("click").bind("click", function () {
                    $("#AppCode").val($(this).text());
                    $("#AppCode").attr("title", $(this).attr("title"));
                    $("#DAppCode").hide();
                    refreshTree();
                });
                $("#DAppCode").toggle(200);
            });
   
            //加载菜单树
            refreshTree();
            
            Powder();
            AjaxStop();
        })

        function AjaxStop() {
            parent.$("#divLoading").hide();
        }
        var zTree1;
        var setting;
        //设置操作菜单的回调函数
        setting = {

            view: {
                dblClickExpand: true, //双击展开  
                showLayer: false,
                selectedMulti: false //是否允许多选  
                //showIcon: showIconForTree//显示节点小图标  
            },
            data: {
                simpleData: {
                    enable: true,
                    idKey: "id", //设定最进步数据
                    pIdKey: "pId",
                    rootPId: ""
                }
            },
            callback: {
                beforeClick: zTreeBeforeClick,
                beforeRename: null,
                onClick: zTreeOnClick,
                //remove: zTreeOnRemove,
                beforeDrag: zTreeBeforeDrag
            }
        };
        //拖拽菜单前执行的函数
        function zTreeBeforeDrag(treeId, treeNode) {
            return false;
        }
        //单击某一菜单前执行的函数
        function zTreeBeforeClick(treeId, treeNode) {
            var r = $("#beforeClickTrue").attr("checked");
            return r;
        }

 
     
        //加载菜单树
        function refreshTree() {
            var AppCode = $("#AppCode").attr("title"); //GetCookie("AppCode"); //$("#AppCode").attr();//所属应用
            var ajaxUrl = "/UI/AjaxPage/MenuManager.ashx";
            var ajaxData = "Action=GetList&AppCode=" + AppCode;
            var msgs = AjaxManagers(ajaxData, ajaxUrl);
            var data = (new Function("", "return " + msgs))();
            var zNodes = eval('[' + data + ']');
            setting.editable = true;
            setting.edit_renameBtn = false;
            setting.edit_removeBtn = false;
            zTree1 = $.fn.zTree.init($("#treeDemo"), setting, zNodes);
            var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
            treeObj.expandAll(true);
        }

        var indexNode = 0;
        function reload() {
            //搜索事件
            var i = 0;
            //获取隐藏控件ID
            var deptName = $("#SearchKeyWord").val();
            if (deptName == "" || deptName == null) {
                parent.ShowMsg("请输入关键字!");
                return false;
            }
            //获得树对象
            var treeDemo = $.fn.zTree.getZTreeObj("treeDemo");
            var nodes = treeDemo.getNodesByFilter(filterAll, false);
            if (nodes.length <= 0) {
                parent.ShowMsg("未找到匹配的节点!");
                return false;
            }
            var node = nodes[i];
            i++;
            if (i > parseInt(nodes.length - 1)) {
                i = 0;
            }
            if (indexNode == nodes.length) {
                indexNode = 0;
            }
            //如果有匹配项，则定位
            if (nodes.length > 0) {
                treeDemo.selectNode(nodes[indexNode]);
                //treeDemo.expandNode(nodes[indexNode], true, true, true);
                indexNode++;
            }
           // treeDemo.selectNode(node);
        }

        //过滤函数
        function filterAll(node) {
            //获得录入的查询关键字
            var str = $("#SearchKeyWord").val();
            return node.name.indexOf(str) > -1;
        }

         //修改
        function Update()
        {
         var guid=   $("#hid_id").val();
         if (guid.length == 0) {
             parent.ShowMsg("请先选择菜单!");
             return false;
         }
         //alert(guid.length);
         $("#Abut").show();
         $("#butAdd").show();                                                           
         $("#hid_Action").val("Update");
         $("#aimg").css("visibility", "visible");
        }

        //点击树节点
        function zTreeOnClick(event, treeId, treeNode) {
            $("#hid_id").val(treeNode.id);
            $("#hid_name").val(treeNode.name);
            Select();
            //alert(treeNode.id);
            //alert(treeNode.pId);
        }

        //带出详细信息
        function Select() {

            var Guid = $("#hid_id").val();
            var ajaxUrl = "/UI/AjaxPage/MenuManager.ashx";
            var ajaxData = "Action=GetModel&Guid=" + Guid;
            var msg = AjaxManagers(ajaxData, ajaxUrl);
            var data = (new Function("", "return " + msg))();
            $("#CN_S_MENUCODE").val(data.CN_S_MENUCODE);
            //根据ID 获取上级菜单的名称
            if (data.CN_S_PARENT_CODE.length > 10) {
                var treeDemo = $.fn.zTree.getZTreeObj("treeDemo");
                var node = treeDemo.getNodeByParam("id", data.CN_S_PARENT_CODE, null);
                $("#CN_S_PARENT_CODE").val(node.name);
                $("#CN_S_PARENT_CODE").attr(data.CN_S_PARENT_CODE);
            }
            $("#CN_S_MEUNNAME").val(data.CN_S_MEUNNAME);
            $("#CN_N_ORDER").val(data.CN_N_ORDER);
            if (data.CN_N_STATE == "0") {
                $("#CN_N_STATE").val("启用");
            } else {
                $("#CN_N_STATE").val("禁用");
            }
            $("#CN_S_URL").val(data.CN_S_URL);
            $("#CN_S_REMARK").val(data.CN_S_REMARK);
           // $("#CN_S_IMAGE").attr("title", data.CN_S_IMAGE);   //绑定图片title属性和src属性
            //$("#CN_S_IMAGE").attr("src", "../Images/MenuImg/" + data.CN_S_IMAGE)
            $("#CN_S_IMAGE").val("&"+data.CN_S_IMAGE);
          
            $("#CN_S_IMAGES").html("&"+data.CN_S_IMAGE);
            $("#hid_img").val(data.CN_S_IMAGE);
            $("#butAdd").hide();
            $("#aimg").css("visibility", "hidden");

        }

        //保存
        function Seve() {
            var obj = {};
            obj.CN_GUID = $("#hid_id").val();
            //obj.CN_S_IMAGE = $("#CN_S_IMAGE").attr("src");
            obj.CN_S_IMAGE = $("#CN_S_IMAGE").val();
            obj.CN_S_IMAGE = obj.CN_S_IMAGE.substr(1);
            if (obj.CN_S_IMAGE.length < 5) {
                parent.ShowMsg("菜单图片不能为空!");
                return false;
            }
            if (obj.CN_S_IMAGE.length < 100)
            {
                //obj.CN_S_IMAGE = $("#hid_img").val();
            }

            obj.CN_S_MEUNNAME = $("#CN_S_MEUNNAME").val();
            if (obj.CN_S_MEUNNAME == undefined || obj.CN_S_MEUNNAME == "") {
                parent.ShowMsg("菜单名称不能为空!");
                return false;
            }
            obj.CN_N_ORDER = $("#CN_N_ORDER").val();
            if (obj.CN_N_ORDER == undefined || obj.CN_N_ORDER == "") {
                parent.ShowMsg("排序不能为空!");
                return false;
            }
            obj.CN_N_STATE = $("#CN_N_STATE").val();
            if (obj.CN_N_STATE == "启用") {
                obj.CN_N_STATE = 0;
            } else {
                obj.CN_N_STATE = 1;
            }
            obj.CN_S_URL = $("#CN_S_URL").val();
            if (obj.CN_S_URL == undefined || obj.CN_S_URL == "") {
                parent.ShowMsg("链接地址不能为空!");
                return false;
            }
            obj.CN_S_REMARK = $("#CN_S_REMARK").val();
          
            obj.CN_S_CREATOR = GetCookie("EmplyeeUserName");
            obj.Flag = GetCookie("EmplyeeUserFlag");
            obj.CN_S_APPCODE = GetCookie("AppCode");
         
            var ajaxUrl = "/UI/AjaxPage/MenuManager.ashx";
            var ajaxData = "Action=Update&jsonString=" + escape(JSON.stringify(obj));
            var msg = AjaxManagers(ajaxData, ajaxUrl);
            if (msg = true || msg == "true") {
                parent.ShowMsg("修改成功!");
               
                refreshTree();
            } else {
               parent.ShowMsg("修改失败!");
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
        function Assigned()
        {
            var AppCode = $("#AppCode").attr("title");
            var guid = $("#hid_id").val();
            if (guid.length == 0) {
                parent.ShowMsg("请先选择菜单!");
                return false;
            }
            var Title = "菜单功能分配";
            //显示进度条 
            parent.$("#divLoading").show();
            parent.$('#openFrameDiv').dialog({
                title: Title,
                width: 601,
                height: 498,
                closed: true,
                cache: false,
                modal: true,
                maximizable: true,
                resizable: true,
                onClose: function () {
                    parent.$('#openIframe')[0].src = "none.html";
                },
                buttons: null
            });
            parent.$('#openIframe')[0].src = "/UI/MenuAssigned.aspx?GUID=" + guid + "&AppCode="+AppCode;
            parent.$('#openFrameDiv').dialog('open');
        }
         //加载应用列表
        function GetAPP() {
            var html = "";
            var ajaxUrl = "/UI/AjaxPage/AppManager.ashx";
            var ajaxData = "Action=GetList&CN_S_APPNAME&CN_S_APPCODE";
            var msg = AjaxManagers(ajaxData, ajaxUrl);
            var name = "", title = "";
            if (msg != "flase") {
                //字符串转成Json对象
                var data = (new Function("", "return " + msg))();
                //遍历数据行
                $.each(data.LIST, function (i, n)   {
                 
                    html += "<p title=" + n.CN_S_APPCODE + ">" + n.CN_S_APPNAME + "</p>";
                    if (name == "") {
                       
                        name = n.CN_S_APPNAME; 
                        title = n.CN_S_APPCODE;
                    }
                });
            }
            $("#AppCode").val(name);
            $("#AppCode").attr("title", title);
            $("#DAppCode").html(html);
        }



        function ImgClick() {
            //显示进度条 
            parent.$("#divLoading").show();
            parent.$('#openFrameDiv').dialog({
                title: '选择图片',
                width: 850,
                height: 508,
                closed: false,
                cache: false,
                modal: true,
                maximizable: false,
                resizable: true,
                onClose: function () {
                    parent.$('#openIframe')[0].src = "none.html";
                },
                buttons: [{
                    text: '确定',
                    iconcls: 'l-btn-left2',
                    handler: function () {
                        var Code = parent.$('#openIframe')[0].contentWindow.$('#hnd_imgid').val();
                        if (Code != "") {
                            $("#CN_S_IMAGE").val(Code);
                            $("#CN_S_IMAGES").html(Code);
                            parent.$('#openFrameDiv').dialog('close');
                        }
                        else {
                            parent.ShowMsg("请选择图片!");
                            return false;
                        }
                    }
                }, {
                    text: '关闭',
                    handler: function () {
                        parent.$('#openFrameDiv').dialog('close');
                    }
                }],
            });
            parent.$('#openIframe')[0].src = "/UI/demoList.aspx"
            parent.$('#openFrameDiv').dialog('open');
        }


    </script>
</head>
<body>
    <form id="form" runat="server">
        <input type="hidden" id="keyword" />
        <input type="hidden" id="hid_id" />
        <input type="hidden" id="hid_name" />
        <input type="hidden" id="hid_Action" />
        <input type="hidden" id="hid_img" />
        <div class="main">
            <table style="min-width: 882px;" width="100%" border="0" height="500" cellspacing="0"
                cellpadding="0">
                <tr>
                    <td>
                        <div class="searchShow">
                            <div>
                                <span class="title">所属应用：</span>
                                <%--<input  id="AppCode"  class="inputText" type="text" readonly="readonly" style="width:150px;"onblur="refreshTree()"/>--%>

                                <div style="position: relative; z-index: 2; padding: 0; text-align: Left">
                                    <span class="active" style="width: 190px; margin: 0;"> 
                                        <input id="AppCode" class="inputText" type="text" value="" readonly="readonly" style="width: 160px; border: none;" onblur="refreshTree()" />
                                        <a id="aAppCode" href="javascript:void(0);" name="a_SelfDropDown" class="trigger"></a>
                                    </span>
                                    <div id="DAppCode" name="div_SelfDropDown" class="dropList" style="width: 190px; display: none; z-index: 7; overflow-y: auto; max-height: 150px">
                                    </div>
                                </div>
                            </div>
                            <span class="title">
                                <a href="#" class="button blueButton" onclick="Update()" power="Edit">修改</a>
                                <a href="#" class="button blueButton" onclick="Assigned()" power="MunuButtom">功能分配</a>
                            </span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td style="height: 10px"></td>
                </tr>
                <tr>
                    <td bgcolor="#e6e6e8">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" height="510">
                            <tr>
                                <td valign="top">
                                    <div class="shadowBoxWhite" style="height: 500px; overflow: hidden; padding: 10px;">
                                        <div style="margin-bottom: 10px;">
                                            <input id="SearchKeyWord" name="SearchKeyWord" type="text" class="inputText" style="margin-right: 5px;" />
                                            <a href="#" class="button greenButton" onclick="reload()" id="search">定位</a>
                                        </div>
                                        <div id="Div1">
                                            <div class="zTreeDemoBackground" style="width: 250px;">
                                                <ul id="treeDemo" class="ztree" style="width: 220px; min-height: 380px">
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td valign="top" style="padding-left: 10px;" width="100%">

                                    <div class=" shadowBoxWhite whiteBox" id="div3" style="float: left; height: 520px; width: 100%">
                                        <div class="title" id="div2">基础数据</div>
                                        <div class="text">
                                            <div id="divpSubDeptlist">
                                                <table width="100%" cellspacing="2" cellpadding="4" id="tabProducts" style="font-size: 13px;">
                                                  <%--  <tr>
                                                        <td style="text-align: right; width: 150px;">菜单图标：</td>
                                                        <td style="text-align: left">
                                                            <div class="col-sm-9 big-photo">
                                                                <div id="preview">
                                                                    <img id="CN_S_IMAGE" title="点击更换" border="0" src="/Images/photo_icon.png" width="48" height="48" onclick="$('#previewImg').click();" />
                                                                </div>
                                                                <input type="file" onchange="previewImage(this)" style="display: none;" id="previewImg" /><span>注:图片尺寸推荐48*48</span>
                                                                <!--<input id="uploaderInput" class="uploader__input" style="display: none;" type="file" accept="" multiple="">-->
                                                            </div>
                                                        </td>
                                                    </tr>--%>
                                                        <tr>
                                                        <td style="text-align: right; width: 150px;">菜单图标：</td>
                                                        <td style="text-align: left">
                                                               <i class="icon iconfont" id="CN_S_IMAGES" style="font-size:35px">&#xe691;</i>
                                                            <input type="hidden" id="CN_S_IMAGE" />
                                                            <a   id="aimg" onclick="ImgClick()" style="visibility:hidden;cursor:pointer">更改</a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="text-align: right">上级菜单：</td>
                                                        <td style="text-align: left">
                                                            <input class="inputText wf200" id="CN_S_PARENT_CODE" type="text" maxlength="30" disabled="disabled" />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="text-align: right">菜单编码：</td>
                                                        <td style="text-align: left">
                                                            <input class="inputText wf200" id="CN_S_MENUCODE" type="text" maxlength="30" onkeyup="value=value.replace(/[^\w\.\/]/ig,'')" disabled="disabled" />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="text-align: right">菜单名称：</td>
                                                        <td style="text-align: left">
                                                            <input class="inputText wf200" id="CN_S_MEUNNAME" type="text" maxlength="10" onkeyup="replaceSpecialSymbol(this)" />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="text-align: right">排序：</td>
                                                        <td style="text-align: left">
                                                            <input class="inputText wf200" id="CN_N_ORDER" type="text" maxlength="8" onkeyup='this.value=this.value.replace(/\D/gi,"")' />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="text-align: right">菜单状态：</td>
                                                        <td style="text-align: left">
                                                            <div style="position: relative; z-index: 2; padding: 0; margin: 0;">
                                                                <span class="active" style="width: 210px; margin: 0;">
                                                                    <input id="CN_N_STATE" class="inputText wf200" type="text" value="" readonly="readonly" style="width: 180px;" />
                                                                    <a id="aCN_N_STATE" href="javascript:void(0);" class="trigger"></a>
                                                                </span>
                                                                <div id="ddCN_N_STATE" class="dropList" style="width: 210px; display: none; z-index: 4">
                                                                    <p title="0">启用</p>
                                                                    <p title="1">禁用</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="text-align: right">链接地址：</td>
                                                        <td style="text-align: left">
                                                            <input class="inputText wf200" id="CN_S_URL" type="text" maxlength="50" />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="text-align: right">备注：</td>
                                                        <td style="text-align: left">
                                                            <textarea id="CN_S_REMARK" maxlength="50" style="width:205px;height: 60px" rows="3"></textarea>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td></td>
                                                        <td style="text-align: left"><a id="butAdd" onclick="Seve()" class="button blueButton">保存</a></td>
                                                    </tr>

                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

        </div>
    </form>
</body>
</html>
