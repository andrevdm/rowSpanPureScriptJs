"use strict";var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key]}}}return target};var _slicedToArray=function(){function sliceIterator(arr,i){var _arr=[];var _n=true;var _d=false;var _e=undefined;try{for(var _i=arr[Symbol.iterator](),_s;!(_n=(_s=_i.next()).done);_n=true){_arr.push(_s.value);if(i&&_arr.length===i)break}}catch(err){_d=true;_e=err}finally{try{if(!_n&&_i["return"])_i["return"]()}finally{if(_d)throw _e}}return _arr}return function(arr,i){if(Array.isArray(arr)){return arr}else if(Symbol.iterator in Object(arr)){return sliceIterator(arr,i)}else{throw new TypeError("Invalid attempt to destructure non-iterable instance")}}}();//--------------------------------------------------------------------------------------------
// Helper functions
//--------------------------------------------------------------------------------------------
// collapseTableArray :: [ {cols: [{span:Int, ...}], ...} ] -> [{cols: [{span:Int, ...}], ...]
// Used to help generating a HTML table with rowSpans
// The span param indicates how many rows should be joined, i.e. the rowspan
// The output array will only have values that should be rendered as TDs
//
// e.g. (assuming you are using the "val" field to hold the text, not that for react you would need a unique key per row & col as well)
//  var arr = [ {rowId:1, cols: [{span:2, val:"1.1"}, {span:3, val:"1.2"}, {span:1, val:"1.3"}, {span:1, val:"1.4"}]}
//             ,{rowId:2, cols: [{span:0, val:"2.1"}, {span:0, val:"2.2"}, {span:3, val:"2.3"}, {span:1, val:"2.4"}]}
//             ,{rowId:3, cols: [{span:2, val:"3.1"}, {span:0, val:"3.2"}, {span:3, val:"3.3"}, {span:1, val:"3.4"}]}
//             ,{rowId:4, cols: [{span:0, val:"4.1"}, {span:1, val:"4.2"}, {span:3, val:"4.3"}, {span:1, val:"4.4"}]}
//            ];
//
//  collapseTableArray( arr ) will give you
//  [ {rowId:1, cols: [{span:2, val:"1.1"}, {span:3, val:"1.2"}, {span:1, val:"1.3"}, {span:1, val:"1.4"}]}
//   ,{rowId:2, cols: [{span:3, val:"2.3"}, {span:1, val:"2.4"}]}
//   ,{rowId:3, cols: [{span:2, val:"3.1"}, {span:1, val:"3.4"}]}
//   ,{rowId:4, cols: [{span:1, val:"4.2"}, {span:1, val:"4.4"}]}
//  ];
//
//  you can then easily rener this as a table like this 
//    +-----+-----+-----+-----+
//    | 1.1 | 1.2 | 1.3 | 1.4 |
//    +     +     +-----+-----+
//    |     |     | 2.3 | 2.4 |
//    +-----+     +-----+-----+
//    | 3.1 |     |     | 3.4 |
//    +     +-----+     +-----+
//    |     | 4.2 |     | 4.4 |
//    +-----+-----+-----+-----+
//
//
var collapseTableArray=function collapseTableArray(tableArray){if(R.isEmpty(tableArray)){return[]}//First collapse array is just a 0 for each col on first row
var collapse=R.map(function(a){return 0},tableArray[0].cols);var fixed=R.reduce(function(_ref,row){var _ref2=_slicedToArray(_ref,2);var skip=_ref2[0];var acc=_ref2[1];//combine the skip list and cols
var skipCols=R.zip(skip,row.cols);//Get the col that should not be skipped (2nd item from each of the filtered pair)
var nextCols=R.map(function(p){return p[1]},R.filter(function(f){return f[0]<=0},skipCols));//Calculate next skip. Look at prev skip, use the rowSpan from tableArray once the previous span has been used up
var nextSkip=R.map(function(p){return p[0]==0?p[1].span-1:p[0]-1},skipCols);var res=R.concat(acc,[_extends({},row,{cols:nextCols})]);return[nextSkip,res]},[collapse,[]],tableArray);return fixed[1]};//--------------------------------------------------------------------------------------------
//# sourceMappingURL=collapseTableArray.js.map