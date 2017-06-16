"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var PropTypes = require('prop-types');
var isEqual = require('deep-equal');
var diff_1 = require("./util/diff");
var uid_1 = require("./util/uid");
var typeToLayerLUT = {
    'fill': 'fill',
    'fill-extrusion': 'fillExtrusion',
    'symbol': 'symbol',
    'circle': 'circle',
    'line': 'line'
};
var GeoJSONLayer = (function (_super) {
    __extends(GeoJSONLayer, _super);
    function GeoJSONLayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = _this.props.id || "geojson-" + uid_1.generateID();
        _this.source = __assign({ type: 'geojson' }, _this.props.sourceOptions, { data: _this.props.data });
        _this.layerIds = [];
        _this.createLayer = function (type) {
            var _a = _this, id = _a.id, layerIds = _a.layerIds;
            var _b = _this.props, before = _b.before, layerOptions = _b.layerOptions;
            var map = _this.context.map;
            var layerId = id + "-" + type;
            layerIds.push(layerId);
            var paint = _this.props[typeToLayerLUT[type] + "Paint"] || {};
            var visibility = Object.keys(paint).length ? 'visible' : 'none';
            var layout = _this.props[typeToLayerLUT[type] + "Layout"] || { visibility: visibility };
            map.addLayer(__assign({ id: layerId, source: id, type: type,
                paint: paint,
                layout: layout }, layerOptions), before);
        };
        return _this;
    }
    GeoJSONLayer.prototype.componentWillMount = function () {
        var _a = this, id = _a.id, source = _a.source;
        var map = this.context.map;
        map.addSource(id, source);
        this.createLayer('symbol');
        this.createLayer('line');
        this.createLayer('fill');
        this.createLayer('fill-extrusion');
        this.createLayer('circle');
    };
    GeoJSONLayer.prototype.componentWillUnmount = function () {
        var _a = this, id = _a.id, layerIds = _a.layerIds;
        var map = this.context.map;
        map.removeSource(id);
        layerIds.forEach(function (lId) { return map.removeLayer(lId); });
    };
    GeoJSONLayer.prototype.componentWillReceiveProps = function (props) {
        var _this = this;
        var id = this.id;
        var data = this.props.data;
        var map = this.context.map;
        if (props.data !== data) {
            map.getSource(id).setData(props.data);
        }
        var _loop_1 = function (type) {
            if (typeToLayerLUT.hasOwnProperty(type)) {
                var prop = typeToLayerLUT[type] + 'Paint';
                if (!isEqual(props[prop], this_1.props[prop])) {
                    var paintDiff_1 = diff_1.default(this_1.props[prop], props[prop]);
                    Object.keys(paintDiff_1).forEach(function (key) {
                        map.setPaintProperty(_this.id + "-" + type, key, paintDiff_1[key]);
                    });
                }
            }
        };
        var this_1 = this;
        for (var type in typeToLayerLUT) {
            _loop_1(type);
        }
        var _loop_2 = function (type) {
            if (typeToLayerLUT.hasOwnProperty(type)) {
                var prop = typeToLayerLUT[type] + 'Layout';
                if (!isEqual(props[prop], this_2.props[prop])) {
                    var layoutDiff_1 = diff_1.default(this_2.props[prop], props[prop]);
                    Object.keys(layoutDiff_1).forEach(function (key) {
                        map.setLayoutProperty(_this.id + "-" + type, key, layoutDiff_1[key]);
                    });
                }
            }
        };
        var this_2 = this;
        for (var type in typeToLayerLUT) {
            _loop_2(type);
        }
    };
    GeoJSONLayer.prototype.render = function () {
        return null;
    };
    return GeoJSONLayer;
}(React.Component));
GeoJSONLayer.contextTypes = {
    map: PropTypes.object
};
exports.default = GeoJSONLayer;
//# sourceMappingURL=geojson-layer.js.map