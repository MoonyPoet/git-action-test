import Vue from 'vue';
import Vuex from 'vuex';
import * as getters from './getters';
import * as actions from './actions';
import * as mutations from './mutations';

Vue.use(Vuex);
const state = {
    options: [],
    activeIndex: '/user',
    pageInfo: {},
    baseInfo: '',
    isPrompt: 1,
    userInfo: '',
    merchantInfo: '',
    isCache: true,
    exCache: [],
    dailogObj: "",
    dailogShow: {},
    recordUserName: "",
    authData: [],
    authArr:[],
    paramConfig:{},
    imgOrVideo:"",
    authTabs:"",
    memberInfo:{},
    baseRouter:[],
    cancelTokenArr:[]
};
const store = new Vuex.Store({
    state,
    mutations,
    getters,
    actions,
});
export default store;