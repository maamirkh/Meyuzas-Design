import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'address',
      title: 'Shipping Address',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'province',
      title: 'Province',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'postalCode',
      title: 'Postal Code',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'paymentMethod',
      title: 'Payment Method',
      type: 'string',
      options: {
        list: [
          {title: 'Cash on Delivery', value: 'cod'},
          {title: 'Easypaisa', value: 'easypaisa'},
          {title: 'JazzCash', value: 'jazzcash'},
        ],
        layout: 'radio',
      },
      readOnly: true,
    }),
    defineField({
      name: 'paymentDetails',
      title: 'Payment Details',
      type: 'object',
      fields: [
        {name: 'accountNumber', title: 'Account Number', type: 'string'},
        {name: 'transactionId', title: 'Transaction ID', type: 'string'},
      ],
      hidden: ({document}) => document?.paymentMethod === 'cod',
      readOnly: true,
    }),
    defineField({
      name: 'subtotal',
      title: 'Subtotal',
      type: 'number',
      readOnly: true,
    }),
    defineField({
      name: 'shipping',
      title: 'Shipping',
      type: 'number',
      readOnly: true,
    }),
    defineField({
      name: 'totalAmount',
      title: 'Total Amount',
      type: 'number',
      readOnly: true,
    }),
    defineField({
      name: 'orderItems',
      title: 'Order Items',
      type: 'array',
      of: [
        {
          title: 'Order Item',
          type: 'object',
          fields: [
            {
              name: 'product',
              title: 'Product',
              type: 'reference',
              to: [{type: 'product'}, {type: 'onsaleproducts'}],
            },
            {
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
            },
            {
              name: 'price',
              title: 'Price',
              type: 'number',
            },
            {
              name: 'discountedPrice',
              title: 'Discounted Price',
              type: 'number',
            },
          ],
          preview: {
            select: {
              productName: 'product.productName',
              quantity: 'quantity',
              price: 'price',
              discountedPrice: 'discountedPrice',
              media: 'product.image',
            },
            prepare({productName, quantity, media, price, discountedPrice}) {
              const discountedSubtitle = discountedPrice ? `, Discounted: ${discountedPrice}` : '';
              return {
                title: `${productName} (x${quantity})`,
                subtitle: `Price: ${price}${discountedSubtitle}`,
                media: media,
              }
            },
          },
        },
      ],
      readOnly: true,
    }),
    defineField({
      name: 'orderStatus',
      title: 'Order Status',
      type: 'string',
      options: {
        list: [
          {title: 'Pending', value: 'pending'},
          {title: 'Processing', value: 'processing'},
          {title: 'Shipped', value: 'shipped'},
          {title: 'Delivered', value: 'delivered'},
          {title: 'Cancelled', value: 'cancelled'},
        ],
        layout: 'dropdown',
      },
      initialValue: 'pending',
    }),
  ],
  preview: {
    select: {
      title: 'customerName',
      subtitle: 'createdAt',
      status: 'orderStatus',
      total: 'totalAmount',
    },
    prepare({title, subtitle, status, total}) {
      return {
        title: `${title} - Rs. ${total}`,
        subtitle: `[${status?.toUpperCase()}] on ${new Date(subtitle).toLocaleString()}`,
      }
    },
  },
  orderings: [
    {
      title: 'Newest First',
      name: 'createdAtDesc',
      by: [{field: '_createdAt', direction: 'desc'}],
    },
  ],
})
