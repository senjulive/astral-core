import { DynamicPage } from '@/components/dynamic-page';
import * as fs from 'fs/promises';
import * as path from 'path';
import { type WebPage } from '@/hooks/use-web-pages';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

async function getPageData(): Promise<WebPage | null> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'web-pages.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const pages: WebPage[] = JSON.parse(data);
    return pages.find(page => page.route === '/faq') || null;
  } catch (error) {
    console.error('Error loading page data:', error);
    return null;
  }
}

const faqs = [
  {
    question: "What is AstralCore Hyperdrive Trading?",
    answer: "AstralCore is an advanced hyperdrive trading platform that uses cutting-edge algorithms to analyze market patterns and execute profitable trades across multiple dimensions simultaneously."
  },
  {
    question: "How do I get started?",
    answer: "Simply register for an account, complete the verification process, and fund your wallet. Our hyperdrive AI will guide you through the setup process."
  },
  {
    question: "Is my money safe?",
    answer: "Yes, we use bank-level encryption and hyperdrive security protocols to protect your funds. All transactions are secured using advanced blockchain technology."
  },
  {
    question: "What are the minimum deposit requirements?",
    answer: "The minimum deposit varies by account tier. Recruit tier starts at $100, while higher tiers like Diamond require $10,000 or more."
  },
  {
    question: "How does the hyperdrive algorithm work?",
    answer: "Our proprietary hyperdrive algorithm processes infinite market possibilities in parallel universes, identifying profitable patterns that traditional systems cannot detect."
  },
  {
    question: "Can I withdraw my funds anytime?",
    answer: "Yes, you can request withdrawals at any time. Processing typically takes 1-3 business days depending on your payment method."
  },
  {
    question: "What trading pairs are supported?",
    answer: "We support major cryptocurrencies including BTC, ETH, USDT, and many others, as well as traditional forex pairs and commodities."
  },
  {
    question: "Is there a mobile app?",
    answer: "Yes, our platform is fully responsive and works on all devices. We also offer progressive web app functionality for mobile users."
  },
  {
    question: "How do I upgrade my tier?",
    answer: "Tiers are automatically upgraded based on your trading volume and account balance. Higher tiers unlock better features and lower fees."
  },
  {
    question: "What customer support is available?",
    answer: "We offer 24/7 customer support through live chat, email, and our support ticket system. Premium tier users get priority support."
  }
];

export default async function FAQPage() {
  const pageData = await getPageData();
  
  if (!pageData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <div className="pt-16 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h1>
              <p className="text-xl text-gray-300">
                Find answers to common questions about AstralCore
              </p>
            </div>

            <Card className="bg-black/40 backdrop-blur-xl border-border/40 mb-8">
              <CardContent className="p-6">
                <Accordion type="single" collapsible className="space-y-4">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border-border/30">
                      <AccordionTrigger className="text-white hover:text-blue-300 text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-xl border-border/40">
              <CardHeader>
                <CardTitle className="text-white text-center">Still have questions?</CardTitle>
                <CardDescription className="text-center">
                  Our support team is here to help you 24/7
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contact">
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
                      Contact Support
                    </Button>
                  </Link>
                  <Link href="/help">
                    <Button variant="outline">
                      Help Center
                    </Button>
                  </Link>
                  <Link href="/dashboard/support">
                    <Button variant="outline">
                      Live Chat
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return <DynamicPage page={pageData} />;
}

export const metadata = {
  title: 'FAQ - AstralCore',
  description: 'Frequently asked questions about AstralCore hyperdrive trading platform.',
};
