import React from 'react';
import { Star, Quote } from 'lucide-react';
import { m } from 'framer-motion';
import { reveal } from '../lib/motion';

import AppleCardWrapper from './AppleCardWrapper';
import SmartImage from './SmartImage';

export const TestimonialCard = ({ testimonial }) => {
  return (
    <m.div
      {...reveal()}
      className="h-full"
    >
      <AppleCardWrapper className="p-8 sm:p-10 flex flex-col justify-between h-full">
        <Quote className="w-8 h-8 text-accent/25 absolute top-7 right-7" />

        <div>
          {/* 5-star rating */}
          <div className="flex items-center gap-1 mb-6 text-accent">
            {[...Array(testimonial.rating || 5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>

          {/* Quote */}
          <p className="text-[19px] sm:text-[21px] text-fg font-semibold tracking-tight leading-snug mb-8">
            &ldquo;{testimonial.quote}&rdquo;
          </p>
        </div>

        {/* Author Details */}
        <div className="flex items-center gap-3 pt-6 border-t border-line/60 dark:border-line">
          {testimonial.avatar && (
            <SmartImage sizes="96px"
              src={testimonial.avatar}
              alt={testimonial.author}
              className="w-11 h-11 rounded-full object-cover"
            />
          )}
          <div>
            <p className="text-[15px] font-semibold text-fg">
              {testimonial.author}
            </p>
            <p className="text-[13px] text-accent">
              {testimonial.role} &bull; {testimonial.project}
            </p>
            <p className="text-[12px] text-muted">
              {testimonial.location}
            </p>
          </div>
        </div>
      </AppleCardWrapper>
    </m.div>
  );
};

export default TestimonialCard;
