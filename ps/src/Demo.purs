module App.Demo where

import Prelude (map, show, ($), (<>), (+), (*))
import Pux.Html (Html, tbody, text, th, tr, thead, table, div, td)
import Pux.Html.Attributes (attr)
import App.Tables (collapseTableArray)
import Data.Array (concat, length)

getTable :: forall a. Html a
getTable =
  let dates = [{year:2016, months:[{month:11, days:[{day:30}
                                                   ,{day:10}
                                                   ]}
                                  ,{month:2, days:[{day:15}
                                                  ,{day:3}
                                                  ,{day:1}
                                                  ]}
                                  ]}
              ,{year:2015, months:[{month:5, days:[{day:20}
                                                  ,{day:17}
                                                  ]}
                                  ]}
              ] in

  let rowData = map
                (\y -> map
                       (\m -> map
                              (\d -> {rid:y.year * 100 + m.month
                                     ,cols:[{val:show y.year,  span:length $ concat $ map (\a -> a.days) y.months}
                                           ,{val:show m.month, span:length m.days}
                                           ,{val:show d.day,   span:1}
                                           ]
                                     })
                              m.days)
                       y.months)
                dates in
  
  
  let c = collapseTableArray $ concat $ concat rowData in
  let tableRows = map buildRow c in
  
  div
    []
    [table
       []
       [thead
          []
          [tr
             []
             [th [] [text "year"]
             ,th [] [text "month"]
             ,th [] [text "day"]
             ]
          ]
       ,tbody
          []
          (map buildRow c)
       ]
    ]
  where
    buildRow r =
      tr
      []
      (map buildCol r.cols)

    buildCol c =
      td
        [attr "rowSpan" c.span]
        [text $ c.val]
