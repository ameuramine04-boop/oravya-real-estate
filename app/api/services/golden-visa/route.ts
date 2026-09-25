import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const dbServiceRecord = {
      id: 5,
      slug: 'golden-visa',
      title: 'UAE Golden Visa',
      subtitle: 'A ten-year renewable residency, earned through property you own. What qualifies, what it costs, and the three steps between a title deed and a visa.',
      stats: JSON.stringify([
        { label: 'Residency, renewable', value: '10 yr' },
        { label: 'Property threshold', value: 'AED 2M' },
        { label: 'Business ownership', value: '100%' },
        { label: 'Typical processing', value: '~30 days' }
      ]),
      description: 'The Golden Visa is a long-term UAE residency permit granted on the strength of what you own rather than who employs you. For property investors that means a ten-year permit, renewable for as long as you hold the asset, with no local sponsor and no employer tied to your status.',
      routes: JSON.stringify([
        {
          badge: 'Most Chosen',
          duration: '10 years',
          title: 'Golden Visa',
          condition: 'Property value AED 2,000,000 or more',
          details: [
            'Renewable indefinitely while you remain invested',
            'Full family sponsorship included',
            'No local sponsor required',
            'Unlimited domestic worker visas',
            'Extended absence from the UAE permitted'
          ]
        },
        {
          badge: 'Age 55+',
          duration: '5 years',
          title: 'Retirement Visa',
          condition: 'Qualifying assets on any one of three tests',
          details: [
            'Property worth AED 2,000,000, or',
            'Savings of AED 1,000,000, or',
            'Monthly income of AED 20,000',
            'Family sponsorship options',
            'No employment required'
          ]
        },
        {
          badge: 'Entry Level',
          duration: '2 years',
          title: 'Investor Visa',
          condition: 'Property value AED 750,000 or more',
          details: [
            'The entry-level investment route',
            'Renewable with continued ownership',
            'Family sponsorship available',
            'A path to upgrading to the Golden Visa',
            'Full UAE residency benefits'
          ]
        }
      ]),
      benefits: JSON.stringify([
        { title: 'Long-term security', desc: 'Ten years of residency rather than a renewal every two or three, for you and your family. The investment behind it is protected under UAE law.' },
        { title: 'Business advantages', desc: '100% business ownership, easier banking access, and the ability to open multiple companies without a local sponsor.' },
        { title: 'Family sponsorship', desc: 'Sponsor a spouse, children of any age, and unlimited domestic workers — without a local sponsor.' },
        { title: 'Travel freedom', desc: 'Stay outside the UAE for extended periods without losing residency, which an ordinary residence visa does not allow.' },
        { title: 'No local sponsor', desc: 'No UAE national sponsor or service agent stands between you and your own residency.' },
        { title: 'Tax position', desc: 'No personal income tax, no capital gains tax and no wealth tax in the UAE.' }
      ]),
      steps: JSON.stringify([
        { step: '1', title: 'Check the value', desc: 'Confirm your property’s market value clears AED 2,000,000. We look at recent sales in the building and what the market is doing, so you know before you pay for anything.' },
        { step: '2', title: 'Get it valued officially', desc: 'Oravya Conveyancing connects you with a DLD-accredited valuation company for the official report the application requires.' },
        { step: '3', title: 'Apply', desc: 'We handle the legal documentation, DLD compliance and submission. A Golden Visa is typically processed within 30 days.' }
      ]),
      rules: JSON.stringify([
        { title: 'The threshold', desc: 'A minimum property value of AED 2,000,000, in one unit or several combined. The value has to be the one recorded at the Dubai Land Department — there is no "net value" or "after mortgage" calculation.' },
        { title: 'Off-plan property', desc: 'Eligible where the value is AED 2M or more, you have paid AED 2M or more, the developer is DLD-approved, and you hold a Golden Visa Eligibility Certificate from the DLD. A deposit or part-payment below that does not qualify.' },
        { title: 'Mortgaged property', desc: 'Eligible where the equity you have paid the bank is AED 2M or more. The financed amount is not what counts — your paid equity is. The bank issues an NOC showing the amount paid and the balance outstanding.' },
        { title: 'Joint ownership', desc: 'Spouses: either can apply where the value is AED 2M or more, with a marriage certificate. Other partners: each must own AED 2M individually for both to qualify.' },
        { title: 'Property status', desc: 'The property must be registered with the DLD with no court dispute or seizure order against it. A disputed property is rejected until the dispute is resolved.' }
      ]),
      faqs: JSON.stringify([
        {
          q: 'Can I sell my property after getting the Golden Visa?',
          a: 'If you hold multiple properties that total AED 2M, you can sell one as long as you maintain another qualifying property worth at least AED 2M. If you only own a single qualifying property, selling it without replacing it with another qualifying asset can lead to visa cancellation.'
        },
        {
          q: 'Is there a minimum stay requirement outside the UAE to keep the Golden Visa?',
          a: 'Unlike standard 2-year residency visas that require you to enter the UAE at least once every 6 months, the UAE Golden Visa allows you to stay outside the country for unlimited periods without invalidating your residency status.'
        },
        {
          q: 'Can I sponsor my parents under my Golden Visa?',
          a: 'Yes, Golden Visa holders can sponsor their parents for a duration of 10 years, subject to meeting standard health insurance and dependent documentation requirements.'
        }
      ])
    };

    return NextResponse.json(dbServiceRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}