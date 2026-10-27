/**
 * The shop's policy pages (Razorpay checks these before it switches on payments):
 * Privacy, Terms, Cancellation & Refunds, Shipping & Delivery. Contact and About are their own pages.
 *
 * Each section's text is a function of the company details (Admin → Page Content → Company & Contact)
 * so the name, address, email and phone are always the current ones. Amounts match the shop
 * (symmetry_backend app/api/public_forms.py: 18% GST, ₹3,500 delivery below ₹1,50,000).
 * Keep the `path`s in step with POLICY_PAGES in symmetry_backend app/seo.py.
 */

export const POLICY_UPDATED = '22 October 2026';

const who = (c) => c.companyName || 'Symmetry Interiors & Building Solutions Pvt. Ltd.';
const reach = (c) =>
  [c.email && `email ${c.email}`, c.phonePrimary && `call ${c.phonePrimary}`].filter(Boolean).join(' or ') ||
  'use the Contact page';

export const POLICIES = {
  privacy: {
    path: '/privacy-policy',
    label: 'Privacy Policy',
    title: 'Privacy Policy',
    intro: (c) =>
      `This policy explains what personal information ${who(c)} ("Symmetry", "we", "us") collects when you use this website, why we collect it, and how we keep it safe. It follows the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023.`,
    sections: [
      {
        heading: 'What we collect',
        items: () => [
          'Account details: your name, email address, mobile number and, if you set one, a password (stored only in scrambled form).',
          'Order details: delivery address, PIN code, delivery notes, the products you order and your order history.',
          'Enquiries and applications: what you write in the contact, consultation, catalogue, newsletter and careers forms, and any CV you upload.',
          'Technical data: your browser type, device and IP address, kept in server logs for security.',
        ],
      },
      {
        heading: 'Payments',
        body: () => [
          'Online payments are processed by Razorpay Software Pvt. Ltd. Your card, UPI, net banking and wallet details are entered in Razorpay\'s secure window and are never seen or stored by us. We only receive the payment reference and whether the payment succeeded. Razorpay\'s own privacy policy applies to the details you give them.',
        ],
      },
      {
        heading: 'How we use your information',
        items: () => [
          'To create and run your account, take your order, deliver and install it, and send you order updates.',
          'To reply to your enquiries, arrange consultations and site visits, and consider job applications.',
          'To send our newsletter, only if you subscribed. You can unsubscribe at any time.',
          'To prevent fraud, keep the website secure, and meet our tax and legal obligations.',
        ],
      },
      {
        heading: 'Who we share it with',
        body: () => [
          'We do not sell or rent your personal information. We share only what is needed with the companies that help us run the shop: Razorpay (payments), our delivery and installation partners (your name, phone and address), our email provider (order and sign-in emails) and our hosting and image providers. We may also disclose information when the law requires it.',
        ],
      },
      {
        heading: 'Cookies',
        body: () => [
          'We use a few essential cookies to keep you signed in, protect forms from misuse and remember your cart. Your theme choice and wishlist are saved in your own browser. We do not use advertising cookies.',
        ],
      },
      {
        heading: 'How long we keep it',
        body: () => [
          'We keep order and invoice records for as long as tax law requires (currently at least eight years). Other information is kept while your account is active or as long as it is needed for the purpose it was given, and then deleted.',
        ],
      },
      {
        heading: 'Your rights',
        body: (c) => [
          `You can see and update your details in My Account. You can also ask us for a copy of your information, ask us to correct or delete it, or withdraw consent for the newsletter: ${reach(c)}. We reply within 30 days.`,
        ],
      },
      {
        heading: 'Grievance officer',
        body: (c) => [
          `For any concern about your personal information, contact our Grievance Officer at ${who(c)}${c.registeredOffice || c.officeAddress ? `, ${c.registeredOffice || c.officeAddress}` : ''}. ${c.email ? `Email: ${c.email}.` : ''} We acknowledge complaints within 48 hours and resolve them within 30 days.`,
        ],
      },
      {
        heading: 'Changes to this policy',
        body: () => [
          'We may update this policy from time to time. The date at the top shows when it last changed.',
        ],
      },
    ],
  },

  terms: {
    path: '/terms-and-conditions',
    label: 'Terms & Conditions',
    title: 'Terms & Conditions',
    intro: (c) =>
      `These terms apply when you use this website or buy from the Symmetry shop. The website is run by ${who(c)}${c.cin ? ` (CIN ${c.cin})` : ''}${c.registeredOffice ? `, registered office ${c.registeredOffice}` : ''}. By using the website or placing an order you agree to these terms.`,
    sections: [
      {
        heading: 'Your account',
        body: () => [
          'You need an account to add items to your cart and to order. Give us correct details and keep your password and sign-in codes to yourself; you are responsible for orders placed from your account. You must be at least 18 years old to order.',
        ],
      },
      {
        heading: 'Products and prices',
        items: () => [
          'Our furniture is made to order in our own workshop. Natural materials such as wood, marble, stone, leather and cane vary in grain, veining and shade, and colours can look different on screen. These variations are part of the material, not defects.',
          'Measurements are given as accurately as we can; small differences of up to 2% can occur in handmade pieces.',
          'Prices are in Indian Rupees and shown before 18% GST. GST and any delivery charge are added and shown at checkout before you pay.',
          'We may change prices or stop selling a product at any time. The price you pay is the one shown at checkout when you place the order.',
        ],
      },
      {
        heading: 'Orders',
        body: () => [
          'Placing an order is an offer to buy. The order is accepted when we confirm it by email. We may refuse or cancel an order, for example if a product is no longer available, the price was shown wrongly, or delivery to your address is not possible. If you have already paid, we refund the full amount.',
        ],
      },
      {
        heading: 'Payment',
        body: () => [
          'You can pay online through Razorpay (UPI, debit and credit cards, net banking and wallets) or, where offered, cash on delivery. Online orders are confirmed once the payment succeeds. Cash on delivery may be limited to orders up to a certain amount.',
        ],
      },
      {
        heading: 'Delivery, cancellation and refunds',
        links: [
          { text: 'Shipping & Delivery Policy', to: '/shipping-policy' },
          { text: 'Cancellation & Refund Policy', to: '/refund-policy' },
        ],
        body: () => ['Delivery times, cancellations, returns and refunds are explained in these policies, which form part of these terms:'],
      },
      {
        heading: 'Warranty',
        body: () => [
          'Shop furniture carries the warranty stated on its product page (for example, a 10-year frame warranty). It covers manufacturing defects under normal home use. It does not cover normal wear, misuse, damage from water, heat or direct sunlight, or changes made by others. Turnkey interior projects are covered by the warranty in their own contract.',
        ],
      },
      {
        heading: 'Design and project services',
        body: () => [
          'Interior design, turnkey and sourcing projects are agreed in a separate written quotation or contract, which sets out their scope, price, payment stages and timelines. These website terms apply to them only where that contract is silent.',
        ],
      },
      {
        heading: 'Website content',
        body: () => [
          'The designs, photographs, text and logos on this website belong to Symmetry or its licensors. You may view them for personal use but may not copy or reuse them commercially without our written permission.',
        ],
      },
      {
        heading: 'Limitation of liability',
        body: () => [
          'To the extent the law allows, our liability for any order is limited to the amount you paid for it. We are not liable for indirect losses, or for delays caused by events beyond our control such as natural disasters, strikes or transport disruption.',
        ],
      },
      {
        heading: 'Governing law',
        body: () => [
          'These terms are governed by the laws of India. Any dispute will be handled by the courts of Hyderabad, Telangana. We will always try to settle a problem with you directly first.',
        ],
      },
      {
        heading: 'Contact',
        body: (c) => [`Questions about these terms? ${reach(c).replace(/^./, (s) => s.toUpperCase())}.`],
      },
    ],
  },

  refunds: {
    path: '/refund-policy',
    label: 'Cancellation & Refunds',
    title: 'Cancellation & Refund Policy',
    intro: () =>
      'Most Symmetry furniture is made to order for you, so cancellations depend on how far your order has gone in our workshop. This policy explains when you can cancel, what we do if something arrives damaged, and how refunds are paid.',
    sections: [
      {
        heading: 'Cancelling an order',
        items: () => [
          'Within 24 hours of placing the order, or any time before we confirm production has started: free cancellation with a full refund.',
          'After production has started: the piece is being made for you, so we keep up to 30% of the order value to cover materials and work already done, and refund the rest.',
          'Once the order has been shipped: it can no longer be cancelled. See "Returns" below.',
          'Custom sizes, finishes or fabrics chosen on request cannot be cancelled after production starts.',
        ],
      },
      {
        heading: 'How to cancel',
        body: (c) => [`To cancel, ${reach(c)} with your order number. We confirm the cancellation and any refund amount by email.`],
      },
      {
        heading: 'Damaged, defective or wrong items',
        body: () => [
          'Our team delivers and places your furniture, so please check each piece at delivery. If anything is damaged, defective or not what you ordered, tell the delivery team or contact us within 48 hours of delivery, with photos if you can. We will repair it, replace it or, if neither is possible, refund it in full, at no cost to you.',
        ],
      },
      {
        heading: 'Returns',
        body: () => [
          'Because pieces are made to order, we do not accept returns for a change of mind once an order has been delivered. Decorative accessories and lighting that are not made to order may be returned unused and in their original packaging within 7 days of delivery; a pickup charge may apply, which we tell you before you agree.',
        ],
      },
      {
        heading: 'Refunds',
        items: () => [
          'Approved refunds are started within 2 working days.',
          'Online payments are refunded to the same card, UPI account, bank account or wallet you paid from, through Razorpay. The money usually reaches you within 5 to 7 working days, depending on your bank.',
          'Cash on delivery orders are refunded by bank transfer (NEFT/IMPS) to an account you give us, within 7 working days.',
          'If your order is cancelled by us, you always get a full refund, including GST and delivery charges.',
        ],
      },
      {
        heading: 'Failed payments',
        body: () => [
          'If money left your account but the order was not confirmed, the payment is reversed automatically by Razorpay and your bank, usually within 5 to 7 working days. If it has not arrived after that, contact us with the payment reference.',
        ],
      },
    ],
  },

  shipping: {
    path: '/shipping-policy',
    label: 'Shipping & Delivery',
    title: 'Shipping & Delivery Policy',
    intro: () =>
      'We deliver our furniture with our own team and trusted delivery partners, and place it in your home. This policy explains where we deliver, how long it takes and what it costs.',
    sections: [
      {
        heading: 'Where we deliver',
        body: () => [
          'We deliver across India. We check every order\'s PIN code; if we cannot deliver to your address, we tell you before production starts and refund any payment in full.',
        ],
      },
      {
        heading: 'Delivery time',
        items: () => [
          'Made-to-order furniture is ready in the lead time shown on its product page, usually 4 to 6 weeks from order confirmation.',
          'Pieces in stock, decorative accessories and lighting are usually dispatched within 3 to 7 working days.',
          'Transit after dispatch: 2 to 5 days within Hyderabad and Telangana, and 5 to 10 days for the rest of India.',
          'We confirm the expected delivery date with you by email and phone and arrange a delivery slot that suits you. You can follow the order status in My Account.',
        ],
      },
      {
        heading: 'Delivery charges',
        items: () => [
          'Free delivery on orders above ₹1,50,000.',
          'A delivery charge of ₹3,500 applies to orders up to ₹1,50,000.',
          'The charge is shown at checkout before you pay. Delivery includes carrying the furniture in and placing it in the room you choose.',
        ],
      },
      {
        heading: 'Before delivery day',
        body: () => [
          'Please make sure the furniture will fit through doors, stairs and lifts, and tell us about any access limits (no lift, narrow staircase, building timings) in the delivery notes at checkout. If a delivery cannot be completed because of access, or nobody is available, a re-delivery charge may apply.',
        ],
      },
      {
        heading: 'Receiving your order',
        body: () => [
          'Please check your furniture with the delivery team before they leave. Report any damage within 48 hours; see the Cancellation & Refund Policy for what happens next.',
        ],
        links: [{ text: 'Cancellation & Refund Policy', to: '/refund-policy' }],
      },
      {
        heading: 'Delays',
        body: (c) => [
          `If your order is delayed, we tell you as soon as we know and give a new date. For any delivery question, ${reach(c)}.`,
        ],
      },
    ],
  },
};

export const POLICY_LIST = Object.values(POLICIES);
