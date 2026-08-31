# Comparison tray states, plus the approved data corrections

Answering the question first: the tray is still rendering. On `/compare/results` it is in the DOM, visible, 57px tall — it just looks like a plain white strip, so it reads as "gone". Two real problems behind that:

1. **The empty state almost never shows.** The tray hides itself unless the page contains a `#comparison-anchor` sentinel, and only the homepage has one. On every other page the empty "0/5" ghost strip appears immediately with no scroll gating, and on the homepage it disappears again the moment you scroll past `#comparison-end`. The frosted, holographic-grey resting state you want was replaced by a plain white dashed strip with `animate-pulse`.
2. **The active tray has no highlight.** It uses the same flat white card surface as the empty state, so adding tests changes nothing visually except the pills.

The tray also runs edge-to-edge, ignoring the 2.5cm page frame, and the pills overflow off the right rather than scrolling cleanly — visible in the second screenshot where "Every…" is cut in half behind the Clear button.

The approved provider-data corrections from the previous plan have not been applied yet; they are folded in below so both ship together.
