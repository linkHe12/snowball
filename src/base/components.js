/**
 * @author hexiang
 * @file 组件基类
 */
define([
    "../config",
    "jquery"
], function (config, $) {
    var C_BASE_PATH = config.C_BASE_PATH;// 模块基础目录
    var identify = config.IDENTITY;

    /**
     * 组件
     * @param {string} name 组件名称
     * @param {HTMLElement|jQuery} dom 组件对应的dom根节点
     * @param {HTMLElement|jQuery} [container] 组件所在的容器，如果传入此参数，在init之前会自动把组件append到容器节点中
     * @constructor
     */
    function Components(name, dom, container) {
        var $element = $(dom);
        this.$element = $element;
        this.name = name;

        // 加载组件
        function load() {
            var path = C_BASE_PATH + name;
            if (/^\/|\..\//.test(name)) {
                throw new Error("组件路径不合法:" + name);
            }
            require([path], function (components) {
                // 判断组件是否加载过，防止嵌套组件被重复加载
                if (!$element.data("init")) {
                    if (container) {
                        $element.appendTo(container);
                    }
                    // 防止什么都没返回报错
                    if (components === void 0) {
                        components = {};
                    }
                    // 调用组件的初始化方法
                    if (components.init) {
                        components.init($element);
                    }
                    if (components.eventHandler) {
                        registerEvent($element, components.eventHandler);
                    }
                    // 如果组件容器没有标识，添加标识
                    if ($element.data(identify) !== name) {
                        $element.attr("data-" + identify, name);
                    }
                    // 标记组件已经加载完成
                    $element.attr("data-init", true);
                    // 加载子组件
                    /*var $childComponents = $element.find("[data-" + identify + "]");
                     if ($childComponents.length > 0) {
                     $childComponents.each(function (index, item) {
                     var $item = $(item);
                     new Components($item.data(identify), $item);
                     })
                     }*/
                }
            });
        }

        load();
        return this;
    }

    /**
     * 给组件注册事件
     * @param {jQuery} $componentEl 组件容器
     * @param {Object} eventCBs 组件的时间回调函数
     */
    function registerEvent($componentEl, eventCBs) {
        var eventsType = [
            "blur",
            "focus",
            "click",
            "dbclick",
            "change",
            "select",
            "submit"
        ];
        var tagName = [];
        for (var i = 0, len = eventsType.length; i < len; i++) {
            tagName.push("[data-" + eventsType[i] + "]");
        }

        $componentEl.on(eventsType.join(" "), tagName.join(","), function (e) {
            var $curTar = $(e.currentTarget);
            var execFuncFullName = $curTar.data(e.type); // 获取要执行的方法
            if (execFuncFullName) {
                // 获取action，prevent
                var action = execFuncFullName.match(/\.\S*/) ? execFuncFullName.match(/\.\S*/)[0] : void 0;
                execFuncFullName = execFuncFullName.replace(/\:\S*/, "");
                // 获取函数名
                var funcName = execFuncFullName.replace(/(?:\()[\S]*(?:\))/, "");
                // 获取函数参数
                var args = execFuncFullName.match(/(?:\()[\S]*(?:\))/)
                    ? execFuncFullName.match(/(?:\()[\S]*(?:\))/)[0].replace(/\(|\)/g, "").split(",")
                    : [];
                args.push(e);
                if (action && action.indexOf("prevent") > 0) {
                    e.preventDefault();
                }
                if (typeof eventCBs[funcName] === "function") {
                    eventCBs[funcName].apply(e.currentTarget, args);
                }
            }
        });
    }

    return Components;
});