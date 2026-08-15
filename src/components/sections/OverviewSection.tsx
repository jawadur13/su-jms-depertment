'use client';

import Image from 'next/image';
import {motion} from 'motion/react';
import Container from '../ui/Container';

export default function OverviewSection() {
  return (
    <section className="bg-white py-8 md:py-16">
      <Container className="!max-w-[1120px]">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 md:mb-8 text-center text-2xl font-bold leading-tight text-primary md:text-[25px]"
        >
          Department of Journalism and Media Studies
        </motion.h2>

        {/* Row 1 (text, image) uses items-stretch so the image matches
            the paragraph's height exactly; the buttons live in their
            own row below the text column only, via `order` — grid
            auto-placement fills row 1 (paragraph, image) before
            wrapping the 3rd item (buttons) onto row 2, col 1. */}
        <div className="mx-auto grid max-w-[1090px] items-stretch gap-x-8 gap-y-6 lg:gap-x-12 lg:grid-cols-[520px_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <p className="text-justify text-[16px] font-medium leading-[1.75] tracking-[0.035em] text-black">

Journalism and Media Studies is a dynamic and challenging field that plays a vital role in shaping public opinion, promoting social awareness, and strengthening democratic values. The programme focuses on shaping the next generation of media professionals who are skilled, ethical, and innovative, and who contribute meaningfully to journalism and society.

The Department of Journalism and Media Studies at Sonargaon University (SU) offers a 4-year BSS (Honors) programme featuring a comprehensive, industry-oriented curriculum. The programme emphasizes both theoretical knowledge and practical skills, preparing students for diverse careers in print, broadcast, digital media, strategic communication, and related fields.
</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2 overflow-hidden rounded-2xl"
          >
            <Image
              src="https://res.cloudinary.com/dqbtpess/image/upload/v1786792533/sonargaon-jms/overview/aonfnixiuvvrjddnha8a.png"
              alt="Students taking notes during a session at the Department of Journalism and Media Studies"
              width={2048}
              height={1365}
              sizes="(min-width: 1024px) 540px, 100vw"
              className="h-auto w-full object-cover lg:h-full"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="order-3 grid gap-5 sm:grid-cols-2 lg:col-start-1"
          >
            <a
              href="/about/overview"
              className="rounded-full bg-gradient-to-r from-primary to-accent px-8 py-3 text-center text-base font-semibold text-white shadow-md transition-all hover:shadow-premium"
            >
              Explore More
            </a>
            <a
              href="/about/deans-message"
              className="rounded-full bg-gradient-to-r from-primary to-accent px-8 py-3 text-center text-base font-semibold text-white shadow-md transition-all hover:shadow-premium"
            >
              Dean's Message
            </a>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
