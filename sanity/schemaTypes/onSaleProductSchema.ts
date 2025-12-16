import {defineField, defineType} from 'sanity'

export const onSaleProductSchema = defineType({
  name: 'onsaleproducts',
  title: 'On Sale Products',
  type: 'document',
  fields: [
    defineField({
      name: 'productName',
      title: 'Product Name',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
    }),
    defineField({
      name: 'price',
      title: 'Original Price',
      type: 'number',
    }),
    defineField({
      name: 'discountPercentage', // New field for discount
      title: 'Discount Percentage',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(100), // Discount should be between 0 and 100
    }),
    defineField({
      name: 'currentPrice', // New field
      title: 'Current Price',
      type: 'number',
      readOnly: true, // This field will be calculated and not directly editable
    }),
    defineField({
      name: 'inventory',
      title: 'Inventory',
      type: 'number',
    }),
    defineField({
      name: 'colors',
      title: 'Colors',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      title: 'Slug',
      name: 'slug',
      type: 'slug',
      options: {
        source: 'productName',
        maxLength: 200,
        slugify: (input: string) =>
          input.toLowerCase().replace(/\s+/g, '-').slice(0, 200),
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
  ],
})