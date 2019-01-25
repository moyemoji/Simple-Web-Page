window.onload = function () {
    // 几个兼容问题记录一下
    // 1、事件绑定方式，addEventListener和attachEvent
    // 2、foreach方法
    // 3、Array的相关方法
    // 4、元素样式

    /////////////////////////////////////////////////////////////////////////////////////////
    
    // 绑定事件兼容写法，attach为ie，add为ff和chrome
    // obj为要绑定事件的元素，ev为要绑定的事件，fn为绑定事件的函数
    function myAddEvent(obj, ev, fn) {        
        if (obj.attachEvent)         {          
            obj.attachEvent("on" + ev, fn);        
        }        
        else if(obj.addEventListener){          
            obj.addEventListener(ev, fn, false);        
        }else{
            obj["on"+ev]=fn;
        }   
    }

    //兼容removeEventListener函数
    function myRemoveEvent(ele, event, fn) {
        if (ele.removeEventListener) {
            ele.removeEventListener(event, fn, false);
        } else if(ele.detachEvent) {
            ele.detachEvent('on' + event, fn.bind(ele));
        }else{
            ele["on"+event]=null;
        }
    }


    // foreach兼容写法
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function forEach(callback, thisArg) {
            var T, k;
            if (this == null) {
                throw new TypeError("this is null or not defined");
            }
            var O = Object(this);
            var len = O.length >>> 0;
            if (typeof callback !== "function") {
                throw new TypeError(callback + " is not a function");
            }
            if (arguments.length > 1) {
                T = thisArg;
            }
            k = 0;
            while (k < len) {
                var kValue;
                if (k in O) {
                    kValue = O[k];
                    callback.call(T, kValue, k, O);
                }
                k++;
            }
        };
    }


    // Array.from兼容写法
    if (!Array.from) {
        Array.from = function (el) {
            return Array.apply(this, el);
        }
    }


    // 简单的节流函数
    function throttle(func, wait, mustRun) {
        var timeout, startTime = new Date();
        return function () {
            var context = this,
                args = arguments,
                curTime = new Date();
            clearTimeout(timeout);
            // 如果达到了规定的触发时间间隔，触发 handler
            if (curTime - startTime >= mustRun) {
                func.apply(context, args);
                startTime = curTime;
                // 没达到触发间隔，重新设定定时器
            } else {
                timeout = setTimeout(func, wait);
            }
        };
    };


    // 获取元素到html/body的距离
    function offsetDis(obj) {
        var l = 0,
            t = 0;
        while (obj) {
            l = l + obj.offsetLeft + obj.clientLeft;
            t = t + obj.offsetTop + obj.clientTop;
            obj = obj.offsetParent;
        }
        return {
            left: l,
            top: t
        };
    }

    /////////////////////////////////////////////////////////////////////////////////////////

    // 滚轮滚动首屏透明度更改
    function changeOpacity() {
        var st = document.documentElement.scrollTop || document.body.scrollTop;
        var h = document.getElementById("background").offsetHeight;
        var op = (1 - 1.2 * st / h) > 0 ? (1 - 1.2 * st / h) : 0;
        var love = document.getElementById("love");
        var you = document.getElementById("you");
        love.style.opacity = op;
        you.style.opacity = op;
    }

    // 修改首屏文字透明度
    myAddEvent(window, "scroll", throttle(changeOpacity, 10, 100));

    /////////////////////////////////////////////////////////////////////////////////////////
    
    // 懒加载
    var lzimgs = Array.from(document.getElementsByClassName('lzimg'));

    function lazyLoad() {
        var remove_event = true;
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        lzimgs.forEach(function (item, index) {
            if (scrollTop === 0 && item.dataset.src !== '' && offsetDis(item).top < window.innerHeight + scrollTop) {
                item.setAttribute('src', item.dataset.src)
                item.setAttribute('data-src', '')
            } else if (item.dataset.src !== '' && offsetDis(item).top < window.innerHeight + scrollTop - 300 && offsetDis(item).top > scrollTop) {
                item.setAttribute('src', item.dataset.src)
                item.setAttribute('data-src', '')
            } else {
                remove_event = false;
            }
        })
        if (remove_event) {
            myRemoveEvent(Window, 'scroll', lazyLoad_throttle);
        }
    }
    // 懒加载
    lazyLoad();
    var lazyLoad_throttle = throttle(lazyLoad, 500, 1000);
    myAddEvent(window, "scroll", lazyLoad_throttle);

    /////////////////////////////////////////////////////////////////////////////////////////
    
    // header添加背景
    var header = document.getElementById('header');
    var description = document.getElementById('description');

    function addHeaderBg() {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (offsetDis(description).top < scrollTop + 80) {
            header.style.backgroundColor = "rgba(0, 0, 0, 1)";
        } else {
            header.style.backgroundColor = "";
        }
    }
    // header添加背景
    addHeaderBg();
    window.addEventListener('scroll', throttle(addHeaderBg, 50, 100));

    /////////////////////////////////////////////////////////////////////////////////////////

    // 文字上滑
    var upintros = Array.from(document.getElementsByClassName('intro'));

    function slideup() {
        var remove_event = true;
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        upintros.forEach(function (item, index) {
            if (offsetDis(item).top < window.innerHeight + scrollTop && offsetDis(item).top > scrollTop) {
                item.style.opacity = '1';
                item.style.top = '0px';
            } else {
                remove_event = false;
            }
        })
        // 如果加载完了解绑scroll
        if (remove_event) {
            myRemoveEvent(Window, 'scroll', slideup_throttle);
        }
    }
    // 文字上滑
    slideup();
    var slideup_throttle = throttle(slideup, 100, 300);
    myAddEvent(window, "scroll", slideup_throttle);

    /////////////////////////////////////////////////////////////////////////////////////////

    // 轮播图
    var arrow_pre = document.getElementById("arrow_pre");
    var arrow_next = document.getElementById("arrow_next");

    arrow_next.onclick = function () {
        var car_cur = document.getElementsByClassName("car_cur")[0];
        var car_next = document.getElementsByClassName("car_next")[0];
        var car_pre = document.getElementsByClassName("car_pre")[0];

        car_cur.style.left = "-100%";
        car_cur.style.opacity = "0";
        car_next.style.left = "0";
        car_next.style.opacity = "1";
        car_pre.style.left = "100%";
        car_cur.setAttribute("class", "car_pre car_img_box");
        car_pre.setAttribute("class", "car_next car_img_box");
        car_next.setAttribute("class", "car_cur car_img_box");

        var car_cur = document.getElementsByClassName("car_cur")[0];
        var car_next = document.getElementsByClassName("car_next")[0];
        var car_pre = document.getElementsByClassName("car_pre")[0];


        car_cur.style.left = "0";
        car_cur.style.left = "1";
        car_next.style.left = "100%";
        car_next.style.opacity = "0";
        car_pre.style.left = "-100%";
    }

    arrow_pre.onclick = function () {
        var car_cur = document.getElementsByClassName("car_cur")[0];
        var car_next = document.getElementsByClassName("car_next")[0];
        var car_pre = document.getElementsByClassName("car_pre")[0];

        car_cur.style.left = "100%";
        car_cur.style.opacity = "0";
        car_pre.style.left = "0";
        car_pre.style.opacity = "1";
        car_next.style.left = "-100%";
        car_cur.setAttribute("class", "car_next car_img_box");
        car_pre.setAttribute("class", "car_cur car_img_box");
        car_next.setAttribute("class", "car_pre car_img_box");

        var car_cur = document.getElementsByClassName("car_cur")[0];
        var car_next = document.getElementsByClassName("car_next")[0];
        var car_pre = document.getElementsByClassName("car_pre")[0];

        car_cur.style.left = "0";
        car_cur.style.left = "1";
        car_pre.style.left = "-100%";
        car_pre.style.opacity = "0";
        car_next.style.left = "100%";
    }

}
