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

        <div className="mx-auto grid max-w-[1090px] items-start gap-8 lg:gap-12 lg:grid-cols-[520px_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1 space-y-6"
          >
            <p className="text-justify text-[16px] font-medium leading-[1.75] tracking-[0.035em] text-black">

Journalism and Media Studies is a dynamic and challenging field that plays a vital role in shaping public opinion, promoting social awareness, and strengthening democratic values. The programme focuses on shaping the next generation of media professionals who are skilled, ethical, and innovative, and who contribute meaningfully to journalism and society.

The Department of Journalism and Media Studies at Sonargaon University (SU) offers a 4-year BSS (Honors) programme featuring a comprehensive, industry-oriented curriculum. The programme emphasizes both theoretical knowledge and practical skills, preparing students for diverse careers in print, broadcast, digital media, strategic communication, and related fields.
</p>
            <div className="grid gap-5 sm:grid-cols-2">
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
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2 overflow-hidden"
          >
            {/* TODO: placeholder image left over from the Architecture-department
                site — it lives in a different Cloudinary account (ynfut7mx, not
                this project's dqbtpess) and does not depict this department.
                Replace with a real Journalism and Media Studies photo. */}
            <Image
              src="https://res.cloudinary.com/ynfut7mx/image/upload/f_auto,q_auto:good/v1786350096/sonargaon-arch/gallery/z8xeifkxt2tr6riopuir.webp"
              alt="Students of the Department of Journalism and Media Studies at Sonargaon University"
              width={2048}
              height={1364}
              sizes="(min-width: 1024px) 540px, 100vw"
              className="h-auto w-full object-cover lg:h-[294px]"
            />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
