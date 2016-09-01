{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE OverloadedStrings #-}
module Main where

import Protolude
import qualified Data.Text as Txt 
import Data.Foldable

data Col c = Col {span :: Int, cval :: c} deriving Show
data Row r c = Row {cols :: [Col c], rval :: r} deriving Show
data Rid = Rid Int deriving Show
data Cval = Cval Text deriving Show

main :: IO ()
main = do
  putText $ test

test :: Text
test =
  let rs = [Row {rval = Rid 1, cols = [Col {span = 1, cval = Cval "1.1"}, Col {span = 2, cval = Cval "1.2"}, Col {span = 3, cval = Cval "1.3"}]}
           ,Row {rval = Rid 2, cols = [Col {span = 2, cval = Cval "2.1"}, Col {span = 9, cval = Cval "2.2"}, Col {span = 9, cval = Cval "2.3"}]}
           ,Row {rval = Rid 3, cols = [Col {span = 9, cval = Cval "3.1"}, Col {span = 2, cval = Cval "3.2"}, Col {span = 9, cval = Cval "3.3"}]}
           ,Row {rval = Rid 4, cols = [Col {span = 1, cval = Cval "4.1"}, Col {span = 9, cval = Cval "4.2"}, Col {span = 1, cval = Cval "4.3"}]} 
           ] in

   Txt.intercalate "\n" $ map showT $ collapseTableArray rs
  where
    showT :: (Show s) => s -> Text
    showT = show

-- | same as minimum but check for an empty list
minimumSafe :: Ord a => [a] -> Maybe a
minimumSafe xs =
  case xs of
    [] -> Nothing
    _ -> Just $ minimum xs
  
collapseTableArray :: [Row r c] -> [Row r c]
collapseTableArray rows =
  -- | To create the initial collapse array, we need to know the number of cols in a row
  -- | Get the number of cols in each row and then  get the minimum value
  -- | Use minimumSafe to guard against an empty list
  case minimumSafe $ (\r -> length $ cols r) <$> rows of
    Just i ->
      -- | Initial collapse array of zeros
      let collapse = replicate i 0 in
      -- | fold rows with collapseRow
      let (c,res) = foldl collapseRow (collapse, []) rows in
      res
    _ ->
      []

  where
    -- | The fold function
    collapseRow :: ([Int], [Row r c]) -> Row r c -> ([Int], [Row r c])
    collapseRow (collapse, res) row =
      -- | Zip the previous collapse array and the current cols array
      -- | This results in a tuple of (collapse, col)
      let skipCols = zip collapse $ cols row in
      -- | Get all cols where the collapse value is less than 1
      -- | First the list is filtered by checking the collapse value (the first value in the tuple)
      -- | Then snd is called (fmapped over) each tuple to get only the column
      let nextCols = snd <$> filter (\(c,_) -> c <= 0) skipCols in
      -- | If current collapse is zero then next skip is the span value - 1 else its collapse - 1
      let nextSkip = map (\(c,r) -> if c == 0 then (span r) - 1 else c - 1) skipCols in
      -- | Construct the row, change only the cols
      let resRow = row { cols = nextCols } in
      (nextSkip, res <> [resRow])

