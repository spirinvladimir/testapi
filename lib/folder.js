/*global window, document, require, console */
var _ = require('underscore'),
    Backbone = require('backbone'),
    Fare = Backbone.Model.extend({}),
    FaresFull = Backbone.Collection.extend({
        model: Fare
    }),
    FareView = Backbone.View.extend({
        initialize: function () {
            this.$el.css({
                fontSize: '15px',
                color: '#757',
                textShadow: '0px 1px 1px #333'
            });
            this.el.innerHTML = 'Fare: ' + this.model.get('FareId') + ' - ' + this.model.get('TotalAmount') + ' ' + this.model.get('Currency');
        }
    }),
    Airline = Backbone.Model.extend({
        defaults: {
            width: 110,
            height: 110,
            left: 0,
            top: 0,
            z: 1,
            max: false
        }
    }),
    Box = Backbone.View.extend({
        initialize: function () {
            this.$el.css({
                position: 'absolute',
                border: '1px solid black',
                backgroundColor: 'grey',
                width: this.model.get('width') + 'px',
                height: this.model.get('height') + 'px',
                left: this.model.get('left') + 'px',
                top: this.model.get('top') + 'px',
                textAlign: 'center',
                margin: 'auto',
                fontFamily: '"League-Gothic", Courier',
                fontSize: '25px',
                textTransform: 'uppercase',
                color: '#222',
                textShadow: '0px 2px 3px #666',
                verticalAlign: 'middle'
            });
            this.el.innerHTML = this.model.get('name');
            this.listenTo(this.model, 'change:left', this.render);
            this.listenTo(this.model, 'change:top', this.render);
            this.listenTo(this.model, 'change:height', this.render);
            this.listenTo(this.model, 'change:width', this.render);
            this.listenTo(this.model, 'change:i', this.render_all);
            this.listenTo(this.model, 'change:max', this.maximize);
            document.body.appendChild(this.el);
        },
        events: {
            "click": "click"
        },
        click: function () {
            if (this.model.get('max') === false) {
                this.model.collection.models.forEach(function (m) {
                    if (m.get('max') === true) {
                        m.set('max', false);
                    }
                });
                this.model.set('max', true);
            }
        },
        maximize: function () {
            if (this.model.get('max') === true) {
                this.model.get('ff').models.forEach(function (fare) {
                    var fareView = new FareView({
                        model: fare
                    });
                    this.el.appendChild(fareView.el);
                }, this);
                this.model.set('z', 2);
                this.model.set('left', 0.1 * w);
                this.model.set('width', 0.8 * w);
                this.model.set('top', 0.1 * h);
                this.model.set('height', 0.8 * h);
            } else {
                var i = this.model.get('i');
                this.model.set('z', 1);
                this.model.set('left', (i * box_w) % w);
                this.model.set('width', 0.9 * box_w);
                this.model.set('top', Math.floor(i * box_w / w) * box_h);
                this.model.set('height', 0.9 * box_h);
            }
        },
        render_all: function () {
            this.model.collection.models.forEach(function (m) {
                m.box.render();
            });
        },
        render: function () {
            this.$el.css('z-index', this.model.get('z'));
            this.$el.animate({
                left: this.model.get('left'),
                top: this.model.get('top'),
                width: this.model.get('width'),
                height: this.model.get('height')
            }, 500, function () {});
        }
    }),
    Airlines = Backbone.Collection.extend({
        model: Airline
    }),
    airlines = new Airlines();

module.export = {
    redraw_Airlines: function (json) {
        'use strict';
        var w = document.body.clientWidth,
            h = document.body.clientHeight,
            box_sq = (w * h) / json.Airlines.length,
            box_h = Math.sqrt(box_sq * h / w),
            box_w = box_sq / box_h;
        json.Airlines.forEach(function (a, i) {
            if (airlines.where({name: a.Name}).length === 0) {
                var airline = new Airline({
                    name: a.Name,
                    i: i,
                    left: (i * box_w) % w,
                    top: Math.floor(i * box_w / w) * box_h,
                    width: 0.9 * box_w,
                    height: 0.9 * box_h,
                    ff: new FaresFull(a.FaresFull.map(function (fare) {
                        return new Fare({
                            FareId: fare.FareId,
                            TotalAmount: fare.TotalAmount,
                            Currency: fare.Currency
                        });
                    }))
                });
                airline.get('ff').comparator = function(m) {
                    return parseInt(m.get('TotalAmount'), 10);
                };
                airline.box = new Box({model: airline});
                airlines.add([airline]);
            }
        });
    }
};

