define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",
    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",

    "dojo/text!Subscriptions/widget/template/Subscriptions.html"
], function(declare, _WidgetBase, _TemplatedMixin, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, lang, dojoText, dojoHtml, dojoEvent, widgetTemplate) {
    "use strict";

    return declare("Subscriptions.widget.Subscriptions", [_WidgetBase, _TemplatedMixin], {

        templateString: widgetTemplate,

        widgetBase: null,

        //modeler
        subAttr: null,
        subEntity: null,
        subObject: null,
        subVal: null,
        attribute: null,
        entity: null,

        // Internal variables.
        _handles: null,
        _contextObj: null,

        constructor: function() {
            this._handles = [];
        },

        postCreate: function() {
            logger.debug(this.id + ".postCreate");
            this.connect(this.triggerChangeNode, "click", lang.hitch(this, function() {
                this._contextObj.set(this.attribute, "rebeccapurple");
            }));
        },

        update: function(obj, callback) {
            logger.debug(this.id + ".update");

            this._contextObj = obj;
            this._resetSubcriptions();
            this._updateRendering(callback);
        },

        resize: function(box) {
            logger.debug(this.id + ".resize");
        },

        uninitialize: function() {
            logger.debug(this.id + ".uninitialize");
        },

        _resetSubcriptions: function() {
            this.unsubscribeAll();
            if (this.subAttr) {
                this.subscribe({
                    guid: this._contextObj.getGuid(),
                    attr: this.attribute,
                    callback: lang.hitch(this, function(guid, attr, attrValue) {
                        console.log("Attribute subscription fired");
                        console.debug(arguments);
                        // the GUID of the object that changed
                        // the attribute name of the attribute whose value changed
                        // the new value of the attribute
                        this._updateRendering();
                    })
                });
            }
            if (this.subObject) {
                this.subscribe({
                    guid: this._contextObj.getGuid(),
                    callback: lang.hitch(this, function(guid) {
                        console.log("Object subscription fired");
                        console.debug(arguments);
                        // the guid of the object that was changed
                        this._updateRendering();
                    })
                });
            }
            if (this.subEntity) {
                this.subscribe({
                    entity: this._contextObj.metaData.getEntity(),
                    callback: lang.hitch(this, function(entity) {
                        console.log("Entity subscription fired");
                        console.debug(arguments);
                        // the entity name of the object that was changed
                        this._updateRendering();
                    })
                });
            }
            if (this.subVal) {
                this.subscribe({
                    guid: this._contextObj.getGuid(),
                    val: true,
                    callback: lang.hitch(this, function(validations) {
                        console.log("Validation subscription fired");
                        console.debug(arguments);
                        // an array of validation objects, per object
                        // validations[0] is the feedback
                        // validations[0].getGuid() --> the obect guid
                        // validations[0].getAttributes() --> the list of attributes with errors
                        // validations[0].getReasonByAttribute({attrName}) --> the message for field `attrName`
                        var val = validations[0];
                        val.getAttributes().forEach(function(a) { console.log(val.getReasonByAttribute(a.name)); });
                        this._updateRendering();
                    })
                });
            }
        },

        _updateRendering: function(callback) {
            logger.debug(this.id + "._updateRendering");

            if (this._contextObj !== null) {
                dojoStyle.set(this.domNode, "display", "block");
            } else {
                dojoStyle.set(this.domNode, "display", "none");
            }

            this._executeCallback(callback);
        },

        _executeCallback: function(cb) {
            if (cb && typeof cb === "function") {
                cb();
            }
        }
    });
});

require(["Subscriptions/widget/Subscriptions"]);