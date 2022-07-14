import {v4 as uuidv4} from 'uuid';

export class BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x = 0, y = 0, width = 1, height = 1) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;        
    }

    intersects(rect: BoundingBox): boolean {
        // return !(rect.x > this.x + this.width || 
        //     rect.x + rect.width < this.x || 
        //     rect.y > this.y + this.height ||
        //     rect.y + rect.height < this.y);
        return this.x + this.width >= rect.x && this.x <= rect.x + rect.width && this.y <= rect.y + rect.height && this.y + this.height >= rect.y;
    }
    
}

export class QuadTreeNode extends BoundingBox {    
    depth: number;
    nodes?: Array<QuadTreeNode>;
    values = new Array<QuadTreeLeafNode>();

    constructor(x = 0, y = 0, width = 1.0, height = 1.0, depth = 0, maxDepth = 4) {
        super(x, y, width, height)
        this.depth = depth;

        if(depth < maxDepth) {
            this.nodes = new Array<QuadTreeNode>(4);
            let rect = new BoundingBox(x, y, width / 2, height / 2);
            this.nodes[0] = new QuadTreeNode(rect.x, rect.y, rect.width, rect.height, depth + 1, maxDepth);
            this.nodes[1] = new QuadTreeNode(rect.x + rect.width, rect.y, rect.width, rect.height, depth + 1, maxDepth);
            this.nodes[2] = new QuadTreeNode(rect.x, rect.y + rect.height, rect.width, rect.height, depth + 1, maxDepth);
            this.nodes[3] = new QuadTreeNode(rect.x + rect.width, rect.y + rect.height, rect.width, rect.height, depth + 1, maxDepth);
        }
    }

    public retrieve(rect: BoundingBox): string[] {
        let ids: string[];
        if(this.values.length > 0) {
            let values = new Array<QuadTreeLeafNode>();
            for(const leafNode of this.values) {
                
                if(leafNode.intersects(rect)) {
                    values.push(leafNode);
                }
            }
            
            ids = values.map(x => x.id);
            
        }
        else {
            ids = [];
            let indices = this.getNodeIndices(rect);
            
            for(const index of indices) {
                if(this.nodes) {
                    for(const id of this.nodes[index].retrieve(rect)) {
                        ids.push(id);
                    }
                }
            }
        }

        
        // remove duplicates
        ids = [...new Set(ids)];

        return ids;
    }

    public getNodeIndices(node: BoundingBox): number[]
    {        
        const indices:number[] = [],
            boundsCenterX   = node.x + (node.width/2),
            boundsCenterY   = node.y + (node.height/2);

        const startIsNorth  = this.y < boundsCenterY,
            startIsWest     = this.x < boundsCenterX,
            endIsEast       = this.x + this.width > boundsCenterX,
            endIsSouth      = this.y + this.height > boundsCenterY;

        //top-right quad
        if(startIsNorth && endIsEast) {
            indices.push(0);
        }
        
        //top-left quad
        if(startIsWest && startIsNorth) {
            indices.push(1);
        }

        //bottom-left quad
        if(startIsWest && endIsSouth) {
            indices.push(2);
        }

        //bottom-right quad
        if(endIsEast && endIsSouth) {
            indices.push(3);
        }

        return indices;
    }

}

class QuadTreeLeafNode extends BoundingBox {    
    id: string;

    constructor(x = 0, y = 0, width = 1, height = 1, id = '') {
        super(x, y, width, height);
        this.id = (id) ? id : uuidv4();
    }

    
}

export class QuadTree extends QuadTreeNode {
    maxLevel: number;

    constructor(x = 0, y = 0, width = 1.0, height = 1.0, maxLevel = 4) {
        super(x, y, width, height);
        this.maxLevel = maxLevel;

    }

    insert(rect: BoundingBox, id = ''): string {
        let valueInserted = (id) ? id : uuidv4();
        let stack = new Array<QuadTreeNode>();
        
        stack.push(this);
        while(stack.length) {
            let currentNode = stack.pop();
            let indices = currentNode!.getNodeIndices(rect);
            
            if(currentNode) {
                if(currentNode.depth == this.maxLevel) {
                    if(currentNode.intersects(rect)) {
                        currentNode.values.push(new QuadTreeLeafNode(rect.x, rect.y, rect.width, rect.height, id));
                    
                    }
                }
                else {
                    const containingNodes = currentNode.nodes!.filter((n, i) => i in indices);
                    
                    for(const node of containingNodes) {
                        stack.push(node);
                    }
                    
                }
            }
        }
        return valueInserted;        
    }
    
}