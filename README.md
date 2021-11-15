# electron-template桌面端基础框架

## 如何使用
1. `cnpm install`
2. 使用 `npm run rebuild` 安装串口通信插件，如果不需要的可在layout -> index.vue 中把构造方法移除
3. 运行项目 `npm run electron:serve`
4. 打包项目 `npm run electron:build`
## 项目中集成了哪些东西
1. 可使用 `vue` 脚手架的一套东西，和 `element-ui` 框架
2. 已集成在线更新，可在 `.env.development`和 `.env.production`中进行修改服务器地址
3. 已集成串口通信插件 , 可在utils -> SerialPorts.js 中进行查看详情
4. 增加托盘区域右键内容，可在 backgrond.js 中 查找 Tray方法 进行修改
> 注意：以上方法均已经过`win10`测试，如需测试macos和linux，和windows其他版本请自行测试
5. 加入使用海康摄像头推流画面，调用海康摄像头识别车牌
> 海康摄像头推流地址：rtsp://admin:[密码]@[ip地址]/Streaming/Channels/101  
6. 摄像头画面组件在 `components -> SpotCar.vue` 中  
| 参数 | 示例 |
| --- | --- |
| arr | [{ url: 'admin:H.123456@192.168.1.65', downTime: null },{ url: 'admin:rsd206369@192.168.1.64', downTime: null }] |
| back | 返回参数车牌地址 |

