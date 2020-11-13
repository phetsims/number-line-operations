Implementation Overview
=======================

TODO: I tried to keep points and operations quite basic, since points are shared between a number of simulations, and
operations may be at some point in the future.  Because of this, the responsibility for maintaining the relationship
between points and operations rests with the number line, specifically `OperationTrackingNumberLine`, instead of
with the points and operations.

Net Worth Screen
----------------

When starting on this screen, I (jbphet) was looking for a general term for assets and debts, since within the
simulation they can be treated as one thing with different monetary values, with (obviously) assets having a positive
value and debts a negative one.  I didn't find anything very specific at the various accounting websites I looked at,
but these sites all talked about how these appeared on balance sheets, so I settled on the term "balance sheet item".
It's a little wordy, but that's what I went with.  So, throughout the code for these screen are classes with names like
"BalanceSheetItem", "BalanceSheetItemView", "BalanceSheetItemBag", and so forth.  

an item is considered to be in or out of the bags based on destination, not position. 