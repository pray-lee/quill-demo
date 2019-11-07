accessid = '';
accesskey = '';
host = '';
policyBase64 = '';
signature = '';
callbackbody = '';
filename = '';
key = '';
expire = 0;
g_object_name = '';
g_object_name_type = '';
now = timestamp = Date.parse(new Date()) / 1000;
var date = new Date;
var year = date.getFullYear();
var month = date.getMonth() + 1;

function send_request() {
    var xmlhttp = null;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    if (xmlhttp != null) {
        // serverUrl是 用户获取 '签名和Policy' 等信息的应用服务器的URL，请将下面的IP和Port配置为您自己的真实信息。
        // serverUrl = 'http://39.105.98.125:8090'
        serverUrl = 'http://39.105.98.125:8090/Test/aliyunController.do?getSignature';
        // serverUrl = 'http://39.105.98.125:8888/CaiKa/aliyunController.do?getSignature';

        xmlhttp.open("GET", serverUrl, false);
        xmlhttp.send(null);
        return xmlhttp.responseText
    } else {
        alert("Your browser does not support XMLHTTP.");
    }
}

// function check_object_radio() {
//     var tt = document.getElementsByName('myradio');
//     for (var i = 0; i < tt.length ; i++ )
//     {
//         if(tt[i].checked)
//         {
//             g_object_name_type = tt[i].value;
//             break;
//         }
//     }
// }

function get_signature() {
    // 可以判断当前expire是否超过了当前时间， 如果超过了当前时间， 就重新取一下，3s 作为缓冲。
    now = timestamp = Date.parse(new Date()) / 1000;
    if (expire < now + 3) {
        body = send_request();
        var obj = eval("(" + body + ")");
        host = obj['host'];
        policyBase64 = obj['policy'];
        accessid = obj['accessid'];
        signature = obj['signature'];
        expire = parseInt(obj['expire']);
        callbackbody = obj['callback'];
        // var accountbookId = document.getElementById('accountbookId').value;
        // var submitterDepartmentId = document.getElementById("submitterDepartmentId").value;
        // var num = random_num(10);
        key = obj['dir'] + year + "/" + month + "/quill-img/";
        return true;
    }
    return false;
}

function random_string(len) {
    len = len || 32;
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

// function random_num(max) {
//     return Math.floor(Math.random() * max + 1);
// }

function get_suffix(filename) {
    pos = filename.lastIndexOf('.');
    suffix = '';
    if (pos != -1) {
        suffix = filename.substring(pos)
    }
    return suffix;
}

function calculate_object_name(filename) {
    // if (g_object_name_type == 'local_name')
    // {
    //     g_object_name += "${filename}"
    // }
    // else if (g_object_name_type == 'random_name')
    // {
    suffix = get_suffix(filename);
    g_object_name = key + random_string(10) + suffix;
    // }
    return ''
}

function get_uploaded_object_name(filename) {
    // if (g_object_name_type == 'local_name')
    // {
    //     tmp_name = g_object_name
    //     tmp_name = tmp_name.replace("${filename}", filename);
    //     return tmp_name
    // }
    // else if(g_object_name_type == 'random_name')
    // {
    return g_object_name
    // }
}

function set_upload_param(up, filename, ret) {
    if (ret == false) {
        ret = get_signature();
    }
    g_object_name = key;
    if (filename != '') {
        suffix = get_suffix(filename);
        calculate_object_name(filename)
    }
    new_multipart_params = {
        'key': g_object_name,
        'policy': policyBase64,
        'OSSAccessKeyId': accessid,
        'success_action_status': '200', //让服务端返回200,不然，默认会返回204
        'callback': callbackbody,
        'signature': signature
    };

    up.setOption({
        'url': host,
        'multipart_params': new_multipart_params
    });

    up.start();
}

var uploader = new plupload.Uploader({
    runtimes: 'html5,flash,silverlight,html4',
    browse_button: 'ql-image',
    // multi_selection: true,
    // container: document.getElementById('upload_table'),
    flash_swf_url: 'lib/plupload-2.1.2/js/Moxie.swf',
    silverlight_xap_url: 'lib/plupload-2.1.2/js/Moxie.xap',
    url: 'http://oss.aliyuncs.com',

    filters: {
        mime_types : [ //只允许上传图片和zip文件
        { title : "Image files", extensions : "jpg,gif,png,bmp" },
        { title : "Zip files", extensions : "zip,rar" }
        ],
        max_file_size: '10mb' //最大只能上传10mb的文件
        // prevent_duplicates : true //不允许选取重复文件
    },

    init: {
        PostInit: function () {
            // document.getElementById('ossfile').innerHTML = '';
            // document.getElementById('uplodeStart').onclick = function() {
            // set_upload_param(uploader, '', false,);
            // return false;
            // };
        },

        FilesAdded: function (up, files) {
            filesAdded(up, files, uploader);
        },

        // FilesRemoved: function(up, files) {
        //     plupload.each(files, function(file) {
        //         var tableId = $("#" + file.id).parent().parent().parent().parent().attr("id")
        //         $("#" + file.id).parent().parent().remove();
        //         resetTrNum(tableId);
        //     });
        // },

        BeforeUpload: function (up, file) {
            // check_object_radio();
            set_upload_param(up, file.name, true);
        },

        // UploadProgress: function (up, file) {
        //     // var d = document.getElementById(file.id);
        //     // d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
        //     // var prog = d.getElementsByTagName('div')[0];
        //     // var progBar = prog.getElementsByTagName('div')[0];
        //     // progBar.style.width= 2*file.percent+'px';
        //     // progBar.setAttribute('aria-valuenow', file.percent);
        // },

        FileUploaded: function (up, file, info) {
            // console.log(file, info)
            if (info.status == 200) {
                // document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = 'upload to oss success, object name:' + file.name + ' 回调服务器返回的内容是:' + info.response;
                console.log(editor)
                setUri(editor, file);
            } else if (info.status == 203) {
                document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '上传到OSS成功，但是oss访问用户设置的上传回调服务器失败，失败原因是:' + info.response;
            } else {
                document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
            }
        },

        Error: function (up, err) {
            if (err.code == -600) {
                alertTipTop("\n选择的文件超过10MB，无法上传！");
            } else if (err.code == -601) {
                alertTipTop("\n选择的文件后缀不对,可以根据应用情况，在upload.js进行设置可允许的上传文件类型");
            } else if (err.code == -602) {
                alertTipTop("\n这个文件已经上传过一遍了");
            } else {
                alertTipTop("\nError xml:" + err.response);
            }
        }
    }
});

uploader.init();

function setUri(editor, file) {
    // 插入图片回显
    showImage(editor, host + "/" + g_object_name)
}


function filesAdded(up, files, uploader) {
    var divhtml = "";
    plupload.each(files, function (file) {
        console.log(file)
        // var tmp = document.createElement('tr');
        // tmp.innerHTML =
        //     '<td class="form-ck" style="padding: 8px;"><input type="checkbox" code="ck" name="ck"/></td>' +
        //     '<td style="width: 55%;"> <div id="' + file.id + '"><a href="" target="_blank">' + file.name + ' (' + plupload.formatSize(file.size) + ')</a><b></b>' +
        //     '</div> </td>' +
        //     '<td style="width: 40%;"><input name="billFiles[#index#].remark" type="text" value="" style="width: 100%;height:27px;"  class="form-control input-sm" /></td>' +
        //     '<td style="display: none"><input name="billFiles[#index#].id" value="" readonly="readonly" type="text" class="form-control input-sm"/></td>' +
        //     '<td style="display: none"><input name="billFiles[#index#].name" value="' + file.name + '" readonly="readonly" type="text" class="form-control input-sm"/></td>' +
        //     '<td style="display: none"><input name="billFiles[#index#].uri" value="" readonly="readonly" type="text" class="form-control input-sm"/></td>' +
        //     '<td style="display: none"><input name="billFiles[#index#].size" value="' + plupload.formatSize(file.size) + '" readonly="readonly" type="text" class="form-control input-sm"/></td>' +
        //     '<td style="display: none"><input name="billFiles[#index#].billId" value="" readonly="readonly" type="text" class="form-control input-sm"/></td>'
        // ;
        // document.getElementById('ossfile').appendChild(tmp);

    });
    // resetTrNum('upload_table');
    set_upload_param(uploader, '', false);
}
