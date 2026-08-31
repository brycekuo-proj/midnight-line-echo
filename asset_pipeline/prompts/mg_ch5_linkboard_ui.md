# Prompt Spec — CH5 ECHO Link Board GUI

Mini-game ID: `link_board`
Asset type: `minigame_ui`
Outputs:
- `img/ui/mg_ch5_linkboard_base.png`
- `img/ui/mg_ch5_linkboard_echo_node.png`
- `img/ui/mg_ch5_linkboard_evidence_node.png`
- `img/ui/mg_ch5_linkboard_connection_glow.png`
- `img/ui/mg_ch5_linkboard_complete.png`

## Goal

Create a graphical inference board for CH5 where accumulated evidence is connected to a central ECHO node. The interface should feel like a hidden synchronization-analysis surface emerging from the chat system.

## Canon lock

The central focus is a large white-painted / white-marked `ECHO` presence. Surrounding nodes represent evidence already encountered in earlier chapters. Existing evidence photographs must be reused as thumbnails where required; do not invent replacement evidence.

## Art direction

- dark desaturated graphite / black board
- thin archival / diagnostic grid traces
- white central ECHO mark with restrained uncanny presence
- subtle cyan / violet connection state
- faint paper/archive/digital hybrid texture
- mobile portrait readability
- investigative rather than sci-fi-command-center look
- no pinboard cliché with bright red yarn
- no fantasy or hacker-movie overload

## Asset 1 — base

A portrait-oriented inference-board background with open space for a large central node and multiple peripheral evidence nodes. Include subtle alignment guides / latent connection paths but no fixed evidence thumbnails or localized text.

## Asset 2 — ECHO node

Transparent isolated central node treatment: imperfect white ECHO mark / painted system imprint, visually dominant but restrained. Must remain readable over the base board.

## Asset 3 — evidence node

Transparent reusable evidence-node frame that can contain existing image thumbnails, timestamps, document icons or short labels inserted by HTML/CSS. Do not bake a specific evidence photo into the generic node asset.

## Asset 4 — connection glow

Transparent activated connection-line / endpoint visual layer. Thin and readable, with subtle white-cyan-violet energy rather than bright neon.

## Asset 5 — complete

A compact completion overlay indicating that the relationship graph has resolved. Leave space for localized DOM text and synchronization feedback.

## Implementation lock

Node placement, drag/tap selection, line drawing, connection validation, completion detection and evidence content remain HTML/CSS/JS. Generated images provide the board, reusable node shells and visual state layers only.
