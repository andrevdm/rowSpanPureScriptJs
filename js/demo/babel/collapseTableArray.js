//--------------------------------------------------------------------------------------------
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
const collapseTableArray = (tableArray) => {
  if( R.isEmpty(tableArray) ){
    return [];
  }
  
  //First collapse array is just a 0 for each col on first row
  var collapse = R.map( a => 0, tableArray[0].cols );

  var fixed = R.reduce(
    ([skip, acc],row) => {
      //combine the skip list and cols
      const skipCols = R.zip( skip, row.cols )
      //Get the col that should not be skipped (2nd item from each of the filtered pair)
      const nextCols = R.map( p => p[1], R.filter( f => f[0] <= 0, skipCols ) )
      //Calculate next skip. Look at prev skip, use the rowSpan from tableArray once the previous span has been used up
      const nextSkip = R.map( p => p[0] == 0 ? p[1].span - 1 : p[0] - 1, skipCols )

      const res = R.concat( acc, [{...row, cols:nextCols}] );
      return [nextSkip, res];
    },
    [collapse,[]],
    tableArray );

  return fixed[1];
}
//--------------------------------------------------------------------------------------------
