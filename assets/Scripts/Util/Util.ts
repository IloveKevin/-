export default class Util {
    public static GetNodeWorldPosition(node: cc.Node): cc.Vec2 {
        return node.parent.convertToWorldSpaceAR(node.getPosition());
    }

    public static GetPointNodePostion(point: cc.Vec2, node: cc.Node): cc.Vec2 {
        return node.convertToNodeSpaceAR(point);
    }

    public static GetIntRandom(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
