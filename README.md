# ForceClick.js [![Build Status](https://travis-ci.org/uupaa/ForceClick.js.svg)](https://travis-ci.org/uupaa/ForceClick.js)

[![npm](https://nodei.co/npm/uupaa.forceclick.js.svg?downloads=true&stars=true)](https://nodei.co/npm/uupaa.forceclick.js/)

Disable force click on link navigation

- Please refer to [Spec](https://github.com/uupaa/ForceClick.js/wiki/) and [API Spec](https://github.com/uupaa/ForceClick.js/wiki/ForceClick) links.
- The ForceClick.js is made of [WebModule](https://github.com/uupaa/WebModule).

## Browser and NW.js(node-webkit)

```js
<style>
a[href] {
  font-size: 20pt;
}
.disable-force-click {
  color: blue;
  cursor: pointer;
  text-decoration: underline;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}
</style>

<p>
  <a href="http://google.co.jp" class="disable-force-click">jump to google</a>
</p>

<script src="<module-dir>/lib/WebModule.js"></script>
<script src="<module-dir>/lib/WebGLDetector.js"></script>
<script src="<module-dir>/lib/UserAgent.js"></script>
<script src="<module-dir>/lib/SpecCatalog.js"></script>
<script src="<module-dir>/lib/Spec.js"></script>
<script src="<module-dir>/lib/ForceClick.js"></script>
<script>

var debug = true;
var ua    = new UserAgent();
var spec  = new Spec(ua);
var forceClick = null;

if (!debug) {
    // pretty code
    if (spec.FORCE_CLICK) {
        new ForceClick().disable();
    }
} else {
    if (spec.FORCE_CLICK) {
        ForceClick.VERBOSE = true;

        forceClick = new ForceClick(function(event,   // @arg Event - Event Object
                                             href,    // @arg URLString - href value
                                             force) { // @arg Number - force touch value. 0.0 - 1.0
            if (force <= 0.4) {
                document.body.style.cssText = "background-color: blue";
            } else {
                document.body.style.cssText = "background-color: yellow";
            }
            // reset bg-color
            setTimeout(function() {
                document.body.style.cssText = "background-color: white";
            }, 500);
        });

        forceClick.disable();
    }
}

</script>
```


