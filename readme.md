# snowball

一个简单的，基于AMD模块规范的页面模块组件加载框架,dom 处理暂时依赖 jQuery

这里所说的组件区别于 Vue 等 MV* 框架中的组件，只是页面上的一个业务模块。

## 开发背景
老项目升级，原项目开发过程中前端没做任何优化，前端开发人员有限，没办法大规模使用 MV* 框架，
业务中遇到需要使用 MV* 框架的场景也不多。
在不大规模提高学习成本的前提下开发了这个工具，使用框架强制规范前端文件结构。

## 使用方式

### 在页面上声明组件

在组件所在的html节点上添加自定义属性 `data-snowball`，值为组件名

组件名是配置文件中变量 `C_BASE_PATH` 指向文件夹内的文件路径，路径省略此目录，
且 **开头不带 `/`,不能为`../`,结尾不带文件后缀名**，否则会报错提示。

示例：
```html
<div data-snowball="index/product_list"></div>
```

`data-snowball` 所在的节点即为组件的根节点

### 在组件中通过构造函数新增子组件(不推荐使用)

构造函数接收三个参数

- name 组件名,String,同页面标签声明组件名
- dom 组件对应的dom节点,HTMLElement|jQuery
- container 可选参数,组件所在的容器， HTMLElement|jQuery，如果传入此参数，在init完成后会自动把组件dom添加进容器节点中

示例：
```javascript
define([
    "base/Components"
],function(Components){
    "use strict";

    function init($el){
        new Components("test/test",$("<div></div>"),$("#subComponent",$el));
    }

    return {
        init:init
    }
});
```

### 组件书写规范

每个组件都是一个单独的js文件，组件存放在 `C_BASE_PATH` 指向的目录中，在组件目录中按照 模块名/组件名.js 规范存放，
组件书写模板：
```javascript
define([],function(){
    "use strict";

    function init($element){}
    return {
        init:init,
        eventHandler:{}
    }
})
```

组件返回的 `Object` 中的属性都不是必须的。

`init` 方法会在组件被加载到dom后自动调用，`init`方法的参数为组件所在的根节点的 **jQuery对象**，
页面上声明的话就是 `data-snowball` 属性值所在的节点。建议在此方法中进行一些初始化操作，如绑定事件等。

`eventHandler` 对象是组件的事件对象，给组件中的html节点添加 `data-click` `data-submit` `data-blur` 等自定义属性，
组件会自动绑定事件，支持的事件有 `click`,`dbclick`,`focus`,`blur`,`select`,`change`,`submit`，属性值为要调用的方法。

子组件标签绑定的事件会冒泡到父组件，注意方法名重复的问题。

传递参数：只需放在括号内即可，通过事件标签绑定的事件，接收到的参数为字符串，最后一个参数为 `Event` 对象。

事件修饰符：在方法名后以 `.` 分隔，目前暂时只支持 `prevent` ，在回调函数调用前会自动执行 `event.preventDefault()`

示例:
```html
<!-- html -->
<div data-wlcomponents="test/test">
    <span data-click="t1"></span>
    <span data-click="t2(1,2,3)"></span>
    <form data-submit="submitForm.prevent"></form>
</div>
```

```javascript
// js
define([],function(){
    function t1(){
        alert("t1");
    }

    function t2(e){
        console.log(arguments); // =>[1,2,3,Event]
    }

    function submitForm(){
        console.log("表单提交了");
    }
    return {
        eventHandler:{
            t1:t1,
            t2:t2,
            submitForm:submitForm
        }
    }
})
```

## 最佳实践

- 组件在使用 `jQuery` 选择节点时，要约束选择的范围，如：`$(".J_test",$element)` ,选择时传递第二个参数为组件所在容器，
就可以只在组件容器内寻找节点

- js hook ，需要被 `js` 选择到的节点添加的 `class`,`id`，以 `J_` 开头命名，不要使用样式用到的css选择器。

## 上线打包流程
暂未实现。先写个思路。

页面上扫描模块标识，获取页面上用了哪些组件模块，生成一个页面入口 js 文件，加载页面用到的模块，
页面上放个标识，加载这个生成的 js 文件，最后打包生成的这个js文件。
snowball.js判断下环境，不要加载模块。