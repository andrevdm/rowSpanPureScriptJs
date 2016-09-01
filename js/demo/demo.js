"use strict";var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key]}}}return target};var createStore=Redux.createStore;var combineReducers=Redux.combineReducers;var Component=React.Component;var Provider=ReactRedux.Provider;var dispatchRefreshData=function dispatchRefreshData(store){return store.dispatch({type:"DATA_REFRESH",store:store})};var dispatchUpdateData=function dispatchUpdateData(store,data){return store.dispatch({type:"DATA_UPDATE",store:store,data:data})};var mainReducer=function mainReducer(){var state=arguments.length<=0||arguments[0]===undefined?{}:arguments[0];var action=arguments[1];switch(action.type){case"DATA_REFRESH":{//This would usually be a AJAX call with the dispatchUpdate happening in the success function
setTimeout(function(){var data=[{year:2016,months:[{month:11,days:[{day:30},{day:10}]},{month:2,days:[{day:15},{day:3},{day:1}]}]},{year:2015,months:[{month:5,days:[{day:20},{day:17}]}]}];dispatchUpdateData(action.store,data)},10);return state}case"DATA_UPDATE":{return _extends({},state,{data:action.data})}default:{return state}}};var chainReducers=function chainReducers(reducers){return function(state,action){return R.reduce(function(a,r){return r(a,action)},state,reducers)}};var dashReducers=chainReducers([mainReducer]);var dashApp=dashReducers;//--------------------------------------------------------------------------------------------
// Presentational components
//--------------------------------------------------------------------------------------------
var DemoComponent=function DemoComponent(_ref){var _ref$data=_ref.data;var data=_ref$data===undefined?[]:_ref$data;var daysInYear=function daysInYear(y){return R.flatten(R.map(function(m){return m.days},y.months))};var rows=R.flatten(R.map(function(y){return R.map(function(m){return R.map(function(d){return{rowId:y.year+"."+m.month+"."+d.day,cols:[{val:y.year,span:daysInYear(y).length},{val:m.month,span:m.days.length},{val:d.day,span:1}]}},m.days)},y.months)},data));var collapsed=collapseTableArray(rows);return React.createElement("div",null,React.createElement("table",null,React.createElement("thead",null,React.createElement("tr",null,React.createElement("th",null,"Year"),React.createElement("th",null,"Month"),React.createElement("th",null,"Day"))),React.createElement("tbody",null,R.map(function(r){return React.createElement("tr",{key:r.rowId},R.map(function(c){return React.createElement("td",{rowSpan:c.span,key:r.rowId+"."+c.val},c.val)},r.cols))},collapsed))))};//--------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------
// Container components
//--------------------------------------------------------------------------------------------
var DemoContainer=function DemoContainer(_ref2){var store=_ref2.store;var state=store.getState();return React.createElement(DemoComponent,{data:state.data})};//--------------------------------------------------------------------------------------------
var startApp=function startApp(){var store=createStore(dashApp);var render=function render(){return ReactDOM.render(React.createElement("span",null,React.createElement("h1",null,"Demo"),React.createElement(DemoContainer,{store:store})),document.getElementById("root"))};dispatchRefreshData(store);store.subscribe(render);render()};startApp();
//# sourceMappingURL=demo.js.map