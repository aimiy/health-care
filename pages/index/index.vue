<template>
    <view class="content">
        <view>
            <uni-forms ref="form" :value="form" :rules="rules">
                <uni-forms-item label="姓名:" name="name">
                    {{user.name}}
                </uni-forms-item>
                <uni-forms-item label="今日:">
                    <uni-datetime-picker v-model="form.today"></uni-datetime-picker>
                </uni-forms-item>
                <uni-forms-item label="入睡时间:">
                    <uni-datetime-picker v-model="form.startSleepTime" @change="sleepHoursChange"></uni-datetime-picker>
                </uni-forms-item>
                <uni-forms-item label="醒来时间:">
                    <uni-datetime-picker v-model="form.endSleepTime" @change="sleepHoursChange"></uni-datetime-picker>
                </uni-forms-item>
                <uni-forms-item label="晚睡时长:">
                    {{sleepHours}}
                </uni-forms-item>
                <button @click="submit">Submit</button>
            </uni-forms>
        </view>
        <view>
            <button type="primary" @click="register">注册</button>
        </view>
        <view class="btn-list">
            <button type="primary" @click="add">新增一条数据</button>
            <button type="primary" @click="remove">删除一条数据</button>
            <button type="primary" @click="update">修改数据</button>
            <button type="primary" @click="get">查询前10条数据</button>
            <button type="primary" @click="useCommon">使用公用模块</button>
            <button type="primary" @click="upload">上传文件</button>
        </view>
    </view>
</template>

<script>
    import dayjs from "dayjs"
    export default {
        data() {
            return {
                user: {
                    name: "米粒"
                },
                form: {
                    today: null,
                    startSleepTime: "2021-01-21 1:32:00",
                    endSleepTime: "2021-01-21 10:32:00",
                    smallSleep: []
                },
                sleepHours:null,
                rules: {},
                list: []
            }
        },
        computed: {
        },
        methods: {
            register(){
                // 客户端代码
                uniCloud.callFunction({
                    name: 'use-common',
                    data: {
                    	action: 'register',
                    	params: {
                    		username: 'mili',
                    		password: '940665425',
                            needPermission:false
                    	}
                    },
                    success(res){
                        if(res.result.code === 0) {
                            // 2.8.0版本起调整为蛇形uni_id_token（调整后在一段时间内兼容驼峰uniIdToken）
                            uni.setStorageSync('uni_id_token',res.result.token)
                            uni.setStorageSync('uni_id_token_expired', res.result.tokenExpired)
                            // 其他业务代码，如跳转到首页等
                            uni.showToast({
                                title: '注册成功',
                                icon: 'none'
                            })
                        } else {
                            uni.showModal({
                                content: res.result.message,
                                showCancel: false
                            })
                        }
                    },
                    fail(res){
                        uni.showModal({
                            content: res,
                            showCancel: false
                        })
                    }
                })
            },
            sleepHoursChange(val){
                let time = dayjs(this.form.endSleepTime) - dayjs(this.form.startSleepTime);
                let timestr = this.secondToDate(time / 1000)
                this.sleepHours= timestr;
            },
            //秒转时分秒【0依旧显示
            secondToDate(val) {
                let h = Math.floor(val / 3600),
                    m = Math.floor((val / 60 % 60)),
                    s = Math.floor((val % 60));
                if (h > 0) {
                    return h + "小时" + m + "分钟" + s + "秒";
                } else if (m > 0) {
                    return m + "分钟" + s + "秒";
                } else {
                    return s + "秒";
                }
            },
            change(value) {
                console.log(value)
            },
            add() {
                uni.showLoading({
                    title: '处理中...'
                })
                uniCloud.callFunction({
                    name: 'add',
                    data: {
                        name: 'DCloud',
                        subType: 'uniCloud',
                        createTime: Date.now()
                    }
                }).then((res) => {
                    uni.hideLoading()
                    uni.showModal({
                        content: `成功添加一条数据，文档id为：${res.result.id}`,
                        showCancel: false
                    })
                    console.log(res)
                }).catch((err) => {
                    uni.hideLoading()
                    uni.showModal({
                        content: `添加数据失败，错误信息为：${err.message}`,
                        showCancel: false
                    })
                    console.error(err)
                })
            },
            remove() {
                uni.showLoading({
                    title: '处理中...'
                })
                uniCloud.callFunction({
                    name: 'remove'
                }).then((res) => {
                    uni.hideLoading()
                    uni.showModal({
                        content: res.result.msg,
                        showCancel: false
                    })
                    console.log(res)
                }).catch((err) => {
                    uni.hideLoading()
                    uni.showModal({
                        content: `删除失败，错误信息为：${err.message}`,
                        showCancel: false
                    })
                    console.error(err)
                })
            },
            update() {
                uni.showLoading({
                    title: '处理中...'
                })
                uniCloud.callFunction({
                    name: 'update',
                    data: {
                        name: 'DCloud',
                        subType: 'html 5+',
                        createTime: Date.now()
                    }
                }).then((res) => {
                    uni.hideLoading()
                    uni.showModal({
                        content: res.result.msg,
                        showCancel: false
                    })
                    console.log(res)
                }).catch((err) => {
                    uni.hideLoading()
                    uni.showModal({
                        content: `更新操作执行失败，错误信息为：${err.message}`,
                        showCancel: false
                    })
                    console.error(err)
                })
            },
            get() {
                uni.showLoading({
                    title: '处理中...'
                })
                uniCloud.callFunction({
                    name: 'get'
                }).then((res) => {
                    uni.hideLoading()
                    uni.showModal({
                        content: `查询成功，获取数据列表为：${JSON.stringify(res.result.data)}`,
                        showCancel: false
                    })
                    this.list = res.result.data;
                    console.log(res)
                }).catch((err) => {
                    uni.hideLoading()
                    uni.showModal({
                        content: `查询失败，错误信息为：${err.message}`,
                        showCancel: false
                    })
                    console.error(err)
                })
            },
            useCommon() {
                console.log('请确保自己已经阅读并按照公用模块文档操作 https://uniapp.dcloud.io/uniCloud/cf-common')
                uniCloud.callFunction({
                    name: 'use-common'
                }).then((res) => {
                    uni.hideLoading()
                    uni.showModal({
                        content: '云函数use-common返回结果：' + JSON.stringify(res.result),
                        showCancel: false
                    })
                    console.log(res)
                }).catch((err) => {
                    uni.hideLoading()
                    uni.showModal({
                        content: `云函数use-common执行失败，错误信息为：${err.message}`,
                        showCancel: false
                    })
                    console.error(err)
                })
            },
            upload() {
                new Promise((resolve, reject) => {
                    uni.chooseImage({
                        count: 1,
                        success: res => {
                            const path = res.tempFilePaths[0]
                            let ext
                            // #ifdef H5
                            ext = res.tempFiles[0].name.split('.').pop()
                            const options = {
                                filePath: path,
                                cloudPath: Date.now() + '.' + ext
                            }
                            resolve(options)
                            // #endif
                            // #ifndef H5
                            uni.getImageInfo({
                                src: path,
                                success(info) {
                                    const options = {
                                        filePath: path,
                                        cloudPath: Date.now() + '.' + info.type.toLowerCase()
                                    }
                                    resolve(options)
                                },
                                fail(err) {
                                    reject(new Error(err.errMsg || '未能获取图片类型'))
                                }
                            })
                            // #endif
                        },
                        fail: () => {
                            reject(new Error('Fail_Cancel'))
                        }
                    })
                }).then((options) => {
                    uni.showLoading({
                        title: '文件上传中...'
                    })
                    return uniCloud.uploadFile({
                        ...options,
                        onUploadProgress(e) {
                            console.log(e)
                        }
                    })
                }).then(res => {
                    uni.hideLoading()
                    console.log(res);
                    uni.showModal({
                        content: '图片上传成功，fileId为：' + res.fileID,
                        showCancel: false
                    })
                }).catch((err) => {
                    uni.hideLoading()
                    console.log(err);
                    if (err.message !== 'Fail_Cancel') {
                        uni.showModal({
                            content: `图片上传失败，错误信息为：${err.message}`,
                            showCancel: false
                        })
                    }
                })
            }
        }
    }
</script>

<style>
</style>
