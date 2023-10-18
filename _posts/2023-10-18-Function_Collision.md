---
layout: post
title: Check Collision detector
description: Checks the collision
type: game
courses: { versions: {week: 0} }
---

# Check Collision detector


```js
function checkCollision(x, y, hitboxWidth, hitboxHeight) {

          if (
                x >= hitboxX &&
                x <= hitboxX + hitboxWidth &&
                y >= hitboxY &&
                y <= hitboxY + hitboxHeight
            ) {
                return true;
            }
            return false;
        }
 ```
