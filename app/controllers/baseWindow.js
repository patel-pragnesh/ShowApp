var args = $.args || {};
var paramsToWidget = args.paramsToWidget;
$.root.add(Alloy.createController("HomeView",{widgetToLoad:args.widget,paramsToWidget:paramsToWidget}).getView());
