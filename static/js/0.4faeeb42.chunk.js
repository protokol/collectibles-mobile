(this["webpackJsonpcollectibles-mobile"]=this["webpackJsonpcollectibles-mobile"]||[]).push([[0],{415:function(e,t,n){"use strict";n.r(t),n.d(t,"createSwipeBackGesture",(function(){return a}));var r=n(27),i=(n(77),n(125)),a=function(e,t,n,a,c){var o=e.ownerDocument.defaultView;return Object(i.createGesture)({el:e,gestureName:"goback-swipe",gesturePriority:40,threshold:10,canStart:function(e){return e.startX<=50&&t()},onStart:n,onMove:function(e){var t=e.deltaX/o.innerWidth;a(t)},onEnd:function(e){var t=e.deltaX,n=o.innerWidth,i=t/n,a=e.velocityX,s=n/2,u=a>=0&&(a>.2||e.deltaX>s),l=(u?1-i:i)*n,b=0;if(l>5){var h=l/Math.abs(a);b=Math.min(h,540)}c(u,i<=0?.01:Object(r.h)(0,i,.9999),b)}})}}}]);
//# sourceMappingURL=0.4faeeb42.chunk.js.map