// Promise构造函数接收一个executor函数，executor函数执行完同步或异步操作后，调用它的两个参数resolve和reject
// var promise = new Promise(function(resolve, reject) {
//     /*
//     如果操作成功，调用resolve并传入value
//     如果操作失败，调用reject并传入reason
//     */
   
// })

var Promise = function(executor) {
    var self = this
    self.data = null
    self.status = 'pending'
    self.onResolvedCallback = []
    self.onRejectedCallback = []

    function resolve(value) {
        if (self.status === 'pending') {
            self.status = 'resolved'
            self.data = value
            for (var i = 0; i < self.onResolvedCallback.length; i++) {
                self.onResolvedCallback[i](value)
            }
        }
    }

    function reject(reason) {
        if (self.status === 'pending') {
            self.status = 'rejected'
            self.data = reason
            for (var i = 0; i < self.onRejectedCallback.length; i++) {
                self.onRejectedCallback[i](reason)
            }
        }
    }

    try {
        executor(resolve, reject)
    } catch(exception) {
        reject(exception)
    }
}

Promise.prototype.then = function(onResolved, onRejected) {
    var self = this
    var promise2 = void 0

    // 根据标准，如果then的参数不是function，则我们需要忽略它，此处以如下方式处理
    onResolved = typeof onResolved === 'function' ? onResolved : function(value) { return value }
    onRejected = typeof onRejected === 'function' ? onRejected : function(reason) { return reason }

    if (self.status === 'resolved') {
        return promise2 = new Promise(function(resolve, reject) {
            try {
                var x = onResolved(self.data)
                if (x instanceof Promise) {
                    x.then(resolve, reject)
                } else {
                    resolve(x)
                }

            } catch (exception) {
                reject(exception)
            }
        })
    }

    if (self.status === 'rejected') {
        return promise2 = new Promise(function(resolve, reject) {
            try {
                var x = onRejected(self.data)
                if (x instanceof Promise) {
                    x.then(resolve, reject)
                } else {
                    reject(x)
                }
            } catch (e) {
                reject(e)
            }
        })
    }

    if (self.status === 'pending') {
        return promise2 = new Promise(function(resolve, reject) {
            self.onResolvedCallback.push(function(value) {
                try {
                    var x = onResolved(self.data)
                    if (x instanceof Promise) {
                        x.then(resolve, reject)
                    } else {
                        resolve(x)
                    }
                } catch (e) {
                    reject(e)
                }
            })

            self.onRejectedCallback.push(function(reason) {
                try {
                    var x = onRejected(self.data)
                    if (x instanceof Promise) {
                        x.then(resolve, reject)
                    } else {
                        reject(x)
                    }
                } catch(e) {
                    reject(e)
                }
            })
        })
    }
}

// 为了下文方便，我们顺便实现一个catch方法
Promise.prototype.catch = function(onRejected) {
    return this.then(null, onRejected)
}

var sleep1 = (value) => {
    console.log('pre sleep')
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(value)
            resolve('sleep1')
        }, 20000)
    })
}

var sleep2 = (value) => {
    console.log('pre sleep2')
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(value)
            resolve('sleep2')
        }, 20000)
    })
}

var sleep3 = (value) => {
    console.log('pre sleep3')
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(value)
            resolve('sleep3')
        }, 10000)
    })
}


// new Promise(resolve => {
//     console.log('111')
//     resolve(111)
// })
// .then((value) => {
//     console.log(value)
//     return 333
// })

new Promise(() => {
    console.log('t1')
    return sleep1(1)
})
.then(() => {
    console.log('t2')
    return sleep2(2)
})
