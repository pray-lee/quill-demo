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
Quill.register('modules/counter', function (quill, options) {
    var container = document.querySelector('#counter');
    quill.on('text-change', function () {
        var text = quill.getText();
        container.innerText = text.length;
    });
});

// 字体自定义
var Size = Quill.import('attributors/style/size');
Size.whitelist = ['12px', '13px', '14px', '15px', '16px', '18px', '20px', '22px', '24px'];
Quill.register(Size, true);
var editor = new Quill('#editor', {
    modules: {
        toolbar: toolbarOptions,
        counter: true, //计数
    },
    theme: 'snow',
    placeholder: '请输入一些内容',
    readOnly: false,
    scrollingContainer: null // 指定该容器具有滚动条。
})
document.getElementsByClassName('ql-image')[0].setAttribute('id', 'ql-image')
// 事件处理程序 处理图片上传
var toolbar = editor.getModule('toolbar')
var CKinstance = new CKEditor('ql-image')
var uploader = CKinstance.createUploader(editor)
toolbar.addHandler('image', function () {
    CKEditor.set_upload_param(uploader, '', false)
})

var editor1 = new Quill('#editor1', {
    modules: {
        toolbar: toolbarOptions,
        counter: true, //计数
    },
    theme: 'snow',
    placeholder: '请输入一些内容',
    readOnly: false,
    scrollingContainer: null // 指定该容器具有滚动条。
})

// 给image按钮加一个id, 供upload.js使用
document.getElementsByClassName('ql-image')[1].setAttribute('id', 'ql-image1')

var toolbar1 = editor1.getModule('toolbar')
var CKinstance1 = new CKEditor('ql-image1')
var uploader1 = CKinstance1.createUploader(editor1)
toolbar1.addHandler('image', function () {
    CKEditor.set_upload_param(uploader1, '', false)
})