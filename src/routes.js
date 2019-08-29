import Home from './components/Home'
import Menu from './components/Menu'
import Admin from './components/Admin'
import About from './components/about/About'
import Login from './components/Login'
import Register from './components/Register'

// 二级路由
import Contact from './components/about/Contact'
import Delivery from './components/about/Delivery'
import History from './components/about/History'
import OrderingGuide from './components/about/OrderingGuide'

// 三级路由
import Phone from './components/about/contact/Phone';
import PersonName from './components/about/contact/PersonName';

export const routes = [
  {path:'/pizza',name:"homeLink",components:{
    default:Home,
    'orderingGuide':OrderingGuide,
    'delivery':Delivery,
    'history':History
  }},
  {path:'/pizza/menu',name:'menuLink',component:Menu},
  {path:'/pizza/admin',name:'adminLink',component:Admin},
  {path:'/pizza/about',name:'aboutLink',component:About,redirect:'/pizza/about/contact', children:[
    {path:'/pizza/about/contact',name:"contactLink",redirect:'/pizza/personname',component:Contact,children:[
      {path:'/pizza/phone',name:"phoneNumber",component:Phone},
      {path:'/pizza/personname',name:"personName",component:PersonName}
    ]},
    {path:'/pizza/history',name:"historyLink",component:History},
    {path:'/pizza/delivery',name:"deliveryLink",component:Delivery},
    {path:'/pizza/orderingGuide',name:"orderingGuideLink",component:OrderingGuide},
  ]},
  {path:'/pizza/login',name:'loginLink',component:Login},
  {path:'/pizza/register',name:'registerLink',component:Register},
  {path:'*',redirect:'/pizza'}
]