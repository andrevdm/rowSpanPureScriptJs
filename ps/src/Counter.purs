module App.Counter where

import Prelude ((+), (-), const, show, map)
import Pux.Html (Html, div, span, button, text)
import Pux.Html.Events (onClick)

data Action = Increment | Decrement

type State = Int

init :: State
init = 0

update :: Action -> State -> State
update Increment state = state + 1
update Decrement state = state - 1

                         
collapseTableArray :: forall r c. Array {cols :: Array {span :: Int | c} | r} -> Array {cols :: Array {span :: Int | c} | r}
collapseTableArray rows = 
  let collapse = map (const 0) rows in
  
  rows
                         
view :: State -> Html Action
view state =
  let rows = [{col: [{span: 1}
                    ,{span: 2}
                    ]
              }] in

  
  div
    []
    [ button [ onClick (const Increment) ] [ text "Increment" ]
    , span [] [ text (show state) ]
    , button [ onClick (const Decrement) ] [ text "Decrement" ]
    ]
