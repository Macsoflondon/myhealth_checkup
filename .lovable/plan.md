

## Reduce Bottom Padding on Goodbody Card

Currently the card wrapper has `p-5 lg:p-6` padding, and the button container has `pb-2`. To bring the card bottom closer to the button (ending roughly 3 lines below it):

### Change
- On line 54, change the button container's `pb-2` to `pb-0`
- On line 35, reduce the card's bottom padding by changing `p-5 lg:p-6` to `pt-5 px-5 pb-3 lg:pt-6 lg:px-6 lg:pb-3`

This keeps the top and side padding intact while trimming the bottom so the card ends just a small gap below the button.

