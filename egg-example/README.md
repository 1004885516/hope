# 项目简介

一个基于nodejs + egg框架 + mongodb实现的服务端项目。

### 基础功能介绍

  - config 系统配置，一套本地配置，一套开发环境配置
  - router 定义路由
  - controller - 解析前端参数，并根据约定好的action参数区分不同service逻辑调用，例如：action:"getOneBook",表示请求获取一本书的service逻辑
  - service 主要业务逻辑处理
  - service/dao 数据库操作方法封装
  - extend 框架扩展方法
  - middleware
    - error_handler 统一异常处理中间件，捕获全局异常，并调用context中封装的扩展方法处理errBody
    - verify_user 用户验证中间件，主要用来解析请求中的token，验证用户信息，并把解析出来的uers信息挂载到ctx对象上，方便之后的逻辑中获取用户信息，节省数据库查询操作。
  - common 常量定义，比如action字段的定义，错误类型定义等
  - util 功能函数封装，比如生成token，日期格式化，book对象类的定义等 

### 业务逻辑介绍
  - user用户增删改查，但是前端代码中只暴漏了查询接口
  - book电子书相关
    - 上传电子书
      - ctx.multipart()方法获取上传文件流
      - fs.createWriteStream()方法创建写入流
      - stream-wormhole()方法消除流
    - 核心book类构建，两种构建方式
      - 根据解析电子书文件到的信息构建
      - 根据前端传来的data构建
    - 解析电子书核心算法
      - 把epub包的文件解析方法集成到了项目中，用来解析电子书的上传文件以及图片
      - adm-zip解压电子书，得到书名作者等信息
      - xml2js解析xml文件(电子书目录)，并处理树状结构  
## 

### 部署相关
- 阿里云虚拟机 centOS 8.0版本
- 运行环境: node v12.18.1 mongodb 4.2.8 nginx 1.16.1(部署前端代码和存放电子书资源文件)
- 端口映射:node 7001 mognodb 27017 nginx 80

### 项目启动

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### 使用
- 首先你需要本地安装[node](https://nodejs.org/) and [mongodb](https://www.mongodb.com/)
- 然后你需要根据model数据库模板定义，填充必要的数据
- 接口调用需要用到postman
- 若需要前端代码请移步[vue-element-admin](https://github.com/1004885516/hope.git)
- [在线预览](http://60.205.191.215/admin)
- 账号提供：
    admin01
    123456