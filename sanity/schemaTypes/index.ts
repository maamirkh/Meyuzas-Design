import { type SchemaTypeDefinition } from 'sanity'
import {productSchema} from "./productSchema"
import order from './orderSchema'
import {onSaleProductSchema} from "./onSaleProductSchema" // Import new schema

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [productSchema, order, onSaleProductSchema], // Add new schema here
}

