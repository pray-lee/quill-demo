// 工具栏选项
var toolbarOptions = [{
        'header': [1, 2, 3, 4, 5, 6, false]
    },
    'clean', // 清除格式
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    {
        size: ['12px', '13px', '14px', '15px', '16px', '18px', '20px', '22px', '24px']
    },
    // 'code-block',
    // {'direction': 'rtl'}, // 没求用
    {
        'font': []
    },
    {
        'align': []
    },
    {
        'color': []
    },
    {
        'background': []
    },
    {
        'indent': '-1'
    },
    {
        'indent': '+1'
    },
    {
        'list': 'ordered'
    },
    {
        'list': 'bullet'
    },
    // {'script': 'sub'},
    // {'script': 'super'},
    'link',
    // 'video',
    'image',
    // 'formula'
]

// 字数统计
// Quill.register('modules/counter', function (quill, options) {
//     var container = document.querySelector('#counter');
//     quill.on('text-change', function () {
//         var text = quill.getText();
//         container.innerText = text.length;
//     });
// });

// 字体自定义
var Size = Quill.import('attributors/style/size');
Size.whitelist = ['12px', '13px', '14px', '15px', '16px', '18px', '20px', '22px', '24px'];
Quill.register(Size, true);

// 绑定图片处理程序, 用来调用upload.js里面的功能
function bundleImageClick(eleId,editor) {
    document.getElementById(eleId).getElementsByClassName('ql-image')[0].setAttribute('id', 'ql-image' + eleId)
    var toolbar = editor.getModule('toolbar')
    var CKinstance = new CKEditor('ql-image' + eleId)
    var uploader = CKinstance.createUploader(editor)
    toolbar.addHandler('image', function () {
        CKEditor.set_upload_param(uploader, '', false)
    })
}