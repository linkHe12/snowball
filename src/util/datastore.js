/**
 * @author: 贺翔
 * @desc: 数据仓库
 * @version: 0.1
 */
define([
    "lodash",
    "../event/eventbase"
], function (_, Event) {
    var data = {};

    /**
     * @classdesc 数据仓库，全局统一的数据管理，提供增删改和数据变更事件，数据变更事件名使用'事件名:字段名'来监听
     * @example store.on("key:change",function(value){}) // 当数据添加或修改时触发change事件
     * store.on("key:remove",function(key){})// 数据删除时触发remove事件
     * @fires DataStore#change:key
     * @fires DataStore#remove:key
     * @constructor
     */
    function DataStore() {
        /**
         * 设置一个值
         * @param {string} key 字段名
         * @param {*} val 值
         * @event DataStore#change:key
         * @desc 触发 'change' 事件，并传递变更的值为参数给回调函数
         */
        var _self = this;
        this.set = function (key, val) {
            data[key] = _.cloneDeep(val);
            var triggerParam = _.cloneDeep(val);
            _self.trigger("change:" + key, triggerParam);
        };
        /**
         * 获取一个或所有值的深克隆对象
         * @param {string} [key] 如果传入key，获取key对应的值，否则获取所有值
         * @return {*} 获取到的值的深克隆
         */
        this.get = function (key) {
            if (key) {
                return data.hasOwnProperty(key) ? _.cloneDeep(data[key]) : void 0;
            } else {
                return _.cloneDeep(data)
            }
        };
        /**
         * 删除一个字段
         * @param {string} key 要删除的字段
         * @event DataStore#remove:key
         * @desc 触发 'remove' 事件，并传递删除的字段给回调函数
         */
        this.remove = function (key) {
            if (data.hasOwnProperty(key)) {
                delete data[key];
                _self.trigger("remove:" + key, key);
            }
        };
    }

    _.extend(DataStore.prototype, Event);

    return new DataStore();
});