module App.Tables (collapseTableArray, Row, Col) where

import Prelude (const, map, (<=), (==), (-), ($))
import Data.Foldable (foldl)
import Data.Array (zip, filter, snoc)
import Data.Tuple (fst, snd)
import Data.Monoid ((<>))


type Col c = {span :: Int | c}
type Row r c = {cols :: Array (Col c) | r}
type CollapseState r c s = {collapse :: Array Int
                           , st :: Array (Row r c)
                           | s
                           }

             
collapseTableArray :: forall r c. Array (Row r c) -> Array (Row r c)
collapseTableArray rows = 
  let collapse = map (const 0) rows in
  let fixed = foldl collapseRow {collapse: collapse, st: []} rows in
  fixed.st

  where
    collapseRow :: forall rr cc ss. (CollapseState rr cc ss) -> Row rr cc -> (CollapseState rr cc ss)
    collapseRow state row =
      -- combine collapse info and cols into tuples
      let skipCols = zip state.collapse row.cols in
      let nextCols = map snd $ filter (\t -> fst t <= 0) skipCols in
      let nextSkip = map (\t -> if fst t == 0 then (snd t).span - 1 else (fst t) - 1) skipCols in
      let resRow = row { cols = nextCols } in
      state {collapse = nextSkip, st = snoc state.st resRow }
