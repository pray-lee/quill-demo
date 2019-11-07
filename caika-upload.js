var CKOptions = {
    date: new Date,
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    now: Date.parse(new Date()) / 1000,
    accessid: '',
    host: '',
    policyBase64: '',
    signature: '',
    callbackbody: '',
    filename: '',
    key: '',
    expire: '',
    g_object_name: '',
    g_object_name_type: '',
}

// CkEditor constructor
function CKEditor (buttonID) {
    this.browse_button = buttonID || 'ql-image'
}

// 获取oss上传权限
CKEditor.send_request = function () {
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

// 获取签名
CKEditor.get_signature = function () {
    // 可以判断当前expire是否超过了当前时间， 如果超过了当前时间， 就重新取一下，3s 作为缓冲。
    CKOptions.now =  Date.parse(new Date()) / 1000;
    if (CKOptions.expire < CKOptions.now + 3) {
        body = CKEditor.send_request();
        var obj = eval("(" + body + ")");
        CKOptions.host = obj['host'];
        CKOptions.policyBase64 = obj['policy'];
        CKOptions.accessid = obj['accessid'];
        CKOptions.signature = obj['signature'];
        CKOptions.expire = parseInt(obj['expire']);
        CKOptions.callbackbody = obj['callback'];
        CKOptions.key = obj['dir'] + CKOptions.year + "/" + CKOptions.month + "/quill-img/";
        return true;
    }
    return false;
}

// 设置随机文件名
CKEditor.random_string = function(len) {
    len = len || 32;
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

// 获取后缀名
CKEditor.get_suffix = function (filename) {
    var pos = filename.lastIndexOf('.');
    suffix = '';
    if (pos != -1) {
        suffix = filename.substring(pos)
    }
    return suffix;
}

// 生成文件名
CKEditor.calculate_object_name = function (filename) {
    var suffix = CKEditor.get_suffix(filename);
    CKOptions.g_object_name = CKOptions.key + this.random_string(10) + suffix;
}

// 设置上传参数
CKEditor.set_upload_param = function(up, filename, ret) {
    if (ret == false) {
        ret = CKEditor.get_signature();
    }
    CKOptions.g_object_name = CKOptions.key;
    if (filename != '') {
        suffix = CKEditor.get_suffix(filename);
        CKEditor.calculate_object_name(filename)
    }
    var new_multipart_params = {
        'key': CKOptions.g_object_name,
        'policy': CKOptions.policyBase64,
        'OSSAccessKeyId': CKOptions.accessid,
        'success_action_status': '200', //让服务端返回200,不然，默认会返回204
        'callback': CKOptions.callbackbody,
        'signature': CKOptions.signature
    };

    up.setOption({
        'url': CKOptions.host,
        'multipart_params': new_multipart_params
    });

    up.start();
}
CKEditor.prototype.createUploader = function (editor) {
    var uploader = new plupload.Uploader({
        runtimes: 'html5,flash,silverlight,html4',
        browse_button: this.browse_button,
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
                CKEditor.filesAdded(up, files, uploader);
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
                CKEditor.set_upload_param(up, file.name, true);
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
                    CKEditor.setUri(editor, file);
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
    uploader.init()
    return uploader
}

// 回显回调
CKEditor.setUri = function (editor, file) {
    // 插入图片回显
    editor.insertEmbed(10, 'image', CKOptions.host + '/' + CKOptions.g_object_name)
}

// 上传
CKEditor.filesAdded = function (up, files, uploader) {
    CKEditor.set_upload_param(uploader, '', false);
}
