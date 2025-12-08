export interface ContainerLayoutConfig {
  readonly width: number;
  readonly height: number;
  readonly padding: number;
  readonly margin: number;
}

export const DEFAULT_CONTAINER_LAYOUT: ContainerLayoutConfig = {
  width: 260,
  height: 160,
  padding: 16,
  margin: 32
};
