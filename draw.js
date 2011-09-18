var draw = {};
draw.drawWorld = function(world, context) {
    var j, b, s;
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    for (j = world.m_jointList; j; j = j.m_next) {
        draw.drawJoint(world, j, context);
    }
    for (b = world.m_bodyList; b; b = b.m_next) {
        for (s = b.GetShapeList(); s !== null; s = s.GetNext()) {
            draw.drawShape(s, context);
        }
    }
};

draw.drawJoint = function(world, joint, context) {
    var b1 = joint.m_body1,
    b2 = joint.m_body2,
    x1 = b1.m_position,
    x2 = b2.m_position,
    p1 = joint.GetAnchor1(),
    p2 = joint.GetAnchor2();

    context.beginPath();

    switch (joint.m_type) {
    case box2d.Joint.e_distanceJoint:
        context.moveTo(p1.x, p1.y);
        context.lineTo(p2.x, p2.y);
        break;

    case box2d.Joint.e_pulleyJoint:
        // TODO
        break;

    default:
        if (b1 === world.m_groundBody) {
            context.moveTo(p1.x, p1.y);
            context.lineTo(x2.x, x2.y);
        } else if (b2 === world.m_groundBody) {
            context.moveTo(p1.x, p1.y);
            context.lineTo(x1.x, x1.y);
        } else {
            context.moveTo(x1.x, x1.y);
            context.lineTo(p1.x, p1.y);
            context.lineTo(x2.x, x2.y);
            context.lineTo(p2.x, p2.y);
        }
        break;
    }
    context.stroke();
};

draw.drawShape = function(shape, context) {
    var i;

    context.beginPath();

    switch (shape.m_type) {
    case box2d.ShapeDef.Type.circleShape:
        var circle = shape;
        var pos = circle.m_position;
        var r = circle.m_radius;

        context.arc(circle.m_position.x, circle.m_position.y, circle.m_radius, 0, 2 * Math.PI, false);

        // draw radius
        context.moveTo(pos.x, pos.y);
        var ax = circle.m_R.col1;
        var pos2 = new box2d.Vec2(pos.x + r * ax.x, pos.y + r * ax.y);
        context.lineTo(pos2.x, pos2.y);
        break;
    case box2d.ShapeDef.Type.polyShape:
        var poly = shape;
        var tV = box2d.Vec2.add(poly.m_position, box2d.Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
        context.moveTo(tV.x, tV.y);
        for (i = 0; i < poly.m_vertexCount; i++) {
            var v = box2d.Vec2.add(poly.m_position, box2d.Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
            context.lineTo(v.x, v.y);
        }
        context.lineTo(tV.x, tV.y);
        break;
    }
    context.stroke();
    if (shape.GetUserData() === 'filled') {
        context.fill();
    }
};

