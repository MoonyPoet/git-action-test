// 菜单配置
// headerMenuConfig：头部导航配置
// asideMenuConfig：侧边导航配置

const headerMenuConfig = [{
    path: '/index',
    name: '机构首页',
}, ];

const asideMenuConfig = [{
        name: "机构设置",
        color: "#95e2d6",
        children: [{
                name: '基本资料',
                path: '/basicInformation',
            },
            {
                name: "校区/分馆管理",
                path: "/campusBranch"
            },
            {
                name: '学员卡设置',
                path: '/coupon',
            },
            {
                name: '优惠活动',
                path: '/preferentialType',

            },
            // {
            //     name: '管理日志',
            //     path: '/manageLog',
            // },
            {
                name: '参数设置',
                path: '/paramConfig',
            },
            {
                name: '短信设置',
                path: '/messageServer?tabPosition=messageSetting',
            },
            {
                name: '短信服务', //做指向
                path: '/messageServer?tabPosition=messageServerView',
            },
            // {
            //     name: "用户查询",
            //     path: "/userSearch"
            // }
        ]
    },
    {
        name: "人事管理",
        color: "#f47564",
        children: [{
                name: "角色权限设置",
                path: '/role'
            },
            {
                name: '岗位设置',
                path: '/joblevel',
            }, {
                name: '员工管理',
                path: '/memberManage',

            },


        ]
    },
    {
        name: "教案管理",
        color: "#71d072",
        children: [{
                name: '教学内容管理',
                path: '/sportManage'
            },
            {
                name: '教学等级管理',
                path: '/teachlevel'
            },
            // {
            //     name: '作业管理',
            //     path: '/taskManage'
            // },
            {
                name: '教案版本管理',
                path: '/versionManage',
            },

            // {
            //     name: '教学教案',
            //     path: '/teachCase'
            // }
        ]
    },
    {
        name: "班级管理",
        color: "#c384ec",
        children: [{
                name: '常规班',
                path: '/classManage'
            },
            {
                name: '常规班排课',
                path: '/classScheduling'
            },
            // {
            //     name: "常规班历史排课",
            //     path: "/classHistorySchedule"
            // },
            {
                name: '预约班', //需要指向团体班或者私教班
                path: '/reservationClassManage'
            },
            {
                name: '预约设置',
                path: '/reservation'
            },
            {
                name: "团体班排课",
                path: "/teamSchedule"
            },
            {
                name: "私教班排课",
                path: "/privateShedule"
            },
            // {
            //     name: '预约班历史排课',
            //     path: '/historySchedule'
            // },

            // {
            //     name: '预约管理',
            //     path: '/reservationManage',
            // },
        ]
    },
    {
        name: "学员管理",
        color: "#60c0dc",
        children: [{
                name: '学员标签设置',
                path: '/filterLabel'
            },
            {
                name: "积分设置",
                path: '/scoreSetting'
            },
             {
                name: '学员列表',
                path: '/studentList'
            },
            // {
            //     name: '日常课务',
            //     path: '/dailyTeach'
            // },

        ]
    },
    // {
    //     name: '体测管理',
    //     children: [{
    //             name: "项目分类",
    //             path: '/projectClassification'
    //         },
    //         {
    //             name: "项目指标",
    //             path: '/projectTarget'
    //         },
    //         {
    //             name: "解决方案",
    //             path: '/solveTheProgram'
    //         }
    //     ]
    // },
    {
        name: '通知提醒',
        color: "#d3b757",
        children: [{
                name: "通知提醒设置",
                path: '/messageRemind'
            }
            // {
            //     name: "通知公告",
            //     path: '/notice'
            // },
            // {
            //     name: "短信群发",
            //     path: '/groupMessage'
            // }
        ]
    },
    {
        name: '财务设置',
        color: "#ef9349",
        children: [
            // {
            //     name: "收支明细",
            //     path: '/incomeExpendDetail'
            // },
            {
                name: "财务设置",
                path: '/otherIncomeExpendProject'
            }
        ]
    },
    {
        name: '销售管理',
        color: "#f4c278",
        children: [{
                name: "CRM标签配置",
                path: '/crmLabelManage'
            },
            {
                name: "CRM客户管理",
                path: '/crmClientManage'
            },
            // {
            //     name: "销售跟踪统计",
            //     path: '/crmSaleStatistics'
            // }
        ]
    },
    {
        name: '增值服务',
        color: "#95e2d6",
        children: [{
            name: "授权管理",
            path: '/authorizedTeachCase'
        }]
    },
    {
        name: '积分商城',
        color: "#f47564",
        children: [{
            name: "商品类别",
            path: '/merchandiseCategories'
        }, {
            name: "商品列表",
            path: '/productList'
        }, 
        // {
        //     name: "积分记录",
        //     path: '/scoreRecord'
        // }, {
        //     name: "订单记录",
        //     path: '/orderHistory'
        // }
    ]
    },
    {
        name: '微官网',
        color: "#ef9349",
        children: [{
            name: "明星老师",
            path: '/starTeacher'
        }]
    },
    // {
    //     name: '统计',
    //     color: "#f47564",
    //     children: [{
    //             name: "企业效率统计",
    //             path: '/statisticsModule'
    //         },
    //         {
    //             name: "销售统计",
    //             path: '/statisticsSales'
    //         }, {
    //             name: "财务统计",
    //             path: '/statisticsFinancial'
    //         }, {
    //             name: "教务统计",
    //             path: '/statisticsSenate'
    //         }
    //     ]
    // }
];

export {
    headerMenuConfig,
    asideMenuConfig
};