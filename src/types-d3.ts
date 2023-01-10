export interface N {
  index?: number | undefined;
  x?: number | undefined;
  y?: number | undefined;
  vx?: number | undefined;
  vy?: number | undefined;
  fx?: number | null | undefined;
  fy?: number | null | undefined;
}

export interface L<ND extends N> {
  source: ND | string | number;
  target: ND | string | number;
  index?: number | undefined;
}

export interface Simulation<ND extends N, LD extends L<ND> | undefined> {
  restart(): this;
  stop(): this;
  tick(iterations?: number): this;
  nodes(): ND[];
  nodes(nodesData: ND[]): this;
  alpha(): number;
  alpha(alpha: number): this;
  alphaMin(): number;
  alphaMin(min: number): this;
  alphaDecay(): number;
  alphaDecay(decay: number): this;
  alphaTarget(): number;
  alphaTarget(target: number): this;
  velocityDecay(): number;
  velocityDecay(decay: number): this;
  force<F extends Force<ND, LD>>(name: string): F | undefined;
  force(name: string, force: null | Force<ND, LD>): this;
  find(x: number, y: number, radius?: number): ND | undefined;
  randomSource(): () => number;
  randomSource(source: () => number): this;
  on(
    typenames: "tick" | "end" | string
  ): ((this: Simulation<ND, LD>) => void) | undefined;
  on(
    typenames: "tick" | "end" | string,
    listener: null | ((this: this) => void)
  ): this;
}

export function forceSimulation<ND extends N>(
  nodesData?: ND[]
): Simulation<ND, undefined>;

export function forceSimulation<ND extends N, LD extends L<ND>>(
  nodesData?: ND[]
): Simulation<ND, LD>;

export interface Force<ND extends N, LD extends L<ND> | undefined> {
  (alpha: number): void;
  initialize?(nodes: ND[], random: () => number): void;
}

export interface ForceCenter<ND extends N> extends Force<ND, any> {
  initialize(nodes: ND[], random: () => number): void;
  x(): number;
  x(x: number): this;
  y(): number;
  y(y: number): this;
  strength(): number;
  strength(strength: number): this;
}

export function forceCenter<ND extends N>(
  x?: number,
  y?: number
): ForceCenter<ND>;

export interface ForceCollide<ND extends N> extends Force<ND, any> {
  initialize(nodes: ND[], random: () => number): void;
  radius(): (node: ND, i: number, nodes: ND[]) => number;
  radius(radius: number | ((node: ND, i: number, nodes: ND[]) => number)): this;
  strength(): number;
  strength(strength: number): this;
  iterations(): number;
  iterations(iterations: number): this;
}

export function forceCollide<ND extends N>(
  radius?: number | ((node: ND, i: number, nodes: ND[]) => number)
): ForceCollide<ND>;

export interface ForceLink<ND extends N, LD extends L<ND>>
  extends Force<ND, LD> {
  initialize(nodes: ND[], random: () => number): void;
  links(): LD[];
  links(links: LD[]): this;
  id(): (node: ND, i: number, nodesData: ND[]) => string | number;
  id(id: (node: ND, i: number, nodesData: ND[]) => string | number): this;
  distance(): (link: LD, i: number, links: LD[]) => number;
  distance(
    distance: number | ((link: LD, i: number, links: LD[]) => number)
  ): this;
  strength(): (link: LD, i: number, links: LD[]) => number;
  strength(
    strength: number | ((link: LD, i: number, links: LD[]) => number)
  ): this;
  iterations(): number;
  iterations(iterations: number): this;
}

export function forceLink<ND extends N, LinksDatum extends L<ND>>(
  links?: LinksDatum[]
): ForceLink<ND, LinksDatum>;

export interface ForceManyBody<ND extends N> extends Force<ND, any> {
  initialize(nodes: ND[], random: () => number): void;
  strength(): (d: ND, i: number, data: ND[]) => number;
  strength(strength: number | ((d: ND, i: number, data: ND[]) => number)): this;
  theta(): number;
  theta(theta: number): this;
  distanceMin(): number;
  distanceMin(distance: number): this;
  distanceMax(): number;
  distanceMax(distance: number): this;
}

export function forceManyBody<ND extends N>(): ForceManyBody<ND>;

export interface ForceX<ND extends N> extends Force<ND, any> {
  initialize(nodes: ND[], random: () => number): void;
  strength(): (d: ND, i: number, data: ND[]) => number;
  strength(strength: number | ((d: ND, i: number, data: ND[]) => number)): this;

  x(): (d: ND, i: number, data: ND[]) => number;
  x(x: number | ((d: ND, i: number, data: ND[]) => number)): this;
}

export function forceX<ND extends N>(
  x?: number | ((d: ND, i: number, data: ND[]) => number)
): ForceX<ND>;

export interface ForceY<ND extends N> extends Force<ND, any> {
  initialize(nodes: ND[], random: () => number): void;
  strength(): (d: ND, i: number, data: ND[]) => number;
  strength(strength: number | ((d: ND, i: number, data: ND[]) => number)): this;
  y(): (d: ND, i: number, data: ND[]) => number;
  y(y: number | ((d: ND, i: number, data: ND[]) => number)): this;
}

export function forceY<ND extends N>(
  y?: number | ((d: ND, i: number, data: ND[]) => number)
): ForceY<ND>;

export interface ForceRadial<ND extends N> extends Force<ND, any> {
  initialize(nodes: ND[], random: () => number): void;
  strength(): (d: ND, i: number, data: ND[]) => number;
  strength(strength: number | ((d: ND, i: number, data: ND[]) => number)): this;
  radius(): (d: ND, i: number, data: ND[]) => number;
  radius(radius: number | ((d: ND, i: number, data: ND[]) => number)): this;
  x(): (d: ND, i: number, data: ND[]) => number;
  x(x: number | ((d: ND, i: number, data: ND[]) => number)): this;
  y(): (d: ND, i: number, data: ND[]) => number;
  y(y: number | ((d: ND, i: number, data: ND[]) => number)): this;
}

export function forceRadial<ND extends N>(
  radius: number | ((d: ND, i: number, data: ND[]) => number),
  x?: number | ((d: ND, i: number, data: ND[]) => number),
  y?: number | ((d: ND, i: number, data: ND[]) => number)
): ForceRadial<ND>;
