'use strict';

const hello = require('hello-common')
exports.main = async (event) => {
    let res = await hello.getVersion();
    console.log(res)
	return res
};
