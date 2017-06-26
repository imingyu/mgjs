let defaultMixinAppOptions = {
    duplicate(prop, appSpec, resultAppSpec, allAppSpecList) {
        var ids = allAppSpecList.map(item => {
            return item.id;
        });
        throw new Error(`app定义中存在重复的属性名【${prop}】请检查！`);
    },
    interceptor: null//拦截器，为合并后的方法内部添加一个拦截器函数，可以拦截到每次方法调用，传入参数：(funName, funArgs).call(this)，如果拦截器返回false，则不继续向下执行
};
/**
 * 混合app定义，返回混合后的结果
 * @param {object} options 混合配置
 * @param {object} mainApp 主app定义对象
 * @param {array<object>} appList 要混合的app定义对象集合
 */
export var mixinApps = (options, mainApp, ...appList) => {
    var ops = Object.assign({}, defaultMixinAppOptions, options || {}),
        sysLife = ['onLaunch', 'onShow', 'onHide', 'onError'],
        resultLife = {},
        resultApp = {},
        namespace = {},
        ids = {},
        allApp = [mainApp].concat(appList);

    //开始混合
    allApp.forEach(appItem => {
        if (typeof appItem !== 'object') {
            console.error('无法混合非object类型的app定义！');
            return false;
        }

        //检查id合法性
        if (!appItem.hasOwnProperty('id') || ids.hasOwnProperty(appItem.id)) {
            console.error('混合方法要求app定义对象需要存在id属性，并符合唯一性');
            return false;
        }
        ids[appItem.id] = true;

        for (var prop in appItem) {
            var propValue = appItem[prop];
            if (resultApp.hasOwnProperty(prop)) {
                ops.duplicate(prop, appItem, resultApp, allApp);
            } else if (typeof propValue !== 'function') {
                resultApp[prop] = propValue;
            } else {
                if (sysLife.indexOf(prop) != -1) {
                    //处理生命周期函数
                    resultLife[prop] = resultLife[prop] || [];
                    resultLife[prop].push(appItem[prop]);
                } else {
                    if (typeof ops.interceptor === 'function') {
                        (function (prop) {
                            resultApp[prop] = function () {
                                var runtimeApp = this,
                                    args = Array.from(arguments);
                                if (ops.interceptor.call(runtimeApp, prop, args) === false) {
                                    return false;
                                }
                                return propValue.apply(runtimeApp, args);
                            }
                        })(prop);
                    } else {
                        resultLife[prop] = propValue;
                    }
                }
            }
        }
    });

    //混合生命周期
    for (var prop in resultLife) {
        (function (prop) {
            resultApp[prop] = function () {
                var runtimeApp = this,
                    args = Array.from(arguments);
                if (typeof ops.interceptor === 'function') {
                    if (ops.interceptor.call(runtimeApp, prop, args) === false) {
                        return false;
                    }
                }

                resultLife[prop].forEach(fun => {
                    fun.apply(runtimeApp, args);
                });
            }
        })(prop);
    }

    return resultApp;
}