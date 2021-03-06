module App.Layout where

import App.Demo (getTable)
import App.Counter as Counter
import App.NotFound as NotFound
import App.Routes (Route(Home, NotFound))
import Prelude (map, ($))
import Pux.Html (Html, text, h1, hr, div)

data Action
  = Child (Counter.Action)
  | PageView Route

type State =
  { route :: Route
  , count :: Counter.State }

init :: State
init =
  { route: NotFound
  , count: Counter.init }

update :: Action -> State -> State
update (PageView route) state = state { route = route }
update (Child action) state = state { count = Counter.update action state.count }

                              
view :: State -> Html Action
view state =
  div
    []
    [ h1 [] [ text "Row span demo" ]
    , getTable 
    , hr [] []
    , h1 [] [ text "Pux Starter App" ]
    , case state.route of
        Home -> map Child $ Counter.view state.count
        NotFound -> NotFound.view state
    ]
