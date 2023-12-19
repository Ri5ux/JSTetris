class ShapeDefinition {
    constructor(cubeOffsets) {
        this.cubeOffsets = cubeOffsets;
    }

    create(game) {
        return new Shape(game, this);
    }
}

const SHAPE_TET_STRAIGHT = new ShapeDefinition([
    [0, -1],
    [0, 0],
    [0, 1],
    [0, 2]
]);
const SHAPE_TET_SQUARE = new ShapeDefinition([
    [0, 0],
    [0, 1],
    [1, 1],
    [1, 0]
]);
const SHAPE_TET_SKEWR = new ShapeDefinition([
    [-1, 0],
    [0, 0],
    [0, -1],
    [1, -1]
]);
const SHAPE_TET_SKEWL = new ShapeDefinition([
    [-1, 0],
    [0, 0],
    [0, 1],
    [1, 1]
]);
const SHAPE_TET_LR = new ShapeDefinition([
    [0, 0],
    [1, 0],
    [0, 1],
    [0, 2]
]);
const SHAPE_TET_LL = new ShapeDefinition([
    [0, 0],
    [-1, 0],
    [0, 1],
    [0, 2]
]);
const SHAPE_TET_T = new ShapeDefinition([
    [0, 0],
    [-1, 0],
    [1, 0],
    [0, -1]
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