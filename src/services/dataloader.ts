import DataLoader from 'dataloader'
import { MaybeCompositeId, Model, QueryBuilder } from 'objection'
import { BaseModel } from '../models/BaseModel'

export type ModelQueryable<T extends Model> = {
  query: (...args: any[]) => QueryBuilder<T, T[]>
}

export class DataLoaderService {
  private modelLoaders = new WeakMap<
    ModelQueryable<any>,
    DataLoader<MaybeCompositeId, any>
  >()

  private modelRelatedLoaders = new Map<string, DataLoader<any, any>>()

  modelLoader<T extends BaseModel>(
    model: ModelQueryable<T>
  ): DataLoader<MaybeCompositeId, T | undefined> {
    const cache = this.modelLoaders.get(model)

    if (cache != null) {
      return cache
    }

    const loader = new DataLoader(async ids => {
      const result = await model.query().findByIds(ids as MaybeCompositeId[])

      return ids.map(id => result.find(v => v.id === id))
    })

    this.modelLoaders.set(model, loader)

    return loader
  }

  modelRelatedLoader<T extends Model, V extends Model>(
    model: typeof Model,
    relation: keyof T
  ): DataLoader<T, V> {
    const mapKey = model.name + relation
    const cacheLoader = this.modelRelatedLoaders.get(mapKey)

    if (cacheLoader != null) {
      return cacheLoader
    }

    const loader = new DataLoader(async models => {
      // Hacky af
      const result = await model.fetchGraph(models as any[], relation as string)

      return result.map((v: any) => v[relation] as V)
    })

    this.modelRelatedLoaders.set(mapKey, loader)

    return loader
  }
}
