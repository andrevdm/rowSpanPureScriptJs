module App.Tables (collapseTableArray, Row, Col) where

import Prelude (map, (<=), (==), (-), ($), (<$>))
import Data.Foldable (foldl, minimum)
import Data.Array (zip, filter, snoc, length)
import Data.Tuple (fst, snd)
import Data.Monoid ((<>))
import Data.Maybe (Maybe (..))
import Data.Unfoldable (replicate)

-- | Column type
type Col c = {span :: Int | c}
-- | Row type
type Row r c = {cols :: Array (Col c) | r}
-- | fold state for the collapseRow function
type CollapseState r c s = {collapse :: Array Int
                           , st :: Array (Row r c)
                           | s
                           }

collapseTableArray :: forall r c. Array (Row r c) -> Array (Row r c)
collapseTableArray rows = 
  -- | To create the initial collapse array, we need to know the number of cols in a row
  -- | Get the number of cols in each row and then  get the minimum value
  case minimum $ (\r -> length r.cols) <$> rows of
    Just m ->
      -- | Initial collapse array of zeros
      let collapse = replicate m 0 in 
      -- | fold rows with collapseRow
      let fixed = foldl collapseRow {collapse: collapse, st: []} rows in
      fixed.st
    _ -> []

  where
    -- | The fold function
    collapseRow :: forall rr cc ss. (CollapseState rr cc ss) -> Row rr cc -> (CollapseState rr cc ss)
    collapseRow state row =
      -- | Zip the previous collapse array and the current cols array
      let skipCols = zip state.collapse row.cols in
      -- | Get all cols where the collapse value is less than 1
      let nextCols = snd <$> filter (\t -> fst t <= 0) skipCols in
      -- | If current collapse is zero then next skip is the span value - 1 else its collapse - 1
      let nextSkip = map (\t -> if fst t == 0 then (snd t).span - 1 else (fst t) - 1) skipCols in
      -- | Construct the row, change the cols
      let resRow = row { cols = nextCols } in
      -- | Next state
      state {collapse = nextSkip, st = snoc state.st resRow }
