(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("ForceClick", function moduleClosure(global) {
"use strict";

// --- dependency modules ----------------------------------
// --- define / local variables ----------------------------
// --- class / interfaces ----------------------------------
function ForceClick(callback,   // @arg Function = null - click on link handler. callback(event:Event, href:URLString, force:Number):void
                    selector) { // @arg CSSSelectorString = ".disable-force-click"
    this._selector = selector || ".disable-force-click";
    this._callback = callback;
    this._touch = { object: null, x: 0, y: 0 };
    this._map = new WeakMap();
}

ForceClick["VERBOSE"] = false;
ForceClick["repository"] = "https://github.com/uupaa/ForceClick.js";
ForceClick["prototype"] = Object.create(ForceClick, {
    "constructor": { "value": ForceClick           }, // new ForceClick():this
    "disable":     { "value": ForceClick_disable   }, // ForceClick#disable():void
    "enable":      { "value": ForceClick_enable    }, // ForceClick#enable():void
});

// --- implements ------------------------------------------
function ForceClick_disable() {
    var that = this;

    [].slice.call(document.querySelectorAll(this._selector)).forEach(function(node) {
            var start = _touchstartHandler.bind(that);
            var end   = _touchendHandler.bind(that);
            var obj   = { href: node.href, peak: 0, start: start, end: end };

            node.href = "javascript:void(1)"; // overwrite <a href="..."> value.
            node.addEventListener("touchstart", start);
            node.addEventListener("touchend",   end);
            that._map.set(node, obj);
    });
}

function ForceClick_enable() {
    var that = this;

    [].slice.call(document.querySelectorAll(this._selector)).forEach(function(node) {
        if (node.href === "javascript:void(1)") {
            var obj = that._map.get(node);

            node.href = obj.href;
            node.removeEventListener("touchstart", obj.start);
            node.removeEventListener("touchend",   obj.end);
            that._map.delete(node);
        }
    });
}

function _touchstartHandler(event) {
    event.preventDefault();
    if (ForceClick["VERBOSE"]) { console.log(event.type); }

    var that  = this;
    var node  = event.target;
    var touch = event.touches[0];

    this._map.get(node).peak = 0;
    this._touch = { object: touch, x: touch.pageX, y: touch.pageY };

    _watchForceValue();

    function _watchForceValue() {
        if (that._touch.object) {
            var force = that._touch.object["force"];
            var obj   = that._map.get(node);
            obj.peak = Math.max(obj.peak, force); // update peak
            if (ForceClick["VERBOSE"]) { console.log(force + "/" + obj.peak); }
            setTimeout(_watchForceValue, 16);
        }
    }
}

function _touchendHandler(event) {
    event.preventDefault();
    if (ForceClick["VERBOSE"]) { console.log(event.type); }

    var touch = event.changedTouches[0];
    var obj   = this._map.get(event.target, { href: "", peak: 0 });
    var rx    = Math.abs(this._touch.x - touch.pageX);
    var ry    = Math.abs(this._touch.y - touch.pageY);

    if (rx <= 12 && ry <= 12) {
        if (this._callback) {
            this._callback(event, obj.href, obj.peak);
        } else {
            location.href = obj.href;
        }
    }
    this._touch.object = null;
}

return ForceClick; // return entity

});

