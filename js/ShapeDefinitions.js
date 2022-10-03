
const SHAPE_TET_STRAIGHT = new ShapeDefinition([
    new Cube(0, -1),
    new Cube(0, 0),
    new Cube(0, 1),
    new Cube(0, 2)
]);
const SHAPE_TET_SQUARE = new ShapeDefinition([
    new Cube(0, 0),
    new Cube(0, 1),
    new Cube(1, 1),
    new Cube(1, 0)
]);
const SHAPE_TET_SKEWR = new ShapeDefinition([
    new Cube(-1, 0),
    new Cube(0, 0),
    new Cube(0, -1),
    new Cube(1, -1)
]);
const SHAPE_TET_SKEWL = new ShapeDefinition([
    new Cube(-1, 0),
    new Cube(0, 0),
    new Cube(0, 1),
    new Cube(1, 1)
]);
const SHAPE_TET_LR = new ShapeDefinition([
    new Cube(0, 0),
    new Cube(1, 0),
    new Cube(0, 1),
    new Cube(0, 2)
]);
const SHAPE_TET_LL = new ShapeDefinition([
    new Cube(0, 0),
    new Cube(-1, 0),
    new Cube(0, 1),
    new Cube(0, 2)
]);
const SHAPE_TET_T = new ShapeDefinition([
    new Cube(0, 0),
    new Cube(-1, 0),
    new Cube(1, 0),
    new Cube(0, -1)
]);
const SHAPES = [
    SHAPE_TET_LL,
    SHAPE_TET_LR,
    SHAPE_TET_SKEWL,
    SHAPE_TET_SKEWR,
    SHAPE_TET_SQUARE,
    SHAPE_TET_STRAIGHT,
    SHAPE_TET_T
];