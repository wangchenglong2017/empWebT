//过滤特殊字符
function Filter(obj) {
    var value = $(obj).val();
    var s="";
    if (value.length == "") {
        return "";
    }
    else {
        s = value.replace(/[^a-zA-Z0-9\u4E00-\u9FA5]*$/, '');
    }
    if (value != s)
        $(obj).val(s);
}