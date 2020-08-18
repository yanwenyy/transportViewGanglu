(function (b, fuc) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = fuc() :
        typeof define === 'function' && define.amd ? define(fuc) :
            (b = b || self, b.Box = fuc);
})(this, function (options) {
   /* 参数解说
    title:标题 (type:String)
    msg:提示内容 (type:String)
    titleClass:标题样式 (type:obj)
    modelClass:弹框样式 (type:obj)
    type:弹框类型 (type:String,val:'alert'||'confirm')
    okText:确认按钮文字 (type:String)
    confirmClass:确认按钮样式 (type:obj)
    cancelText:取消按钮文字 (type:String)
    cancelClass:取消按钮样式 (type:obj)
    suc:确认回调函数 (type:func)
    cancel:取消回调函数 (type:func)
    */
    function Box(options) {
        this._shadow=null;
        this.show=false;
        this.options = options;
        this.init();
    }
    function IsPC() {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone",
            "SymbianOS", "Windows Phone",
            "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    }

    var flag = IsPC(); //true为PC端，false为手机端
    var w = document.documentElement.clientWidth || document.body.clientWidth;
    var _px= flag?1:w / 750*2;
    Box.prototype = {
        constructor: Box,
        init:function () {
            this._creatShadow();
        },
        close:function(msg){
            msg.indexOf("取消")==-1&&this.options.succ?this.options.succ():this.options.cancel?this.options.cancel():console.log(msg);
            document.body.removeChild(this._shadow);
        },
        _creatShadow: function () {
            this._shadow = document.createElement('div');
            this._setStyle(this._shadow, "width:100vw;height:100vh;background:rgba(0,0,0,.3);position:fixed;top:0;left:0");
            this._shadow.appendChild(this._creatModel(this.options.title||"消息提示", this.options.msg||"消息说明"));
            document.body.appendChild(this._shadow);
        },
        _creatModel: function (title, msg) {
            // var _title = '<div style="text-align: center">' + title + '</div>',
            //     _body = '<div style="height:auto;box-sizing:border-box;padding:10px">' + msg + '</div>';
            var _title=document.createElement('div');
            _title.innerHTML=title;
            this._setStyle(_title, {
                "text-align":"center",
                "height":50*_px+"px",
                "line-height":50*_px+"px",
                "font-size":18*_px+"px",
                "border-bottom":0.5*_px+"px solid #ddd",
                "border-top-left-radius":10*_px+"px",
                "border-top-right-radius":10*_px+"px"
            });
            this._setStyle(_title,this.options.titleClass||'');
            var _body=document.createElement('div');
            _body.innerHTML=msg;
            this._setStyle(_body, {
                "height":"auto",
                "font-size":16*_px+"px",
                "box-sizing":"border-box",
                "padding":10*_px+"px"
            });
            var _model = document.createElement('div');
            this._setStyle(_model,"width:30%;margin:10% 35%;background:#fff;border-radius:"+10*_px+"px");
            this._setStyle(_model,{
                "width":flag?"30%":"60%",
                "margin":flag?"10% 35%":"30% 20%",
                "background":"#fff",
                "border-radius":10*_px+"px"
            });
            this._setStyle(_model,this.options.modelClass||'');
            _model.appendChild(_title);
            _model.appendChild(_body);
            _model.appendChild(this._creatFoot());
            return _model;
        },
        _creatFoot: function (t) {
            var _btnBox = document.createElement('div');
            this._setStyle(_btnBox, {
                "display":"flex",
                "justify-content":"space-around",
                "padding":20*_px+"px"
            });
            switch (this.options.type) {
                case "alert":
                    var _btn = document.createElement('div');
                    _btn.innerHTML = "确定";
                    this._setStyle(_btn, {
                        "width":"40%",
                        "border-radius":5*_px+"px",
                        "text-align": "center",
                        "background":"green",
                        "color":"#fff",
                        "height": flag?30*_px+"px":40*_px+"px",
                        "line-height": flag?30*_px+"px":40*_px+"px",
                        "font-size":14*_px+"px",
                        "cursor":"pointer"
                    });
                    this._setStyle(_btn,this.options.confirmClass||'');
                    _btn.onclick=this.close.bind(this,"用户点击确认");
                    _btnBox.appendChild(_btn);
                    break;
                case "confirm":
                   var  _btnConfirm=document.createElement('div');
                    _btnConfirm.innerHTML = this.options.okText||"确定";
                    this._setStyle(_btnConfirm, {
                        "width":"30%",
                        "border-radius":5*_px+"px",
                        "text-align": "center",
                        "background":"green",
                        "color":"#fff",
                        "height": flag?30*_px+"px":40*_px+"px",
                        "line-height": flag?30*_px+"px":40*_px+"px",
                        "font-size":14*_px+"px",
                        "cursor":"pointer"
                    });
                    this._setStyle(_btnConfirm,this.options.confirmClass||'');
                    _btnConfirm.onclick=this.close.bind(this,"用户点击确认");
                    var  _btnCancel=document.createElement('div');
                    _btnCancel.innerHTML = this.options.cancelText||"取消";
                    this._setStyle(_btnCancel, {
                        "border": 0.5*_px+"px solid #ddd",
                        "width":"30%",
                        "border-radius":5*_px+"px",
                        "text-align": "center",
                        "height": flag?30*_px+"px":40*_px+"px",
                        "line-height": flag?30*_px+"px":40*_px+"px",
                        "font-size":14*_px+"px",
                        "cursor":"pointer"
                    });
                    this._setStyle(_btnCancel,this.options.cancelClass||'');
                    _btnCancel.onclick=this.close.bind(this,"用户点击取消");
                    _btnBox.appendChild(_btnCancel);
                    _btnBox.appendChild(_btnConfirm);
            }
            return _btnBox;
        },
        _setStyle: function (e, s) {
            typeof s === "string" ? e.style.cssText+= s : Object.prototype.toString.call(s).toLowerCase() === '[object object]' ? _class() : _err();
            function _class() {
                var _cssText='';
                var reg = /\d+em/gi;
                for(var i in s){
                    // s[i].replace(reg,function (word) {
                    //     console.log(word);
                    //     console.log(word.substring("em")[0]*_px+"px");
                    //     return word.substring("em")[0]*_px+"px";
                    // });
                    _cssText+=i+":"+s[i]+";"
                }
                e.style.cssText +=_cssText;
            }

            function _err() {
                throw new Error("样式设置须是字符串格式或者对象格式")
            }

            return e;
        }
    };
    return new Box(options);
});