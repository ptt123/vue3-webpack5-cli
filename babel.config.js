module.exports = {
    presets: [
        [
            "@babel/preset-env", {
                "targets": {
                    'browsers': ['last 2 versions']
                }
            }
        ],
        [
            "@babel/preset-typescript",
            {
              allExtensions: true, // 支持所有文件扩展名，否则在vue文件中使用ts会报错
            },
        ],
    ]
}