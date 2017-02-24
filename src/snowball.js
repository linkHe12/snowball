/**
 * @author hexiang
 * @file 入口文件
 */
define([
    "./config",
    "./base/components",
    "jquery"
], function (config, Components, $) {
    // 加载组件
    var identify = config.IDENTITY;
    var $componentsDom = $("[data-" + identify + "]");
    $componentsDom.each(function (index, item) {
        var $item = $(item);
        var name = $item.data(identify);
        setTimeout(function () {
            new Components(name, item);
        }, 0);
    });
});