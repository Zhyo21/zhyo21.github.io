

(function( window ) {

  "use strict";



  function whichTransitionEvent(){
    var t,
        el = document.createElement("fakeelement");

    var transitions = {
      "transition"      : "transitionend",
      "OTransition"     : "oTransitionEnd",
      "MozTransition"   : "transitionend",
      "WebkitTransition": "webkitTransitionEnd"
    }

    for (t in transitions){
      if (el.style[t] !== undefined){
        return transitions[t];
      }
    }
  }
  var transitionEvent = whichTransitionEvent();




  function getPosition(e) {
    var posx = 0;
    var posy = 0;
    if (!e) var e = window.event;
    if (e.pageX || e.pageY) {
      posx = e.pageX;
      posy = e.pageY;
    }
    else if (e.clientX || e.clientY) {
      posx = e.clientX + document.body.scrollLeft
        + document.documentElement.scrollLeft;
      posy = e.clientY + document.body.scrollTop
        + document.documentElement.scrollTop;
    }
    return {
      x: posx,
      y: posy
    }
  }


  function getOffsetRect(elem) {
    var box = elem.getBoundingClientRect()
     
    var body = document.body;
    var docElem = document.documentElement;
     
    var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
     
    var clientTop = docElem.clientTop || body.clientTop || 0;
    var clientLeft = docElem.clientLeft || body.clientLeft || 0;
     
    var top  = box.top + scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;
     
    return {
      x: Math.round(left),
      y: Math.round(top)
    }
  }




  function Menu() {
    this.body = document.body;
    this.wrapper = document.querySelector("#wrapper");
    this.toggle = document.querySelector("#mm-menu-toggle");
    this.menu = document.querySelector("#mm-menu");
    this.menuItems = this.menu.querySelectorAll("li");
    this.menuItemLinks = this.menu.querySelectorAll("a");
    this.menuPosition = "off";
    this.mask = document.createElement("div");
    this.mask.className = "mm-menu-mask";
    document.body.appendChild(this.mask);
    this._init();
  }



  Menu.prototype._init = function() {
    this._initToggleEvents();
    this._initItemTransitions();
    this._initTouchEffect();
    this._initMaskEvents();
  };


  Menu.prototype._initToggleEvents = function() {
    var scope = this;
    this.toggle.addEventListener( "click", function() {
      (scope.menuPosition == "off") ? scope._toggleMenuOn() : scope._toggleMenuOff();
    });
  };


  Menu.prototype._toggleMenuOn = function() {
    var scope = this;

    this.body.classList.add("mm-menu-open");
    this.wrapper.classList.add("mm-menu-open");
    this.toggle.classList.add("active");
    this.menu.classList.add("active");

    for ( var i = 0; i < scope.menuItems.length; i++ ) {
      var item = scope.menuItems[i];
      (function( item ) {
        item.classList.add("in-view");
      })( item );
    }

    this.mask.classList.add("active");
    this.menuPosition = "on";
  };

  Menu.prototype._toggleMenuOff = function() {
    var scope = this;

    this.body.classList.remove("mm-menu-open");
    this.wrapper.classList.remove("mm-menu-open");
    this.toggle.classList.remove("active");
    this.menu.classList.remove("active");
    
    for ( var i = 0; i < scope.menuItems.length; i++ ) {
      var item = scope.menuItems[i];
      (function( item ) {
        item.classList.remove("in-view");
      })( item );
    }

    this.mask.classList.remove("active");
    this.menuPosition = "off";
  };



  Menu.prototype._initItemTransitions = function() {
    var scope = this;
    var len = this.menuItems.length;
    for ( var i = 0; i < len; i++ ) {
      var num = i+1;
      var menuItem = this.menuItems[i];
      this._itemTransitionHandler( menuItem, num );
    }
  };

  /**
   
   * @param {HTMLElement} menuItem The menu item in question
   * @param {Number} num The number to append to the class name
   */

  Menu.prototype._itemTransitionHandler = function( menuItem, num ) {
    menuItem.classList.add("item-"+num);
  };

  

  Menu.prototype._initTouchEffect = function() {
    var num = this.menuItemLinks.length;
    for ( var i = 0; i < num; i++ ) {
      var menuItemLink = this.menuItemLinks[i];
      this._touchEffectHandler( menuItemLink );
    }
  };

  /**
   
   * @param {HTMLElement} menuItemLink The menu item link in question
   */

  Menu.prototype._touchEffectHandler = function( menuItemLink ) {
    var elWidth = menuItemLink.offsetWidth,
        elHeight = menuItemLink.offsetHeight,
        touchEffectSize = Math.max(elWidth, elHeight) * 2;
    
    var touchEffectElement = document.createElement("span");
    touchEffectElement.className = "mm-menu__link--touch-effect";
    touchEffectElement.style.width = touchEffectSize+"px";
    touchEffectElement.style.height = touchEffectSize+"px";
    menuItemLink.insertBefore( touchEffectElement, menuItemLink.firstChild );

    menuItemLink.addEventListener( "click", function(e) {
      var relX = getPosition(e).x - getOffsetRect(this).x,
          relY = getPosition(e).y - getOffsetRect(this).y;

      touchEffectElement.style.top = relY+"px";
      touchEffectElement.style.left = relX+"px";
      touchEffectElement.style.marginTop = -(touchEffectSize/2)+"px";
      touchEffectElement.style.marginLeft = -(touchEffectSize/2)+"px";
      touchEffectElement.classList.add("animating");
    });


    touchEffectElement.addEventListener( transitionEvent, function() {
      this.classList.remove("animating");
    });
  };

 

  Menu.prototype._initMaskEvents = function() {
    var scope = this;
    this.mask.addEventListener( "click", function(e) {
      e.preventDefault();
      (scope.menuPosition == "on") ? scope._toggleMenuOff() : false;
    });
  };

  /**
   * Add to global namespace.
   */

  window.Menu = Menu;

})( window );