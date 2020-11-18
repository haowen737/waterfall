interface ModuleMetaData {
  controller: any[],
  provider: any[],
}


// module decorator
export const Module = (metaData: ModuleMetaData): ClassDecorator => {
  return (target) => {
    for (const key in metaData) {
      if (Object.prototype.hasOwnProperty.call(metaData, key)) {
        Reflect.defineMetadata(key, metaData[key as keyof ModuleMetaData], target)
      }
    }
  }
}

export class WaterfallModule {

}