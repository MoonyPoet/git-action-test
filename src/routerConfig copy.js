import { resolve } from 'any-promise';

// 以下文件格式为描述路由的协议格式
// 你可以调整 routerConfig 里的内容
// 变量名 routerConfig 为 iceworks 检测关键字，请不要修改名称

let Login = () => import('./pages/Login');
let Index = () => import('./pages/Index');
let HeaderAsideLayout = () => import('./layouts/HeaderAsideLayout');
let NotFound = () => import('./pages/NotFound');
let NoAuthority = () => import('./pages/NoAuthority/NoAuthority');
let ServerError = () => import('./pages/ServerError');
let PageOne =() =>import('./pages/PageOne');
let Campus= ()=>import('./pages/Campus/Campus');
let AddCampus= ()=>import('./pages/Campus/AddCampus');
let EditCampus= ()=>import('./pages/Campus/EditCampus');
let Role=()=>import('./pages/Role/Role');
let Member=()=>import('./pages/Member/Member');
let AddMember=()=>import('./pages/Member/AddMember');
let EditMember=()=>import('./pages/Member/EditMember');
let Institution=()=>import('./pages/Institution/Institution');
let Coupon=()=>import('./pages/Coupon/Coupon');
let AddCoupon=()=>import('./pages/Coupon/AddCoupon');
let EditCoupon=()=>import('./pages/Coupon/EditCoupon');
let Position=()=>import('./pages/Position/Position');
let AddPosition=()=>import('./pages/Position/AddPosition');
let EditPosition=()=>import('./pages/Position/EditPosition');
// let router;
// let request = new XMLHttpRequest();
// request.open('POST', 'http://192.168.0.110:8077/rest/manage/card/find_paging?insId=1', false); 
// request.setRequestHeader("Token","d05b65d53089403fbed8460ba5806452")
// request.setRequestHeader("lt","1")
// request.setRequestHeader("Content-Type","application/json")
// request.send(JSON.stringify({"offset":"0","limit":"10"}));
// if (request.status === 200) {
//     console.log(JSON.parse(request.response).data)
// }
const routerConfig = [
    {
        path: '/',
        layout: HeaderAsideLayout,
        component:Index,
        redirect:"/index",
    },
    {
        path: '/noAuthority',
        layout: HeaderAsideLayout,
        component: NoAuthority,
        name: '无权限',
    },
    {
        path: '/serverError',
        layout: HeaderAsideLayout,
        component: ServerError,
        name: '服务器错误',
    },
    {
        path: '/notFound',
        name: 'notFound',
        layout: HeaderAsideLayout,
        component: NotFound,
    },
    {
        path: '/login',
        layout: HeaderAsideLayout,
        component:Login,
    },
    {
        path: '/index',
        layout: HeaderAsideLayout,
        component: Index,
        name: '机构首页',
        meta:{
            isBlock:false
        }
    }
];

// {
//     path: '/institution',
//     layout: HeaderAsideLayout,
//     component: Institution,
//     name: '机构管理',
//     meta:{
//         isBlock:false
//     }
// },
// {
//     path: '/pageOne',
//     layout: HeaderAsideLayout,
//     meta:{
//         isBlock:false
//     },
//     component: PageOne,
//     name: '测试',
// },
// {
//     path:'/campus',
//     layout:HeaderAsideLayout,
//     component:Campus,
//     name:'校区管理',
//     meta:{
//         isBlock:false
//     },
//     children:[
//         {
//             path: '/campus/addCampus',
//             layout: HeaderAsideLayout,
//             component: AddCampus,
//             meta:{
//                 isBlock:false
//             },
//             name:"新增校区"
//         },
//         {
//             path: '/campus/editCampus',
//             layout: HeaderAsideLayout,
//             component: EditCampus,
//             meta:{
//                 isBlock:false
//             },
//             name:"编辑校区"
//         }
//     ]
// },
// {
//     path:'/coupon',
//     layout:HeaderAsideLayout,
//     component:Coupon,
//     name:'卡种管理',
//     meta:{
//         isBlock:false
//     },
//     children:[
//         {
//             path: '/coupon/addCoupon',
//             layout: HeaderAsideLayout,
//             component: AddCoupon,
//             meta:{
//                 isBlock:false
//             },
//             name:"新增卡种"
//         },
//         {
//             path: '/coupon/editCoupon',
//             layout: HeaderAsideLayout,
//             component: EditCoupon,
//             meta:{
//                 isBlock:false
//             },
//             name:"编辑卡种"
//         }
//     ]
// },
// {
//     path:'/position',
//     layout:HeaderAsideLayout,
//     component:Position,
//     name:'职位管理',
//     meta:{
//         isBlock:false
//     },
//     children:[
//         {
//             path: '/position/addPosition',
//             layout: HeaderAsideLayout,
//             component: AddPosition,
//             meta:{
//                 isBlock:false
//             },
//             name:"新增职位"
//         },
//         {
//             path: '/position/editPosition',
//             layout: HeaderAsideLayout,
//             component: EditPosition,
//             meta:{
//                 isBlock:false
//             },
//             name:"编辑职位"
//         }
//     ]
// },
// {
//     path:"/role",
//     layout:HeaderAsideLayout,
//     component:Role,
//     name:'角色',
// },
// {
//     path:"/member",
//     layout:HeaderAsideLayout,
//     component:Member,
//     name:"员工",
//     meta:{
//         isBlock:false
//     },
//     children:[
//         {
//             path: '/member/addMember',
//             layout: HeaderAsideLayout,
//             component: AddMember,
//             meta:{
//                 isBlock:false
//             },
//             name:"新增员工"
//         },
//         {
//             path: '/member/editMember',
//             layout: HeaderAsideLayout,
//             component: EditMember,
//             meta:{
//                 isBlock:false
//             },
//             name:"编辑员工"
//         }
//     ]
// },
// {
//     path: '*',
//     layout: HeaderAsideLayout,
//     component: NotFound,
// },


export default routerConfig;