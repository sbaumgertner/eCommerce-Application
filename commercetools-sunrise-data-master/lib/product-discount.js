import { productDiscountService } from './services'
import {
  execute,
  logAndExit,
  createStandardDelete
} from './helpers'
require('dotenv').config()

export const deleteAllProductDiscounts = createStandardDelete(
  {
    itemName: 'discounts',
    service: productDiscountService
  }
)

export const importProductDiscounts = () =>
  execute({
    uri: productDiscountService.build(),
    method: 'POST',
    body: {
      value: {
        type: 'relative',
        permyriad: 5000
      },
      predicate: 'attributes.isOnSale = true',
      name: {
        en: 'testPlants'
      },
      description: {
        en: 'testPlants'
      },
      isActive: true,
      sortOrder: '0.001',
      references: [],
      attributeTypes: {}
    }
  }).catch((error) =>
    logAndExit(error, 'Failed to import product discounts')
  )
