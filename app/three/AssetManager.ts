export class AssetManager {
  private loadedAssets: Map<string, any> = new Map();

  public async preload(url: string, type: 'texture' | 'model'): Promise<void> {
    // Implemented in later phases
  }

  public getAsset(url: string) {
    return this.loadedAssets.get(url);
  }
}

export const assetManager = new AssetManager();
