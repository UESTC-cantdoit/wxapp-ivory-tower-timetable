# 象牙塔课程表

一款基于微信小程序开发的由课程驱动的大学生专用待办事项工具。

正在紧张刺激的开发过程中。

## 开发之前

确保已经安装 [node](https://nodejs.org/en/)，移动到项目目录下，执行命令 `npm install`

然后打开微信开发者工具，点击 **工具 -> 构建 npm**，并勾选 **使用 npm 模块** 选项。

  ![构建 npm 包](https://img.yzcdn.cn/public_files/2019/08/15/fa0549210055976cb63798503611ce3d.png)

## To do List

### 基本特性

- [x] 每个用户有自己的课表
- [ ] 用户在“课表”页面可以查看、添加和修改课程
- [ ] 用户为课程添加事项，将体现在“日程”页面中
- [ ] 用户可以删除、修改和完成事项
- [ ] 用户可以查看已完成的事项
- [ ] 逾期的事项自动设置为**已结束**（并非已完成）
- [ ] 用户可以加入或创建“班级”

### 加入“班级”后的新特性

- [ ] “班级”共享公用课程以及公用课程中的事项
- [ ] 创建“班级”的人将成为该“班级”的创建者
- [ ] “班级”的创建者可以设置“班级”是否能加入以及是否需要验证
- [ ] “班级”的创建者可以允许或拒绝用户加入本“班级”；“班级”的创建者可以拉黑用户，同时将删除该用户创建的**所有**公用课程和公用事项
- [ ] 现在添加课程也可以从“班级”的公用课程中选择
- [ ] 新建的课程可以添加到“班级”的公用课程中，此时您将成为该课程的所有者
- [ ] **只能**由课程的所有者修改课程信息
- [ ] 修改后的公用课程信息会同步到所有选择该课程的同学的课表中
- [ ] 所有人都可以在已加入的公用课程中添加的公用事项，此时您将成为该事项的所有者
- [ ] 逾期的公用事项将不会出现在公用事项列表中
- [ ] 用户可以随时从（已添加课程的）公用事项中同步事项到“日程”页面中，此时的事项与普通的自行添加的事项没有区别
- [ ] 事项的所有者可以修改公用事项。修改后的公用事项会同步到该课程公用事项列表中，但已添加该事项的用户**不受影响**
- [ ] 用户只能同时加入一个“班级”
- [ ] 用户可以退出“班级”，已添加的公用课程会变成**普通课程**，已添加的事项**不受影响**
- [ ] **特别的**，“班级”创建者可以在“班级”中创建不占用课表的“公告”，加入“班级”的人都默认拥有该公用课程。**只有**“班级”创建者可以在“公告”中添加公用事项。

### 其它特性

- [ ] Dark Mode
- [ ] 支持生成“班级”二维码，可以通过扫描二维码快速加入班级
- [ ] 被两个或以上“班级”拉黑的用户将不能够再搜索加入“班级”
