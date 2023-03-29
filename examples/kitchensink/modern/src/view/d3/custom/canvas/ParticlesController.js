Ext.define('KitchenSink.view.d3.custom.canvas.ParticlesController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.particles',

    requires: [
        'KitchenSink.view.d3.custom.canvas.Particle'
    ],

    onSceneResize: function(component, canvas) {
        var me = this,
            list = me.list = [],
            context, i, p;

        if (!me.setupDone) {
            me.x = canvas.width / 2;
            me.y = canvas.height / 2;

            me.color = d3.scaleLinear()
                .domain([0, 0.2, 0.4, 0.6, 0.8, 1])
                .range(['red', 'orange', 'yellow', 'green', 'blue', 'violet']);

            context = canvas.getContext('2d');
            context.lineWidth = 4;

            me.timer = d3.timer(function() {
                context.save();
                context.globalCompositeOperation = 'lighter';

                for (i = list.length - 1; i >= 0; i--) {
                    p = list[i];

                    p.updatePosition();
                    p.render(context);

                    if (p.isDead) {
                        list.splice(i, 1);
                    }
                }

                context.restore();

                list.push(me.createParticle(me.x, me.y));

                context.fillStyle = 'rgba(0,0,0,0.2)';
                context.fillRect(0, 0, canvas.width, canvas.height);
            });

            me.setupDone = true;
        }
    },

    createParticle: function(x, y) {
        var raduis = 2 + Math.random() * 3,
            color = this.color(Math.random()),
            p = new KitchenSink.view.d3.custom.canvas.Particle(x, y, raduis, color);

        p.setVelocity(Math.random() * 4 - 2, -3 - Math.random() * 2);
        p.setGravity(0, 0.1);

        return p;
    },

    onMouseMove: function(e) {
        var viewXY = this.view.el.getXY(),
            pageXY = e.getXY();

        this.x = pageXY[0] - viewXY[0];
        this.y = pageXY[1] - viewXY[1];
    },

    onDestroy: function() {
        if (this.timer) {
            this.timer.stop();
        }
    }

});
