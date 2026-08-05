# 📊 交易与代理管理系统前后端 API 接口与集成规范说明书

> 💡 **特别说明（重要提示，请后端开发人员注意）**：
> 1. 本说明书主要用于指导前后端数据对接。文档中定义的前端请求载荷（Request Body）仅作为设计参考，**具体接口请求格式（如参数名称、封装层级、字段嵌套方式）统一以后端工作人员实际开放、发送的接口规范为准**。前端将根据后端提供的最终格式进行适配。
> 2. 🌟 **特别提示**：**目前前端各页面中 Table 表格的前端数据筛选与过滤功能均未编写逻辑，因此需要麻烦后端人员在编写查询接口（GET 列表接口）时，支持对应的筛选字段并在数据库中完成条件过滤（如按账号、品种、类型、日期范围查询），将过滤后的结果直接返回给前端渲染展示。**

---

## 一、 通用技术协议规范

### 1.1 基础请求配置
* **Base URL**: `http://localhost:8080/api` (开发环境，可配置)
* **Content-Type**: `application/json; charset=utf-8`
* **身份认证 (Authorization)**: 采用 **JWT Token** 机制。前端将 Token 存于 `sessionStorage`/`localStorage` 中，并在所有私有接口请求时通过拦截器自动在 Header 中携带：
  ```http
  Authorization: Bearer <your_jwt_token_here>
  ```

### 1.2 统一响应报文格式 (Standard Response)
后端接口响应应统一使用以下 JSON 结构：
```json
{
  "code": 200,          // 业务状态码。200 代表成功，非 200 代表各类业务异常
  "message": "操作成功", // 错误或提示信息。如“密码错误”、“账号不存在”等
  "data": {}            // 数据载荷。可以是对象、数组或 null
}
```

#### 常见状态码规范：
* `200`: 请求成功。
* `401`: 身份校验失败或 Token 已过期。前端检测到此状态后会自动清除缓存并重定向至 `/login` 页。
* `403`: 拒绝访问（无操作权限）。
* `500`: 服务器内部错误。

---

## 二、 全局共享状态设计 (前端需要保存的重要数据)

前端在 `AuthContext.jsx`、`localStorage` 或 `sessionStorage` 中维护以下全局变量，用于页面联动及接口数据 scope 隔离：

| 变量名 | 数据类型 | 作用描述 | 关联应用场景 |
| :--- | :--- | :--- | :--- |
| `token` | `string` | 用户的登录凭证 | 所有的私有接口请求头校验 |
| `userRole` | `string` | 当前用户角色权限：`normal` (普通交易员) / `special_user` (经纪人/代理商) | 侧边栏菜单条件渲染，限制非 Broker 用户访问管理页面 |
| `isRiskAssessed` | `boolean` | 当前用户是否已完成投资者风险评估 | 决定是否触发 `RiskGuard` 路由拦截，强制用户完成答题 |
| `currentAccountId` | `string` | 当前选中的**主交易账号**（MT 账号） | 过滤持仓列表、交易历史、出入金流水的 scope 条件 |

---

## 三、 风险评估模块 (Risk Assessment)

### 3.1 业务背景与跳转拦截
* 当用户成功登录系统时，前端通过全局 `isRiskAssessed` 状态判断用户是否已完成投资者风险评估。
* 若为 `false`，则会弹出 Modal 强制用户跳转至 `/dashboard/riskassessment`。一旦提交成功，该状态更新为 `true`。

### 3.2 答题提交接口
答卷共 **11 道题**（对应题目标识 `q1` 至 `q11`），每道题有不同的单选选项（如 `"1"`, `"2"`, `"A"`, `"B"`, `"C"`, `"D"`）。

* **API 路径**：`POST /api/user/risk-assessment`
* **请求载荷 (Request Body)**：
  ```json
  {
    "resultString": "12CBEDABAAA" 
  }
  ```
  * **`resultString` 拼接算法说明**：
    前端在表单提交时，会依次取出题目 `['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11']` 的值，并按照顺序拼接成一长串字符串。
    * *举例：第一题选 "1"，第二题选 "2"，第三题选 "C"，第四题选 "B"，第五题选 "E"，第六题选 "D"，第七题选 "A"，第八、九、十、十一题都选 "A"。拼接出的值即为 `"12CBEDABAAA"`。*
    * **后端职责**：接收此字符串并保存，同时更新该用户的风险评估完成状态为“已完成”。
* **响应载荷 (Response Body)**：
  ```json
  {
    "code": 200,
    "message": "风险评估提交成功",
    "data": {
      "isRiskAssessed": true,
      "score": 85,
      "level": "稳健型"
    }
  }
  ```

---

## 四、 交易账号管理与密码修改接口 (`accountlist.jsx`)

此模块对应前端页面 **`/dashboard/accountlist` (我的交易账号列表)**。

### 4.1 获取交易账号列表 (READ)
* **API 路径**: `GET /api/account/list`
* **功能说明**: 获取当前登录用户名下的所有子交易账号。

#### 🔹 `data` 列表字段定义：
| 字段键 (Key) | 数据类型 | 说明 | 示例值 |
| :--- | :--- | :--- | :--- |
| `accountId` | `string` | 交易账号（主键） | `"889021"` |
| `username` | `string` | 交易账号拥有者姓名 | `"Trader_John"` |
| `openDate` | `string` | 开户日期 | `"2025-03-15"` |
| `leverage` | `string` | 交易杠杆比例 | `"1:100"` |
| `balance` | `number` | 账户余额 (USD) | `50000.00` |
| `equity` | `number` | 账户净值 (USD) | `51200.00` |
| `credit` | `number` | 信用额度 (USD) | `1000.00` |
| `initPassword`| `string` | 交易账号初始密码（没有则返回 `"null"`）| `"Admin@123"` |

---

### 4.2 更改交易账号密码 (WRITE)
* **功能说明**: 用户点击表格操作列中的“**修改密码**”按钮，弹出密码修改弹窗。
* **API 路径**: `POST /api/account/change-password`
* **请求载荷 (Request Body)**:
  ```json
  {
    "mtAccount": "889021",               // 要修改密码的 MT 交易账号 (必填)
    "oldPassword": "oldMasterPassword1", // 旧密码/主密码 (必填)
    "newPassword": "newMasterPassword2", // 新密码 (必填，最少8位包含大小写/数字/符号)
    "confirmPassword": "newMasterPassword2" // 确认新密码 (必填，前端已做一致性校验)
  }
  ```
* **响应载荷 (Response Body)**:
  ```json
  {
    "code": 200,
    "message": "账号 889021 密码修改成功！"
  }
  ```

---

## 五、 数据获取（READ）类 API 规范 (前端表格数据源)

> 💡 **特别提醒**：前端页面未对表格数据做任何内存级别的筛选，所有头部搜索表单（如：通过订单号、账号、品种过滤）以及日期选择器的过滤请求，**均需要麻烦后端人员在编写查询接口（GET 接口）时，通过 Query 参数拦截后，在数据库层面完成筛选逻辑并返回对应的数据结果。**

### 5.1 当前活期持仓列表 (`position.jsx`)
* **API 路径**: `GET /api/trade/positions`
* **Query 参数**: `accountId` (当前选中要查看的 MT 账户)
* **功能说明**: 获取特定交易账号当前的未平仓订单。

#### 🔹 `data` 列表字段定义：
| 字段键 (Key) | 数据类型 | 说明 | 示例值 |
| :--- | :--- | :--- | :--- |
| `orderId` | `string` | 订单编号 | `"ORD9987612"` |
| `accountId` | `string` | 关联交易账号 | `"889021"` |
| `type` | `string` | 交易类型（必须为小写 `"buy"` 或 `"sell"`） | `"buy"` |
| `symbol` | `string` | 交易品种名称 | `"EURUSD"` |
| `volume` | `number` | 交易量 (手数) | `2.50` |
| `openPrice` | `number` | 开仓点位/价格 | `1.08540` |
| `currentPrice`| `number` | 当前市场点位/价格 | `1.08920` |
| `sl` | `number` | 止损价 (Stop Loss) | `1.08000` |
| `tp` | `number` | 止盈价 (Take Profit) | `1.09500` |
| `fee` | `number` | 交易手续费 | `-20.00` |
| `swaps` | `number` | 过夜利息 | `-12.50` |
| `profit` | `number` | 浮动盈亏（正值前端呈绿色，负值呈红色） | `950.00` |
| `openTime` | `string` | 开仓时间 | `"2026-08-04 10:15:00"` |

---

### 5.2 历史交易结单 (`tradehistory.jsx`)
* **API 路径**: `GET /api/trade/history`
* **Query 筛选参数**: `accountId`, `symbol`, `type`, `startDate`, `endDate`, `page`, `pageSize` (**需要后端完成分页与筛选逻辑**)
* **功能说明**: 获取用户已经平仓的交易历史订单，支持过滤和分页。

#### 🔹 `data.list` 明细数组字段定义：
| 字段键 (Key) | 数据类型 | 说明 | 示例值 |
| :--- | :--- | :--- | :--- |
| `orderId` | `string` | 订单编号 | `"ORD9912041"` |
| `accountId` | `string` | 交易账号 | `"889021"` |
| `type` | `string` | 交易类型（小写 `"buy"` 或 `"sell"`） | `"sell"` |
| `symbol` | `string` | 交易品种 | `"XAUUSD"` |
| `volume` | `number` | 交易手数 | `1.00` |
| `openPrice` | `number` | 开仓点位价格 | `2350.40` |
| `closePrice` | `number` | 平仓点位价格 | `2342.10` |
| `openTime` | `string` | 开仓时间 | `"2026-08-04 10:15:00"` |
| `closeTime` | `string` | 平仓结算时间 | `"2026-08-04 15:30:22"` |
| `sl` | `number` | 止损价 | `2360.00` |
| `tp` | `number` | 止盈价 | `2335.00` |
| `fee` | `number` | 手续费 | `-10.00` |
| `swaps` | `number` | 过夜利息 | `0.00` |
| `profit` | `number` | 最终平仓盈亏 | `830.00` |

---

### 5.3 账户资金流水变动记录 (`fundrecords.jsx`)
* **API 路径**: `GET /api/account/fund-records`
* **Query 筛选参数**: `accountId`, `page`, `pageSize` (**需要后端完成筛选与分页**)
* **功能说明**: 记录入金、出金、内部转账等历史。

#### 🔹 `data.list` 内部字段定义：
| 字段键 (Key) | 数据类型 | 说明 | 示例值 |
| :--- | :--- | :--- | :--- |
| `accountId` | `string` | 发生流水的交易账号 | `"889021"` |
| `deposit` | `number` | 入金金额（无变动则为 `0.00`） | `10000.00` |
| `withdraw` | `number` | 出金金额（无变动则为 `0.00`） | `0.00` |
| `adjust` | `number` | 调账金额 | `50.00` |
| `type` | `string` | 流水类型描述（包含“入金”/“出金”字样前端自动高亮）| `"银联入金"` / `"电汇出金"` |
| `time` | `string` | 资金变动处理完成时间 | `"2026-08-01 10:00:00"` |
| `remark` | `string` | 流水备注说明 | `"用户银联快捷支付入金 $10000 成功"` |

---

### 5.4 提现通道与绑卡信息查询 (`bankcard.jsx`)
* **API 路径**: `GET /api/payment/cards`
* **功能说明**: 获取当前用户已绑定的常用银行卡和加密钱包地址。

#### 🔹 `data` 响应嵌套对象字段定义：
##### 🔸 1. 银行卡明细列表 (`bankCards` 数组)
| 字段键 (Key) | 数据类型 | 说明 | 示例值 |
| :--- | :--- | :--- | :--- |
| `key` | `string` | 银行卡主键唯一 ID | `"card_001"` |
| `bankAccount` | `string` | 银行账号 | `"6225881029381029"` |
| `bankName` | `string` | 开户行名称 | `"招商银行"` |
| `payeeName` | `string` | 账户收款人姓名 | `"张三"` |
| `country` | `string` | 国家/地区二字码 | `"CN"` |
| `province` | `string` | 开户行所在省份 | `"广东省"` |
| `city` | `string` | 开户行所在城市 | `"深圳市"` |
| `district` | `string` | 开户行所在区县 | `"南山区"` |
| `branch` | `string` | 开户行支行名称 | `"高新园支行"` |
| `bankAddress` | `string` | 详细开户网点地址 | `"深圳市科苑路x号"` |
| `swiftCode` | `string` | 银行 Swift Code | `"CMBCCNBSZ"` |
| `isDefault` | `string` | 是否为默认提现卡（必须为字面 `"是"` 或 `"否"`）| `"是"` |
| `cardImg` | `string` | 银行卡背面/正面图 URL 或 Base64 编码 | `"data:image/png;base64,..."` |

##### 🔸 2. 加密货币钱包地址列表 (`cryptoWallets` 数组)
| 字段键 (Key) | 数据类型 | 说明 | 示例值 |
| :--- | :--- | :--- | :--- |
| `key` | `string` | 钱包唯一 ID | `"crypto_001"` |
| `cryptoType` | `string` | 加密货币及公链名称 | `"USDT-TRC20"` |
| `walletAddress`| `string` | 钱包接收地址 | `"TY4h92uNfJsabcDe..."` |

---

### 5.5 Broker 客户管理列表 (`BrokerPages.jsx`)
* **API 路径**: `GET /api/broker/list`
* **Query 筛选参数**: `name`, `brokerId`, `level` (**需要后端完成数据库模糊查询**)
* **权限**: 仅限 `userRole === 'special_user'` 访问。

#### 🔹 `data` 列表字段定义：
| 字段键 (Key) | 数据类型 | 说明 | 示例值 |
| :--- | :--- | :--- | :--- |
| `brokerId` | `string` | 下级经纪人唯一 ID | `"BRK1002"` |
| `name` | `string` | 姓名 | `"李四"` |
| `parent` | `string` | 上级代理名称 | `"高级代理王五"` |
| `level` | `string` | 代理等级 | `"二级代理"` |
| `email` | `string` | 邮箱 | `"lisi@example.com"` |
| `phone` | `string` | 手机号 | `"+852 98765432"` |
| `time` | `string` | 注册/开户时间 | `"2025-01-20 12:00:00"` |
| `status` | `string` | 状态（`"active"` 允许登录、`"pending"` 待审核、`"disabled"` 禁用）| `"active"` |

---

### 5.6 Trader 用户管理列表 (`TraderPages.jsx`)
* **API 路径**: `GET /api/trader/list`
* **Query 筛选参数**: `name`, `mtAccountId` (**需要后端完成筛选**)
* **权限**: 仅限 `userRole === 'special_user'` 访问。

#### 🔹 `data` 列表字段定义：
| 字段键 (Key) | 数据类型 | 说明 | 示例值 |
| :--- | :--- | :--- | :--- |
| `mtAccountId` | `string` | Trader 的 MT 交易账户 | `"889021"` |
| `name` | `string` | 用户真实姓名 | `"约翰"` |
| `parent` | `string` | 直属经纪人/上级代理 | `"代理李四"` |
| `email` | `string` | 电子邮箱 | `"john@example.com"` |
| `phone` | `string` | 联系手机号 | `"13800138000"` |
| `time` | `string` | 注册时间 | `"2025-03-15 08:30:11"` |
| `status` | `string` | 账号状态（`"active"` 允许登录、`"pending"` 待审核、`"disabled"` 已禁用）| `"active"` |

---

### 5.7 双层嵌套佣金报表 (`commissionreport.jsx`)
* **API 路径**: `GET /api/broker/commission-report`
* **Query 筛选参数**: `agent`, `account` (**需要后端完成筛选过滤**)
* **功能说明**: 展示主代理下属所有子代理的总返佣合计数及底层每笔订单详情。

#### 🔹 响应数据 `data` 字段结构（核心）：
##### 🔸 外层表格字段 (子代理合计)
| 字段键 (Key) | 数据类型 | 说明 | 示例值 |
| :--- | :--- | :--- | :--- |
| `key` | `string` | 外层行唯一标识 Row Key | `"1"` |
| `agent` | `string` | 下级代理名称及编号 | `"BRK1002 (李四)"` |
| `account` | `string` | 结收佣金的 MT 账号 | `"MT-99812"` |
| `accountName` | `string` | 结收佣金账户人姓名 | `"John Lee"` |
| `totalLots` | `number` | 本期下属客户合计交易手数 | `154.20` |
| `commissionPaid`| `number` | 已付返佣金总计 (USD) | `1542.00` |
| `commissionStr` | `string` | 格式化展示佣金文本 | `"1,542.00"` |
| `innerData` | `array` | **该代理对应的明细订单数组（见下表）** | `[...]` |

##### 🔸 内层嵌套表格字段 (`innerData` 数组明细)
| 字段键 (Key) | 数据类型 | 说明 | 示例值 |
| :--- | :--- | :--- | :--- |
| `agent` | `string` | 归属代理 ID | `"BRK1002"` |
| `receiveAcc` | `string` | 收款账号 | `"MT-99812"` |
| `comm` | `number` | 本单产生的返佣金额 (USD) | `10.00` |
| `lots` | `number` | 该订单的手数 | `1.00` |
| `std` | `string` | 返佣计算执行标准 | `"10$/手"` |
| `date` | `string` | 佣金结算平仓日期 | `"2026-08-04"` |
| `orderId` | `string` | 底层 MT 交易订单号 | `"TX889102"` |
| `symbol` | `string` | 交易品种 | `"XAUUSD"` |
| `openPrice` | `number` | 开仓价 | `2350.40` |
| `openTime` | `string` | 开仓时间 | `"2026-08-04 10:15:00"` |
| `closePrice` | `number` | 平仓价 | `2352.10` |
| `closeTime` | `string` | 平仓时间 | `"2026-08-04 11:20:00"` |
| `profit` | `number` | 订单毛盈亏 | `170.00` |
| `swap` | `number` | 订单过夜利息 | `0.00` |
| `fee` | `number` | 交易扣除手续费 | `-2.00` |

---

## 六、 其他写入（WRITE）操作类 API 规范 (前端表单提交、增删改)

> 💡 **请求提示**：此部分接口 of Body 参数名称与封装层级以**后端工作人员提供的最终规范为准**。

### 6.1 提现通道与绑卡管理 (`bankcard.jsx` 增删改)

#### ① 新增/绑定银行卡
* **API 路径**: `POST /api/payment/cards`
* **Body 示例 (仅作参考)**:
  ```json
  {
    "bankAccount": "6225881029381029",
    "bankName": "招商银行",
    "payeeName": "张三",
    "country": "CN",
    "province": "广东省",
    "city": "深圳市",
    "district": "南山区",
    "branch": "高新园支行",
    "bankAddress": "科苑路x号招商银行大厦",
    "swiftCode": "CMBCCNBSZ",
    "isDefault": "是",
    "cardImg": "data:image/png;base64,..."
  }
  ```

#### ② 编辑/修改银行卡
* **API 路径**: `PUT /api/payment/cards/{id}` (Path 参数中包含卡片 ID)
* **Body 示例 (仅作参考)**: 与新增格式相同。

#### ③ 删除银行卡/提现渠道
* **API 路径**: `DELETE /api/payment/cards/{id}`
* **响应示例**:
  ```json
  { "code": 200, "message": "已成功删除该银行卡" }
  ```

#### ④ 新增数字货币钱包
* **API 路径**: `POST /api/payment/crypto`
* **Body 示例 (仅作参考)**:
  ```json
  {
    "cryptoType": "USDT-TRC20",
    "walletAddress": "TY4h92uNfJsabcDe..."
  }
  ```

#### ⑤ 修改/删除数字货币钱包
* **修改路径**: `PUT /api/payment/crypto/{id}`
* **删除路径**: `DELETE /api/payment/crypto/{id}`

---

### 6.2 个人基本信息与系统登录密码重置 (`Profile.jsx` & `Security.jsx`)

#### ① 修改前端 Profile 基本信息
* **API 路径**: `PUT /api/user/profile`
* **Body 示例 (仅作参考)**:
  ```json
  {
    "avatar": "data:image/png;base64,...", // 头像 Base64 数据
    "email": "desonfx.xie@icloud.com",
    "phone": "84024318",
    "birthday": "2001-07-12",
    "address": "中国香港特别行政区香港上水",
    "detailAddress": "详细地址内容"
  }
  ```

#### ② 修改系统主账户平台登录密码
* **API 路径**: `POST /api/user/change-password`
* **Body 示例 (仅作参考)**:
  ```json
  {
    "oldPassword": "current_password_123",
    "newPassword": "new_secure_password_456"
  }
  ```

---

### 6.3 出入金与划转业务表单申请

#### ① 在线入金申请 (充值 `DepositPages.jsx`)
* **API 路径**: `POST /api/payment/deposit`
* **Body 示例 (仅作参考)**:
  ```json
  {
    "accountId": "889021",
    "depositAmount": 5000.00,       // 入金金额 (USD)
    "channel": "网关支付"            // 支付渠道类型
  }
  ```
* **响应 `data` 示例 (用于前端做支付跳转)**:
  ```json
  {
    "code": 200,
    "data": {
      "paymentUrl": "https://gateway.pay.com/checkout/order123456"
    }
  }
  ```

#### ② 出金申请提交 (提现 `CashOut.jsx`)
* **API 路径**: `POST /api/payment/withdraw`
* **Body 示例 (根据提取渠道类型决定参数, 仅作参考)**:
  * **电汇出金**:
    ```json
    {
      "type": "电汇",
      "accountId": "889021",
      "amount": 2000.00,
      "bankCardId": "card_001" // 前端已绑定银行卡的唯一 ID，后端根据此 ID 获取详细收款卡号
    }
    ```
  * **数字货币出金**:
    ```json
    {
      "type": "数字货币",
      "accountId": "889021",
      "amount": 2000.00,
      "cryptoAddressId": "crypto_001" // 加密接收钱包唯一 ID
    }
    ```

#### ③ 内部转账申请提交 (`Transfer.jsx`)
* **API 路径**: `POST /api/payment/transfer`
* **Body 示例 (仅作参考)**:
  ```json
  {
    "transferType": "同名转账",   // "同名转账" 或 "异名转账"
    "sourceAccountId": "889021", // 转出子账户
    "targetAccountId": "667102", // 转入子账户
    "amount": 1500.00,           // 划账金额 (USD)
    "remark": "划转备注"
  }
  ```