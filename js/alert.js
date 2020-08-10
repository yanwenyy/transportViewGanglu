(function ($) {
    //初始化参数
    var Alert=function(data){
        if(!data){return ;}
        this.msg=data.msg;
        this.ok=data.ok;
        this.no=data.no;
        this.callback=data.callback;
    };
    Alert.prototype={
        init:function(){
            var callback=this.callback;
            var model=$("<div></div>");
            model.css({
                "width":"100%",
                "height":"100%",
                "background":"rgba(0,0,0,.3)",
                "position":'fixed',
                "top":"0",
                'left':'0'
            });
            var div=$("<div></div>");
            div.css({
                'width':'60%',
                'min-height':'20%',
                'height':'auto',
                'background':'#fff',
                'border-radius':'1rem',
                'margin':'30% auto',
                'position':'relative'
            });
            var title=$("<div>"+this.msg+"</div>");
            title.css({
                'width':'100%',
                'min-height':'8rem',
                'height':'auto',
                'line-height':'8rem',
                'text-align':'center',
                'font-size':'2.8rem',
                'font-weight':'bold',
            });
            var btn=$('<div><span class="btn no-btn">'+this.no+'</span><span class="btn ok-btn">'+this.ok+'</span></div>');
            btn.css({
                'width':'100%',
                'position':'absolute',
                'bottom':'2rem',
                'text-align':'center'
            });
            btn.children(".btn").css({
                'width':'30%',
                'height':'6rem',
                'line-height':'6rem',
                'text-align':'center',
                'font-size':'2.4rem',
                'color':'#fff',
                'border-radius':'0.5rem',
                'display':'inline-block'
            });
            btn.children(".no-btn").css({
                'background':'#eee',
                'margin-right':'3%'
            }).on('click',close);
            btn.children(".ok-btn").css({
                'background':'rgba(254, 109, 39, 1)',
            }).on('click',okclick);
            div.append(title);
            div.append(btn);
            model.append(div);
            var body=$("body");
            body.append(model);
            function close(){
                model.hide();
                model.remove();
            }
            function okclick(){
                callback();
                model.hide();
                model.remove();
            }
        }
    };
    alerting=function(options){
        var alerting=new Alert(options);
        return alerting.init();
    };
})(jQuery);