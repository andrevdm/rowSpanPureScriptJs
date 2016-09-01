"use strict";
const createStore = Redux.createStore;
const combineReducers = Redux.combineReducers;
const Component = React.Component;
const Provider = ReactRedux.Provider;

const dispatchRefreshData = (store) => store.dispatch( {type: "DATA_REFRESH", store} );
const dispatchUpdateData = (store, data) => store.dispatch( {type: "DATA_UPDATE", store, data} );

const mainReducer = (state = {}, action) => {
  switch( action.type ){
    case "DATA_REFRESH":{
      //This would usually be a AJAX call with the dispatchUpdate happening in the success function
      setTimeout( () => {
        const data = [{year:2016,
                       months:[{month:11,
                                days:[{day:30},
                                      {day:10}
                                     ]
                               },
                               {month:2,
                                days:[{day:15},
                                      {day:3},
                                      {day:1}
                                     ]
                               }
                              ]
                      },
                      {year:2015,
                       months:[{month:5,
                                days:[{day:20},
                                      {day:17}
                                     ]
                               }
                              ]
                      }
                     ];
        
        dispatchUpdateData( action.store, data );
      },
      10 );

      return state;
    }

    case "DATA_UPDATE":{
      return {
        ...state,
        data: action.data
      };
    }
    
    default:{
      return state;
    }
  }
};

const chainReducers = reducers => {
  return (state,action) => {
    return R.reduce( (a,r) => r(a, action), state, reducers );
  };
}

const dashReducers = chainReducers( [mainReducer] );
const dashApp = dashReducers;


//--------------------------------------------------------------------------------------------
// Presentational components
//--------------------------------------------------------------------------------------------
const DemoComponent = ({data = []}) => {
  const daysInYear = y => R.flatten( R.map( m => m.days, y.months ) );
  
  const rows = R.flatten( R.map(
    y => R.map(
      m => R.map(
        d => ({rowId: y.year + "." + m.month + "." + d.day,
               cols:[{val: y.year,  span: daysInYear(y).length}
                    ,{val: m.month, span: m.days.length} 
                    ,{val: d.day,   span: 1}        
                    ]
              }),
        m.days ),
      y.months ),
    data )
  );

  var collapsed = collapseTableArray( rows );

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Year</th>
            <th>Month</th>
            <th>Day</th>
          </tr>
        </thead>
        <tbody>
          {R.map( r => (<tr key={r.rowId}>
                         {R.map( c => (<td rowSpan={c.span} key={r.rowId + "." + c.val}>
                                         {c.val}
                                       </td>),
                                 r.cols )}
                        </tr>),
                  collapsed )}
        </tbody>
      </table>
    </div>
  );
}
//--------------------------------------------------------------------------------------------


//--------------------------------------------------------------------------------------------
// Container components
//--------------------------------------------------------------------------------------------
const DemoContainer = ({store}) => {
  const state = store.getState();
  
  return (
    <DemoComponent data={state.data} />
  );
}
//--------------------------------------------------------------------------------------------

const startApp = () => {
  const store = createStore(dashApp);

  const render = () => {
    return ReactDOM.render(
        <span>
          <h1>Demo</h1>

          <DemoContainer
            store={store} />
        </span>,
      document.getElementById("root")
    );
  };

  dispatchRefreshData(store);
  store.subscribe(render);
  render();
}

startApp();
